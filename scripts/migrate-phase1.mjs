#!/usr/bin/env node
// Phase 1 migration: all 2024–2026 articles not already migrated.
// Run: node scripts/migrate-phase1.mjs

import { writeFileSync, mkdirSync, existsSync, readdirSync, createWriteStream } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// URL → { category, subcategory } mapping
function classifyUrl(url) {
  const path = url.replace('https://www.beauticate.com/', '').replace(/\/$/, '')
  const parts = path.split('/')

  if (parts[0] === 'beauty-style') {
    const sub = parts.length > 2 ? parts[1] : 'beauty-tips'
    return { category: 'beauty-style', subcategory: sub, slug: parts[parts.length - 1] }
  }
  if (parts[0] === 'wellness') {
    return { category: 'wellness', subcategory: parts[1] ?? 'health', slug: parts[parts.length - 1] }
  }
  if (parts[0] === 'destination') {
    if (parts[1] === 'travel') return { category: 'destinations', subcategory: 'travel', slug: parts[parts.length - 1] }
    return { category: 'destinations', subcategory: 'clinics', slug: parts[parts.length - 1] }
  }
  if (parts[0] === 'interviews') {
    return { category: 'interviews', subcategory: parts[1] ?? 'creatives', slug: parts[parts.length - 1] }
  }
  if (parts[0] === 'living') {
    return { category: 'living', subcategory: parts[1] ?? 'lifestyle', slug: parts[parts.length - 1] }
  }
  if (parts[0] === 'sigourneys-edit') {
    return { category: 'sigourneys-edit', subcategory: 'edit', slug: parts[parts.length - 1] }
  }
  if (parts[0] === 'news') {
    return { category: 'news', subcategory: 'news', slug: parts[parts.length - 1] }
  }
  return null
}

// Collect already-migrated slugs
function getMigratedSlugs() {
  const slugs = new Set()
  function walk(dir) {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const mdx = join(dir, entry.name, `${entry.name}.mdx`)
        if (existsSync(mdx)) slugs.add(entry.name)
        else walk(join(dir, entry.name))
      }
    }
  }
  walk(join(ROOT, 'content'))
  return slugs
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d))
    }).on('error', reject)
  })
}

function fetchJson(url) {
  return fetchText(url).then(JSON.parse)
}

function htmlToMarkdown(html) {
  return html
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, '\n\n## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, '\n\n### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gis, '\n\n#### $1\n\n')
    .replace(/<strong>(.*?)<\/strong>/gis, '**$1**')
    .replace(/<b>(.*?)<\/b>/gis, '**$1**')
    .replace(/<em>(.*?)<\/em>/gis, '*$1*')
    .replace(/<i>(.*?)<\/i>/gis, '*$1*')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gis, '[$2]($1)')
    .replace(/<li[^>]*>(.*?)<\/li>/gis, '\n- $1')
    .replace(/<\/?(ul|ol|blockquote)[^>]*>/gis, '\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gis, '\n\n$1\n\n')
    .replace(/<br\s*\/?>/gis, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#8217;/g, "'").replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—').replace(/&hellip;/g, '…')
    .replace(/\n{3,}/g, '\n\n').trim()
}

function downloadImage(imgUrl, destPath) {
  if (!imgUrl) return Promise.resolve(false)
  return new Promise(resolve => {
    const file = createWriteStream(destPath)
    https.get(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode !== 200) { file.close(); resolve(false); return }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve(true) })
    }).on('error', () => { file.close(); resolve(false) })
  })
}

async function migrateArticle({ url, slug, category, subcategory }) {
  const apiUrl = `https://www.beauticate.com/wp-json/wp/v2/posts?slug=${slug}&_fields=title,content,date,excerpt,yoast_head_json`
  let post
  try {
    const data = await fetchJson(apiUrl)
    post = data[0]
  } catch { return { slug, status: 'API_ERROR' } }

  if (!post) return { slug, status: 'NOT_FOUND' }

  const title = (post.title?.rendered ?? slug).replace(/&#8217;/g,"'").replace(/&#8211;/g,'–').replace(/&#8220;/g,'"').replace(/&#8221;/g,'"')
  const date = post.date?.substring(0, 10) ?? '2024-01-01'
  const excerpt = (post.excerpt?.rendered ?? '').replace(/<[^>]+>/g,'').replace(/\n/g,' ').trim().substring(0, 200)
  const body = htmlToMarkdown(post.content?.rendered ?? '')
  const ogImage = post.yoast_head_json?.og_image?.[0]?.url ?? ''
  const ogDescription = post.yoast_head_json?.og_description ?? excerpt

  // Download hero image
  const imgDir = join(ROOT, 'public', 'content', category, subcategory, slug)
  const imgPath = join(imgDir, 'hero.jpg')
  let hasImage = existsSync(imgPath)
  if (!hasImage && ogImage) {
    mkdirSync(imgDir, { recursive: true })
    hasImage = await downloadImage(ogImage, imgPath)
  }

  // Determine schema type hint
  const isNews = category === 'news' || (post.yoast_head_json?.og_type === 'article' && date > '2025-01-01')
  const titleLower = title.toLowerCase()
  const schemaHint = isNews ? 'is_news: true' :
    (titleLower.includes('review') ? 'schema_type: "Article"  # review' :
    (titleLower.includes('how to') || titleLower.includes('guide') ? 'schema_type: "HowTo"' : ''))

  const featuredImage = hasImage ? `/content/${category}/${subcategory}/${slug}/hero.jpg` : ''

  const mdx = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
category: "${category}"
subcategory: "${subcategory}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
meta_description: "${ogDescription.replace(/"/g, '\\"').substring(0, 155)}"
featured_image: "${featuredImage}"
featured_image_alt: "${title.replace(/"/g, '\\"')}"
author: "Beauticate Editorial"
date_published: "${date}"
date_modified: "${date}"
tags: ["${category}", "${subcategory}"]
${schemaHint}
is_featured: false
published: ${hasImage && body.length > 100 ? 'true' : 'false'}
reviewed: false
---

${body || '*Content being imported — check back soon.*'}
`

  const dir = join(ROOT, 'content', category, subcategory, slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, `${slug}.mdx`), mdx)

  return { slug, status: 'OK', chars: body.length, image: hasImage }
}

async function run() {
  // Get sitemap
  const xml = await fetchText('https://www.beauticate.com/post-sitemap.xml')
  const urls = [...xml.matchAll(/<loc>(https[^<]+)<\/loc>/g)].map(m => m[1])
  const dates = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1])

  const cutoff = new Date('2024-01-01')
  const skip = ['video-', 'recipe-', 'pinterest-predicts', 'this-is-the-worlds', 'its-official-pregnancy', 'this-superfood', 'news/']

  const toMigrate = urls
    .map((url, i) => ({ url, date: dates[i] }))
    .filter(({ url, date }) => {
      if (!date || new Date(date) < cutoff) return false
      if (!url.match(/beauticate\.com\/(wellness|destination|living|interviews|beauty-style|sigourneys-edit|news)\//)) return false
      if (skip.some(s => url.includes(s))) return false
      return true
    })
    .map(({ url }) => {
      const classified = classifyUrl(url)
      return classified ? { url, ...classified } : null
    })
    .filter(Boolean)

  const alreadyMigrated = getMigratedSlugs()
  const pending = toMigrate.filter(a => !alreadyMigrated.has(a.slug))

  console.log(`Found ${toMigrate.length} articles in range, ${pending.length} not yet migrated\n`)

  const results = { ok: [], skipped: [], errors: [] }
  for (const article of pending) {
    process.stdout.write(`  ${article.slug}... `)
    const result = await migrateArticle(article)
    if (result.status === 'OK') {
      console.log(`✓ (${result.chars} chars, image: ${result.image})`)
      results.ok.push(result.slug)
    } else {
      console.log(`✗ ${result.status}`)
      results.errors.push(result.slug)
    }
    // Polite delay
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n✅ Migrated: ${results.ok.length}`)
  console.log(`❌ Errors: ${results.errors.length}`)
  if (results.errors.length) console.log('  ', results.errors.join(', '))
}

run().catch(console.error)
