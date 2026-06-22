/**
 * Syncs body images for all articles by fetching post content from the
 * WP REST API, extracting every image URL, comparing against local files,
 * and downloading anything missing.
 *
 * All progress is written to sync-images.log — check that when done.
 *
 * Run:  node scripts/sync-images-from-api.mjs
 *       node scripts/sync-images-from-api.mjs --slug some-slug
 *
 * Safe to re-run — skips already-downloaded files.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync, createWriteStream } from 'fs'
import { join, basename, dirname, extname } from 'path'

const BASE_WP     = 'https://beauticate.com/wp-json/wp/v2'
const BASE_SITE   = 'https://beauticate.com'
const CONTENT_DIR = 'content'
const PUBLIC_DIR  = 'public'
const LOG_FILE    = 'sync-images.log'
const DELAY_MS    = 300
const MAX_IMGS    = 15   // max body images to download per article
const PER_PAGE    = 100  // WP API max

const ARGS        = process.argv.slice(2)
const TARGET_SLUG = ARGS.includes('--slug') ? ARGS[ARGS.indexOf('--slug') + 1] : null

// ─── Logging ──────────────────────────────────────────────────────────────────

const logStream = createWriteStream(LOG_FILE, { flags: 'w' })
function log(msg) {
  const line = `${new Date().toISOString().substring(11,19)} ${msg}`
  logStream.write(line + '\n')
  process.stdout.write(line + '\n')
}

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

function contentRelDir(mdxPath) {
  return mdxPath.replace(/^content\//, '').replace(/\/[^/]+\.mdx$/, '')
}

function localImageFilenames(pubDir) {
  if (!existsSync(pubDir)) return new Set()
  return new Set(readdirSync(pubDir).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f)))
}

function referencedInBody(body) {
  const refs = new Set()
  for (const m of body.matchAll(/\/content\/[^\s"')>]+\.(jpg|jpeg|png|webp|gif)/gi)) {
    refs.add(basename(m[0]))
  }
  return refs
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

function canonicalImageUrl(src) {
  try {
    if (src.startsWith('//')) src = 'https:' + src
    else if (src.startsWith('/')) src = BASE_SITE + src
    src = src.replace(/&amp;/g, '&')
    const u = new URL(src)
    // unwrap Jetpack proxy i0.wp.com/beauticate.com/...
    if (u.hostname.match(/^i\d+\.wp\.com$/)) {
      src = 'https://' + u.pathname.slice(1)
    }
    const clean = new URL(src)
    clean.search = ''
    return clean.toString()
  } catch { return null }
}

function stripSize(filename) {
  return filename.replace(/-\d+x\d+(\.\w+)$/, '$1')
}

function safeFilename(src, idx) {
  try {
    const u    = new URL(src)
    const base = basename(u.pathname)
    const name = stripSize(base).replace(/[^a-zA-Z0-9_.-]/g, '-').replace(/-+/g, '-').toLowerCase()
    return name || `body-${idx}.jpg`
  } catch { return `body-${idx}.jpg` }
}

// ─── Extract images from WP post HTML ────────────────────────────────────────

function extractImages(html) {
  const imgs  = []
  const seen  = new Set()
  const imgPat = /<img[^>]+>/gi
  let m

  while ((m = imgPat.exec(html)) !== null) {
    const tag = m[0]

    // prefer highest-res srcset entry
    let src = ''
    const srcsetM = tag.match(/srcset=["']([^"']+)["']/)
    if (srcsetM) {
      const candidates = srcsetM[1].split(',').map(s => s.trim().split(/\s+/))
      let best = 0
      for (const [u, w] of candidates) {
        const width = parseInt(w) || 0
        if (width > best) { best = width; src = u }
      }
      if (!src) src = candidates[0]?.[0] || ''
    }
    if (!src) {
      const srcM = tag.match(/\bsrc=["']([^"']+)["']/)
      src = srcM ? srcM[1] : ''
    }
    if (!src) continue

    const canon = canonicalImageUrl(src)
    if (!canon) continue

    // skip non-beauticate, avatars, icons etc
    if (!canon.includes('beauticate.com') && !canon.includes('wp-content')) continue
    if (/avatar|logo|icon|emoji|pixel|1x1|gravatar|s\.w\.org/i.test(canon)) continue

    const key = stripSize(basename(new URL(canon).pathname))
    if (seen.has(key)) continue
    seen.add(key)

    const altM = tag.match(/alt=["']([^"']*)["']/)
    imgs.push({ src: canon, alt: altM ? altM[1] : '' })
  }

  return imgs
}

// ─── Download ─────────────────────────────────────────────────────────────────

async function download(url, destPath) {
  if (existsSync(destPath)) return 'exists'
  try {
    mkdirSync(dirname(destPath), { recursive: true })
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Beauticate-migration/1.0)' },
      signal: AbortSignal.timeout(25000),
    })
    if (!res.ok || !res.body) return 'fail'
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 2000) return 'tiny'
    writeFileSync(destPath, buf)
    return 'ok'
  } catch { return 'fail' }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ─── MDX insertion ────────────────────────────────────────────────────────────

function insertImages(body, imageRefs) {
  if (imageRefs.length === 0) return body
  const lines  = body.split('\n')
  const result = []
  let imgIdx   = 0, h2Count = 0

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
  while (imgIdx < imageRefs.length) {
    result.push('', imageRefs[imgIdx])
    imgIdx++
  }
  return result.join('\n')
}

// ─── Fetch all posts from WP API ──────────────────────────────────────────────

async function fetchAllPosts() {
  const posts = []
  let page = 1
  while (true) {
    const url = `${BASE_WP}/posts?per_page=${PER_PAGE}&page=${page}&_fields=slug,content`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) break
    const batch = await res.json()
    if (!Array.isArray(batch) || batch.length === 0) break
    posts.push(...batch)
    log(`  Fetched page ${page} (${posts.length} posts so far)`)
    if (batch.length < PER_PAGE) break
    page++
    await sleep(200)
  }
  return posts
}

// ─── Main ─────────────────────────────────────────────────────────────────────

log('=== sync-images-from-api starting ===')

// Build slug → MDX path map
const allMdx    = findMdx(CONTENT_DIR)
const slugToMdx = {}
for (const f of allMdx) {
  const fm   = parseFrontmatter(readFileSync(f, 'utf8')).fm
  const slug = getSlug(fm)
  if (slug) slugToMdx[slug] = f
}
log(`Indexed ${Object.keys(slugToMdx).length} local MDX files`)

// Fetch posts from API
let posts
if (TARGET_SLUG) {
  log(`Fetching single post: ${TARGET_SLUG}`)
  const res   = await fetch(`${BASE_WP}/posts?slug=${TARGET_SLUG}&_fields=slug,content`)
  const data  = await res.json()
  posts = Array.isArray(data) ? data : []
} else {
  log('Fetching all posts from WP API...')
  posts = await fetchAllPosts()
}

log(`Processing ${posts.length} posts\n`)

let articlesUpdated = 0, totalNew = 0, totalErrors = 0, totalSkipped = 0

for (const post of posts) {
  const slug   = post.slug
  const mdxPath = slugToMdx[slug]

  if (!mdxPath) {
    // No local MDX for this slug — skip
    totalSkipped++
    continue
  }

  const html    = post.content?.rendered ?? ''
  const liveImgs = extractImages(html)

  if (liveImgs.length === 0) {
    totalSkipped++
    continue
  }

  const content  = readFileSync(mdxPath, 'utf8')
  const { fm, body } = parseFrontmatter(content)
  const relDir   = contentRelDir(mdxPath)
  const pubDir   = join(PUBLIC_DIR, CONTENT_DIR, relDir)
  const localFiles  = localImageFilenames(pubDir)
  const referenced  = referencedInBody(body)

  // Which live images are missing locally?
  const toDownload = []
  for (const img of liveImgs.slice(0, MAX_IMGS)) {
    const fname    = safeFilename(img.src, toDownload.length + 1)
    const stripped = stripSize(fname)
    const have     = [...localFiles].some(lf => stripSize(lf) === stripped)
    if (!have) toDownload.push({ ...img, fname })
  }

  if (toDownload.length === 0) {
    log(`✓ ${slug} (${liveImgs.length} live, all local)`)
    totalSkipped++
    continue
  }

  log(`↓ ${slug}: ${toDownload.length} missing of ${liveImgs.length}`)

  const newRefs = []
  for (const { src, alt, fname } of toDownload) {
    const destPath  = join(pubDir, fname)
    const result    = await download(src, destPath)
    if (result === 'ok') {
      localFiles.add(fname)
      if (!referenced.has(fname)) {
        newRefs.push(`![${alt}](/content/${relDir}/${fname})`)
      }
      totalNew++
      log(`  ✓ ${fname}`)
    } else {
      totalErrors++
      log(`  ✗ ${fname} (${result}) ${src}`)
    }
    await sleep(150)
  }

  if (newRefs.length > 0) {
    const newBody    = insertImages(body, newRefs)
    const newContent = `---\n${fm}\n---\n${newBody}`
    writeFileSync(mdxPath, newContent, 'utf8')
    articlesUpdated++
    log(`  → ${newRefs.length} refs inserted into MDX`)
  }

  await sleep(DELAY_MS)
}

log(`
=== Done ===
Articles updated : ${articlesUpdated}
New images       : ${totalNew}
Already complete : ${totalSkipped}
Errors           : ${totalErrors}
`)

logStream.end()
