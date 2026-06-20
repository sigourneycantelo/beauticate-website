#!/usr/bin/env node
// Bulk import from WordPress → MDX, newest first, with images + alt text in one pass.
//
// Modes:
//   node scripts/bulk-import.mjs              — recent 2 years only (default)
//   node scripts/bulk-import.mjs --all        — all 1724 posts
//   node scripts/bulk-import.mjs --fix        — re-process already-imported to fix quality issues
//   node scripts/bulk-import.mjs --slug foo   — single article

import { writeFileSync, mkdirSync, existsSync, createWriteStream, readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const ARGS          = process.argv.slice(2)
const MODE_ALL      = ARGS.includes('--all')
const MODE_FIX      = ARGS.includes('--fix')
const TARGET_SLUG   = ARGS[ARGS.indexOf('--slug') + 1] ?? null
const CUTOFF_DATE   = MODE_ALL ? null : new Date(Date.now() - 2 * 365.25 * 24 * 60 * 60 * 1000)
const CONCURRENCY   = 3   // parallel downloads — polite to WP server
const DELAY_MS      = 300 // between API calls

// ─── Category mapping: WP category IDs → our {category, subcategory} ─────────
// Priority: first match wins (most specific first)
const CAT_MAP = [
  // Beauty & Style
  { ids: [361],  category: 'beauty-style',   subcategory: 'skin-care' },
  { ids: [362],  category: 'beauty-style',   subcategory: 'hair' },
  { ids: [364],  category: 'beauty-style',   subcategory: 'makeup' },
  { ids: [365],  category: 'beauty-style',   subcategory: 'beauty-tips' },
  { ids: [367],  category: 'beauty-style',   subcategory: 'style' },
  { ids: [369],  category: 'beauty-style',   subcategory: 'nails' },
  { ids: [421],  category: 'beauty-style',   subcategory: 'cosmetic' },
  { ids: [4014], category: 'beauty-style',   subcategory: 'fragrance' },
  { ids: [3993], category: 'beauty-style',   subcategory: 'beauty-tips' },
  { ids: [896],  category: 'beauty-style',   subcategory: 'beauty-tips' },
  // Wellness
  { ids: [368],  category: 'wellness',       subcategory: 'health' },
  { ids: [370],  category: 'wellness',       subcategory: 'fitness' },
  { ids: [4011], category: 'wellness',       subcategory: 'biohacking' },
  { ids: [4012], category: 'wellness',       subcategory: 'longevity' },
  { ids: [4013], category: 'wellness',       subcategory: 'mindset' },
  { ids: [4010], category: 'wellness',       subcategory: 'health' },
  // Interviews
  { ids: [128],  category: 'interviews',     subcategory: 'actors-presenters' },
  { ids: [119],  category: 'interviews',     subcategory: 'models' },
  { ids: [121],  category: 'interviews',     subcategory: 'creatives' },
  { ids: [125],  category: 'interviews',     subcategory: 'founders' },
  { ids: [116],  category: 'interviews',     subcategory: 'tastemakers' },
  { ids: [299],  category: 'interviews',     subcategory: 'creatives' },
  // Destinations
  { ids: [392],  category: 'destinations',   subcategory: 'travel' },
  { ids: [4022], category: 'destinations',   subcategory: 'hotels-resorts' },
  { ids: [4023], category: 'destinations',   subcategory: 'city-guides' },
  { ids: [4024], category: 'destinations',   subcategory: 'stays' },
  { ids: [100],  category: 'destinations',   subcategory: 'spas-retreats' },
  { ids: [897],  category: 'destinations',   subcategory: 'travel' },
  // Living
  { ids: [376],  category: 'living',         subcategory: 'lifestyle' },
  { ids: [943],  category: 'living',         subcategory: 'interiors' },
  { ids: [4016], category: 'living',         subcategory: 'outdoors' },
  { ids: [3395], category: 'living',         subcategory: 'sustainability' },
  { ids: [4015], category: 'living',         subcategory: 'lifestyle' },
  // Clinics / treatments (beauty-style)
  { ids: [98, 4018, 4017, 96, 102, 4019, 4021], category: 'beauty-style', subcategory: 'treatments' },
  // Vodcast
  { ids: [3932], category: 'vodcast',        subcategory: 'episodes' },
  // Sigourney's Edit
  { ids: [51],   category: 'sigourneys-edit', subcategory: 'picks' },
  // Fallback
  { ids: [],     category: 'beauty-style',   subcategory: 'beauty-tips' },
]

function mapCategories(catIds) {
  for (const rule of CAT_MAP) {
    if (rule.ids.length === 0) return { category: rule.category, subcategory: rule.subcategory }
    if (rule.ids.some(id => catIds.includes(id)))
      return { category: rule.category, subcategory: rule.subcategory }
  }
  return { category: 'beauty-style', subcategory: 'beauty-tips' }
}

// ─── HTTP ────────────────────────────────────────────────────────────────────

function fetchText(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = () => https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return fetchText(res.headers.location, retries).then(resolve).catch(reject)
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d))
    }).on('error', e => { if (retries > 0) setTimeout(() => fetchText(url, retries - 1).then(resolve).catch(reject), 1000); else reject(e) })
    attempt()
  })
}

function fetchJson(url) { return fetchText(url).then(JSON.parse) }

function downloadFile(url, destPath) {
  if (!url?.startsWith('http')) return Promise.resolve(false)
  const safeUrl = url.replace(/^http:\/\//, 'https://')
  return new Promise(resolve => {
    https.get(safeUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return downloadFile(res.headers.location, destPath).then(resolve)
      if (res.statusCode !== 200) { res.resume(); resolve(false); return }
      const file = createWriteStream(destPath)
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve(true) })
      file.on('error', () => resolve(false))
    }).on('error', () => resolve(false))
  })
}

// ─── HTML → Markdown ─────────────────────────────────────────────────────────

function htmlToMd(html) {
  return html
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n\n')
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    .replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    .replace(/<\/?(ul|ol)[^>]*>/gi, '\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n\n$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    // Convert img tags to markdown with alt text
    .replace(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '\n\n![$2]($1)\n\n')
    .replace(/<img[^>]+src="([^"]+)"[^>]*\/?>/gi, '\n\n![]($1)\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&#8230;/g, '…')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function decodeEntities(str) {
  return str
    .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'").replace(/&hellip;/g, '…').replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '') // strip any remaining numeric entities
    .replace(/<[^>]+>/g, '') // strip any HTML tags that leaked into excerpt
}

// ─── Already-imported slugs ───────────────────────────────────────────────────

function getImportedSlugs(contentDir = join(ROOT, 'content')) {
  const slugs = new Set()
  function walk(dir) {
    if (!existsSync(dir)) return
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(join(dir, e.name))
      else if (e.name.endsWith('.mdx')) slugs.add(e.name.replace(/\.mdx$/, ''))
    }
  }
  walk(contentDir)
  return slugs
}

// ─── Per-post import ─────────────────────────────────────────────────────────

async function importPost(post, existingSlugs) {
  const slug = post.slug
  const alreadyImported = existingSlugs.has(slug)

  if (alreadyImported && !MODE_FIX) return { slug, status: 'SKIP_EXISTS' }

  const { category, subcategory } = mapCategories(post.categories ?? [])
  const title    = decodeEntities(post.title?.rendered ?? slug)
  const dateStr  = post.date?.substring(0, 10) ?? '2024-01-01'
  const excerpt  = decodeEntities((post.excerpt?.rendered ?? '').replace(/<[^>]+>/g, '').trim()).substring(0, 250)
  const body     = htmlToMd(post.content?.rendered ?? '')

  // Image
  const imgDir   = join(ROOT, 'public', 'content', category, subcategory, slug)
  const imgPath  = join(imgDir, 'hero.jpg')
  const localImg = `/content/${category}/${subcategory}/${slug}/hero.jpg`
  let heroAlt    = title

  if (!existsSync(imgPath) && post.featured_media) {
    try {
      const media = await fetchJson(
        `https://www.beauticate.com/wp-json/wp/v2/media/${post.featured_media}?_fields=source_url,alt_text,caption,title`
      )
      if (media.source_url) {
        mkdirSync(imgDir, { recursive: true })
        await downloadFile(media.source_url, imgPath)
      }
      if (media.alt_text?.trim()) heroAlt = media.alt_text.trim()
    } catch {}
  } else if (existsSync(imgPath)) {
    // Image exists — try to get better alt text from WP
    if (post.featured_media) {
      try {
        const media = await fetchJson(
          `https://www.beauticate.com/wp-json/wp/v2/media/${post.featured_media}?_fields=alt_text`
        )
        if (media.alt_text?.trim()) heroAlt = media.alt_text.trim()
      } catch {}
    }
  }

  const hasFeaturedImage = existsSync(imgPath)

  const yaml = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
category: "${category}"
subcategory: "${subcategory}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
featured_image: "${hasFeaturedImage ? localImg : ''}"
featured_image_alt: "${heroAlt.replace(/"/g, '\\"')}"
featured_image_caption: "${title.replace(/"/g, '\\"')} — ${subcategory.replace(/-/g, ' ')} feature on Beauticate"
author: "Beauticate Editorial"
date_published: "${dateStr}"
date_modified: "${dateStr}"
tags: ["${category}", "${subcategory}"]
is_featured: false
published: ${hasFeaturedImage}
reading_time: ${Math.max(1, Math.round(body.split(/\s+/).length / 200))}
---`

  const dir = join(ROOT, 'content', category, subcategory, slug)
  mkdirSync(dir, { recursive: true })
  const rawMdx = `${yaml}\n\n${body}\n`
  const { cleanMdxBody } = await import('./clean-mdx.mjs')
  writeFileSync(join(dir, `${slug}.mdx`), cleanMdxBody(rawMdx))

  return { slug, status: alreadyImported ? 'FIXED' : 'IMPORTED', hasImage: hasFeaturedImage }
}

// ─── Fetch all WP posts (paginated) ──────────────────────────────────────────

async function fetchAllPosts() {
  const posts = []
  let page = 1
  const perPage = 100

  // Fields we need — keep payload small
  const fields = 'slug,title,date,excerpt,content,categories,featured_media'
  const dateAfter = CUTOFF_DATE
    ? `&after=${CUTOFF_DATE.toISOString()}`
    : ''

  console.log(CUTOFF_DATE
    ? `Fetching posts since ${CUTOFF_DATE.toISOString().substring(0,10)}...`
    : 'Fetching all posts...')

  while (true) {
    const url = `https://www.beauticate.com/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&orderby=date&order=desc&_fields=${fields}${dateAfter}`
    let batch
    try { batch = await fetchJson(url) } catch { break }
    if (!Array.isArray(batch) || batch.length === 0) break
    posts.push(...batch)
    process.stdout.write(`  Fetched page ${page} (${posts.length} posts)\r`)
    if (batch.length < perPage) break
    page++
    await new Promise(r => setTimeout(r, DELAY_MS))
  }
  console.log(`\nTotal posts to process: ${posts.length}`)
  return posts
}

// ─── Runner ───────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n🌿 Beauticate Bulk Importer`)
  console.log(`   Mode: ${TARGET_SLUG ? `single (${TARGET_SLUG})` : MODE_ALL ? 'all posts' : MODE_FIX ? 'fix existing' : 'recent 2 years'}\n`)

  const existingSlugs = getImportedSlugs()
  console.log(`Already imported: ${existingSlugs.size} articles\n`)

  let posts

  if (TARGET_SLUG) {
    const data = await fetchJson(`https://www.beauticate.com/wp-json/wp/v2/posts?slug=${TARGET_SLUG}&_fields=slug,title,date,excerpt,content,categories,featured_media`)
    posts = data
  } else {
    posts = await fetchAllPosts()
  }

  const toProcess = posts.filter(p => {
    if (TARGET_SLUG) return true
    if (MODE_FIX) return existingSlugs.has(p.slug)
    return !existingSlugs.has(p.slug)
  })

  console.log(`\nTo process: ${toProcess.length}\n`)

  let imported = 0, fixed = 0, skipped = 0
  const errors = []

  // Process in batches for mild parallelism
  for (let i = 0; i < toProcess.length; i += CONCURRENCY) {
    const batch = toProcess.slice(i, i + CONCURRENCY)
    const results = await Promise.all(batch.map(p => importPost(p, existingSlugs).catch(e => ({ slug: p.slug, status: 'ERROR', error: e.message }))))

    for (const r of results) {
      const label = `[${i + 1}/${toProcess.length}] ${r.slug}`
      if (r.status === 'IMPORTED') {
        console.log(`✓ ${label}${r.hasImage ? ' +img' : ' (no img)'}`)
        imported++
      } else if (r.status === 'FIXED') {
        console.log(`↺ ${label} (fixed)`)
        fixed++
      } else if (r.status === 'SKIP_EXISTS') {
        skipped++
      } else if (r.status === 'ERROR') {
        console.log(`✗ ${label}: ${r.error?.substring(0, 80)}`)
        errors.push(r.slug)
      }
    }

    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  console.log(`\n${'─'.repeat(50)}`)
  console.log(`✅ Imported: ${imported}  |  Fixed: ${fixed}  |  Skipped: ${skipped}  |  Errors: ${errors.length}`)
  if (errors.length) console.log(`❌ Errors:\n   ${errors.join('\n   ')}`)
}

run().catch(e => { console.error('Fatal:', e); process.exit(1) })
