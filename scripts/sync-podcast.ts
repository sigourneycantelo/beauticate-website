/**
 * sync-podcast.ts
 *
 * Fetches the Beautiful Inside RSS feed and creates MDX episode files
 * for any episodes that don't already exist.
 *
 * Usage:
 *   npx tsx scripts/sync-podcast.ts
 *   npx tsx scripts/sync-podcast.ts --dry-run   (preview without writing)
 *   npx tsx scripts/sync-podcast.ts --update     (also update anchor URL on existing files)
 *
 * After running, manually add youtube_video_id to new episode frontmatter.
 * Custom episode images go in public/images/podcast/<slug>.jpg — the script
 * uses that path if the file exists, otherwise falls back to the Spotify cover art.
 */

import fs from 'fs'
import path from 'path'

const RSS_URL = 'https://anchor.fm/s/e54320e8/podcast/rss'
const EPISODES_DIR = path.join(process.cwd(), 'content', 'vodcast', 'episodes')
const PODCAST_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'podcast')
const DEFAULT_COVER = 'https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/38363818/38363818-1739270093542-7154f374420cb.jpg'

const DRY_RUN = process.argv.includes('--dry-run')
const DO_UPDATE = process.argv.includes('--update')

// ─── XML helpers ──────────────────────────────────────────────────────────────

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m = xml.match(re)
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : ''
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i')
  const m = xml.match(re)
  return m ? m[1].trim() : ''
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function parseItems(xml: string): string[] {
  const items: string[] = []
  let start = 0
  while (true) {
    const s = xml.indexOf('<item>', start)
    const e = xml.indexOf('</item>', s)
    if (s === -1 || e === -1) break
    items.push(xml.slice(s, e + 7))
    start = e + 7
  }
  return items
}

// ─── Slug generation ──────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// ─── YAML string safety ───────────────────────────────────────────────────────

function yamlStr(s: string): string {
  // Use double-quoted YAML string, escaping only what's needed
  return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
}

// ─── MDX template ─────────────────────────────────────────────────────────────

function buildMdx(opts: {
  title: string
  slug: string
  date: string
  excerpt: string
  anchorUrl: string
  image: string
  description: string
}): string {
  const { title, slug, date, excerpt, anchorUrl, image, description } = opts
  const shortExcerpt = excerpt.length > 160 ? excerpt.slice(0, 157) + '...' : excerpt
  const metaDesc = description.length > 155 ? description.slice(0, 152) + '...' : description

  return `---
title: ${yamlStr(title)}
slug: ${yamlStr(slug)}
category: "vodcast"
subcategory: "episodes"
excerpt: ${yamlStr(shortExcerpt)}
featured_image: ${yamlStr(image)}
featured_image_alt: ${yamlStr(title + ' | Beautiful Inside by Beauticate')}
featured_image_caption: ${yamlStr(title + ' — Beautiful Inside podcast')}
author: "Beauticate Editorial"
date_published: "${date}"
date_modified: "${date}"
tags: ["vodcast", "episodes"]
is_featured: false
published: true
reading_time: 1
seo_title: ${yamlStr(title + ' | Beautiful Inside')}
meta_description: ${yamlStr(metaDesc)}
---
[${anchorUrl}](${anchorUrl})

${excerpt}
`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Fetching RSS feed: ${RSS_URL}`)
  const res = await fetch(RSS_URL)
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`)
  const xml = await res.text()

  const items = parseItems(xml)
  console.log(`Found ${items.length} episodes in feed\n`)

  let created = 0
  let skipped = 0
  let updated = 0

  for (const item of items) {
    const title = stripHtml(extractTag(item, 'title'))
    const pubDate = extractTag(item, 'pubDate')
    const description = stripHtml(extractTag(item, 'description'))
    const content = stripHtml(extractTag(item, 'content:encoded') || extractTag(item, 'description'))
    const anchorUrl = extractAttr(item, 'enclosure', 'url') || extractTag(item, 'enclosure')

    if (!title) continue

    const slug = slugify(title)
    const date = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)

    const epDir = path.join(EPISODES_DIR, slug)
    const mdxPath = path.join(epDir, `${slug}.mdx`)

    // Check for custom image in public/images/podcast/
    const customImagePath = path.join(PODCAST_IMAGES_DIR, `${slug}.jpg`)
    const customImageWebp = path.join(PODCAST_IMAGES_DIR, `${slug}.webp`)
    const customImagePng = path.join(PODCAST_IMAGES_DIR, `${slug}.png`)
    let image: string
    if (fs.existsSync(customImagePath)) {
      image = `/images/podcast/${slug}.jpg`
    } else if (fs.existsSync(customImageWebp)) {
      image = `/images/podcast/${slug}.webp`
    } else if (fs.existsSync(customImagePng)) {
      image = `/images/podcast/${slug}.png`
    } else {
      image = DEFAULT_COVER
    }

    if (fs.existsSync(mdxPath)) {
      if (DO_UPDATE && anchorUrl) {
        // Only update the anchor URL in the body, leave everything else intact
        const existing = fs.readFileSync(mdxPath, 'utf-8')
        const updatedContent = existing.replace(
          /\[https:\/\/anchor\.fm[^\]]*\]\([^\)]*\)/,
          `[${anchorUrl}](${anchorUrl})`
        )
        if (updatedContent !== existing) {
          if (!DRY_RUN) fs.writeFileSync(mdxPath, updatedContent, 'utf-8')
          console.log(`  UPDATED  ${slug}`)
          updated++
        } else {
          console.log(`  SKIP     ${slug} (anchor URL unchanged)`)
          skipped++
        }
      } else {
        console.log(`  SKIP     ${slug} (already exists)`)
        skipped++
      }
      continue
    }

    // New episode — create it
    const excerpt = content || description || ''
    const mdx = buildMdx({ title, slug, date, excerpt, anchorUrl, image, description: description || excerpt })

    console.log(`  CREATE   ${slug}`)
    console.log(`           "${title}"`)
    console.log(`           date: ${date}, image: ${image.includes('cloudfront') ? 'default cover' : 'custom'}`)

    if (!DRY_RUN) {
      if (!fs.existsSync(epDir)) fs.mkdirSync(epDir, { recursive: true })
      fs.writeFileSync(mdxPath, mdx, 'utf-8')
    }
    created++
  }

  console.log(`\nDone.${DRY_RUN ? ' (dry run — nothing written)' : ''}`)
  console.log(`  Created: ${created}`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Skipped: ${skipped}`)

  if (created > 0 && !DRY_RUN) {
    console.log('\nNext steps:')
    console.log('  1. Add youtube_video_id to new episode frontmatter (from the YouTube playlist)')
    console.log('  2. Add custom images to public/images/podcast/<slug>.jpg')
    console.log('  3. git add content/vodcast/episodes/ && git commit')
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
