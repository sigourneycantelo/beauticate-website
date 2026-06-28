#!/usr/bin/env node
/**
 * map-shop-images.mjs <slug>
 * For an article whose WP shop grid (anchor>img product tiles) was dropped in
 * migration, map each WP product tile to: its local image file (content-match),
 * its destination shop URL, and a guessed product name (from the inner url= host
 * or image filename). Prints a table to drive a <ShopGrid> rebuild.
 */
import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const slug = process.argv[2]

let r = null
for (const rep of readdirSync(join(ROOT, 'qa', 'wp-audit')).filter(f => f.endsWith('.json'))) {
  const f = JSON.parse(readFileSync(join(ROOT, 'qa', 'wp-audit', rep), 'utf8')).results?.find(x => x.slug === slug)
  if (f) { r = f; break }
}
const parts = r.path.replace('content/', '').replace(/\/[^/]+\.mdx$/, '')
const pubDir = join(ROOT, 'public', 'content', parts)
const html = JSON.parse(readFileSync(join(ROOT, '.cache', 'wp', `${slug}.json`), 'utf8')).content.rendered

function get(url) { return new Promise((res, rej) => { https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, x => { if (x.statusCode >= 300 && x.statusCode < 400 && x.headers.location) return get(x.headers.location).then(res, rej); if (x.statusCode !== 200) { x.resume(); return rej(new Error('' + x.statusCode)) } const c = []; x.on('data', d => c.push(d)); x.on('end', () => res(Buffer.concat(c))) }).on('error', rej) }) }
const sig = async b => { try { return await sharp(b).resize(16, 16, { fit: 'fill' }).grayscale().raw().toBuffer() } catch { return null } }
const dist = (a, b) => { if (!a || !b) return 1e9; let s = 0; for (let i = 0; i < a.length; i++)s += Math.abs(a[i] - b[i]); return s }

// local signatures
const locals = []
for (const f of readdirSync(pubDir)) { if (!/\.(jpe?g|png|webp|gif)$/i.test(f)) continue; locals.push({ f, s: await sig(readFileSync(join(pubDir, f))) }) }

const dec = s => s.replace(/&#0?38;|&amp;/g, '&')
const hostOf = href => { const m = dec(href).match(/url=([^&]+)/i); const u = m ? decodeURIComponent(m[1]) : dec(href); try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u.slice(0, 40) } }

let i = 0
for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>\s*(?:<picture[^>]*>)?\s*(?:<source[^>]*>\s*)*<img\b[^>]*src="([^"]+)"[^>]*>/gi)) {
  const href = dec(m[1]), src = m[2]
  if (/beauticate\.com\/(interviews|living|sacred60shop|top-50)/.test(href)) continue // internal cross-links, not shop tiles
  i++
  let buf; try { buf = await get(src) } catch { console.log(`${i}. [dl fail] ${src.split('/').pop()}`); continue }
  const ws = await sig(buf)
  const match = locals.map(l => ({ f: l.f, d: dist(l.s, ws) })).sort((a, b) => a.d - b.d)[0]
  console.log(`${i}. host=${hostOf(href).padEnd(22)} img=${(match && match.d < 1500 ? match.f : '??' + src.split('/').pop().slice(0, 24))}`)
}
