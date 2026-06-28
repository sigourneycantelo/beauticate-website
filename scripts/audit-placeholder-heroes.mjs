#!/usr/bin/env node
/**
 * audit-placeholder-heroes.mjs
 * Finds article hero images that are solid/near-solid colour placeholders
 * (e.g. blank beige squares) — they load fine so size/existence checks miss
 * them, but they're visually empty. Uses sharp's per-channel stdev: a real
 * photo has high colour variance; a flat placeholder is ~0.
 *
 *   node scripts/audit-placeholder-heroes.mjs [--category beauty-style] [--threshold 12]
 */
import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONTENT = join(ROOT, 'content')
const VERCEL = 'https://beauticate-website.vercel.app'

const args = process.argv.slice(2)
const ci = args.indexOf('--category'); const ONLY = ci !== -1 ? args[ci + 1] : null
const ti = args.indexOf('--threshold'); const THRESH = ti !== -1 ? parseFloat(args[ti + 1]) : 12

function walk(dir, parts, out) {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    const m = join(dir, e.name, `${e.name}.mdx`)
    if (existsSync(m)) out.push({ mdx: m, parts: [...parts, e.name], slug: e.name })
    else walk(join(dir, e.name), [...parts, e.name], out)
  }
  return out
}

let arts = walk(CONTENT, [], [])
if (ONLY) arts = arts.filter(a => a.parts[0] === ONLY)

const flagged = []
let checked = 0
for (const a of arts) {
  const { data } = matter(readFileSync(a.mdx, 'utf8'))
  const fi = data.featured_image
  if (!fi || /^https?:\/\//.test(fi)) continue
  const fp = join(ROOT, 'public', String(fi).replace(/^\//, ''))
  if (!existsSync(fp)) continue
  try {
    const stats = await sharp(fp).stats()
    // ignore alpha; max colour-channel stdev. Low = flat/solid placeholder.
    const rgb = stats.channels.slice(0, 3)
    const maxStdev = Math.max(...rgb.map(c => c.stdev))
    checked++
    if (maxStdev < THRESH) {
      flagged.push({ ...a, title: data.title || a.slug, published: data.published !== false, maxStdev: maxStdev.toFixed(1) })
    }
  } catch { /* skip unreadable */ }
}

flagged.sort((x, y) => (x.parts[0] + x.parts[1]).localeCompare(y.parts[0] + y.parts[1]))
console.log(`Checked ${checked} hero images${ONLY ? ` in ${ONLY}` : ''} — ${flagged.length} are solid/near-solid placeholders (stdev < ${THRESH})\n`)
let cat = ''
for (const f of flagged) {
  if (f.parts[0] !== cat) { cat = f.parts[0]; console.log(`\n## ${cat}`) }
  console.log(`  ${f.published ? '🔴 LIVE' : '⚪ unpub'}  stdev=${f.maxStdev}  ${f.title}`)
  console.log(`        ${VERCEL}/${f.parts.join('/')}/`)
}
console.log(`\n🔴 LIVE placeholders (visible to users): ${flagged.filter(f => f.published).length}`)
