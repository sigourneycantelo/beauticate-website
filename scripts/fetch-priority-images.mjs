/**
 * Fetches body images for the 8 priority articles that have none.
 * Scrapes the live beauticate.com page, downloads images, inserts refs into MDX.
 *
 * Run:  node scripts/fetch-priority-images.mjs
 * Log:  tail -f priority-images.log
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, createWriteStream } from 'fs'
import { join, basename, dirname } from 'path'
import { pipeline } from 'stream/promises'

const BASE = 'https://beauticate.com'
const LOG  = 'priority-images.log'
const log  = createWriteStream(LOG, { flags: 'w' })
const out  = m => { log.write(m + '\n'); process.stdout.write(m + '\n') }

const TARGETS = [
  { slug: 'the-exact-products-melanie-grant-uses-to-look-flawless',  mdx: 'content/interviews/founders/the-exact-products-melanie-grant-uses-to-look-flawless/the-exact-products-melanie-grant-uses-to-look-flawless.mdx' },
  { slug: 'chic-sunscreens-hats',                                     mdx: 'content/beauty-style/skin-care/chic-sunscreens-hats/chic-sunscreens-hats.mdx' },
  { slug: 'qure-micro-infusion-system-review',                        mdx: 'content/beauty-style/beauty-tips/qure-micro-infusion-system-review/qure-micro-infusion-system-review.mdx' },
  { slug: 'riley-minford-the-trans-model-owning-her-beauty',          mdx: 'content/interviews/tastemakers/riley-minford-the-trans-model-owning-her-beauty/riley-minford-the-trans-model-owning-her-beauty.mdx' },
  { slug: 'best-ai-image-generator-app-review-glam-ai',               mdx: 'content/beauty-style/beauty-tips/best-ai-image-generator-app-review-glam-ai/best-ai-image-generator-app-review-glam-ai.mdx' },
  { slug: 'how-to-remove-fake-tan-from-white-clothes',                mdx: 'content/beauty-style/beauty-tips/how-to-remove-fake-tan-from-white-clothes/how-to-remove-fake-tan-from-white-clothes.mdx' },
  { slug: 'sensitive-scalp-moogoo-shampoo-review',                    mdx: 'content/sigourneys-edit/edit/sensitive-scalp-moogoo-shampoo-review/sensitive-scalp-moogoo-shampoo-review.mdx' },
  { slug: 'stella-kim',                                               mdx: 'content/interviews/tastemakers/stella-kim/stella-kim.mdx' },
]

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function scrapeImages(slug) {
  const res = await fetch(`${BASE}/${slug}/`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Beauticate/1.0)' },
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) return []
  const html = await res.text()

  const contentMatch =
    html.match(/<(?:div|section)[^>]+class="[^"]*(?:entry-content|post-content|article-content)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|section)>/i) ||
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
  const area = contentMatch ? contentMatch[1] : html

  const seen = new Set()
  const imgs = []
  for (const m of area.matchAll(/<img[^>]+>/gi)) {
    const tag = m[0]
    let src = ''
    // prefer largest srcset entry
    const ss = tag.match(/srcset=["']([^"']+)["']/)
    if (ss) {
      const best = ss[1].split(',').map(s => s.trim().split(/\s+/)).sort((a,b) => (parseInt(b[1])||0)-(parseInt(a[1])||0))[0]
      src = best?.[0] || ''
    }
    if (!src) { const sm = tag.match(/src=["']([^"']+)["']/); src = sm?.[1] || '' }
    if (!src) continue
    src = src.replace(/&amp;/g, '&')
    if (/avatar|logo|icon|emoji|pixel|1x1|gravatar|s\.w\.org/i.test(src)) continue
    if (src.startsWith('http') && !src.includes('beauticate.com') && !src.includes('wp-content')) continue
    if (src.startsWith('//')) src = 'https:' + src
    if (src.startsWith('/')) src = BASE + src
    // canonicalise: strip Jetpack proxy + resize params
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
  return imgs.slice(0, 12)
}

async function download(url, dest) {
  if (existsSync(dest)) return 'exists'
  try {
    mkdirSync(dirname(dest), { recursive: true })
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(20000) })
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
  const result = []
  let idx = 0, h2 = 0
  for (const line of lines) {
    result.push(line)
    if (line.startsWith('## ') && idx < refs.length) {
      if (++h2 % 2 === 0) { result.push('', refs[idx++], '') }
    }
  }
  while (idx < refs.length) result.push('', refs[idx++])
  return result.join('\n')
}

for (const { slug, mdx } of TARGETS) {
  out(`\n[${slug}]`)
  const imgs = await scrapeImages(slug)
  out(`  found ${imgs.length} images on live page`)
  if (!imgs.length) { out('  skipped — no images found'); await sleep(800); continue }

  const relDir = mdx.replace(/^content\//, '').replace(/\/[^/]+\.mdx$/, '')
  const pubDir = join('public/content', relDir)
  const refs = []

  for (const { src, alt } of imgs) {
    const fname = basename(new URL(src).pathname).replace(/-\d+x\d+(\.\w+)$/, '$1').replace(/[^a-zA-Z0-9_.-]/g,'-').toLowerCase()
    const dest  = join(pubDir, fname)
    const result = await download(src, dest)
    out(`  ${result === 'ok' ? '✓' : result === 'exists' ? '~' : '✗'} ${fname}`)
    if (result === 'ok' || result === 'exists') {
      refs.push(`![${alt || fname.replace(/-/g,' ').replace(/\.\w+$/,'')}](/content/${relDir}/${fname})`)
    }
    await sleep(200)
  }

  if (!refs.length) { out('  no images downloaded'); continue }

  const txt = readFileSync(mdx, 'utf8')
  const fmEnd = txt.indexOf('\n---\n') + 5
  const body = txt.slice(fmEnd)
  const hasBodyImgs = /!\[.*?\]\(\/content/.test(body)
  const newBody = hasBodyImgs ? body : insertImages(body, refs)
  writeFileSync(mdx, txt.slice(0, fmEnd) + newBody)
  out(`  → ${refs.length} refs ${hasBodyImgs ? 'downloaded (already referenced)' : 'inserted into MDX'}`)
  await sleep(600)
}

out('\n✅ Done')
log.end()
