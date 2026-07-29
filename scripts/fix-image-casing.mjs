#!/usr/bin/env node
/**
 * fix-image-casing.mjs
 *
 * The migration lowercased many /content/ image paths in the MDX while the real
 * files (tracked in git under public/content/**) kept their original CamelCase
 * names. On macOS (case-insensitive) they render; on Vercel (case-sensitive
 * Linux) they 404 → "missing" body/featured images.
 *
 * This script uses `git ls-files public/content` as the source of truth (that is
 * exactly what Vercel checks out and serves) and, for every /content/ image
 * reference in every MDX file, decides:
 *   - OK        : exact-case path is tracked → leave alone
 *   - CASEFIX   : only a case-variant is tracked → rewrite ref to tracked casing
 *   - AMBIGUOUS : >1 tracked file differ only by case → skip, report
 *   - MISSING   : no case-variant tracked at all → genuine gap (WP restore)
 *
 * Dry-run by default. Pass --apply to write. Writes two reports to docs/audit/.
 *
 *   node scripts/fix-image-casing.mjs            # dry run + reports
 *   node scripts/fix-image-casing.mjs --apply    # rewrite refs + reports
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const APPLY = process.argv.includes('--apply')
const ROOT = process.cwd()
const IMG_RE = /\/content\/[^\s)"'>\]]+\.(?:jpe?g|png|webp|gif)/gi

// 1. Source of truth: git-tracked image files under public/content
const tracked = execSync('git ls-files public/content', { encoding: 'utf8', maxBuffer: 1 << 28 })
  .split('\n')
  .filter((p) => /\.(jpe?g|png|webp|gif)$/i.test(p))
  .map((p) => p.replace(/^public/, '')) // → /content/...

const trackedSet = new Set(tracked)
const lcMap = new Map() // lowercase(ref) → [actual tracked refs]
for (const ref of tracked) {
  const k = ref.toLowerCase()
  if (!lcMap.has(k)) lcMap.set(k, [])
  lcMap.get(k).push(ref)
}

// 2. All MDX files
const mdxFiles = execSync('git ls-files "content/**/*.mdx"', { encoding: 'utf8', maxBuffer: 1 << 28 })
  .split('\n')
  .filter(Boolean)

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

let stats = { ok: 0, casefix: 0, ambiguous: 0, missing: 0 }
const caseReport = [] // {file, from, to}
const missingReport = new Map() // file → Set(refs)
const ambiguousReport = []
let filesChanged = 0

for (const file of mdxFiles) {
  let text = fs.readFileSync(file, 'utf8')
  const refs = text.match(IMG_RE) || []
  if (!refs.length) continue
  const edits = new Map() // from → to (per file, dedup)

  for (const raw of new Set(refs)) {
    // Compare the ref exactly as written — git tracks names in the same
    // percent-encoded form the MDX uses. Decoding here caused false "missing".
    const ref = raw
    if (trackedSet.has(ref)) { stats.ok++; continue }
    const cands = lcMap.get(ref.toLowerCase())
    if (!cands) {
      stats.missing++
      if (!missingReport.has(file)) missingReport.set(file, new Set())
      missingReport.get(file).add(ref)
      continue
    }
    if (cands.length > 1) {
      stats.ambiguous++
      ambiguousReport.push({ file, ref, cands })
      continue
    }
    // exactly one tracked case-variant, and it differs → case fix
    if (cands[0] !== ref) {
      stats.casefix++
      edits.set(raw, cands[0]) // rewrite the raw (possibly encoded) form
      caseReport.push({ file, from: raw, to: cands[0] })
    }
  }

  if (edits.size) {
    let next = text
    for (const [from, to] of edits) {
      // boundary-safe: don't rewrite when the match is a prefix of a longer name
      // (e.g. serum.png inside serum.png.jpeg) — disallow a trailing word char or dot
      const re = new RegExp(escapeRe(from) + '(?![\\w.])', 'g')
      next = next.replace(re, to)
    }
    if (next !== text) {
      filesChanged++
      if (APPLY) fs.writeFileSync(file, next)
    }
  }
}

// 3. Reports
fs.mkdirSync('docs/audit', { recursive: true })
const caseLines = caseReport.map((r) => `${r.file}\n    from: ${r.from}\n    to:   ${r.to}`)
fs.writeFileSync('docs/audit/image-casing-fixes.txt',
  `# Case-only image ref fixes (${caseReport.length} refs across ${new Set(caseReport.map(r=>r.file)).size} files)\n` +
  `# ${APPLY ? 'APPLIED' : 'DRY RUN'}\n\n` + caseLines.join('\n') + '\n')

const missLines = [...missingReport.entries()].map(([file, set]) =>
  `${file}\n` + [...set].map((r) => `    ${r}`).join('\n'))
fs.writeFileSync('docs/audit/image-genuinely-missing.txt',
  `# Image refs with NO tracked file in any casing — genuine gaps (WP restore candidates)\n` +
  `# ${missingReport.size} articles, ${stats.missing} refs\n\n` + missLines.join('\n') + '\n')

if (ambiguousReport.length) {
  fs.writeFileSync('docs/audit/image-casing-ambiguous.txt',
    ambiguousReport.map((r) => `${r.file}\n    ref: ${r.ref}\n    cands: ${r.cands.join(', ')}`).join('\n') + '\n')
}

console.log(`\nMDX files scanned:      ${mdxFiles.length}`)
console.log(`Tracked content images: ${tracked.length}`)
console.log(`\nRefs OK (exact case):   ${stats.ok}`)
console.log(`CASE FIX:               ${stats.casefix}  (across ${new Set(caseReport.map(r=>r.file)).size} files)`)
console.log(`AMBIGUOUS (case coll.): ${stats.ambiguous}`)
console.log(`GENUINELY MISSING:      ${stats.missing}  (across ${missingReport.size} articles)`)
console.log(`\nFiles ${APPLY ? 'REWRITTEN' : 'that would change'}: ${filesChanged}`)
console.log(`\nReports:`)
console.log(`  docs/audit/image-casing-fixes.txt`)
console.log(`  docs/audit/image-genuinely-missing.txt`)
if (ambiguousReport.length) console.log(`  docs/audit/image-casing-ambiguous.txt`)
if (!APPLY) console.log(`\n(dry run — re-run with --apply to write)`)
