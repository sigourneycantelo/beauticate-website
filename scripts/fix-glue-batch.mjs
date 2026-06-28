#!/usr/bin/env node
/**
 * fix-glue-batch.mjs
 * Batch-fixes the migration "glue" bug: italic-intro sentences merged into the
 * previous paragraph at a `.*Capital` boundary (e.g. `…career.*My own…`).
 * Splits with a blank line before the `*` (CLAUDE.md GLUE fix), exactly like the
 * jocelyn-petroni fix.
 *
 * SAFETY: only writes a file if EVERY body line ends up with a balanced (even)
 * count of `**`/`*` markers — otherwise the split would have broken an italic
 * span (e.g. an italic-close rather than open), so it's skipped for manual review.
 *
 *   node scripts/fix-glue-batch.mjs            # dry-run (report only)
 *   node scripts/fix-glue-batch.mjs --apply    # write safe fixes
 *
 * Targets only articles flagged with a glue bug in qa/wp-audit/<cat>.json.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const APPLY = process.argv.includes('--apply')
const ci = process.argv.indexOf('--cat')
const CAT = ci !== -1 ? process.argv[ci + 1] : 'beauty-style'

// sentence/word char + single * (no space) + Capital = a glued italic intro/byline.
// A space before * is legitimate italic, so requiring no space avoids real emphasis.
const GLUE = /([.!?…”’"\w])\*([A-Z“‘"])/g
const starParity = line => {
  const dbl = (line.match(/\*\*/g) || []).length
  // count single stars not part of ** : strip ** then count *
  const singles = (line.replace(/\*\*/g, '').match(/\*/g) || []).length
  return { dblOdd: dbl % 2 === 1, singleOdd: singles % 2 === 1 }
}

const j = JSON.parse(readFileSync(join(ROOT, 'qa', 'wp-audit', `${CAT}.json`), 'utf8'))
const targets = j.results.filter(r => (r.findings || []).some(f => f.type === 'MARKDOWN' && (f.detail || []).some(b => b.type === 'glue')))

let applied = 0, skipped = 0, nochange = 0
const skips = []
for (const r of targets) {
  const path = join(ROOT, r.path)
  if (!existsSync(path)) continue
  const raw = readFileSync(path, 'utf8')
  const m = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/)
  if (!m) continue
  const head = m[1], body = m[2]
  const n = (body.match(GLUE) || []).length
  if (!n) { nochange++; continue }
  const fixed = body.replace(GLUE, '$1\n\n*$2')
  // safety: no body line may have odd ** or odd single-* after fix
  const bad = fixed.split('\n').filter(l => { const p = starParity(l); return p.dblOdd || p.singleOdd })
  if (bad.length) { skipped++; skips.push(`${r.slug} (${bad.length} unbalanced lines)`); continue }
  if (APPLY) writeFileSync(path, head + fixed)
  applied++
}
console.log(`glue targets: ${targets.length}`)
console.log(`${APPLY ? 'APPLIED' : 'would apply'}: ${applied}`)
console.log(`skipped (unbalanced after fix → manual): ${skipped}`)
console.log(`no glue found now: ${nochange}`)
if (skips.length) { console.log('\nskipped:'); skips.forEach(s => console.log('  ' + s)) }
