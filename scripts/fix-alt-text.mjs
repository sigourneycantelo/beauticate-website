#!/usr/bin/env node
// Enrich all article images with descriptive alt text, captions, and titles.
//
// Strategy (in priority order):
//   1. WordPress media API alt_text / caption (most accurate)
//   2. Yoast OG image title (fallback)
//   3. Generated from article title + category + position (last resort)
//
// Run: node scripts/fix-alt-text.mjs
// Run for one slug: node scripts/fix-alt-text.mjs masks-for-stressed-skin

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const TARGET_SLUG = process.argv[2] ?? null

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return fetchText(res.headers.location).then(resolve).catch(reject)
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d))
    }).on('error', reject)
  })
}

function fetchJson(url) { return fetchText(url).then(JSON.parse) }

// ─── Alt text generation ──────────────────────────────────────────────────────

function toTitleCase(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function generateAlt(title, category, subcategory, position = 'hero') {
  const cat = toTitleCase(subcategory || category || '')
  const clean = title.replace(/["""'']/g, '').trim()
  if (position === 'hero') return `${clean} — ${cat} | Beauticate`
  return `${clean} — image ${position} | Beauticate`
}

function generateCaption(title, category) {
  const cat = toTitleCase(category || 'Beauty')
  return `${title} — ${cat} feature on Beauticate`
}

// ─── WordPress API ────────────────────────────────────────────────────────────

async function getWpPost(slug) {
  try {
    const data = await fetchJson(
      `https://www.beauticate.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_fields=featured_media,yoast_head_json,content`
    )
    return data[0] ?? null
  } catch { return null }
}

async function getWpMedia(mediaId) {
  if (!mediaId) return null
  try {
    return await fetchJson(
      `https://www.beauticate.com/wp-json/wp/v2/media/${mediaId}?_fields=alt_text,caption,title,source_url`
    )
  } catch { return null }
}

// Extract all WP image URLs + their media IDs from post content
async function getBodyImageMeta(html) {
  // WP REST content doesn't expose per-image media IDs easily,
  // but we can search the media library by source URL
  const srcRe = /wp-content\/uploads\/[^"'\s)]+/g
  const urls = [...new Set([...html.matchAll(srcRe)].map(m => `https://www.beauticate.com/${m[0]}`))]
  const meta = {}
  for (const url of urls) {
    try {
      const results = await fetchJson(
        `https://www.beauticate.com/wp-json/wp/v2/media?search=${encodeURIComponent(url.split('/').pop())}&_fields=alt_text,caption,title,source_url&per_page=5`
      )
      const match = results.find(r => r.source_url === url)
      if (match) meta[url] = match
    } catch {}
    await new Promise(r => setTimeout(r, 80))
  }
  return meta
}

// ─── MDX processing ───────────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/m)
  if (!m) return null
  return { yaml: m[1], body: m[2] }
}

function getField(yaml, key) {
  return yaml.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'))?.[1]?.trim() ?? ''
}

function setField(yaml, key, value) {
  const escaped = value.replace(/"/g, '\\"')
  const re = new RegExp(`^${key}:.*$`, 'm')
  if (re.test(yaml)) return yaml.replace(re, `${key}: "${escaped}"`)
  // Add after the last frontmatter field that exists
  return yaml + `\n${key}: "${escaped}"`
}

// Rewrite body image markdown: ![old alt](url) → ![new alt](url)
function enrichBodyImages(body, imageMeta, title, category, subcategory) {
  let index = 0
  return body.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    index++
    // Only touch local /content/ images or wp-content URLs
    if (!src.includes('/content/') && !src.includes('wp-content')) return match
    // If already has meaningful alt text (>10 chars), keep it
    if (alt && alt.trim().length > 10) return match

    const wpUrl = src.startsWith('http') ? src : null
    const meta = wpUrl ? imageMeta[wpUrl] : null
    const newAlt = meta?.alt_text?.trim()
      || generateAlt(title, category, subcategory, index)

    return `![${newAlt}](${src})`
  })
}

// ─── Per-article fix ──────────────────────────────────────────────────────────

async function fixAltText(mdxPath) {
  const raw = readFileSync(mdxPath, 'utf-8')
  const parsed = parseFrontmatter(raw)
  if (!parsed) return { status: 'NO_FM' }

  let { yaml, body } = parsed

  const slug        = getField(yaml, 'slug') || mdxPath.split('/').slice(-2, -1)[0]
  const title       = getField(yaml, 'title')
  const category    = getField(yaml, 'category')
  const subcategory = getField(yaml, 'subcategory')
  const currentAlt  = getField(yaml, 'featured_image_alt')

  // Fetch WP post
  const post = await getWpPost(slug)
  if (!post) return { slug, status: 'NOT_FOUND' }

  // ── Featured image alt ──────────────────────────────────────────────────────
  let heroAlt = currentAlt
  let heroCaption = ''
  let heroTitle = ''

  const media = await getWpMedia(post.featured_media)
  if (media) {
    heroAlt     = media.alt_text?.trim()     || heroAlt
    heroCaption = media.caption?.rendered?.replace(/<[^>]*>/g, '').trim() || ''
    // WP titles are often just filenames — only use if it looks like real text
    const wpTitle = media.title?.rendered?.trim() || ''
    heroTitle = /^[a-f0-9]{20,}$/.test(wpTitle) ? '' : wpTitle
  }

  // Fall back to generated alt if still empty or very short
  if (!heroAlt || heroAlt.length < 8) {
    heroAlt = generateAlt(title, category, subcategory)
  }
  if (!heroCaption) heroCaption = generateCaption(title, category)
  if (!heroTitle)   heroTitle   = title

  yaml = setField(yaml, 'featured_image_alt',     heroAlt)
  yaml = setField(yaml, 'featured_image_caption',  heroCaption)
  yaml = setField(yaml, 'featured_image_title',    heroTitle)

  // ── Body images ─────────────────────────────────────────────────────────────
  const html = post.content?.rendered ?? ''
  const bodyMeta = Object.keys(
    body.match(/!\[[^\]]*\]\(([^)]+)\)/g) ?? []
  ).length > 0 ? await getBodyImageMeta(html) : {}

  const newBody = enrichBodyImages(body, bodyMeta, title, category, subcategory)

  const changed = yaml !== parsed.yaml || newBody !== body
  if (changed) writeFileSync(mdxPath, `---\n${yaml}\n---\n${newBody}`)

  return { slug, status: 'OK', heroAlt, changed }
}

// ─── Runner ───────────────────────────────────────────────────────────────────

function findAllMdx(dir = join(ROOT, 'content'), results = []) {
  if (!existsSync(dir)) return results
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name)
    if (e.isDirectory()) findAllMdx(full, results)
    else if (e.name.endsWith('.mdx')) results.push(full)
  }
  return results
}

async function run() {
  const files = findAllMdx()
  const targets = TARGET_SLUG
    ? files.filter(f => f.includes(`/${TARGET_SLUG}/`))
    : files

  console.log(`Enriching alt text for ${targets.length} article(s)...\n`)

  let updated = 0, skipped = 0
  const errors = []

  for (const f of targets) {
    const name = f.split('/content/')[1] ?? f
    process.stdout.write(`  ${name}... `)
    let r
    try { r = await fixAltText(f) } catch (e) { r = { status: 'CRASH', error: e.message } }

    if (r.status === 'OK') {
      if (r.changed) {
        console.log(`✓  "${r.heroAlt?.substring(0, 60)}"`)
        updated++
      } else {
        console.log(`— unchanged`)
        skipped++
      }
    } else if (r.status === 'NOT_FOUND') {
      console.log(`✗ not found on WP`)
      errors.push(name)
    } else {
      console.log(`✗ ${r.status}${r.error ? ': ' + r.error.substring(0, 80) : ''}`)
      errors.push(name)
    }

    await new Promise(r => setTimeout(r, 250))
  }

  console.log(`\n✅ Updated: ${updated}  |  Unchanged: ${skipped}  |  Errors: ${errors.length}`)
  if (errors.length) console.log(`❌ ${errors.slice(0, 20).join('\n   ')}`)
}

run().catch(console.error)
