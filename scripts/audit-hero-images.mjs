#!/usr/bin/env node
/**
 * audit-hero-images.mjs
 * ---------------------
 * Finds articles whose hero/card image (`featured_image`) is broken — empty,
 * pointing at a missing file, or a tiny placeholder — and reports a recoverable
 * source from WordPress (Yoast og:image, else first body image) where one exists.
 *
 *   node scripts/audit-hero-images.mjs                # report only
 *   node scripts/audit-hero-images.mjs --fix          # download + wire up heroes
 *   node scripts/audit-hero-images.mjs --category beauty-style [--fix]
 *
 * --fix downloads the WP source image to the article's public/content dir as
 * hero.<ext> and sets `featured_image` in the MDX. It NEVER overwrites a good
 * existing hero, and skips articles with no WP source (reported as manual).
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONTENT_DIR = join(ROOT, 'content')
const WP_BASE = 'https://www.beauticate.com/wp-json/wp/v2'
const TINY_BYTES = 6000

const args = process.argv.slice(2)
const FIX = args.includes('--fix')
const ci = args.indexOf('--category')
const ONLY_CAT = ci !== -1 ? args[ci + 1] : null

function get(url, binary = false) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (beauticate-hero-audit)' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location, binary).then(resolve, reject)
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)) }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(binary ? Buffer.concat(chunks) : Buffer.concat(chunks).toString('utf8')))
    }).on('error', reject)
  })
}

function walk(dir, parts, out) {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    const m = join(dir, e.name, `${e.name}.mdx`)
    if (existsSync(m)) out.push({ mdx: m, parts: [...parts, e.name], slug: e.name })
    else walk(join(dir, e.name), [...parts, e.name], out)
  }
  return out
}

function classify(fm) {
  const fi = fm.featured_image
  if (!fi || !String(fi).trim()) return { status: 'empty' }
  if (/^https?:\/\//.test(fi)) return { status: 'remote', fi }
  const fp = join(ROOT, 'public', String(fi).replace(/^\//, ''))
  if (!existsSync(fp)) return { status: 'missing', fi }
  if (statSync(fp).size < TINY_BYTES) return { status: 'tiny', fi, bytes: statSync(fp).size }
  return { status: 'ok', fi }
}

async function wpSource(slug) {
  try {
    const raw = await get(`${WP_BASE}/posts?slug=${encodeURIComponent(slug)}&_fields=slug,yoast_head_json,content`)
    const post = JSON.parse(raw)[0]
    if (!post) return null
    const og = post.yoast_head_json?.og_image?.[0]?.url
    const first = (post.content?.rendered?.match(/<img[^>]+src=["']([^"']+)["']/) || [])[1]
    return og || first || null
  } catch { return null }
}

async function downloadHero(item, srcUrl) {
  const ext = (srcUrl.split('?')[0].match(/\.(jpe?g|png|webp|gif|avif)$/i)?.[1] || 'jpg').toLowerCase()
  const publicDir = join(ROOT, 'public', 'content', ...item.parts)
  mkdirSync(publicDir, { recursive: true })
  const buf = await get(srcUrl, true)
  if (buf.length < TINY_BYTES) throw new Error(`source too small (${buf.length}b)`)
  const dest = join(publicDir, `hero.${ext}`)
  writeFileSync(dest, buf)
  // wire up featured_image in the MDX
  const rawMdx = readFileSync(item.mdx, 'utf8')
  const { data, content } = matter(rawMdx)
  data.featured_image = `/content/${item.parts.join('/')}/hero.${ext}`
  writeFileSync(item.mdx, matter.stringify(content, data))
  return { dest: dest.replace(ROOT + '/', ''), bytes: buf.length }
}

async function main() {
  let arts = walk(CONTENT_DIR, [], [])
  if (ONLY_CAT) arts = arts.filter(a => a.parts[0] === ONLY_CAT)

  const broken = []
  for (const a of arts) {
    const { data } = matter(readFileSync(a.mdx, 'utf8'))
    const c = classify(data)
    if (c.status === 'ok' || c.status === 'remote') continue   // remote handled separately
    broken.push({ ...a, ...c })
  }

  console.log(`Scanned ${arts.length} article(s) — ${broken.length} with broken heroes\n`)

  for (const b of broken) {
    const src = await wpSource(b.slug)
    b.wpSource = src
    const tag = b.status.toUpperCase().padEnd(8)
    if (FIX && src) {
      try {
        const r = await downloadHero(b, src)
        console.log(`✅ FIXED  ${tag} ${b.parts.join('/')}  → ${r.dest} (${r.bytes}b)`)
      } catch (e) {
        console.log(`❌ FAIL   ${tag} ${b.parts.join('/')}  (${e.message})`)
      }
    } else {
      console.log(`${src ? '🔧' : '✋'} ${tag} ${b.parts.join('/')}  ${src ? 'WP src: ' + src : 'NO WP source — needs manual image'}`)
    }
  }

  if (!FIX) console.log(`\n🔧 = recoverable from WordPress (run with --fix)   ✋ = needs a manually-supplied image`)
}

main().catch(e => { console.error(e); process.exit(1) })
