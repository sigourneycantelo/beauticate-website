#!/usr/bin/env node
// Fix image downloading for articles where OG image was missing but body has images.
// Also downloads all body images and rewrites MDX to reference local copies.
//
// Run: node scripts/fix-images.mjs
// Run for specific slug: node scripts/fix-images.mjs masks-for-stressed-skin

import { readFileSync, writeFileSync, mkdirSync, existsSync, createWriteStream, readdirSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const TARGET_SLUG = process.argv[2] ?? null  // optional: limit to one slug

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve).catch(reject)
      }
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d))
    }).on('error', reject)
  })
}

function fetchJson(url) { return fetchText(url).then(JSON.parse) }

function downloadFile(url, destPath) {
  return new Promise(resolve => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        req.destroy()
        return downloadFile(res.headers.location, destPath).then(resolve)
      }
      if (res.statusCode !== 200) { resolve(false); return }
      const file = createWriteStream(destPath)
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve(true) })
    }).on('error', () => resolve(false))
  })
}

function extractBodyImages(html) {
  // Get all img src values from the HTML
  const imgs = []
  const re = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*?)["'])?[^>]*\/?>/gi
  let m
  while ((m = re.exec(html)) !== null) {
    const src = m[1]
    // Skip data URIs and tiny spacers
    if (src.startsWith('data:')) continue
    if (src.includes('spacer') || src.includes('pixel') || src.includes('1x1')) continue
    imgs.push({ src, alt: m[2] ?? '' })
  }
  return imgs
}

function safeFilename(url, index) {
  try {
    const u = new URL(url)
    const base = u.pathname.split('/').pop() ?? `image-${index}`
    // Sanitise: keep only safe chars
    return base.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
  } catch {
    return `image-${index}.jpg`
  }
}

function findAllMdx(dir = join(ROOT, 'content'), results = []) {
  if (!existsSync(dir)) return results
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name)
    if (e.isDirectory()) findAllMdx(full, results)
    else if (e.name.endsWith('.mdx')) results.push(full)
  }
  return results
}

async function fixArticle(mdxPath) {
  const raw = readFileSync(mdxPath, 'utf-8')
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/m)
  if (!fmMatch) return { status: 'NO_FM' }

  let yaml = fmMatch[1]
  let body = fmMatch[2]

  const slugMatch = yaml.match(/^slug:\s*"?([^"\n]+)"?/m)
  const slug = slugMatch?.[1] ?? mdxPath.split('/').slice(-2, -1)[0]
  const categoryMatch = yaml.match(/^category:\s*"?([^"\n]+)"?/m)
  const subcatMatch = yaml.match(/^subcategory:\s*"?([^"\n]+)"?/m)
  const category = categoryMatch?.[1] ?? 'beauty-style'
  const subcategory = subcatMatch?.[1] ?? 'beauty-tips'

  // Fetch article from WP
  const apiUrl = `https://www.beauticate.com/wp-json/wp/v2/posts?slug=${slug}&_fields=content,yoast_head_json`
  let post
  try {
    const data = await fetchJson(apiUrl)
    post = data[0]
  } catch { return { slug, status: 'API_ERROR' } }
  if (!post) return { slug, status: 'NOT_FOUND' }

  const html = post.content?.rendered ?? ''
  const ogImage = post.yoast_head_json?.og_image?.[0]?.url ?? ''
  const bodyImages = extractBodyImages(html)

  const imgDir = join(ROOT, 'public', 'content', category, subcategory, slug)
  mkdirSync(imgDir, { recursive: true })

  // Track which URLs map to which local path
  const urlToLocal = {}
  let downloaded = 0

  // Hero: prefer OG image, fall back to first body image
  const heroSrc = ogImage || bodyImages[0]?.src
  if (heroSrc) {
    const heroPath = join(imgDir, 'hero.jpg')
    if (!existsSync(heroPath)) {
      const ok = await downloadFile(heroSrc, heroPath)
      if (ok) downloaded++
    }
    if (existsSync(heroPath)) {
      urlToLocal[heroSrc] = `/content/${category}/${subcategory}/${slug}/hero.jpg`
    }
  }

  // Download all body images
  for (let i = 0; i < bodyImages.length; i++) {
    const { src } = bodyImages[i]
    if (urlToLocal[src]) continue  // already mapped (og == first body img)

    const filename = safeFilename(src, i)
    const ext = extname(filename) || '.jpg'
    const localName = `body-${i}${ext}`
    const localPath = join(imgDir, localName)

    if (!existsSync(localPath)) {
      const ok = await downloadFile(src, localPath)
      if (ok) {
        downloaded++
        urlToLocal[src] = `/content/${category}/${subcategory}/${slug}/${localName}`
      }
    } else {
      urlToLocal[src] = `/content/${category}/${subcategory}/${slug}/${localName}`
    }
    await new Promise(r => setTimeout(r, 100))
  }

  // Update featured_image in frontmatter if currently empty
  const hasHero = existsSync(join(imgDir, 'hero.jpg'))
  const localHeroPath = `/content/${category}/${subcategory}/${slug}/hero.jpg`

  if (hasHero) {
    // Set featured_image if empty
    yaml = yaml.replace(/^featured_image:\s*"?[^"\n]*"?/m, `featured_image: "${localHeroPath}"`)
    // Set published: true if it was false due to missing image
    yaml = yaml.replace(/^published:\s*false/m, 'published: true')
  }

  // Rewrite any WP image URLs in the body markdown to local paths
  let newBody = body
  for (const [wpUrl, localUrl] of Object.entries(urlToLocal)) {
    // Escape for use in regex
    const escaped = wpUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    newBody = newBody.replace(new RegExp(escaped, 'g'), localUrl)
  }

  // Also rewrite img tags that survived as HTML in the markdown
  newBody = newBody.replace(
    /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*?)["'][^>]*\/?>/gi,
    (match, src, alt) => {
      const local = urlToLocal[src]
      return local ? `![${alt}](${local})` : match
    }
  ).replace(
    /<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi,
    (match, src) => {
      const local = urlToLocal[src]
      return local ? `![](${local})` : match
    }
  )

  if (yaml !== fmMatch[1] || newBody !== body) {
    writeFileSync(mdxPath, `---\n${yaml}\n---\n${newBody}`)
  }

  return { slug, status: 'OK', downloaded, total: bodyImages.length, hasHero }
}

async function run() {
  const files = findAllMdx()
  const targets = TARGET_SLUG
    ? files.filter(f => f.includes(`/${TARGET_SLUG}/`))
    : files

  console.log(`Processing ${targets.length} article(s)...\n`)

  let fixed = 0, skipped = 0, errors = []
  for (const f of targets) {
    const name = f.split('/content/')[1] ?? f
    process.stdout.write(`  ${name}... `)
    const r = await fixArticle(f)

    if (r.status === 'OK') {
      const tag = r.downloaded > 0 ? `✓ ${r.downloaded}/${r.total} images downloaded` : `— no new images`
      console.log(tag + (r.hasHero ? ', hero set' : ', no hero'))
      if (r.downloaded > 0) fixed++
    } else {
      console.log(`✗ ${r.status}`)
      errors.push(name)
    }
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\n✅ Fixed: ${fixed} articles`)
  if (errors.length) console.log(`❌ Errors: ${errors.join(', ')}`)
}

run().catch(console.error)
