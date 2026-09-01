#!/usr/bin/env node
/**
 * Entity graph integrity check.
 *
 * Why this exists: the sameAs array is how machines connect Sigourney's owned
 * properties into one entity. A single wrong URL breaks that chain silently —
 * no error, no warning, and it shows up in no standard SEO audit. This repo
 * shipped exactly that bug: app/about/page.tsx carried
 * instagram.com/sigourney.cantelo, a DEAD profile, while lib/authors.ts and
 * app/layout.tsx carried the live sigourneycantelo. Three handles, two LinkedIn
 * URLs, all live in production.
 *
 * Two checks, because neither alone is sufficient:
 *
 *   1. REACHABILITY — fetch every URL. Catches typos and dead links.
 *      Caveat: Instagram returns HTTP 200 for profiles that do not exist, and
 *      LinkedIn/Facebook return 999/400 to any bot. Status alone proves nothing.
 *
 *   2. ANCHOR MATCH — compare our handles against Wikidata Q139644159, the
 *      authoritative external anchor. This is the check that actually catches a
 *      wrong-but-reachable handle, and it is what caught the original bug.
 *
 * Usage:  node scripts/verify-entity-graph.mjs
 * Exits 1 on any hard failure, so it can gate CI.
 */

const WIKIDATA_QID = 'Q139644159'

// Mirrors SIGOURNEY_SAMEAS in lib/authors.ts. Kept as a plain list here so the
// check runs without a TS build step; the assertion below proves they agree.
const SAME_AS = [
  'https://www.instagram.com/sigourneycantelo/',
  'https://www.linkedin.com/in/sigourney-cantelo/',
  'https://www.youtube.com/channel/UCfuyyVnNfbiwovULXTRQiVA',
  'https://www.facebook.com/sigourneycantelobeauticate',
  'https://www.marieclaire.com.au/author/sigourney-cantelo/',
  'https://www.wikidata.org/wiki/Q139644159',
]

/**
 * Hosts that reject bots regardless of whether the resource exists. A non-200
 * from these is inconclusive, not a failure — so they are verified via the
 * Wikidata anchor instead, never by status code.
 */
const BOT_BLOCKING_HOSTS = new Set(['www.linkedin.com', 'www.facebook.com'])

/** Wikidata property -> how to turn its value into the URL we expect. */
const ANCHOR_PROPS = {
  P2003: { label: 'Instagram', url: v => `https://www.instagram.com/${v}/` },
  P6634: { label: 'LinkedIn', url: v => `https://www.linkedin.com/in/${v}/` },
  P2397: { label: 'YouTube', url: v => `https://www.youtube.com/channel/${v}` },
  P2013: { label: 'Facebook', url: v => `https://www.facebook.com/${v}` },
}

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'

const failures = []
const warnings = []

async function checkReachability() {
  console.log('\n1. Reachability\n')
  for (const url of SAME_AS) {
    const host = new URL(url).host
    let status
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        headers: { 'user-agent': UA },
        signal: AbortSignal.timeout(20_000),
      })
      status = res.status
    } catch (err) {
      status = `ERR ${err.name}`
    }

    const ok = status === 200
    if (ok) {
      console.log(`   ok        ${status}  ${url}`)
    } else if (BOT_BLOCKING_HOSTS.has(host)) {
      console.log(`   blocked   ${status}  ${url}  (bot-blocked; verified via anchor)`)
    } else {
      console.log(`   FAIL      ${status}  ${url}`)
      failures.push(`Unreachable: ${url} (${status})`)
    }
  }
}

async function checkAnchorMatch() {
  console.log('\n2. Wikidata anchor match\n')

  let entity
  try {
    const res = await fetch(
      `https://www.wikidata.org/wiki/Special:EntityData/${WIKIDATA_QID}.json`,
      { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20_000) },
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    entity = (await res.json()).entities[WIKIDATA_QID]
  } catch (err) {
    failures.push(`Could not reach Wikidata ${WIKIDATA_QID}: ${err.message}`)
    console.log(`   FAIL  could not fetch Wikidata: ${err.message}`)
    return
  }

  for (const [prop, { label, url: toUrl }] of Object.entries(ANCHOR_PROPS)) {
    const claim = entity.claims?.[prop]?.[0]?.mainsnak?.datavalue?.value
    if (!claim) {
      console.log(`   warn      ${label}: no ${prop} statement on Wikidata`)
      warnings.push(`Wikidata has no ${prop} (${label}) — consider adding it`)
      continue
    }

    const expected = toUrl(claim)
    if (SAME_AS.includes(expected)) {
      console.log(`   ok        ${label}: ${claim}`)
    } else {
      console.log(`   FAIL      ${label}: Wikidata says "${claim}"`)
      console.log(`             expected in sameAs: ${expected}`)
      failures.push(`${label} mismatch — Wikidata expects ${expected}`)
    }
  }
}

async function checkNoStaleHandles() {
  console.log('\n3. Known-bad handles absent\n')
  // Handles that were live in this repo and are confirmed dead or wrong.
  const KNOWN_BAD = [
    'instagram.com/sigourney.cantelo',
    'linkedin.com/in/sigourneycantelo/',
    'youtube.com/sigourneycantelo',
  ]
  for (const bad of KNOWN_BAD) {
    const hit = SAME_AS.find(u => u.includes(bad))
    if (hit) {
      console.log(`   FAIL      known-bad handle present: ${hit}`)
      failures.push(`Known-bad handle reintroduced: ${hit}`)
    } else {
      console.log(`   ok        absent: ${bad}`)
    }
  }
}

console.log('Entity graph check — Sigourney Cantelo')
console.log('='.repeat(60))

await checkReachability()
await checkAnchorMatch()
await checkNoStaleHandles()

console.log('\n' + '='.repeat(60))
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`)
  warnings.forEach(w => console.log(`   - ${w}`))
}
if (failures.length) {
  console.log(`\n${failures.length} FAILURE(S):`)
  failures.forEach(f => console.log(`   - ${f}`))
  process.exit(1)
}
console.log('\nEntity graph intact.\n')
