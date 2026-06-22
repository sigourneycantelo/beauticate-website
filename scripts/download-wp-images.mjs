/**
 * Downloads WordPress CDN images still referenced in MDX body text and
 * replaces the URLs with local /content/... paths.
 *
 * Targets any article whose body contains:
 *   - https://beauticate.com/wp-content/uploads/...
 *   - https://i0.wp.com/beauticate.com/wp-content/uploads/...
 *   - /wp-content/uploads/...
 *
 * Run: node scripts/download-wp-images.mjs
 * Safe to re-run — skips images that are already downloaded.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, createWriteStream, readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'
import { pipeline } from 'stream/promises'

const CONTENT_DIR = 'content'
const PUBLIC_DIR  = 'public'
const DELAY_MS    = 400

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function findMdx(dir, results = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) findMdx(p, results)
    else if (f.endsWith('.mdx')) results.push(p)
  }
  return results
}

// Normalise any WP image URL to a canonical https:// URL
function normaliseWpUrl(raw) {
  // already absolute
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    // strip Jetpack resize params: ?resize=..., ?w=..., ?fit=... etc
    const u = new URL(raw)
    // unwrap jetpack proxy: https://i0.wp.com/beauticate.com/wp-content/...
    if (u.hostname.match(/^i\d+\.wp\.com$/)) {
      return `https://${u.pathname.slice(1)}` // pathname starts with /beauticate.com/...
    }
    u.search = ''
    return u.toString()
  }
  // relative /wp-content/uploads/...
  if (raw.startsWith('/wp-content/')) return `https://beauticate.com${raw}`
  return null
}

// Derive a safe local filename from the URL
function localFilename(url, idx) {
  try {
    const u = new URL(url)
    const base = basename(u.pathname)
    const ext = extname(base) || '.jpg'
    // sanitise: remove query/special chars
    const name = base.replace(/[^a-zA-Z0-9_.-]/g, '-').replace(/-+/g, '-').toLowerCase()
    return name || `image-${idx}${ext}`
  } catch {
    return `image-${idx}.jpg`
  }
}

async function download(url, dest) {
  if (existsSync(dest)) return true
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Beauticate-migration/1.0)' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok || !res.body) return false
    mkdirSync(join(dest, '..'), { recursive: true })
    await pipeline(res.body, createWriteStream(dest))
    return true
  } catch (e) {
    return false
  }
}

// ─── Regex to find WP image references in body ───────────────────────────────
// Matches markdown ![alt](url) and <img src="url"> and bare urls in frontmatter
const WP_PATTERN = /(?:https?:\/\/(?:i\d+\.wp\.com\/)?beauticate\.com)?\/wp-content\/uploads\/[^\s"')>]+/g

function contentRelDir(mdxPath) {
  // e.g. content/beauty-style/beauty-tips/slug/slug.mdx
  // → beauty-style/beauty-tips/slug
  return mdxPath.replace(/^content\//, '').replace(/\/[^/]+\.mdx$/, '')
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const allFiles = findMdx(CONTENT_DIR)
const targets = allFiles.filter(f => {
  const body = readFileSync(f, 'utf8')
  return WP_PATTERN.test(body) && (WP_PATTERN.lastIndex = 0, true)
})

console.log(`Found ${targets.length} articles with WP image URLs\n`)

let updated = 0, totalImgs = 0, failed = 0

for (const file of targets) {
  const original = readFileSync(file, 'utf8')
  const relDir   = contentRelDir(file)
  const publicDir = join(PUBLIC_DIR, CONTENT_DIR, relDir)

  // Collect all unique WP URLs in this file
  const matches = [...new Set([...original.matchAll(WP_PATTERN)].map(m => m[0]))]
  if (matches.length === 0) continue

  let content = original
  let fileUpdated = false
  let idx = 0

  process.stdout.write(`${relDir} (${matches.length} images)`)

  for (const raw of matches) {
    const canonUrl = normaliseWpUrl(raw)
    if (!canonUrl) { idx++; continue }

    const fname    = localFilename(canonUrl, idx + 1)
    const destPath = join(publicDir, fname)
    const localRef = `/content/${relDir}/${fname}`

    const ok = await download(canonUrl, destPath)
    if (ok) {
      // Replace ALL occurrences of this raw URL with the local path
      // Handle both the raw form and any normalised variants
      content = content.split(raw).join(localRef)
      // Also replace the normalised URL if different
      if (canonUrl !== raw) content = content.split(canonUrl).join(localRef)
      process.stdout.write(` ✓`)
      totalImgs++
      fileUpdated = true
    } else {
      process.stdout.write(` ✗`)
      failed++
    }

    idx++
    await sleep(DELAY_MS)
  }

  if (fileUpdated) {
    writeFileSync(file, content, 'utf8')
    updated++
    console.log(` → saved`)
  } else {
    console.log(` → skipped (all downloads failed)`)
  }
}

console.log(`\n✅ Done: ${updated} articles updated, ${totalImgs} images downloaded, ${failed} failed`)
