#!/usr/bin/env node
// Sweep 1, step 3: reattribute the real author from the body credit line.
// Most migrated pieces say author: "Beauticate Editorial" in frontmatter, but the
// true byline sits at the foot of the body ("Story by ...", "Words by ...").
// This rewrites the frontmatter author to that writer, mapping known variants to
// the canonical name in lib/authors.ts. Pieces with no byline are left untouched.
//
// Usage:
//   node scripts/reattribute-authors.mjs            # dry run, prints summary + samples
//   node scripts/reattribute-authors.mjs --apply    # write changes

import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const GENERIC = new Set(['beauticate editorial', 'beauticate editors', 'beauticate', ''])

// Writer credits only. Photography / imagery credits are deliberately excluded.
// The keyword must sit at a credit boundary (line start, italic/quote marker, or
// after a full stop) so it can't fire mid-sentence, e.g. a book title that ends
// "...Forgotten Words by Paul Anthony Jones".
// Keyword case is handled explicitly ([Ss]tory etc.) rather than with /i, because
// /i would also un-gate the [A-Z] capitalisation that bounds the captured name.
// \[? allows a markdown-link byline "by [Sigourney Cantelo](url)"; À-ÿ allows
// accented names like "Tess de Vivie de Régie".
// The optional "(and X)" arm catches compound credits like "Interview and story by".
const KW = "(?:[Ss]tory|[Ww]ords|[Ww]ritten|[Ii]nterview(?:ed|s)?)"
const CRED = new RegExp(
  `(?:^|[\\n.*_>"'\\)\\]:])\\s*${KW}(?:\\s+and\\s+${KW})?\\s+[Bb]y\\s+\\[?([A-ZÀ-ÿ][a-zA-ZÀ-ÿ'.-]+(?:\\s+[A-ZÀ-ÿ][a-zA-ZÀ-ÿ'.-]+){0,3})`,
  'gm',
)

// Canonical names from the registry (source of truth).
const registrySrc = readFileSync('lib/authors.ts', 'utf8')
const REGISTRY = registrySrc.match(/name: '([^']+)'/g).map(s => s.replace(/name: '|'/g, ''))
const REGISTRY_LC = new Map(REGISTRY.map(n => [n.toLowerCase(), n]))

// Byline variant -> canonical registry name.
const ALIAS = {
  'sigourney': 'Sigourney Cantelo',
  'sigourney cantelo': 'Sigourney Cantelo',
  'steph russo': 'Stephanie Russo',
  'rikki hodge': 'Rikki Hodge-Smith',
  'rikki hodge smith': 'Rikki Hodge-Smith',
  'rikki hodge-smith': 'Rikki Hodge-Smith',
  'jess burdon': 'Jessica Burdon',
  'jessica burdon': 'Jessica Burdon',
  'chrisanthi kalivioits': 'Chrisanthi Kaliviotis',
  'steph russo.': 'Stephanie Russo',
  // First-name-only and renamed bylines, each unambiguous in this corpus.
  'tess': 'Tess Schlink',
  'tess schlink': 'Tess Schlink',
  'tess de vivie': 'Tess Schlink',
  'tess de vivie de régie': 'Tess Schlink',
  'kristina': 'Kristina Zhou',
}

const STOP = /\s+(And|With|Imagery|Photography|Photographed|Photos|Production|For|At|On|In|The|Main|Hero|Header|Holding|Images|Image|Select|Layout|Sponsored|Story|Video|Words|Arranged|Shot|This)\b.*/i

function normName(raw) {
  let n = raw.split('.')[0].replace(/\s+/g, ' ').trim() // cut at first full stop
  n = n.replace(STOP, '').trim()
  const lc = n.toLowerCase()
  if (ALIAS[lc]) return ALIAS[lc]
  if (REGISTRY_LC.has(lc)) return REGISTRY_LC.get(lc)
  return n // a real-person byline not in the registry (kept as name-only author)
}

function firstCredit(body) {
  CRED.lastIndex = 0
  let m
  while ((m = CRED.exec(body)) !== null) {
    const name = normName(m[1])
    if (name.split(' ').length >= 2) return name // need first + last
  }
  return null
}

const apply = process.argv.includes('--apply')
const files = execSync('find content -name "*.mdx"', { encoding: 'utf8' }).trim().split('\n')

const summary = { reattributed: 0, noCredit: 0, alreadyNamed: 0, changes: [] }
const byTarget = {}

for (const path of files) {
  const raw = readFileSync(path, 'utf8')
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!fm) continue
  const [, frontmatter, body] = fm

  const authorMatch = frontmatter.match(/^author:\s*"?([^"\n]*)"?\s*$/m)
  const current = authorMatch ? authorMatch[1].trim() : ''

  // Only touch generic/editorial bylines. Leave already-named authors alone.
  if (!GENERIC.has(current.toLowerCase())) { summary.alreadyNamed++; continue }

  const real = firstCredit(body)
  if (!real) { summary.noCredit++; continue }

  summary.reattributed++
  byTarget[real] = (byTarget[real] || 0) + 1
  summary.changes.push({ path, from: current || '(none)', to: real, inRegistry: REGISTRY_LC.has(real.toLowerCase()) })

  if (apply) {
    const newFm = authorMatch
      ? frontmatter.replace(/^author:\s*"?[^"\n]*"?\s*$/m, `author: "${real}"`)
      : frontmatter.replace(/\s*$/, '') + `\nauthor: "${real}"`
    writeFileSync(path, `---\n${newFm}\n---\n${body}`, 'utf8')
  }
}

console.log(`${apply ? 'APPLIED' : 'DRY RUN'}`)
console.log(`reattributed: ${summary.reattributed}`)
console.log(`no byline, left as-is: ${summary.noCredit}`)
console.log(`already named, skipped: ${summary.alreadyNamed}`)
console.log(`\n--- reattributions by target author (registry? ) ---`)
for (const [name, n] of Object.entries(byTarget).sort((a, b) => b[1] - a[1])) {
  console.log(`${String(n).padStart(4)}  ${REGISTRY_LC.has(name.toLowerCase()) ? '[reg]' : '[name-only]'}  ${name}`)
}
if (!apply) {
  console.log(`\n--- sample of 12 changes ---`)
  for (const c of summary.changes.slice(0, 12)) console.log(`${c.to}  <=  ${c.path.replace('content/', '')}`)
}
