#!/usr/bin/env node
/**
 * fix-space-close-emphasis.mjs — site-wide fixer for emphasis markers that
 * never close because whitespace sits just inside the closing delimiter:
 *
 *   *Story by Jessica Burdon. *   ->  *Story by Jessica Burdon.*
 *   With *that hair *and ...      ->  With *that hair* and ...
 *   **Label: **value              ->  **Label:** value
 *
 * The whitespace is MOVED outside the delimiter, never deleted, so word
 * spacing is preserved.
 *
 * A regex cannot tell an opening delimiter from a closing one, so it will
 * happily "fix" the gap between two ALREADY-CORRECT emphases
 * (`*a*, to *b*` -> `*a*, to* b*`). Correctness therefore comes from the
 * parser, not the pattern: each candidate rewrite is applied ON ITS OWN and
 * kept only if, re-parsed with the same parser the site uses:
 *
 *   - the file still parses
 *   - strictly fewer asterisks survive as literal text (a real marker paired)
 *   - the emphasis/strong node count does not drop (nothing valid was broken)
 *   - the visible prose is unchanged once asterisks are stripped
 *
 * Anything failing those checks is left for manual review. Escaped asterisks
 * (\*) are deliberate footnote markers and are never candidates.
 *
 *   node scripts/fix-space-close-emphasis.mjs            # dry-run
 *   node scripts/fix-space-close-emphasis.mjs --apply
 *   node scripts/fix-space-close-emphasis.mjs --report   # what's left, by file
 */
import { readFileSync, writeFileSync, globSync } from 'fs'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { mdxjs } from 'micromark-extension-mdxjs'
import { mdxFromMarkdown } from 'mdast-util-mdx'
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'

const APPLY = process.argv.includes('--apply')
const REPORT = process.argv.includes('--report')

function analyse(md) {
  let tree
  try {
    tree = fromMarkdown(md, { extensions: [mdxjs()], mdastExtensions: [mdxFromMarkdown()] })
  } catch { return null }
  let stars = 0, emph = 0
  const where = []
  visit(tree, (node) => {
    if (node.type === 'emphasis' || node.type === 'strong') emph++
    if (node.type === 'text') {
      const c = (node.value.match(/\*/g) || []).length
      if (c) { stars += c; where.push({ line: node.position?.start.line, text: node.value.replace(/\s+/g,' ').trim().slice(0,110) }) }
    }
  })
  return { stars, emph, where, prose: toString(tree).replace(/\*/g,'').replace(/\s+/g,' ').trim() }
}

// Candidate sites: whitespace immediately inside what looks like a closer.
const BOLD   = /(^|[^\\*])\*\*(?=\S)((?:[^*\n\\]|\\.)*?)([  \t]+)\*\*/
const ITALIC = /(^|[^\\*])\*(?=\S)((?:[^*\n\\]|\\.)*?)([  \t]+)\*(?!\*)/

/** Apply only the match starting at or after `from`; return [newBody, nextFrom] or null. */
function applyOne(body, from) {
  for (const re of [BOLD, ITALIC]) {
    const slice = body.slice(from)
    const m = slice.match(re)
    if (!m) continue
    const at = from + m.index
    const marker = re === BOLD ? '**' : '*'
    const replaced = `${m[1]}${marker}${m[2]}${marker}${m[3]}`
    return [body.slice(0, at) + replaced + body.slice(at + m[0].length), at + replaced.length]
  }
  return null
}

const files = globSync('content/**/*.mdx').sort()
let changed = 0, before = 0, after = 0, accepted = 0, rejected = 0
const leftover = []

for (const f of files) {
  const raw = readFileSync(f, 'utf8')
  const m = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/)
  if (!m) continue
  const [, head, orig] = m

  const base = analyse(orig)
  if (!base || base.stars === 0) continue
  before += base.stars

  let body = orig
  let cur = base
  let from = 0
  for (;;) {
    const step = applyOne(body, from)
    if (!step) break
    const [cand, next] = step
    const a = analyse(cand)
    const ok = a && a.stars < cur.stars && a.emph >= cur.emph && a.prose === cur.prose
    if (ok) { body = cand; cur = a; accepted++; from = 0 }   // restart: offsets shifted
    else    { rejected++; from = next }
  }

  after += cur.stars
  if (body !== orig) { changed++; if (APPLY) writeFileSync(f, head + body) }
  if (cur.stars) leftover.push({ f, n: cur.stars, where: cur.where })
}

console.log(`files scanned             : ${files.length}`)
console.log(`${APPLY ? 'files written' : 'files would change'}     : ${changed}`)
console.log(`rewrites accepted/rejected: ${accepted} / ${rejected}`)
console.log(`literal stars before/after: ${before} -> ${after}`)
console.log(`files still needing review: ${leftover.length}`)

if (REPORT) {
  console.log('\n--- remaining, by file ---')
  for (const l of leftover.sort((a,b)=>b.n-a.n)) {
    console.log(`\n${String(l.n).padStart(3)}  ${l.f}`)
    for (const w of l.where.slice(0,4)) console.log(`      L${w.line}: ${w.text}`)
  }
}
