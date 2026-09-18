#!/usr/bin/env node
/**
 * build-optimisation-worklist.mjs — the SEO/AEO/GEO optimisation target list.
 *
 * One row per published article, ranked by search value, saying what each one
 * still needs. This is the spine of the optimisation project: it decides the
 * order of work, and it imports straight into Asana as tasks.
 *
 * The dimensions, in the order they are worth doing:
 *
 *   QuickAnswer   the 40-60 word direct answer. Highest leverage, on 6 of 1,848.
 *   Verdict       a visible rating block where a rating is already claimed in
 *                 the markup. Until it exists the markup is a policy breach.
 *   Hero image    a landscape holding shot. Without one a portrait gets
 *                 stretched into the wide hero and cropped badly.
 *   Video         a YouTube embed. Schema follows automatically once present,
 *                 so this is pure editorial work. Do it LAST, once the piece is
 *                 otherwise finished, per Sig: videos go on finished articles.
 *   News          whether the piece is recent enough for Google News.
 *
 * Output: docs/audit/optimisation-worklist.csv (gitignored — rebuild it)
 * Usage:  node scripts/build-optimisation-worklist.mjs [--limit 200]
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT = join(ROOT, 'content')
const OUT = join(ROOT, 'docs/audit/optimisation-worklist.csv')
const PRIORITY_CSV = join(ROOT, 'docs/SEO-Beauticate-priority-list.csv')

const i = process.argv.indexOf('--limit')
const LIMIT = i === -1 ? Infinity : Number(process.argv[i + 1])

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (e.endsWith('.mdx')) out.push(p)
  }
  return out
}
const split = raw => {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  return m ? { fm: m[1], body: m[2] } : { fm: '', body: raw }
}
const field = (fm, name) => {
  const m = fm.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null
}

/** Search value per URL, read loosely from the multi-table priority CSV. */
function loadPriority() {
  const score = new Map()
  if (!existsSync(PRIORITY_CSV)) return score
  for (const line of readFileSync(PRIORITY_CSV, 'utf-8').split('\n')) {
    const path = line.match(/\/[a-z0-9-]+(?:\/[a-z0-9-]+)+/)?.[0]
    if (!path) continue
    const nums = [...line.matchAll(/,(\d{2,7}),/g)].map(m => Number(m[1]))
    score.set(path, Math.max(score.get(path) ?? 0, nums.length ? Math.max(...nums) : 0))
  }
  return score
}

const YOUTUBE = /(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)[A-Za-z0-9_-]{11}/
const NEWS_WINDOW_DAYS = 120
const today = new Date()
const priority = loadPriority()
const rows = []

for (const file of walk(CONTENT)) {
  const { fm, body } = split(readFileSync(file, 'utf-8'))
  if (field(fm, 'published') === 'false') continue
  // Directory listings are a different job with different rules (draft_reason,
  // duplicates, venue detail). They do not belong on an editorial worklist.
  if (field(fm, 'venueType')) continue

  const rel = file.replace(CONTENT + '/', '')
  const url = '/' + rel.replace(/\/[^/]+\.mdx$/, '')
  const published = field(fm, 'date_published')
  const ageDays = published ? Math.round((today - new Date(published)) / 86400000) : null
  const rating = field(fm, 'review_rating')

  const needs = []
  if (!body.includes('<QuickAnswer')) needs.push('QuickAnswer')
  if (rating && !body.includes('<Verdict')) needs.push('Verdict')
  if (!field(fm, 'hero_image')) needs.push('Hero image')
  if (!YOUTUBE.test(body) && !field(fm, 'podcast_episode')) needs.push('Video')

  rows.push({
    traffic: priority.get(url) ?? 0,
    url,
    title: (field(fm, 'title') ?? rel).replace(/''/g, "'"),
    category: rel.split('/').slice(0, 2).join('/'),
    quickAnswer: body.includes('<QuickAnswer') ? 'has' : 'NEEDED',
    verdict: rating ? (body.includes('<Verdict') ? 'has' : 'NEEDED') : '',
    rating: rating ?? '',
    heroImage: field(fm, 'hero_image') ? 'has' : 'NEEDED',
    video: YOUTUBE.test(body) ? 'has' : 'NEEDED',
    newsEligible: ageDays !== null && ageDays <= NEWS_WINDOW_DAYS ? 'yes' : '',
    published: published ?? '',
    needs: needs.join(' + '),
    effort: needs.length,
  })
}

// Highest search value first; within equal value, the piece needing least work,
// so a batch clears whole articles rather than starting many.
rows.sort((a, b) => b.traffic - a.traffic || a.effort - b.effort)

const HEAD = ['Rank', 'Task', 'Notes', 'Traffic', 'URL', 'Category', 'QuickAnswer',
  'Verdict', 'Rating', 'Hero image', 'Video', 'News eligible', 'Published', 'Items']
const esc = v => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const out = [HEAD.join(',')]
rows.slice(0, LIMIT).forEach((r, idx) => {
  out.push([idx + 1, `Optimise: ${r.title}`, r.needs || 'Ready — promote', r.traffic, r.url,
    r.category, r.quickAnswer, r.verdict, r.rating, r.heroImage, r.video,
    r.newsEligible, r.published, r.effort].map(esc).join(','))
})
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, out.join('\n') + '\n')

const count = k => rows.filter(r => r[k] === 'NEEDED').length
const withTraffic = rows.filter(r => r.traffic > 0)
console.log(`
Optimisation worklist — ${rows.length} published articles

  Need a QuickAnswer   ${count('quickAnswer')}
  Need a Verdict block ${count('verdict')}   (rating already in the markup)
  Need a hero image    ${count('heroImage')}
  Need a video         ${count('video')}
  Fully ready          ${rows.filter(r => r.effort === 0).length}

  Have search data     ${withTraffic.length}  <- start here, top of the file

Written to ${OUT.replace(ROOT + '/', '')}
Import straight into Asana: Task = column B, Notes = column C.
`)
