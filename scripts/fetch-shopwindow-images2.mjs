/**
 * Fetches body images for shop-window stories with no body images.
 * Uses the full category URL path from sw-no-body.json (not just the bare slug).
 *
 * Run:   node scripts/fetch-shopwindow-images2.mjs
 * Watch: tail -f shopwindow-images2.log
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, createWriteStream } from 'fs'
import { basename, dirname } from 'path'

const BASE    = 'https://beauticate.com'
const LOGFILE = 'shopwindow-images2.log'
const MAX_IMG = 10
const DELAY   = 600

const logStream = createWriteStream(LOGFILE, { flags: 'w' })
const log = m => { logStream.write(m + '\n'); process.stdout.write(m + '\n') }
const sleep = ms => new Promise(r => setTimeout(r, ms))

const TARGETS = JSON.parse(readFileSync('/tmp/sw-no-body.json', 'utf8'))

async function scrapeImages(urlPath) {
  // urlPath like "/beauty-style/hair/red-light-therapy-hair-thinning"
  const url = BASE + urlPath + '/'
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Beauticate/1.0)' },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) {
      log(`  HTTP ${res.status} at ${url}`)
      return []
    }
    const html = await res.text()

    const seen = new Set()
    const imgs = []
    for (const m of html.matchAll(/<img[^>]+>/gi)) {
      const tag = m[0]
      let src = ''
      // prefer largest srcset entry
      const ss = tag.match(/srcset=["']([^"']+)["']/)
      if (ss) {
        const best = ss[1].split(',').map(s => s.trim().split(/\s+/))
          .sort((a, b) => (parseInt(b[1]) || 0) - (parseInt(a[1]) || 0))[0]
        src = best?.[0] || ''
      }
      if (!src) { const sm = tag.match(/src=["']([^"']+)["']/); src = sm?.[1] || '' }
      if (!src) continue
      src = src.replace(/&amp;/g, '&')

      // skip UI chrome
      if (/avatar|logo|icon|emoji|pixel|1x1|gravatar|s\.w\.org|spinner|Beauticate-Logo/i.test(src)) continue
      // skip external non-WP images
      if (src.startsWith('http') && !src.includes('beauticate.com') && !src.includes('wp-content')) continue

      if (src.startsWith('//')) src = 'https:' + src
      if (src.startsWith('/')) src = BASE + src

      // canonicalise: strip Jetpack proxy + resize params
      try {
        const u = new URL(src)
        if (/^i\d+\.wp\.com$/.test(u.hostname)) src = 'https://' + u.pathname.slice(1)
        const c = new URL(src); c.search = ''; src = c.toString()
      } catch { continue }

      // dedup by base filename (strips size suffixes)
      const key = basename(src).replace(/-\d+x\d+(\.\w+)$/, '$1')
      if (seen.has(key)) continue
      seen.add(key)

      const altM = tag.match(/alt=["']([^"']*)["']/)
      imgs.push({ src, alt: altM?.[1] || '' })
    }
    return imgs.slice(0, MAX_IMG)
  } catch (e) {
    log(`  fetch error: ${e.message}`)
    return []
  }
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

let done = 0, added = 0, noImgs = 0, failed = 0
const missing = []

log(`Fetching body images for ${TARGETS.length} shop-window stories (using full URL paths)...\n`)

for (const { slug, mdx, url } of TARGETS) {
  log(`[${++done}/${TARGETS.length}] ${slug}`)

  const imgs = await scrapeImages(url)
  if (!imgs.length) {
    log(`  no images found`)
    missing.push({ slug, url, mdx, reason: 'no images on live WP page' })
    noImgs++
    await sleep(DELAY)
    continue
  }
  log(`  found ${imgs.length} images`)

  const relDir = mdx.replace(/^content\//, '').replace(/\/[^/]+\.mdx$/, '')
  const pubDir = `public/content/${relDir}`
  const refs = []

  for (const { src, alt } of imgs) {
    const raw   = basename(new URL(src).pathname)
    const fname = raw.replace(/-\d+x\d+(\.\w+)$/, '$1').replace(/[^a-zA-Z0-9_.-]/g, '-').toLowerCase()
    const dest  = `${pubDir}/${fname}`
    const res   = await download(src, dest)
    const mark  = res === 'ok' ? '✓' : res === 'exists' ? '~' : '✗'
    log(`    ${mark} ${fname} (${res})`)
    if (res === 'ok' || res === 'exists') {
      const cleanAlt = (alt || fname.replace(/-/g, ' ').replace(/\.\w+$/, '')).replace(/—/g, '-')
      refs.push(`![${cleanAlt}](/content/${relDir}/${fname})`)
    }
    await sleep(150)
  }

  if (!refs.length) {
    log(`  all downloads failed`)
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
  log(`  inserted ${refs.length} image refs`)
  added++
  await sleep(DELAY)
}

writeFileSync('/tmp/sw-missing-images.json', JSON.stringify(missing, null, 2))

log(`\n✅ Done`)
log(`  Stories updated:   ${added}`)
log(`  No imgs on WP:     ${noImgs}`)
log(`  Download failures: ${failed}`)
log(`  Missing list:      /tmp/sw-missing-images.json (${missing.length} articles)`)
logStream.end()
