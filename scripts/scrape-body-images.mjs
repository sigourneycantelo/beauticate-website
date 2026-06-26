/**
 * Scrapes body images from live beauticate.com for articles that have NO inline
 * images in their MDX body. Downloads images to public/content/... and inserts
 * markdown image references after the first paragraph that follows a heading.
 *
 * Run: node scripts/scrape-body-images.mjs
 * Safe to re-run — skips articles that already have inline images.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs'
import { join, dirname, extname } from 'path'
import { createWriteStream } from 'fs'

const BASE_URL = 'https://beauticate.com'
const PUBLIC_DIR = 'public'
const CONTENT_DIR = 'content'
const DELAY_MS = 800 // be polite to the server

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function findMdx(dir, results = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) findMdx(p, results)
    else if (f.endsWith('.mdx')) results.push(p)
  }
  return results
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/m)
  if (!match) return { fm: '', body: content }
  return { fm: match[1], body: match[2] }
}

function hasInlineImages(body) {
  return /!\[.*?\]\(/.test(body) || /<img\s/i.test(body) || /<Portrait\s/i.test(body)
}

function extractSlug(fm) {
  const m = fm.match(/^slug:\s*["']?([^"'\n]+)["']?/m)
  return m ? m[1].trim() : null
}

function extractCategory(fm) {
  const cat = fm.match(/^category:\s*["']?([^"'\n]+)["']?/m)
  const sub = fm.match(/^subcategory:\s*["']?([^"'\n]+)["']?/m)
  return { category: cat?.[1]?.trim(), subcategory: sub?.[1]?.trim() }
}

async function fetchArticleImages(wpUrl) {
  try {
    const res = await fetch(wpUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Beauticate-migration/1.0)' },
      signal: AbortSignal.timeout(15000)
    })
    if (!res.ok) return []
    const html = await res.text()

    // Find the article/post content area
    // WordPress typically uses .entry-content, .post-content, article .content etc.
    const contentMatch = html.match(/<(?:div|article)[^>]+class="[^"]*(?:entry-content|post-content|article-content)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|article)>/i)
      || html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)

    const contentHtml = contentMatch ? contentMatch[1] : html

    // Extract img tags — get src and alt
    const imgPattern = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*\/?>/gi
    const imgs = []
    let m
    while ((m = imgPattern.exec(contentHtml)) !== null) {
      let src = m[1]
      const alt = m[2] || ''
      // Skip tiny images, icons, avatars, logos
      if (src.includes('avatar') || src.includes('logo') || src.includes('icon') ||
          src.includes('emoji') || src.includes('pixel') || src.includes('1x1') ||
          src.includes('gravatar') || src.includes('s.w.org')) continue
      // Skip already-absolute non-beauticate URLs (social etc)
      if (src.startsWith('http') && !src.includes('beauticate.com') && !src.includes('wp-content')) continue
      // Make absolute
      if (src.startsWith('//')) src = 'https:' + src
      else if (src.startsWith('/')) src = BASE_URL + src

      // Use largest srcset version if available - look for srcset near this img
      imgs.push({ src, alt })
    }

    // Deduplicate by src
    const seen = new Set()
    return imgs.filter(i => {
      // Strip size suffix like -850x425 to deduplicate variants
      const base = i.src.replace(/-\d+x\d+(\.\w+)$/, '$1')
      if (seen.has(base)) return false
      seen.add(base)
      return true
    })
  } catch (e) {
    console.error(`  fetch error: ${e.message}`)
    return []
  }
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Beauticate-migration/1.0)' },
      signal: AbortSignal.timeout(20000)
    })
    if (!res.ok) return false
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 2000) return false // skip tiny/broken images
    mkdirSync(dirname(destPath), { recursive: true })
    writeFileSync(destPath, buf)
    return true
  } catch {
    return false
  }
}

function getFilename(url, index) {
  try {
    const u = new URL(url)
    let name = u.pathname.split('/').pop()
    // Strip WP size suffix: image-850x425.jpg → image.jpg
    name = name.replace(/-\d+x\d+(\.\w+)$/, '$1')
    if (!name || !name.includes('.')) name = `image-${index}.jpg`
    return name
  } catch {
    return `image-${index}.jpg`
  }
}

// Insert images into MDX body after each H2 section heading (space them out)
function insertImagesIntoBody(body, imageRefs) {
  if (imageRefs.length === 0) return body

  const lines = body.split('\n')
  const result = []
  let imgIdx = 0
  let h2Count = 0

  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i])

    // After every other H2, insert the next image
    if (lines[i].startsWith('## ') && imgIdx < imageRefs.length) {
      h2Count++
      if (h2Count % 2 === 0) {
        result.push('')
        result.push(imageRefs[imgIdx])
        result.push('')
        imgIdx++
      }
    }
  }

  // Append remaining images at the end
  while (imgIdx < imageRefs.length) {
    result.push('')
    result.push(imageRefs[imgIdx])
    imgIdx++
  }

  return result.join('\n')
}

// --- Main ---

const allFiles = findMdx(CONTENT_DIR)

// Filter to articles that have NO inline images
const candidates = allFiles.filter(file => {
  const content = readFileSync(file, 'utf8')
  const { body } = parseFrontmatter(content)
  return !hasInlineImages(body)
})

console.log(`Found ${candidates.length} articles with no inline images (out of ${allFiles.length} total)`)
console.log('Starting scrape from beauticate.com...\n')

let scraped = 0
let skipped = 0
let errors = 0

for (const file of candidates) {
  const content = readFileSync(file, 'utf8')
  const { fm, body } = parseFrontmatter(content)
  const slug = extractSlug(fm)
  if (!slug) { skipped++; continue }

  const { category, subcategory } = extractCategory(fm)

  // Build WordPress URL — try the slug directly
  const wpUrl = `${BASE_URL}/${slug}/`

  process.stdout.write(`Fetching ${slug}...`)

  const imgs = await fetchArticleImages(wpUrl)

  if (imgs.length === 0) {
    console.log(` no images found`)
    skipped++
    await sleep(DELAY_MS)
    continue
  }

  // Download each image
  const imageRefs = []
  const articleDir = file.replace(/\.mdx$/, '').replace(CONTENT_DIR + '/', '')
  const publicArticleDir = join(PUBLIC_DIR, CONTENT_DIR, articleDir.split('/').slice(1).join('/'))
  // Actually use the content path structure
  const contentRelPath = file.replace(/^content\//, '').replace(/\/[^/]+\.mdx$/, '')

  for (let i = 0; i < Math.min(imgs.length, 8); i++) {
    const { src, alt } = imgs[i]
    const filename = getFilename(src, i + 1)
    const destPath = join(PUBLIC_DIR, 'content', contentRelPath, filename)

    // Skip if already exists
    if (existsSync(destPath)) {
      imageRefs.push(`![${alt}](/content/${contentRelPath}/${filename})`)
      continue
    }

    const ok = await downloadImage(src, destPath)
    if (ok) {
      imageRefs.push(`![${alt}](/content/${contentRelPath}/${filename})`)
      process.stdout.write(` ✓${filename}`)
    }
    await sleep(200)
  }

  if (imageRefs.length === 0) {
    console.log(` (download failed)`)
    errors++
    await sleep(DELAY_MS)
    continue
  }

  // Insert images into body
  const newBody = insertImagesIntoBody(body, imageRefs)
  const newContent = `---\n${fm}\n---\n${newBody}`
  writeFileSync(file, newContent, 'utf8')

  console.log(` → ${imageRefs.length} images inserted`)
  scraped++
  await sleep(DELAY_MS)
}

console.log(`\n✅ Done: ${scraped} articles updated, ${skipped} skipped, ${errors} errors`)
