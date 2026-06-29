#!/usr/bin/env node
/**
 * link-shop-images.mjs <slug> [--apply]
 * For an article whose product images are shown but PLAIN (buy links dropped in
 * migration), re-wrap each matching image in its WP shop URL:
 *   ![alt](img)  ->  [![alt](img)](buyUrl)
 * Maps WP shop tiles (anchor>img with affiliate href) to local images by
 * perceptual content-match, then wraps the markdown image. Dry-run by default.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const slug = process.argv[2]
const APPLY = process.argv.includes('--apply')

let mdxPath = null
for (const rep of readdirSync(join(ROOT, 'qa', 'wp-audit')).filter(f => f.endsWith('.json'))) {
  const f = JSON.parse(readFileSync(join(ROOT, 'qa', 'wp-audit', rep), 'utf8')).results?.find(x => x.slug === slug)
  if (f) { mdxPath = join(ROOT, f.path); break }
}
const html = JSON.parse(readFileSync(join(ROOT, '.cache', 'wp', `${slug}.json`), 'utf8')).content.rendered
const pubDir = join(ROOT, mdxPath.replace(ROOT + '/', '').replace('content/', 'public/content/').replace(/\/[^/]+\.mdx$/, ''))

const get = url => new Promise((res, rej) => https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, x => { if (x.statusCode >= 300 && x.statusCode < 400 && x.headers.location) return get(x.headers.location).then(res, rej); if (x.statusCode !== 200) { x.resume(); return rej(new Error('' + x.statusCode)) } const c = []; x.on('data', d => c.push(d)); x.on('end', () => res(Buffer.concat(c))) }).on('error', rej))
const sig = async b => { try { return await sharp(b).resize(16, 16, { fit: 'fill' }).grayscale().raw().toBuffer() } catch { return null } }
const dist = (a, b) => { if (!a || !b) return 1e9; let s = 0; for (let i = 0; i < a.length; i++)s += Math.abs(a[i] - b[i]); return s }
const dec = s => s.replace(/&#0?38;|&amp;/g, '&')
const SHOP = /skimresources\.com|prf\.hn|\.pxf\.io|bit\.ly|partnerize|impact\.com|\/click\/camref/i

// local signatures
const locals = []
for (const f of readdirSync(pubDir)) { if (!/\.(jpe?g|png|webp|gif)$/i.test(f)) continue; locals.push({ f, s: await sig(readFileSync(join(pubDir, f))) }) }

let mdx = readFileSync(mdxPath, 'utf8')
let wrapped = 0
const seenHref = new Set()
for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>\s*(?:<picture[^>]*>)?\s*(?:<source[^>]*>\s*)*<img\b[^>]*src="([^"]+)"[^>]*>/gi)) {
  const href = dec(m[1]), src = m[2]
  if (!SHOP.test(href)) continue
  if (seenHref.has(href)) continue; seenHref.add(href)
  let buf; try { buf = await get(src) } catch { continue }
  const ws = await sig(buf)
  const best = locals.map(l => ({ f: l.f, d: dist(l.s, ws) })).sort((a, b) => a.d - b.d)[0]
  if (!best || best.d > 1500) continue
  // wrap the plain markdown image for this local file (not already linked)
  const re = new RegExp(`(?<!\\]\\()(?<!\\)\\]\\()\\!\\[([^\\]]*)\\]\\(([^)]*${best.f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\)(?!\\])`, 'g')
  const next = mdx.replace(re, (full, alt, path) => { wrapped++; return `[![${alt}](${path})](${href})` })
  if (next !== mdx) { mdx = next; console.log(`  wrap ${best.f}  ->  ${href.slice(0, 55)}`) }
}
console.log(`${slug}: wrapped ${wrapped} product image(s) in buy links`)
if (APPLY && wrapped) writeFileSync(mdxPath, mdx)
