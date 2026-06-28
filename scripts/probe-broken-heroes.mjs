#!/usr/bin/env node
/**
 * probe-broken-heroes.mjs
 * Lists articles with a broken/placeholder hero and, for each, tries hard to
 * find a recoverable image on WordPress: exact slug → base slug (strip -N /
 * -copy) → title search. Splits podcast episodes from regular articles.
 * Read-only; prints a report.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONTENT = join(ROOT, 'content')
const WP = 'https://www.beauticate.com/wp-json/wp/v2'
const TINY = 6000
const GENERIC_RE = /cloudfront\.net\/staging\/podcast_uploaded_nologo/i

function getJson(url) {
  return new Promise((res, rej) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return getJson(r.headers.location).then(res, rej)
      let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)) } catch { res(null) } })
    }).on('error', () => res(null))
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
  if (!fi || !String(fi).trim()) return 'empty'
  if (GENERIC_RE.test(fi)) return 'generic-podcast'
  if (/^https?:\/\//.test(fi)) return 'remote'
  const fp = join(ROOT, 'public', String(fi).replace(/^\//, ''))
  if (!existsSync(fp)) return 'missing'
  if (statSync(fp).size < TINY) return 'tiny'
  return 'ok'
}
function imgFrom(post) {
  if (!post) return null
  return post.yoast_head_json?.og_image?.[0]?.url
    || (post.content?.rendered?.match(/<img[^>]+src=["']([^"']+)["']/) || [])[1]
    || null
}
async function findWp(slug, title) {
  // 1. exact slug
  let p = (await getJson(`${WP}/posts?slug=${encodeURIComponent(slug)}&_fields=slug,link,content,yoast_head_json`))?.[0]
  if (p) return { via: 'exact-slug', slug: p.slug, link: p.link, img: imgFrom(p) }
  // 2. base slug (strip trailing -2 / -copy / -3 …)
  const base = slug.replace(/-(?:\d+|copy)$/,'')
  if (base !== slug) {
    p = (await getJson(`${WP}/posts?slug=${encodeURIComponent(base)}&_fields=slug,link,content,yoast_head_json`))?.[0]
    if (p) return { via: 'base-slug', slug: p.slug, link: p.link, img: imgFrom(p) }
  }
  // 3. title search
  if (title) {
    const list = await getJson(`${WP}/posts?search=${encodeURIComponent(title)}&per_page=3&_fields=slug,link,title,content,yoast_head_json`)
    if (Array.isArray(list) && list[0]) return { via: 'title-search', slug: list[0].slug, link: list[0].link, img: imgFrom(list[0]) }
  }
  return null
}

const arts = walk(CONTENT, [], [])
const podcast = [], articles = []
for (const a of arts) {
  const { data } = matter(readFileSync(a.mdx, 'utf8'))
  const status = classify(data)
  if (status === 'ok' || status === 'remote') continue
  const rec = { ...a, status, title: data.title || a.slug }
  if (a.parts[0] === 'vodcast' || /podcast/.test(a.slug)) podcast.push(rec)
  else articles.push(rec)
}

console.log(`\n========== PODCAST / VODCAST EPISODES NEEDING IMAGES (${podcast.length}) ==========`)
console.log('(generic shared logo, empty, or placeholder — need per-episode artwork)\n')
for (const p of podcast) console.log(`  [${p.status}] ${p.title}\n        ${p.parts.join('/')}`)

console.log(`\n\n========== OTHER ARTICLES WITH BROKEN HEROES (${articles.length}) ==========\n`)
for (const a of articles) {
  const wp = await findWp(a.slug, a.title)
  console.log(`• ${a.title}  [${a.status}]`)
  console.log(`    ${a.parts.join('/')}`)
  if (wp && wp.img) console.log(`    ✅ WP (${wp.via}): ${wp.img}`)
  else if (wp) console.log(`    ⚠️  WP post found (${wp.via}) but no image: ${wp.link}`)
  else console.log(`    ❌ no WP source — post-migration or junk/duplicate`)
}
