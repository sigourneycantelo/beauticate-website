#!/usr/bin/env node
/**
 * restore-images.mjs — for one article, find WP body images that are GENUINELY
 * absent locally (content match, not filename), download the truly-missing ones,
 * and print an ordered placement worklist. Resolves the rename ambiguity:
 * filename-"missing" images that are actually present under a renamed local file
 * are detected by a perceptual signature and skipped.
 *
 *   node scripts/restore-images.mjs <slug>           # report (downloads to /tmp)
 *   node scripts/restore-images.mjs <slug> --save    # save truly-missing into the article dir
 */
import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const slug = process.argv[2]
const SAVE = process.argv.includes('--save')
if (!slug) { console.error('usage: restore-images.mjs <slug> [--save]'); process.exit(1) }

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return get(r.headers.location).then(res, rej)
      if (r.statusCode !== 200) { r.resume(); return rej(new Error('HTTP ' + r.statusCode)) }
      const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c)))
    }).on('error', rej)
  })
}
async function sig(buf) {
  try { const r = await sharp(buf).resize(16, 16, { fit: 'fill' }).grayscale().raw().toBuffer(); return r } catch { return null }
}
function dist(a, b) { if (!a || !b) return 1e9; let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s }

// find the article across all category reports
let r = { path: null }
for (const rep of readdirSync(join(ROOT, 'qa', 'wp-audit')).filter(f => f.endsWith('.json'))) {
  const found = JSON.parse(readFileSync(join(ROOT, 'qa', 'wp-audit', rep), 'utf8')).results?.find(x => x.slug === slug)
  if (found) { r = found; break }
}
const mdxPath = r.path && join(ROOT, r.path)
const html = JSON.parse(readFileSync(join(ROOT, '.cache', 'wp', `${slug}.json`), 'utf8')).content?.rendered || ''

// local image signatures (existing files in the article public dir)
const parts = mdxPath ? r.path.replace('content/', '').replace(/\/[^/]+\.mdx$/, '') : ''
const pubDir = join(ROOT, 'public', 'content', parts)
const localSigs = []
if (existsSync(pubDir)) for (const f of readdirSync(pubDir)) {
  if (!/\.(jpe?g|png|webp|gif|avif)$/i.test(f)) continue
  try { localSigs.push({ f, s: await sig(readFileSync(join(pubDir, f))) }) } catch {}
}

// WP body images in order (dedup by normalised filename key — collapses the
// same image served at multiple sizes, e.g. -1024x683 vs -600x400)
const nkey = u => u.split('/').pop().split('?')[0].toLowerCase().replace(/-\d+x\d+(?=\.[a-z]+$)/, '').replace(/\.[a-z]+$/, '')
const seen = new Set(); const wpImgs = []
for (const m of html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
  const src = m[1]; if (/gravatar|spacer|1x1|pixel/i.test(src)) continue
  const k = nkey(src); if (seen.has(k)) continue; seen.add(k)
  const alt = (m[0].match(/\balt=["']([^"']*)/i) || [])[1] || ''
  wpImgs.push({ src, alt })
}

const truly = []
for (const w of wpImgs) {
  let buf; try { buf = await get(w.src) } catch { console.log('  ✗ download fail', w.src); continue }
  const ws = await sig(buf)
  const match = localSigs.find(l => dist(l.s, ws) < 800)   // threshold: ~3 avg/px on 256 px
  if (match) continue // present under another name
  const meta = await sharp(buf).metadata().catch(() => ({}))
  truly.push({ ...w, buf, w: meta.width, h: meta.height, ext: (meta.format || 'jpg').replace('jpeg', 'jpg') })
}

console.log(`${slug}: ${wpImgs.length} WP body images, ${localSigs.length} local — ${truly.length} genuinely missing`)
let i = 0
for (const t of truly) {
  i++
  const orient = t.h > t.w ? 'PORTRAIT' : 'landscape'
  const name = t.src.split('/').pop().split('?')[0].toLowerCase().replace(/-\d+x\d+(?=\.)/, '').replace(/-re[0-9a-z]{20,}/, '')
  console.log(`  ${i}. ${t.w}x${t.h} ${orient}  ${name}  | ${t.alt.slice(0, 60)}`)
  if (SAVE) { mkdirSync(pubDir, { recursive: true }); writeFileSync(join(pubDir, name), t.buf); console.log(`       saved -> public/content/${parts}/${name}`) }
}
