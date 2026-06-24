#!/usr/bin/env node
// Detect floating / bare URLs left in article bodies by the WordPress migration.
// These are NOT safe to blanket-delete: some are mangled links to repair, some are
// embed/product opportunities, some are useful brand links. So this REPORTS and
// classifies rather than mutating. Output: qa/floating-urls-report.csv (a worklist
// for the visual pass).
//
// Usage: node scripts/detect-floating-urls.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

function classify(line) {
  const l = line.trim()
  if (/\b(instagram|tiktok|facebook|youtube|youtu\.be)\b/i.test(l) && /^\[?https?:|^⁠?\s*https?:/.test(l))
    return ['SOCIAL/EMBED', 'Convert to a proper link, follow-block, or video embed (VideoObject)']
  if (/^"https?:\/\//.test(l))
    return ['QUOTED', 'Likely an intended embed or product link. Wire up (YouTube -> embed, shop -> ProductEmbed)']
  if (/^\[https?:\/\//.test(l))
    return ['MANGLED-LINK', 'Broken markdown link (open bracket, no label). Repair into [text](url)']
  if (/https?:\/\/\S+[A-Z][a-z]/.test(l) && !/\]\(/.test(l))
    return ['RUN-INTO-WORD', 'URL concatenated to following text (e.g. .../salonReview). Split and link']
  return ['BARE-URL', 'Bare URL floating in body. Convert to a clean link or remove']
}

function csv(v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v }

const files = execSync('find content -name "*.mdx"', { encoding: 'utf8' }).trim().split('\n')
const rows = [['Article', 'Line', 'Type', 'Suggested action', 'Snippet']]
const counts = {}

for (const path of files) {
  const raw = readFileSync(path, 'utf8')
  const fm = raw.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/)
  const body = fm ? fm[1] : raw
  const offset = fm ? raw.slice(0, raw.length - fm[1].length).split('\n').length - 1 : 0
  body.split('\n').forEach((line, i) => {
    // Strip everything that legitimately contains a URL so only floating/bare
    // ones remain: image markdown, then link markdown (this resolves nested
    // shoppable [![alt](img)](url) cards), then HTML tags and JSX component
    // props (<a href>, <ShopItem image=...>).
    let stripped = line
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')   // ![alt](img)
      .replace(/\[[^\]]*\]\([^)]*\)/g, '')      // [text](url)
      .replace(/<[^>]+>/g, '')                  // HTML / JSX tags
    if (!/https?:\/\//.test(stripped)) return
    const [type, action] = classify(stripped)
    counts[type] = (counts[type] || 0) + 1
    rows.push([path.replace('content/', ''), offset + i + 1, type, action, line.trim().slice(0, 120)])
  })
}

writeFileSync('qa/floating-urls-report.csv', rows.map(r => r.map(csv).join(',')).join('\n'))
console.log(`Wrote qa/floating-urls-report.csv (${rows.length - 1} occurrences)\n`)
for (const [t, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`${String(n).padStart(4)}  ${t}`)
