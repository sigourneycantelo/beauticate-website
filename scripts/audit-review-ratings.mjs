#!/usr/bin/env node
/**
 * audit-review-ratings.mjs — keep `review_rating` and <Verdict> together.
 *
 * `lib/seo.ts` emits a reviewRating into the page's JSON-LD whenever
 * `review_rating` is set. Google requires structured data to reflect what a
 * reader can see, so a rating with no visible block on the page is the
 * textbook spammy-structured-markup case. The reverse is just waste: a visible
 * verdict with no markup throws away the rich result it earned.
 *
 * So the two must always agree. This reports three failure modes:
 *
 *   NAKED     review_rating set, no <Verdict> in the body   → policy breach
 *   UNCLAIMED <Verdict> present, no review_rating           → lost rich result
 *   MISMATCH  both present, different numbers               → which is true?
 *
 * Run: node scripts/audit-review-ratings.mjs [--json]
 *
 * Not wired into `npm run build` yet, deliberately: 69 articles are NAKED as
 * of September 2026 and a check that fails on day one is a check someone
 * disables. Once the backlog is clear, add it beside check-editorial-integrity.
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT = join(ROOT, 'content')
const asJson = process.argv.includes('--json')

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (e.endsWith('.mdx')) out.push(p)
  }
  return out
}

/** Frontmatter is the first `---` fenced block; everything after it is body. */
function split(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  return m ? { fm: m[1], body: m[2] } : { fm: '', body: raw }
}

const field = (fm, name) => {
  const m = fm.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null
}

/**
 * Pull the rating off a <Verdict rating={4.5}> or <Verdict rating="4.5">.
 * MDX drops some `{expression}` props, so both spellings appear in the wild.
 */
function verdictRating(body) {
  const tag = body.match(/<Verdict\b[^>]*>/)
  if (!tag) return { present: false, rating: null }
  const m = tag[0].match(/rating=(?:\{\s*([\d.]+)\s*\}|["']([\d.]+)["'])/)
  return { present: true, rating: m ? Number(m[1] ?? m[2]) : null }
}

const naked = [], unclaimed = [], mismatch = []

for (const file of walk(CONTENT)) {
  const { fm, body } = split(readFileSync(file, 'utf-8'))
  if (field(fm, 'published') === 'false') continue

  const raw = field(fm, 'review_rating')
  const fmRating = raw == null ? null : Number(raw)
  const v = verdictRating(body)
  const slug = file.replace(CONTENT + '/', '').replace(/\.mdx$/, '')
  const title = field(fm, 'title') ?? slug

  if (fmRating != null && !v.present) naked.push({ slug, title, rating: fmRating })
  else if (fmRating == null && v.present) unclaimed.push({ slug, title, rating: v.rating })
  else if (fmRating != null && v.rating != null && fmRating !== v.rating) {
    mismatch.push({ slug, title, frontmatter: fmRating, verdict: v.rating })
  }
}

if (asJson) {
  console.log(JSON.stringify({ naked, unclaimed, mismatch }, null, 2))
  process.exit(0)
}

const section = (label, rows, render) => {
  if (!rows.length) return
  console.log(`\n${label} — ${rows.length}\n`)
  for (const r of rows) console.log('  ' + render(r))
}

section('NAKED — rating in the markup, nothing visible on the page (policy breach)',
  naked, r => `${String(r.rating).padStart(4)}★  ${r.slug}`)
section('UNCLAIMED — visible verdict, no schema (a rich result left on the table)',
  unclaimed, r => `${String(r.rating ?? '?').padStart(4)}★  ${r.slug}`)
section('MISMATCH — the page and the markup disagree',
  mismatch, r => `${r.verdict}★ shown vs ${r.frontmatter}★ in markup  ${r.slug}`)

const total = naked.length + unclaimed.length + mismatch.length
console.log(total === 0
  ? '\n[review-ratings] clean — every rating is visible, and every visible rating is marked up.\n'
  : `\n[review-ratings] ${total} to resolve (${naked.length} naked, ${unclaimed.length} unclaimed, ${mismatch.length} mismatched).\n`)
