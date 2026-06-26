#!/usr/bin/env node
// Sweep 1: migrate body-markdown FAQ into `faqs:` frontmatter, then remove the body block.
// The renderer builds FAQPage schema + the styled panel from frontmatter only (lib/seo.ts),
// so body-markdown FAQs earn nothing. This moves them where they count.
//
// Usage:
//   node scripts/migrate-faqs.mjs <file.mdx>            # dry run, prints proposed diff
//   node scripts/migrate-faqs.mjs <file.mdx> --apply    # write changes
//   node scripts/migrate-faqs.mjs --all --apply         # process every content/**/*.mdx

import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const HEADING = /\n#{1,3}\s*Frequently Asked Questions\s*\n/i

// One regex for the whole pipeline. Answers are single paragraphs in this dataset,
// so bound each answer at the next blank line. This stops the final answer from
// swallowing trailing images (e.g. a gallery that follows the FAQ block).
const PAIR_RE = /\*\*Q:\s*([\s\S]*?)\*\*\s*\n+A:\s*([\s\S]*?)(?=\n\s*\n|\s*$)/g

// Parse "**Q: ...**\nA: ..." pairs out of a block of text.
function parsePairs(block) {
  const pairs = []
  const re = new RegExp(PAIR_RE.source, 'g')
  let m
  while ((m = re.exec(block)) !== null) {
    const q = m[1].replace(/\s+/g, ' ').trim()
    const a = m[2].replace(/\s+/g, ' ').trim()
    if (q && a) pairs.push({ q, a })
  }
  return pairs
}

// Double-quote a YAML scalar safely (matches existing file style).
function yamlQuote(s) {
  return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
}

function buildFaqsYaml(pairs) {
  let out = 'faqs:\n'
  for (const { q, a } of pairs) {
    out += `  - question: ${yamlQuote(q)}\n`
    out += `    answer: ${yamlQuote(a)}\n`
  }
  return out
}

function processFile(path, apply) {
  const raw = readFileSync(path, 'utf8')

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!fmMatch) return { path, status: 'skip', reason: 'no frontmatter' }
  let [, frontmatter, body] = fmMatch

  if (/^faqs:/m.test(frontmatter)) return { path, status: 'skip', reason: 'already has faqs frontmatter' }

  const hMatch = body.match(HEADING)
  if (!hMatch) return { path, status: 'skip', reason: 'no body FAQ block' }

  const idx = body.indexOf(hMatch[0])
  const before = body.slice(0, idx)
  const faqBlock = body.slice(idx)

  const pairs = parsePairs(faqBlock)
  if (pairs.length === 0) return { path, status: 'skip', reason: 'FAQ heading but no parseable pairs' }

  // Strip the FAQ heading and every Q/A pair out of the block. Whatever is left
  // (interleaved images, a stray gallery) is preserved, so we never delete media.
  const leftover = faqBlock
    .replace(HEADING, '\n')
    .replace(new RegExp(PAIR_RE.source, 'g'), '')
    .trim()

  const newFrontmatter = frontmatter.replace(/\s*$/, '') + '\n' + buildFaqsYaml(pairs).replace(/\n$/, '')
  let newBody = before.replace(/\s*$/, '') + '\n'
  if (leftover) newBody += '\n' + leftover + '\n'
  const result = `---\n${newFrontmatter}\n---\n${newBody}`

  if (apply) {
    writeFileSync(path, result, 'utf8')
    return { path, status: 'applied', count: pairs.length }
  }
  return { path, status: 'dry', count: pairs.length, pairs, preview: buildFaqsYaml(pairs) }
}

// --- main ---
const args = process.argv.slice(2)
const apply = args.includes('--apply')
const all = args.includes('--all')

let files
if (all) {
  files = execSync('find content -name "*.mdx"', { encoding: 'utf8' }).trim().split('\n')
} else {
  files = args.filter(a => !a.startsWith('--'))
}

const summary = { applied: 0, skipped: 0, dry: 0, totalPairs: 0 }
for (const f of files) {
  const r = processFile(f, apply)
  if (r.status === 'applied') { summary.applied++; summary.totalPairs += r.count }
  else if (r.status === 'dry') {
    summary.dry++; summary.totalPairs += r.count
    if (!all) {
      console.log(`\n=== ${f} ===`)
      console.log(`Parsed ${r.count} Q&A pairs. Proposed frontmatter addition:\n`)
      console.log(r.preview)
    }
  } else {
    summary.skipped++
    if (!all) console.log(`SKIP ${f} — ${r.reason}`)
  }
}

console.log(`\n--- summary ---`)
console.log(`applied: ${summary.applied}, dry: ${summary.dry}, skipped: ${summary.skipped}, total Q&A: ${summary.totalPairs}`)
