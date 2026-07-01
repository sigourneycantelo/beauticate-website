#!/usr/bin/env node
/**
 * scaffold-article.mjs — front-load the MECHANICAL parts of the optimisation pass
 * for one already-migrated article (see docs/article-seo-optimization.md).
 *
 * It does NOT make editorial decisions. It:
 *   1. pulls the WordPress REST source (cached under .cache/wp/<slug>.json),
 *   2. works out the body-image order (featured image + [vc_single_image] IDs,
 *      falling back to <img> tags) and resolves each to a URL + dimensions,
 *   3. with --save, downloads them into the article's public/content dir as
 *      wp-hero.<ext> / wp-1.<ext> … (staging names — you rename them descriptively),
 *   4. prints a frontmatter skeleton (WP title/dates/excerpt pre-filled, editorial
 *      fields left as TODO) and the next.config.ts redirect lines for a slug change.
 *
 * Usage:
 *   node scripts/scaffold-article.mjs <slug>                     # plan only
 *   node scripts/scaffold-article.mjs <slug> --save              # also download images
 *   node scripts/scaffold-article.mjs <slug> --new-slug <slug2>  # also print redirects
 *
 * Notes: sharp is broken under Node 24, so dimensions come from the WP media API,
 * not local probing. .png/.webp sources are flagged — convert to .jpg via the
 * PowerShell WIC method in the beauticate-local-dev memory if the brief wants jpg.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const WP = 'https://www.beauticate.com/wp-json/wp/v2'

const args = process.argv.slice(2)
const slug = args.find(a => !a.startsWith('--'))
const SAVE = args.includes('--save')
const newSlug = (() => { const i = args.indexOf('--new-slug'); return i >= 0 ? args[i + 1] : null })()
if (!slug) { console.error('usage: scaffold-article.mjs <slug> [--save] [--new-slug <slug2>]'); process.exit(1) }

async function getJSON(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`)
  return r.json()
}

// ── locate the existing article in content/ to derive category/subcategory ──
function findArticleDir(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (!statSync(p).isDirectory()) continue
    if (name === slug && existsSync(join(p, `${slug}.mdx`))) return p
    const hit = findArticleDir(p)
    if (hit) return hit
  }
  return null
}
const contentDir = findArticleDir(join(ROOT, 'content'))
if (!contentDir) { console.error(`✗ no content/.../${slug}/${slug}.mdx found — is the slug right?`); process.exit(1) }
function require_sep() { return process.platform === 'win32' ? '\\' : '/' }
const relParts = contentDir.replace(join(ROOT, 'content') + require_sep(), '').split(/[\\/]/)
const category = relParts[0]
const subcategory = relParts.length >= 3 ? relParts[relParts.length - 2] : ''
const oldPath = '/' + relParts.join('/')
const pubDir = join(ROOT, 'public', 'content', ...relParts)

// ── WP source (cache) ──
const cachePath = join(ROOT, '.cache', 'wp', `${slug}.json`)
let post
if (existsSync(cachePath)) {
  post = JSON.parse(readFileSync(cachePath, 'utf8'))
} else {
  const arr = await getJSON(`${WP}/posts?slug=${slug}&_fields=id,date,modified,slug,link,title,content,excerpt,author,featured_media`)
  post = arr[0]
  if (!post) { console.error(`✗ WP returned no post for slug ${slug}`); process.exit(1) }
  mkdirSync(dirname(cachePath), { recursive: true })
  writeFileSync(cachePath, JSON.stringify(post, null, 2))
}
const html = post.content?.rendered || ''
const decode = s => (s || '').replace(/&#8217;|&#8216;/g, '’').replace(/&#8220;|&#8221;/g, '“').replace(/&amp;/g, '&').replace(/&#8211;/g, '–').replace(/<[^>]+>/g, '').trim()

// ── image order: hero from featured_media, then body images in WP order ──
// Body uses [vc_single_image image="ID"] (migration-era articles) and resolves
// each ID via the media API for dimensions; newer articles use plain <img> and
// fall back to scraping <src> (no dimensions available without sharp).
async function media(id) {
  try { return await getJSON(`${WP}/media/${id}?_fields=source_url,alt_text,media_details`) } catch { return null }
}
const norm = u => (u || '').split('/').pop().split('?')[0].toLowerCase().replace(/-\d+x\d+(?=\.)/, '').replace(/-scaled(?=\.)/, '')
const imgs = []
let heroUrl = null
if (post.featured_media) {
  const m = await media(post.featured_media)
  if (m) { imgs.push({ role: 'hero', url: m.source_url, alt: m.alt_text || '', w: m.media_details?.width, h: m.media_details?.height }); heroUrl = m.source_url }
}
const vcIds = [...html.matchAll(/\[vc_single_image[^\]]*\bimage=(?:&#8221;|&#8220;|&#8243;|["'“”])(\d+)/gi)].map(m => Number(m[1]))
if (vcIds.length) {
  for (const id of vcIds) {
    const m = await media(id)
    imgs.push({ role: 'body', url: m?.source_url || null, alt: m?.alt_text || '', w: m?.media_details?.width, h: m?.media_details?.height })
  }
} else {
  const seen = new Set(heroUrl ? [norm(heroUrl)] : [])
  for (const m of html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    const src = m[1], k = norm(src)
    if (/gravatar|spacer|1x1|pixel/i.test(src) || seen.has(k)) continue
    seen.add(k)
    if (!imgs.length) { imgs.push({ role: 'hero', url: src, alt: (m[0].match(/\balt=["']([^"']*)/i) || [])[1] || '' }); continue }
    imgs.push({ role: 'body', url: src, alt: (m[0].match(/\balt=["']([^"']*)/i) || [])[1] || '' })
  }
}

// ── report ──
console.log(`\n=== ${slug} ===`)
console.log(`content : ${contentDir.replace(ROOT + require_sep(), '')}`)
console.log(`images  : public/content/${relParts.join('/')}/`)
console.log(`WP title: ${decode(post.title?.rendered)}`)
console.log(`WP date : published ${post.date?.slice(0, 10)}  modified ${post.modified?.slice(0, 10)}`)
console.log(`old path: ${oldPath}`)
console.log(`\nImages in WP order (${imgs.length}):`)
let n = 0
const plan = []
for (const im of imgs) {
  const ext = (im.url?.split('?')[0].match(/\.([a-z0-9]+)$/i)?.[1] || 'jpg').toLowerCase()
  const stage = im.role === 'hero' ? `wp-hero.${ext}` : `wp-${++n}.${ext}`
  const orient = im.w && im.h ? (im.h > im.w ? 'PORTRAIT' : 'landscape') : '?'
  const dim = im.w && im.h ? `${im.w}x${im.h}` : '??'
  const flag = /png|webp/i.test(ext) ? '  ⚠ convert→jpg' : ''
  console.log(`  ${stage.padEnd(12)} ${dim.padEnd(11)} ${orient.padEnd(9)} ${im.url || 'NO URL'}${flag}`)
  if (im.alt) console.log(`     wp alt: ${im.alt.slice(0, 80)}`)
  plan.push({ ...im, stage, ext })
}

// ── download (--save) ──
if (SAVE) {
  mkdirSync(pubDir, { recursive: true })
  for (const p of plan) {
    if (!p.url) { console.log(`  ✗ skip ${p.stage} (no url)`); continue }
    try {
      const r = await fetch(p.url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      writeFileSync(join(pubDir, p.stage), Buffer.from(await r.arrayBuffer()))
      console.log(`  ✓ saved public/content/${relParts.join('/')}/${p.stage}`)
    } catch (e) { console.log(`  ✗ ${p.stage}: ${e.message}`) }
  }
  console.log(`\nNext: rename wp-*.<ext> to descriptive names + write alt text per the brief.`)
} else {
  console.log(`\n(plan only — re-run with --save to download into public/content)`)
}

// ── frontmatter skeleton ──
console.log(`\n--- frontmatter skeleton (fill TODOs from the brief) ---`)
console.log(`---
title: "TODO H1"
slug: "${newSlug || slug}"
category: "${category}"
subcategory: "${subcategory}"
excerpt: "${decode(post.excerpt?.rendered)}"
featured_image: "/content/${relParts.join('/').replace(slug, newSlug || slug)}/TODO-hero.jpg"
featured_image_alt: "TODO"
author: "Sigourney Cantelo"   # confirm
date_published: "${post.date?.slice(0, 10)}"
date_modified: "${new Date(post.modified).toISOString().slice(0, 10)}"
seo_title: "TODO"
meta_description: "TODO"
focus_keyphrase: "TODO"
tags: ["${category}", "${subcategory}"]
# review_rating: 4.5            # only if the brief makes this a Review
# review_item: "TODO"
# review_brand: "TODO"
affiliate_disclosure: true      # if it has affiliate links
faqs:                           # only if supplied/approved
  - question: "TODO"
    answer: "TODO"
published: true
---`)

// ── redirects ──
if (newSlug) {
  const newPath = '/' + relParts.slice(0, -1).concat(newSlug).join('/')
  console.log(`\n--- next.config.ts redirects (slug change ${slug} → ${newSlug}) ---`)
  console.log(`ADD: { source: '${oldPath}', destination: '${newPath}', permanent: true },`)
  const cfg = readFileSync(join(ROOT, 'next.config.ts'), 'utf8')
  const reuse = cfg.split('\n').filter(l => l.includes(`destination: '${oldPath}'`))
  if (reuse.length) {
    console.log(`RE-POINT existing redirects whose destination was the old path:`)
    for (const l of reuse) console.log(`   ${l.trim().replace(`destination: '${oldPath}'`, `destination: '${newPath}'`)}`)
  }
  console.log(`Remember: git mv the folder + .mdx to ${newSlug}; canonical follows the directory.`)
}
console.log('')
