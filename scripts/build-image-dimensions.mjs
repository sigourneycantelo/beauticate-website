#!/usr/bin/env node
/**
 * Builds data/image-dimensions.json — every image under public/, mapped to its
 * intrinsic [width, height].
 *
 * WHY THIS EXISTS, because deleting it would look harmless and would not be.
 *
 * lib/rehype-portrait-images.ts needs an image's dimensions at request time, to
 * decide whether a lone body image is portrait and how far to cap it. It used
 * to read the file: `fs.readFileSync(path.join(process.cwd(), 'public', src))`,
 * where `src` is only known at runtime.
 *
 * @vercel/nft, which decides what ships inside a serverless function, cannot
 * resolve that path statically. Faced with an unresolvable read rooted at
 * public/, it conservatively traced the ENTIRE 3.3GB public/ tree into the
 * bundle of every dynamic route that could reach the plugin — which is both
 * article routes. That put main at ~7.3GB of build output on an 8GB build
 * machine, and adding one more such route (the RSS feed, PR #84) tipped it into
 * `ENOSPC: no space left on device`. The error appears while collecting build
 * traces, long after the offending code has run, and points nowhere near it.
 *
 * A precomputed manifest read from ONE literal path removes the guesswork: nft
 * resolves `data/image-dimensions.json` to a single 2MB file. Same behaviour at
 * request time, ~3.3GB less in each bundle.
 *
 * Keep the read in the plugin literal. The moment a path is assembled from a
 * runtime value again, the 3.3GB comes back.
 */
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { imageSize } from 'image-size'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const OUT = path.join(process.cwd(), 'data', 'image-dimensions.json')
/**
 * Every raster extension present under public/, plus the obvious neighbours.
 * Enumerated from the tree rather than assumed: an initial guess omitted the
 * single .tiff and the single .jpe, and those two images silently lost their
 * portrait treatment. A missing extension here is not a build error — it is a
 * picture that quietly stops being centred.
 */
const EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.jpe', '.png', '.webp', '.gif', '.avif',
  '.tiff', '.tif', '.bmp', '.svg',
])

/** Enough for every raster header we carry; a miss falls back to a full read. */
const HEADER_BYTES = 64 * 1024

/** Concurrent file reads. This is I/O bound, and the tree is ~21,000 files. */
const CONCURRENCY = 32

function listImages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) listImages(full, out)
    else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) out.push(full)
  }
  return out
}

async function measure(file) {
  let handle
  try {
    handle = await fsp.open(file, 'r')
    const buffer = Buffer.alloc(HEADER_BYTES)
    const { bytesRead } = await handle.read(buffer, 0, HEADER_BYTES, 0)
    try {
      return imageSize(buffer.subarray(0, bytesRead))
    } catch {
      // Header window too small for this file (rare) — pay for the whole thing.
      return imageSize(await fsp.readFile(file))
    }
  } catch {
    return null
  } finally {
    await handle?.close()
  }
}

async function main() {
  const started = Date.now()
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.warn('[image-dimensions] no public/ directory — nothing to index')
    return
  }

  const files = listImages(PUBLIC_DIR)
  const manifest = {}
  let unreadable = 0

  let cursor = 0
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (cursor < files.length) {
        const file = files[cursor++]
        const dims = await measure(file)
        if (dims?.width && dims?.height) {
          // Key by the path as it appears in article markup: leading slash,
          // relative to public/, NOT URL-decoded. The plugin looks src up
          // verbatim, exactly as the old filesystem read resolved it.
          const key = '/' + path.relative(PUBLIC_DIR, file).split(path.sep).join('/')
          manifest[key] = [dims.width, dims.height]
        } else {
          unreadable++
        }
      }
    })
  )

  // Sorted, one entry per line. This file is committed, so it wants a diff that
  // shows the images that actually changed rather than rewriting a single 2MB
  // line every time someone adds a photo. Still ordinary JSON.
  const keys = Object.keys(manifest).sort()
  const body = keys
    .map(key => `${JSON.stringify(key)}:[${manifest[key][0]},${manifest[key][1]}]`)
    .join(',\n')

  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, `{\n${body}\n}\n`)
  const sorted = manifest

  const bytes = fs.statSync(OUT).size
  console.log(
    `Image dimensions: ${Object.keys(sorted).length} images` +
    `${unreadable ? `, ${unreadable} unreadable` : ''}` +
    ` (${(bytes / 1e6).toFixed(2)} MB, ${((Date.now() - started) / 1000).toFixed(1)}s) -> data/image-dimensions.json`
  )
}

await main()
