#!/usr/bin/env node
/**
 * Resolve a destination against Agoda's place list, the same lookup the
 * TravelWidget's search box uses.
 *
 * WHY THIS EXISTS
 * `<TravelWidget city="..." />` passes its string to Agoda as
 * `default_destination`, and Agoda matches it against its own places. A string
 * Agoda doesn't recognise does not error — it silently resolves to the nearest
 * thing it can find. The Kerala guide shipped with city="Kerala, India" and the
 * reader got a search box for Kochi, because Agoda has no Kerala entry at all.
 * Nothing in the page, the build or the console said so.
 *
 * So destinations are looked up, never typed from memory. Run:
 *
 *     node scripts/resolve-travel-destination.mjs "Saffire Freycinet"
 *
 * and use one of the strings it prints, verbatim.
 *
 * Agoda returns four kinds of place, and which you want depends on the story:
 *   Property — the hotel itself. Right for a review of one hotel.
 *   Area     — a district or valley. Right for "where to stay in X".
 *   City     — right for a destination guide.
 *   Landmark — never; it's a monument, not somewhere to sleep.
 *
 * --check scans every article for a TravelWidget and verifies its city still
 * resolves to itself exactly, which is the only way a wrong one gets noticed.
 */

import { readFileSync, globSync } from 'node:fs'

const ENDPOINT = 'https://suggest.apistp.com/search'

export async function resolve(term, limit = 5) {
  const url = `${ENDPOINT}?term=${encodeURIComponent(term)}&service=agoda&locale=en`
  const res = await fetch(url, { headers: { 'user-agent': 'beauticate-website/destination-check' } })
  if (!res.ok) throw new Error(`lookup failed for "${term}": HTTP ${res.status}`)
  const body = await res.json()
  if (!Array.isArray(body)) throw new Error(`lookup returned no list for "${term}"`)
  return body.slice(0, limit).map((r) => ({ title: r.title, kind: r.subtitle }))
}

/** The place itself, without the country/region Agoda appends. */
const place = (s) => s.split(',')[0].trim().toLowerCase()

/**
 * True when Agoda's FIRST answer is the place we asked for.
 *
 * First, not "somewhere in the list", because the widget takes the top hit —
 * a correct answer sitting third still means the reader sees the wrong one.
 * And compared on the place alone, because Agoda answers "Byron Bay" with
 * "Byron Bay, Australia" and that is a match, while it answers "Bells at
 * Killcare" with "Belfast, United Kingdom" and that very much is not.
 */
export async function isExact(city) {
  const [first] = await resolve(city, 1)
  return Boolean(first) && place(first.title) === place(city)
}

async function check() {
  const files = globSync('content/**/*.mdx')
  const uses = []
  for (const f of files) {
    const text = readFileSync(f, 'utf8')
    for (const m of text.matchAll(/<TravelWidget[^>]*city="([^"]+)"/g)) {
      uses.push({ file: f, city: m[1] })
    }
  }
  if (!uses.length) return console.log('No TravelWidget destinations found.')

  let bad = 0
  for (const u of uses) {
    const hits = await resolve(u.city, 5)
    const exact = hits.length > 0 && place(hits[0].title) === place(u.city)
    if (exact) {
      console.log(`  ok    ${u.city}`)
    } else {
      bad++
      console.log(`  WRONG ${u.city}  (${u.file})`)
      console.log(`        Agoda would use: ${hits[0]?.title ?? '(nothing)'}`)
      console.log(`        did you mean: ${hits.map((h) => `${h.title} [${h.kind}]`).join(' | ')}`)
    }
  }
  console.log(`\n${uses.length} destination(s), ${bad} not resolving to themselves.`)
  if (bad) process.exitCode = 1
}

const args = process.argv.slice(2)
if (args[0] === '--check') {
  await check()
} else if (args.length) {
  for (const term of args) {
    console.log(`\n▸ ${term}`)
    for (const h of await resolve(term)) console.log(`   ${h.title}  [${h.kind}]`)
  }
} else {
  console.log('usage: resolve-travel-destination.mjs "<place>" [...]  |  --check')
}
