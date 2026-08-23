#!/usr/bin/env node
/**
 * Reads the Ask Sig query log out of Vercel Blob and prints a summary.
 *
 * The point of logging was never the raw count. It was the two columns that
 * only exist once you log at the end of a turn:
 *
 *   NO CONTENT   questions where retrieval matched zero articles. That is your
 *                content calendar, written by readers.
 *   INVENTED     answers where a made-up link had to be stripped. That is the
 *                fabrication rate, which is otherwise completely invisible.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=... node scripts/ask-sig-report.mjs
 *   BLOB_READ_WRITE_TOKEN=... node scripts/ask-sig-report.mjs --days 7
 *   BLOB_READ_WRITE_TOKEN=... node scripts/ask-sig-report.mjs --csv > queries.csv
 */

import { list } from '@vercel/blob'

const args = process.argv.slice(2)
const days = Number(args[args.indexOf('--days') + 1]) || 0
const asCsv = args.includes('--csv')

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN is not set.')
  console.error('Get it from Vercel > Storage > your Blob store > .env.local tab.')
  process.exit(1)
}

const cutoff = days ? Date.now() - days * 86_400_000 : 0
const entries = []
let cursor

do {
  const page = await list({ prefix: 'ask-sig-queries/', cursor, limit: 1000 })
  cursor = page.cursor
  for (const b of page.blobs) {
    if (cutoff && new Date(b.uploadedAt).getTime() < cutoff) continue
    try {
      entries.push(await (await fetch(b.url)).json())
    } catch {}
  }
} while (cursor)

entries.sort((a, b) => (a.ts < b.ts ? 1 : -1))

if (asCsv) {
  console.log('ts,question,restricted,articles,products,response_chars,invented_links,page')
  for (const e of entries) {
    const q = `"${String(e.question).replace(/"/g, '""')}"`
    console.log([e.ts, q, e.restricted, e.articleCount, e.productCount,
      e.responseChars, e.strippedLinks, e.pageContext || ''].join(','))
  }
  process.exit(0)
}

if (entries.length === 0) {
  console.log('No entries yet.')
  console.log('Either nobody has asked anything since this shipped, or')
  console.log('BLOB_READ_WRITE_TOKEN is missing in the Vercel production environment.')
  process.exit(0)
}

const noContent = entries.filter(e => e.articleCount === 0)
const invented = entries.filter(e => e.strippedLinks > 0)
const restricted = entries.filter(e => e.restricted)
const first = entries[entries.length - 1].ts.slice(0, 10)
const last = entries[0].ts.slice(0, 10)

console.log(`\nASK SIG  ${first} to ${last}`)
console.log('='.repeat(64))
console.log(`questions                 ${entries.length}`)
console.log(`touching a restricted good ${restricted.length}  (${(restricted.length / entries.length * 100).toFixed(0)}%)`)
console.log(`no article matched         ${noContent.length}  (${(noContent.length / entries.length * 100).toFixed(0)}%)  <- content gaps`)
console.log(`invented a link            ${invented.length}  (${(invented.length / entries.length * 100).toFixed(0)}%)  <- caught and stripped`)

const perDay = {}
for (const e of entries) perDay[e.ts.slice(0, 10)] = (perDay[e.ts.slice(0, 10)] || 0) + 1
const busiest = Object.entries(perDay).sort((a, b) => b[1] - a[1])[0]
console.log(`busiest day               ${busiest[0]} (${busiest[1]})`)

// Rough cost, using the measured ~11k in / ~350 out per question.
const per = (11000 / 1e6) * 1 + (350 / 1e6) * 5
console.log(`approx spend so far       $${(entries.length * per).toFixed(2)} at current Haiku pricing`)

if (noContent.length) {
  console.log('\nASKED, BUT WE HAD NOTHING (story ideas)')
  console.log('-'.repeat(64))
  for (const e of noContent.slice(0, 25)) console.log(`  ${e.ts.slice(0, 10)}  ${e.question}`)
}

if (invented.length) {
  console.log('\nANSWERS WHERE A LINK WAS INVENTED')
  console.log('-'.repeat(64))
  for (const e of invented.slice(0, 15)) console.log(`  ${e.ts.slice(0, 10)}  (${e.strippedLinks})  ${e.question}`)
}

const byPage = {}
for (const e of entries) if (e.pageContext) byPage[e.pageContext] = (byPage[e.pageContext] || 0) + 1
const pages = Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 10)
if (pages.length) {
  console.log('\nASKED FROM')
  console.log('-'.repeat(64))
  for (const [p, n] of pages) console.log(`  ${String(n).padStart(4)}  ${p}`)
}

console.log('\nRECENT')
console.log('-'.repeat(64))
for (const e of entries.slice(0, 20)) {
  const flag = e.strippedLinks ? '!' : e.articleCount === 0 ? '?' : ' '
  console.log(`${flag} ${e.ts.slice(0, 16).replace('T', ' ')}  ${e.question.slice(0, 78)}`)
}
console.log('\n  ! link invented   ? no article matched\n')
