#!/usr/bin/env node
/**
 * find-shop-grids.mjs — scan cached WP content for articles that had a product
 * shop grid (anchor>img tiles linking to affiliate/shop URLs) but whose MDX has
 * no <ShopGrid>/<ShopItem>. These are the migration "dropped shop grid" cases.
 */
import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CACHE = join(ROOT, '.cache', 'wp')

// slug -> mdx path, from all category reports
const path = {}
for (const rep of readdirSync(join(ROOT, 'qa', 'wp-audit')).filter(f => f.endsWith('.json'))) {
  let j; try { j = JSON.parse(readFileSync(join(ROOT, 'qa', 'wp-audit', rep), 'utf8')) } catch { continue }
  for (const r of (j.results || [])) if (r.path) path[r.slug] = r.path
}

const SHOP = /skimresources\.com|prf\.hn|\.pxf\.io|bit\.ly|go\.redirectingat|partnerize|impact\.com|\/click\/camref/i
const rows = []
for (const f of readdirSync(CACHE)) {
  if (!f.endsWith('.json') || f.startsWith('_')) continue
  const slug = f.replace(/\.json$/, '')
  let wp; try { wp = JSON.parse(readFileSync(join(CACHE, f), 'utf8')) } catch { continue }
  const html = wp?.content?.rendered; if (!html) continue
  // count anchor>img tiles whose href is an affiliate/shop link
  let tiles = 0
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>\s*(?:<picture[^>]*>)?\s*(?:<source[^>]*>\s*)*<img\b/gi)) {
    if (SHOP.test(m[1].replace(/&#0?38;/g, '&'))) tiles++
  }
  if (tiles < 3) continue
  const p = path[slug]
  const mdx = p && existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), 'utf8') : ''
  const hasGrid = /<ShopGrid|<ShopItem|<CollectionEmbed/.test(mdx)
  rows.push({ slug, tiles, hasGrid, cat: p ? p.split('/')[1] : '?' })
}
rows.sort((a, b) => b.tiles - a.tiles)
const need = rows.filter(r => !r.hasGrid)
console.log(`${rows.length} articles with a WP shop grid (>=3 affiliate tiles); ${need.length} have NO ShopGrid/ShopItem in MDX:\n`)
for (const r of need) console.log(`  ${String(r.tiles).padStart(3)} tiles  [${r.cat}]  ${r.slug}`)
console.log(`\n(already have a grid: ${rows.length - need.length})`)
