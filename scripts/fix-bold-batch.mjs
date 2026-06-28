#!/usr/bin/env node
/**
 * fix-bold-batch.mjs — conservative batch fixer for mismatched-bold /
 * space-close-bold across audit-flagged articles. Per line, ONLY rewrites when
 * the result becomes balanced (even ** and even single *); otherwise leaves the
 * line untouched for manual review. Never touches censored swears (f***).
 *
 * Fixes:
 *   - collapse stray 3-4 star runs to **      (**Title**** -> **Title**)
 *   - drop a single trailing ** when it balances (Heading** -> Heading)
 *   - space-close-bold: **X ** -> **X**       (space/NBSP before closing **)
 *
 *   node scripts/fix-bold-batch.mjs [--cat beauty-style]          # dry-run
 *   node scripts/fix-bold-batch.mjs --apply
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const APPLY = process.argv.includes('--apply')
const ci = process.argv.indexOf('--cat')
const CAT = ci !== -1 ? process.argv[ci + 1] : 'beauty-style'

const balanced = l => ((l.match(/\*\*/g) || []).length % 2 === 0) && ((l.replace(/\*\*/g, '').match(/\*/g) || []).length % 2 === 0)
const censored = l => /[A-Za-z]\*{2,}/.test(l) && /\b[a-z]\*{2,}/i.test(l) && !/\*\*\[/.test(l)

function fixLine(orig) {
  if (balanced(orig)) return orig
  if (censored(orig)) return orig
  let l = orig
  // collapse stray runs of 3+ stars to **
  let t = l.replace(/\*{3,}/g, '**')
  if (balanced(t)) return t
  // remove a trailing ** if that balances
  if (/\*\*\s*$/.test(t)) {
    const t2 = t.replace(/\*\*(\s*)$/, '$1')
    if (balanced(t2)) return t2
  }
  // space-close-bold: **X ** -> **X**
  const t3 = t.replace(/\*\*(?=\S)([^*\n]*?)[  ]+\*\*/g, '**$1**')
  if (balanced(t3)) return t3
  return orig // give up — leave for manual
}

const j = JSON.parse(readFileSync(join(ROOT, 'qa', 'wp-audit', `${CAT}.json`), 'utf8'))
const targets = j.results.filter(r => (r.findings || []).some(f => f.type === 'MARKDOWN' && (f.detail || []).some(b => b.type === 'mismatched-bold' || b.type === 'space-close-bold')))

let filesChanged = 0, linesFixed = 0, linesLeft = 0
const examples = []
for (const r of targets) {
  const path = join(ROOT, r.path)
  if (!existsSync(path)) continue
  const raw = readFileSync(path, 'utf8')
  const m = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/); if (!m) continue
  const head = m[1]; const lines = m[2].split('\n')
  let changed = false, leftHere = 0
  const out = lines.map(l => {
    const odd = ((l.match(/\*\*/g) || []).length % 2 === 1 && l.trim().length > 2) || /\*\*(?=\S)[^*\n]*[  ]\*\*/.test(l)
    if (!odd) return l
    const f = fixLine(l)
    if (f !== l) { changed = true; linesFixed++; if (examples.length < 12) examples.push(`- ${l.trim().slice(0, 80)}\n+ ${f.trim().slice(0, 80)}`); return f }
    leftHere++; linesLeft++; return l
  })
  if (changed) { filesChanged++; if (APPLY) writeFileSync(path, head + out.join('\n')) }
}
console.log(`bold targets: ${targets.length}`)
console.log(`${APPLY ? 'files written' : 'files would change'}: ${filesChanged}`)
console.log(`lines fixed: ${linesFixed} · lines left for manual: ${linesLeft}`)
console.log('\nsample fixes:'); examples.forEach(e => console.log(e))
