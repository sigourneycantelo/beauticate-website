/**
 * Restores inline images to MDX articles by:
 * 1. Fetching post content from WordPress REST API (gets raw shortcodes with attachment IDs)
 * 2. Extracting [vc_single_image image="XXXXX"] attachment IDs
 * 3. Looking up each ID via wp/v2/media to get real image URLs
 * 4. Downloading images to public/content/...
 * 5. Inserting markdown ![alt](path) references into the MDX body
 *
 * Run: node scripts/restore-body-images.mjs
 * Re-run safe: skips articles that already have inline images.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'

const WP_API = 'https://beauticate.com/wp-json/wp/v2'
const PUBLIC_DIR = 'public'
const CONTENT_DIR = 'content'
const DELAY_MS = 600

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function findMdx(dir, results = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) findMdx(p, results)
    else if (f.endsWith('.mdx')) results.push(p)
  }
  return results
}

function splitFrontmatter(content) {
  const m = content.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/)
  return m ? { header: m[1], body: m[2] } : { header: '', body: content }
}

function hasInlineImages(body) {
  return /!\[[^\]]*\]\((?!https?:\/\/beauticate\.com\/wp-content)/.test(body)
    || /<Portrait\s/i.test(body)
}

function extractSlug(header) {
  const m = header.match(/^slug:\s*["']?([^"'\n]+)["']?/m)
  return m ? m[1].trim() : null
}

function extractCategory(header) {
  const cat = header.match(/^category:\s*["']?([^"'\n]+)["']?/m)?.[1]?.trim()
  const sub = header.match(/^subcategory:\s*["']?([^"'\n]+)["']?/m)?.[1]?.trim()
  return { category: cat, subcategory: sub }
}

// Decode HTML entities in attribute values
function decodeEntities(str) {
  return str
    .replace(/&#8220;|&#8221;|&#8243;|&quot;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&amp;/g, '&')
}

async function getPostBySlug(slug) {
  try {
    const res = await fetch(`${WP_API}/posts?slug=${encodeURIComponent(slug)}&_fields=id,slug,content`, {
      signal: AbortSignal.timeout(15000)
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.[0] ?? null
  } catch { return null }
}

async function getMediaUrl(attachmentId) {
  try {
    const res = await fetch(`${WP_API}/media/${attachmentId}?_fields=source_url,alt_text`, {
      signal: AbortSignal.timeout(10000)
    })
    if (!res.ok) return null
    const d = await res.json()
    return { url: d.source_url, alt: d.alt_text || '' }
  } catch { return null }
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://beauticate.com/',
      },
      signal: AbortSignal.timeout(20000)
    })
    if (!res.ok) return false
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 1500) return false
    mkdirSync(dirname(destPath), { recursive: true })
    writeFileSync(destPath, buf)
    return true
  } catch { return false }
}

function getFilenameFromUrl(url, index) {
  try {
    const u = new URL(url)
    const name = u.pathname.split('/').pop()
    return name && name.includes('.') ? name : `image-${index}.jpg`
  } catch {
    return `image-${index}.jpg`
  }
}

// Extract all [vc_single_image image="ID"] attachment IDs from WP content
function extractAttachmentIds(rawContent) {
  const decoded = decodeEntities(rawContent)
  const pattern = /\[vc_single_image[^\]]*image="(\d+)"/gi
  const ids = []
  let m
  while ((m = pattern.exec(decoded)) !== null) {
    ids.push(m[1])
  }
  return [...new Set(ids)]
}

// Also extract image IDs from [cs_gb_row], [uncode_single_image] and other common WPBakery variants
function extractAllImageIds(rawContent) {
  const decoded = decodeEntities(rawContent)
  const ids = []
  // vc_single_image, vc_gallery, uncode variants
  const patterns = [
    /\[vc_single_image[^\]]*\bimage="(\d+)"/gi,
    /\[uncode_single_image[^\]]*\bimage="(\d+)"/gi,
    /\battachment="(\d+)"/gi,
    /\bmedia="(\d+)"/gi,
  ]
  for (const pat of patterns) {
    let m
    while ((m = pat.exec(decoded)) !== null) {
      ids.push(m[1])
    }
  }
  return [...new Set(ids)]
}

// Insert image refs into body. Strategy:
// - If body has H2 headings, insert images after every 2nd paragraph following a heading
// - Otherwise, insert inline at regular intervals
function insertImages(body, imageRefs) {
  if (imageRefs.length === 0) return body

  const lines = body.split('\n')
  const result = []
  let imgIdx = 0
  let paraCount = 0

  for (const line of lines) {
    result.push(line)

    const isHeading = /^#{1,3} /.test(line)
    const isPara = line.trim().length > 80 // substantial paragraph

    if (isPara) paraCount++

    // Insert an image every ~3 substantial paragraphs
    if (isPara && paraCount % 3 === 0 && imgIdx < imageRefs.length) {
      result.push('')
      result.push(imageRefs[imgIdx])
      result.push('')
      imgIdx++
    }
  }

  // Append any remaining images
  while (imgIdx < imageRefs.length) {
    result.push('')
    result.push(imageRefs[imgIdx])
    imgIdx++
  }

  return result.join('\n')
}

// --- Main ---

const allFiles = findMdx(CONTENT_DIR)

// Only process articles with no locally-hosted inline images
const candidates = allFiles.filter(file => {
  const content = readFileSync(file, 'utf8')
  const { body } = splitFrontmatter(content)
  return !hasInlineImages(body)
})

console.log(`${candidates.length} articles need inline images (of ${allFiles.length} total)\n`)

let updated = 0
let noImages = 0
let errors = 0

for (let i = 0; i < candidates.length; i++) {
  const file = candidates[i]
  const content = readFileSync(file, 'utf8')
  const { header, body } = splitFrontmatter(content)
  const slug = extractSlug(header)
  if (!slug) { noImages++; continue }

  process.stdout.write(`[${i + 1}/${candidates.length}] ${slug.substring(0, 50)}... `)

  // Get post from WP REST API
  const post = await getPostBySlug(slug)
  if (!post) {
    console.log(`not found in WP`)
    noImages++
    await sleep(DELAY_MS)
    continue
  }

  // Extract attachment IDs
  const rawContent = post.content?.rendered ?? ''
  const attachmentIds = extractAllImageIds(rawContent)

  if (attachmentIds.length === 0) {
    console.log(`no images in WP content`)
    noImages++
    await sleep(DELAY_MS)
    continue
  }

  // Determine local path for this article's images
  const contentRelPath = file
    .replace(/^content\//, '')
    .replace(/\/[^/]+\.mdx$/, '')

  // Fetch media URLs and download
  const imageRefs = []
  for (let j = 0; j < Math.min(attachmentIds.length, 12); j++) {
    const id = attachmentIds[j]
    const media = await getMediaUrl(id)
    if (!media?.url) { await sleep(200); continue }

    const filename = getFilenameFromUrl(media.url, j + 1)
    const destPath = join(PUBLIC_DIR, CONTENT_DIR, contentRelPath, filename)
    const publicPath = `/content/${contentRelPath}/${filename}`

    if (!existsSync(destPath)) {
      const ok = await downloadImage(media.url, destPath)
      if (!ok) { await sleep(200); continue }
    }

    imageRefs.push(`![${media.alt}](${publicPath})`)
    await sleep(150)
  }

  if (imageRefs.length === 0) {
    console.log(`download failed`)
    errors++
    await sleep(DELAY_MS)
    continue
  }

  // Insert images into body
  const newBody = insertImages(body, imageRefs)
  writeFileSync(file, header + newBody, 'utf8')

  console.log(`✓ ${imageRefs.length} images`)
  updated++
  await sleep(DELAY_MS)
}

console.log(`\n✅ Done: ${updated} updated, ${noImages} no images found, ${errors} errors`)
