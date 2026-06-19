#!/usr/bin/env node
// Fetches article content from beauticate.com WP REST API and writes MDX files.
// Run: node scripts/migrate-articles.mjs

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createWriteStream } from 'fs'
import https from 'https'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const ARTICLES = [
  { slug: 'sigourneys-sleep-edit',      category: 'wellness',      subcategory: 'health' },
  { slug: 'how-i-stay-fit-with-rebecca-judd', category: 'wellness', subcategory: 'fitness' },
  { slug: 'gaia-byron-bay',             category: 'destinations',   subcategory: 'travel' },
  { slug: 'bannisters-port-stephens-family-getaway', category: 'destinations', subcategory: 'travel' },
  { slug: 'reve-skin-beauty-annandale', category: 'destinations',   subcategory: 'clinics' },
  { slug: 'lazy-girls-guide-summer-entertaining', category: 'living', subcategory: 'lifestyle' },
  { slug: 'how-to-make-it-in-the-beauty-biz-rules-from-the-top-ceos', category: 'living', subcategory: 'lifestyle' },
  { slug: 'shaynna-blaze-tvs-interior-designer-on-feeling-your-best-at-every-age', category: 'interviews', subcategory: 'creatives' },
  { slug: 'rae-morris-interview',       category: 'interviews',     subcategory: 'creatives' },
  { slug: 'masks-for-stressed-skin',    category: 'beauty-style',   subcategory: 'skin-care' },
  { slug: 'red-light-therapy-hair-thinning', category: 'beauty-style', subcategory: 'hair' },
  { slug: 'chic-sunscreens-hats',       category: 'beauty-style',   subcategory: 'beauty-tips' },
]

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => { try { resolve(JSON.parse(data)) } catch(e) { reject(e) } })
    }).on('error', reject)
  })
}

function htmlToMarkdown(html) {
  // Very simple HTML → markdown conversion
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
    .replace(/<ul[^>]*>/gis, '\n').replace(/<\/ul>/gis, '\n')
    .replace(/<ol[^>]*>/gis, '\n').replace(/<\/ol>/gis, '\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gis, '\n\n$1\n\n')
    .replace(/<br\s*\/?>/gis, '\n')
    .replace(/<[^>]+>/g, '') // strip remaining tags
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function run() {
  for (const { slug, category, subcategory } of ARTICLES) {
    const url = `https://www.beauticate.com/wp-json/wp/v2/posts?slug=${slug}&_fields=title,content,date,excerpt,yoast_head_json`
    console.log(`Fetching: ${slug}`)

    let post
    try {
      const data = await fetchJson(url)
      post = data[0]
    } catch(e) {
      console.error(`  ERROR fetching ${slug}:`, e.message)
      continue
    }

    if (!post) { console.warn(`  Not found: ${slug}`); continue }

    const title = post.title?.rendered?.replace(/&#8217;/g,"'").replace(/&#8211;/g,'–') ?? slug
    const date = post.date?.substring(0, 10) ?? '2024-01-01'
    const excerpt = (post.excerpt?.rendered ?? '').replace(/<[^>]+>/g,'').replace(/\n/g,' ').trim()
    const body = htmlToMarkdown(post.content?.rendered ?? '')
    const ogImage = post.yoast_head_json?.og_image?.[0]?.url ?? ''

    const dir = join(ROOT, 'content', category, subcategory, slug)
    mkdirSync(dir, { recursive: true })
    const mdxPath = join(dir, `${slug}.mdx`)

    // Check if image already exists
    const imgDir = join(ROOT, 'public', 'content', category, subcategory, slug)
    const imgPath = join(imgDir, 'hero.jpg')
    const hasImage = existsSync(imgPath)
    const featuredImage = hasImage ? `/content/${category}/${subcategory}/${slug}/hero.jpg` : ''

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
category: "${category}"
subcategory: "${subcategory}"
excerpt: "${excerpt.replace(/"/g, '\\"').substring(0, 200)}"
featured_image: "${featuredImage}"
featured_image_alt: "${title.replace(/"/g, '\\"')}"
author: "Beauticate Editorial"
date_published: "${date}"
tags: ["${category}", "${subcategory}"]
is_featured: false
published: ${hasImage ? 'true' : 'false'}
---`

    const mdx = `${frontmatter}\n\n${body}\n`
    writeFileSync(mdxPath, mdx)
    console.log(`  ✓ Written: ${category}/${subcategory}/${slug} (${body.length} chars, image: ${hasImage})`)
  }
  console.log('\nDone.')
}

run().catch(console.error)
