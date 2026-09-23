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

/**
 * TOURS_CITIES, read out of lib/travelpayouts.ts rather than imported.
 *
 * Importing a .ts module from a .mjs script leans on Node's type stripping and
 * warns on every run. The list is a flat literal, so reading it keeps one
 * source of truth without the import.
 */
function toursCities() {
  const src = readFileSync('lib/travelpayouts.ts', 'utf8')
  const block = src.match(/export const TOURS_CITIES[^{]*\{([^}]*)\}/)
  if (!block) throw new Error('TOURS_CITIES not found in lib/travelpayouts.ts')
  return Object.fromEntries(
    [...block[1].matchAll(/'?([a-z][a-z ]*)'?\s*:\s*'([A-Z]{3})'/g)].map((m) => [m[1].trim(), m[2]]),
  )
}
const TOURS_CITIES = toursCities()

const ENDPOINT = 'https://suggest.apistp.com/search'
const IATA_ENDPOINT = 'https://suggest.travelpayouts.com/uaca/v1/search_terms_forward'

export async function resolve(term, limit = 5) {
  const url = `${ENDPOINT}?term=${encodeURIComponent(term)}&service=agoda&locale=en`
  const res = await fetch(url, { headers: { 'user-agent': 'beauticate-website/destination-check' } })
  if (!res.ok) throw new Error(`lookup failed for "${term}": HTTP ${res.status}`)
  const body = await res.json()
  if (!Array.isArray(body)) throw new Error(`lookup returned no list for "${term}"`)
  return body.slice(0, limit).map((r) => ({ title: r.title, kind: r.subtitle }))
}

/**
 * IATA city code for a place, which is what the tours widget takes.
 *
 * Note this only tells you a code EXISTS, not that GetYourGuide sells tours
 * there. Mudgee returns DGE and has no tours at all. Render it before you
 * trust it, then add it to TOURS_CITIES.
 */
export async function iata(term) {
  const url = `${IATA_ENDPOINT}?term=${encodeURIComponent(term)}&locale=en&service=aviasales`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`IATA lookup failed for "${term}": HTTP ${res.status}`)
  const body = await res.json()
  return Array.isArray(body) ? body.slice(0, 5).map((r) => ({ code: r.slug, title: r.title, where: r.subtitle })) : []
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
    for (const m of text.matchAll(/<TravelWidget[^>]*?type="([a-z_]+)"[^>]*?city="([^"]+)"/g)) {
      uses.push({ file: f, type: m[1], city: m[2] })
    }
  }
  if (!uses.length) return console.log('No TravelWidget destinations found.')

  let bad = 0
  for (const u of uses) {
    // Tours are checked against TOURS_CITIES, not Agoda. The two widgets
    // address places completely differently — a name vs an IATA code — so
    // checking a tours city against Agoda's list proves nothing either way.
    if (u.type === 'tours') {
      const key = place(u.city)
      if (TOURS_CITIES[key]) {
        console.log(`  ok    tours  ${u.city} -> ${TOURS_CITIES[key]}`)
      } else {
        bad++
        console.log(`  WRONG tours  ${u.city}  (${u.file})`)
        console.log(`        not in TOURS_CITIES, so this renders nothing.`)
        const hits = await iata(u.city)
        console.log(`        IATA lookup says: ${hits.map((h) => `${h.code} ${h.title}`).join(' | ') || '(nothing)'}`)
        console.log(`        Render it before adding it — a code is not proof of coverage.`)
      }
      continue
    }

    const hits = await resolve(u.city, 5)
    const exact = hits.length > 0 && place(hits[0].title) === place(u.city)
    if (exact) {
      console.log(`  ok    hotel  ${u.city}`)
    } else {
      bad++
      console.log(`  WRONG hotel  ${u.city}  (${u.file})`)
      console.log(`        Agoda would use: ${hits[0]?.title ?? '(nothing)'}`)
      console.log(`        did you mean: ${hits.map((h) => `${h.title} [${h.kind}]`).join(' | ')}`)
    }
  }
  console.log(`\n${uses.length} destination(s), ${bad} not resolving correctly.`)
  if (bad) process.exitCode = 1
}

const args = process.argv.slice(2)
if (args[0] === '--check') {
  await check()
} else if (args[0] === '--iata') {
  for (const term of args.slice(1)) {
    console.log(`\n▸ ${term}`)
    for (const h of await iata(term)) console.log(`   ${h.code}  ${h.title} (${h.where})`)
  }
} else if (args.length) {
  for (const term of args) {
    console.log(`\n▸ ${term}`)
    for (const h of await resolve(term)) console.log(`   ${h.title}  [${h.kind}]`)
  }
} else {
  console.log('usage: resolve-travel-destination.mjs "<place>" [...]   hotel destinations (Agoda)')
  console.log('       resolve-travel-destination.mjs --iata "<city>"    tours city codes (GetYourGuide)')
  console.log('       resolve-travel-destination.mjs --check            verify every destination on the site')
}
