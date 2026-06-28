#!/usr/bin/env node
/**
 * pick-hero-from-body.mjs
 * For articles with a blank placeholder hero, choose the best existing body
 * image to promote: prefer editorial markdown images over <ShopItem> products,
 * prefer landscape, prefer high colour-variance (real photo, not white product).
 *
 *   node scripts/pick-hero-from-body.mjs            # propose only (prints picks)
 *   node scripts/pick-hero-from-body.mjs --apply    # copy to hero.<ext> + set featured_image
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const APPLY = process.argv.includes('--apply')

// the 14 placeholder articles (Guy Sebastian excluded — no body image)
const SLUGS = [
  'beauty-style/beauty-tips/beauticate-collective-editors-experts',
  'beauty-style/beauty-tips/best-ai-image-generator-app-review-glam-ai',
  'beauty-style/beauty-tips/dyson-supersonic-r-hair-dryer-review',
  'beauty-style/beauty-tips/last-minute-christmas-gifts',
  'beauty-style/beauty-tips/magnesium-pools-wellness-design-australia',
  'beauty-style/skin-care/the-new-approach-to-layering-skincare',
  'interviews/actors-presenters/what-to-watch-and-listen-to-over-the-break',
  'interviews/creatives/kate-waterhouse-style-beauty',
  'interviews/founders/susan-yara-reinvention-podcast',
  'living/outdoors/pool-accessories-that-changed-our-lives',
  'sigourneys-edit/edit/winter-beauty-rituals',
  'sigourneys-edit/qure-shower-filter-review',
  'vodcast/episodes/susan-yara-on-reinvention-resilience-and-rebuilding-trust',
]

// Ordered body image refs with type: markdown (editorial) ranked above shop/portrait
function bodyRefs(content) {
  const refs = []
  const re = /!\[[^\]]*\]\(([^)]+)\)|<(ShopItem|Portrait|img)\b[^>]*?\b(?:src|image)=["']([^"']+)["']/gi
  let m
  while ((m = re.exec(content))) {
    const url = m[1] || m[3]
    if (!url) continue
    const type = m[1] ? 'md' : m[2].toLowerCase()
    refs.push({ url: url.trim(), type })
  }
  return refs
}

async function score(file) {
  try {
    const meta = await sharp(file).metadata()
    const stats = await sharp(file).stats()
    const stdev = Math.max(...stats.channels.slice(0, 3).map(c => c.stdev))
    const w = meta.width || 0, h = meta.height || 0
    const landscape = w >= h
    return { w, h, stdev, landscape, area: w * h }
  } catch { return null }
}

for (const slug of SLUGS) {
  const base = slug.split('/').pop()
  const mdxPath = join(ROOT, 'content', slug, `${base}.mdx`)
  if (!existsSync(mdxPath)) { console.log(`SKIP (no mdx): ${slug}`); continue }
  const { data, content } = matter(readFileSync(mdxPath, 'utf8'))
  const refs = bodyRefs(content)

  // resolve + score local candidates
  const cands = []
  for (const r of refs) {
    if (/^https?:\/\//.test(r.url)) continue
    const fp = join(ROOT, 'public', r.url.replace(/^\//, ''))
    if (!existsSync(fp)) continue
    const s = await score(fp)
    if (!s || s.stdev < 12) continue          // skip blanks
    cands.push({ ...r, fp, ...s, order: cands.length })
  }
  if (!cands.length) { console.log(`❌ ${slug}\n      no usable body image`); continue }

  // Rank: editorial markdown first, then landscape, then colour variance, then earlier in article
  cands.sort((a, b) => {
    const typeRank = t => (t === 'md' ? 0 : t === 'portrait' ? 1 : 2)
    if (typeRank(a.type) !== typeRank(b.type)) return typeRank(a.type) - typeRank(b.type)
    if (a.landscape !== b.landscape) return a.landscape ? -1 : 1
    if (Math.abs(a.stdev - b.stdev) > 8) return b.stdev - a.stdev
    return a.order - b.order
  })
  const pick = cands[0]
  const rel = pick.fp.replace(ROOT + '/', '')
  console.log(`✅ ${slug}\n      pick: ${rel}\n      ${pick.w}x${pick.h} ${pick.landscape ? 'landscape' : 'PORTRAIT'} stdev=${pick.stdev.toFixed(0)} type=${pick.type}  (of ${cands.length} candidates)`)

  if (APPLY) {
    const ext = extname(pick.fp).toLowerCase().replace('.', '') || 'jpg'
    const dest = join(ROOT, 'public', 'content', slug, `hero.${ext}`)
    copyFileSync(pick.fp, dest)
    data.featured_image = `/content/${slug}/hero.${ext}`
    writeFileSync(mdxPath, matter.stringify(content, data))
    console.log(`      → applied hero.${ext}`)
  }
}
