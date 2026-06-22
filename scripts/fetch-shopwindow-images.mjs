/**
 * Fetches body images for the 109 shop-window stories that have a hero
 * but no body images. Scrapes beauticate.com, downloads, inserts into MDX.
 *
 * Run:   node scripts/fetch-shopwindow-images.mjs
 * Watch: tail -f shopwindow-images.log
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, basename, dirname } from 'path'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'

const BASE    = 'https://beauticate.com'
const LOGFILE = 'shopwindow-images.log'
const MAX_IMG = 10
const DELAY   = 500

const logStream = createWriteStream(LOGFILE, { flags: 'w' })
const log = m => { logStream.write(m + '\n'); process.stdout.write(m + '\n') }
const sleep = ms => new Promise(r => setTimeout(r, ms))

const TARGETS = JSON.parse(readFileSync('/tmp/sw-no-body.json', 'utf8'))

async function scrapeImages(wpSlug) {
  const url = `${BASE}/${wpSlug}/`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Beauticate/1.0)' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return []
    const html = await res.text()
    const area = (
      html.match(/<(?:div|section)[^>]+class="[^"]*(?:entry-content|post-content)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|section)>/i) ||
      html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
      [null, html]
    )[1]

    const seen = new Set()
    const imgs = []
    for (const m of area.matchAll(/<img[^>]+>/gi)) {
      const tag = m[0]
      let src = ''
      const ss = tag.match(/srcset=["']([^"']+)["']/)
      if (ss) {
        const best = ss[1].split(',').map(s => s.trim().split(/\s+/))
          .sort((a,b) => (parseInt(b[1])||0) - (parseInt(a[1])||0))[0]
        src = best?.[0] || ''
      }
      if (!src) { const sm = tag.match(/src=["']([^"']+)["']/); src = sm?.[1] || '' }
      if (!src) continue
      src = src.replace(/&amp;/g, '&')
      if (/avatar|logo|icon|emoji|pixel|1x1|gravatar|s\.w\.org|spinner/i.test(src)) continue
      if (src.startsWith('http') && !src.includes('beauticate.com') && !src.includes('wp-content')) continue
      if (src.startsWith('//')) src = 'https:' + src
      if (src.startsWith('/')) src = BASE + src
      try {
        const u = new URL(src)
        if (/^i\d+\.wp\.com$/.test(u.hostname)) src = 'https://' + u.pathname.slice(1)
        const c = new URL(src); c.search = ''; src = c.toString()
      } catch {}
      const key = basename(src).replace(/-\d+x\d+(\.\w+)$/, '$1')
      if (seen.has(key)) continue
      seen.add(key)
      const altM = tag.match(/alt=["']([^"']*)["']/)
      imgs.push({ src, alt: altM?.[1] || '' })
    }
    return imgs.slice(0, MAX_IMG)
  } catch { return [] }
}

async function download(url, dest) {
  if (existsSync(dest)) return 'exists'
  try {
    mkdirSync(dirname(dest), { recursive: true })
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok || !res.body) return 'fail'
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 2000) return 'tiny'
    writeFileSync(dest, buf)
    return 'ok'
  } catch { return 'fail' }
}

function insertImages(body, refs) {
  if (!refs.length) return body
  const lines = body.split('\n')
  const out = []
  let idx = 0, h2 = 0
  for (const line of lines) {
    out.push(line)
    if (line.startsWith('## ') && idx < refs.length && ++h2 % 2 === 0) {
      out.push('', refs[idx++], '')
    }
  }
  while (idx < refs.length) out.push('', refs[idx++])
  return out.join('\n')
}

// stats
let done = 0, noImgs = 0, failed = 0
const missing = []  // articles where WP has no images either

log(`Fetching body images for ${TARGETS.length} shop-window stories...\n`)

for (const { slug, mdx, url } of TARGETS) {
  log(`[${++done}/${TARGETS.length}] ${slug}`)

  const imgs = await scrapeImages(slug)
  if (!imgs.length) {
    log(`  no images on live page`)
    missing.push({ slug, url, mdx, reason: 'not on live WP page' })
    noImgs++
    await sleep(DELAY)
    continue
  }

  const relDir = mdx.replace(/^content\//, '').replace(/\/[^/]+\.mdx$/, '')
  const pubDir = `public/content/${relDir}`
  const refs = []

  for (const { src, alt } of imgs) {
    const raw  = basename(new URL(src).pathname)
    const fname = raw.replace(/-\d+x\d+(\.\w+)$/, '$1').replace(/[^a-zA-Z0-9_.-]/g, '-').toLowerCase()
    const dest  = `${pubDir}/${fname}`
    const res   = await download(src, dest)
    if (res === 'ok' || res === 'exists') {
      const cleanAlt = (alt || fname.replace(/-/g,' ').replace(/\.\w+$/, '')).replace(/—/g, '-')
      refs.push(`![${cleanAlt}](/content/${relDir}/${fname})`)
    }
    await sleep(150)
  }

  if (!refs.length) {
    log(`  downloads all failed`)
    missing.push({ slug, url, mdx, reason: 'all downloads failed' })
    failed++
    await sleep(DELAY)
    continue
  }

  const txt    = readFileSync(mdx, 'utf8')
  const fmEnd  = txt.indexOf('\n---\n', 3) + 5
  const body   = txt.slice(fmEnd)
  const newBody = insertImages(body, refs)
  writeFileSync(mdx, txt.slice(0, fmEnd) + newBody)
  log(`  inserted ${refs.length} images`)
  await sleep(DELAY)
}

// Write missing list for workbook
writeFileSync('/tmp/sw-missing-images.json', JSON.stringify(missing, null, 2))

log(`\n✅ Done`)
log(`  Body images added:   ${TARGETS.length - noImgs - failed}`)
log(`  No imgs on WP:       ${noImgs}`)
log(`  Download failures:   ${failed}`)
log(`  Missing list saved:  /tmp/sw-missing-images.json (${missing.length} articles)`)
logStream.end()
