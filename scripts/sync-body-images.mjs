/**
 * Comprehensive body-image sync: for every article, fetch the live beauticate.com
 * page, extract ALL body images, compare against what's already local, download
 * anything missing, and insert new image refs into the MDX.
 *
 * Unlike scrape-body-images.mjs (which skips articles that have ANY images),
 * this script compares image-by-image so articles with partial image sets get
 * topped up.
 *
 * Run:  node scripts/sync-body-images.mjs
 *       node scripts/sync-body-images.mjs --slug some-article-slug
 *       node scripts/sync-body-images.mjs --limit 50   (process first 50 articles)
 *
 * Safe to re-run — already-downloaded files are skipped.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs'
import { join, extname, basename, dirname } from 'path'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'

const BASE_URL    = 'https://beauticate.com'
const CONTENT_DIR = 'content'
const PUBLIC_DIR  = 'public'
const DELAY_MS    = 600   // polite crawl delay
const MAX_IMGS    = 12    // max body images per article

const ARGS       = process.argv.slice(2)
const TARGET_SLUG = ARGS.includes('--slug') ? ARGS[ARGS.indexOf('--slug') + 1] : null
const LIMIT       = ARGS.includes('--limit') ? parseInt(ARGS[ARGS.indexOf('--limit') + 1]) : Infinity

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ─── File helpers ─────────────────────────────────────────────────────────────

function findMdx(dir, results = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) findMdx(p, results)
    else if (f.endsWith('.mdx')) results.push(p)
  }
  return results
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/m)
  if (!m) return { fm: '', body: content }
  return { fm: m[1], body: m[2] }
}

function getSlug(fm) {
  const m = fm.match(/^slug:\s*["']?([^"'\n]+)["']?/m)
  return m ? m[1].trim() : null
}

function getCategory(fm) {
  const cat = fm.match(/^category:\s*["']?([^"'\n]+)["']?/m)
  const sub = fm.match(/^subcategory:\s*["']?([^"'\n]+)["']?/m)
  return { category: cat?.[1]?.trim(), subcategory: sub?.[1]?.trim() }
}

// content/beauty-style/beauty-tips/slug/slug.mdx → beauty-style/beauty-tips/slug
function contentRelDir(mdxPath) {
  return mdxPath.replace(/^content\//, '').replace(/\/[^/]+\.mdx$/, '')
}

// List files already in the article's public folder
function localImageFilenames(publicArticleDir) {
  if (!existsSync(publicArticleDir)) return new Set()
  return new Set(readdirSync(publicArticleDir).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f)))
}

// Which local image paths are already referenced in the MDX body?
function referencedImages(body) {
  const refs = new Set()
  for (const m of body.matchAll(/\/content\/[^\s"')>]+\.(jpg|jpeg|png|webp|gif)/gi)) {
    refs.add(basename(m[0]))
  }
  return refs
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

function canonicalUrl(src) {
  // unwrap Jetpack proxy: https://i0.wp.com/beauticate.com/wp-content/...
  try {
    const u = new URL(src)
    if (u.hostname.match(/^i\d+\.wp\.com$/)) {
      src = 'https://' + u.pathname.slice(1) // remove leading /
    }
    // strip resize params
    const clean = new URL(src)
    clean.search = ''
    return clean.toString()
  } catch { return src }
}

// Strip WP size suffix: image-850x425.jpg → image.jpg
function stripSizeSuffix(filename) {
  return filename.replace(/-\d+x\d+(\.\w+)$/, '$1')
}

function safeFilename(src, idx) {
  try {
    const u    = new URL(src)
    const base = basename(u.pathname)
    const name = stripSizeSuffix(base).replace(/[^a-zA-Z0-9_.-]/g, '-').replace(/-+/g, '-').toLowerCase()
    return name || `body-${idx}.jpg`
  } catch {
    return `body-${idx}.jpg`
  }
}

// ─── Live page scraping ───────────────────────────────────────────────────────

async function fetchBodyImages(slug) {
  const url = `${BASE_URL}/${slug}/`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Beauticate-migration/1.0)' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return []
    const html = await res.text()

    // Find article content area
    const contentMatch =
      html.match(/<(?:div|section)[^>]+class="[^"]*(?:entry-content|post-content|article-content)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|section)>/i) ||
      html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)

    const contentHtml = contentMatch ? contentMatch[1] : html

    // Extract all <img> tags
    const imgPat = /<img[^>]+>/gi
    const imgs   = []
    const seen   = new Set()

    let m
    while ((m = imgPat.exec(contentHtml)) !== null) {
      const tag = m[0]

      // prefer largest srcset entry, fall back to src
      let src = ''
      const srcsetM = tag.match(/srcset=["']([^"']+)["']/)
      if (srcsetM) {
        const candidates = srcsetM[1].split(',').map(s => s.trim().split(/\s+/))
        // pick highest width
        let best = 0, bestUrl = ''
        for (const [u, w] of candidates) {
          const width = parseInt(w) || 0
          if (width > best) { best = width; bestUrl = u }
        }
        src = bestUrl || candidates[0]?.[0] || ''
      }
      if (!src) {
        const srcM = tag.match(/src=["']([^"']+)["']/)
        src = srcM ? srcM[1] : ''
      }
      if (!src) continue

      // Decode HTML entities
      src = src.replace(/&amp;/g, '&')

      const altM = tag.match(/alt=["']([^"']*)["']/)
      const alt  = altM ? altM[1] : ''

      // Skip tiny/ui images
      if (/avatar|logo|icon|emoji|pixel|1x1|gravatar|s\.w\.org/i.test(src)) continue
      if (src.startsWith('http') && !src.includes('beauticate.com') && !src.includes('wp-content')) continue

      if (src.startsWith('//')) src = 'https:' + src
      else if (src.startsWith('/')) src = BASE_URL + src

      const canon = canonicalUrl(src)
      const key   = stripSizeSuffix(basename(new URL(canon).pathname))
      if (seen.has(key)) continue
      seen.add(key)

      imgs.push({ src: canon, alt })
    }

    return imgs
  } catch (e) {
    return []
  }
}

// ─── Download ─────────────────────────────────────────────────────────────────

async function downloadImage(url, destPath) {
  if (existsSync(destPath)) return 'exists'
  try {
    mkdirSync(dirname(destPath), { recursive: true })
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Beauticate-migration/1.0)' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok || !res.body) return 'fail'
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 2000) return 'tiny'   // skip broken/placeholder images
    writeFileSync(destPath, buf)
    return 'ok'
  } catch {
    return 'fail'
  }
}

// ─── MDX body insertion ───────────────────────────────────────────────────────

// Insert image refs into body after H2 headings, spread evenly
function insertImages(body, imageRefs) {
  if (imageRefs.length === 0) return body

  const lines  = body.split('\n')
  const result = []
  let imgIdx   = 0
  let h2Count  = 0

  for (const line of lines) {
    result.push(line)
    if (line.startsWith('## ') && imgIdx < imageRefs.length) {
      h2Count++
      if (h2Count % 2 === 0) {
        result.push('', imageRefs[imgIdx], '')
        imgIdx++
      }
    }
  }

  // Append remaining at end
  while (imgIdx < imageRefs.length) {
    result.push('', imageRefs[imgIdx])
    imgIdx++
  }

  return result.join('\n')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

let allFiles = findMdx(CONTENT_DIR)

if (TARGET_SLUG) {
  allFiles = allFiles.filter(f => f.includes(`/${TARGET_SLUG}/`))
  if (allFiles.length === 0) {
    console.error(`No MDX found for slug: ${TARGET_SLUG}`)
    process.exit(1)
  }
}

if (allFiles.length > LIMIT) allFiles = allFiles.slice(0, LIMIT)

console.log(`Syncing body images for ${allFiles.length} articles...\n`)

let totalNew = 0, totalSkipped = 0, totalErrors = 0, articlesUpdated = 0

for (const file of allFiles) {
  const content  = readFileSync(file, 'utf8')
  const { fm, body } = parseFrontmatter(content)
  const slug     = getSlug(fm)
  if (!slug) { totalSkipped++; continue }

  const { category, subcategory } = getCategory(fm)
  const relDir   = contentRelDir(file)
  const pubDir   = join(PUBLIC_DIR, CONTENT_DIR, relDir)

  // What's already on disk locally
  const localFiles  = localImageFilenames(pubDir)
  // What's already referenced in the MDX (so we don't re-insert)
  const referenced  = referencedImages(body)

  process.stdout.write(`${relDir}... `)

  // Fetch live page images
  const liveImgs = await fetchBodyImages(slug)

  if (liveImgs.length === 0) {
    console.log('(no live images found)')
    totalSkipped++
    await sleep(DELAY_MS)
    continue
  }

  // Determine which live images are missing locally
  const toDownload = []
  for (const img of liveImgs.slice(0, MAX_IMGS)) {
    const fname = safeFilename(img.src, toDownload.length + 1)
    const stripped = stripSizeSuffix(fname)
    // Check if any local file matches this base name
    const alreadyHave = [...localFiles].some(lf => stripSizeSuffix(lf) === stripped)
    if (!alreadyHave) {
      toDownload.push({ ...img, fname })
    }
  }

  if (toDownload.length === 0) {
    console.log(`✓ complete (${liveImgs.length} live, all local)`)
    totalSkipped++
    await sleep(DELAY_MS / 2)
    continue
  }

  process.stdout.write(`${toDownload.length} new of ${liveImgs.length}`)

  // Download missing images
  const newRefs = []
  for (const { src, alt, fname } of toDownload) {
    const destPath = join(pubDir, fname)
    const result   = await downloadImage(src, destPath)
    if (result === 'ok') {
      // Only add to MDX if not already referenced
      const localPath = `/content/${relDir}/${fname}`
      if (!referenced.has(fname)) {
        newRefs.push(`![${alt}](${localPath})`)
      }
      process.stdout.write(' ✓')
      totalNew++
    } else {
      process.stdout.write(` ✗(${result})`)
      totalErrors++
    }
    await sleep(200)
  }

  // Insert new image refs into MDX body
  if (newRefs.length > 0) {
    const newBody    = insertImages(body, newRefs)
    const newContent = `---\n${fm}\n---\n${newBody}`
    writeFileSync(file, newContent, 'utf8')
    articlesUpdated++
    console.log(` → ${newRefs.length} added to MDX`)
  } else {
    console.log(' → downloaded, already referenced')
  }

  await sleep(DELAY_MS)
}

console.log(`
✅ Done
   Articles updated : ${articlesUpdated}
   New images       : ${totalNew}
   Already complete : ${totalSkipped}
   Download errors  : ${totalErrors}
`)
