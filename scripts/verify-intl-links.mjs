#!/usr/bin/env node
// Check every intl destination in data/link-database.json actually lands where
// it claims. Deep-linking has to be enabled per merchant, and a link that
// silently bounces to the retailer's homepage is worse than no link at all —
// the reader gets dumped on a front page with no idea what they clicked.
//
//   node scripts/verify-intl-links.mjs           # check unverified entries
//   node scripts/verify-intl-links.mjs --all     # re-check everything
//   node scripts/verify-intl-links.mjs --write   # flip passing entries to verified
//
// Entries stay inert (verified: false) until they pass. Run this from a normal
// network — CI sandboxes commonly block retailer domains outright.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dbPath = join(root, 'data', 'link-database.json')
const db = JSON.parse(readFileSync(dbPath, 'utf8'))

const all = process.argv.includes('--all')
const write = process.argv.includes('--write')

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

/** A sample product name, so `{q}` search templates resolve to a real query. */
const SAMPLE_QUERY = 'cerave hydrating cleanser'

function isHomepage(url) {
  try {
    const u = new URL(url)
    return u.pathname.replace(/\/+$/, '') === '' && !u.search
  } catch {
    return false
  }
}

async function probe(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': UA, accept: 'text/html' },
      signal: AbortSignal.timeout(20_000),
    })
    const final = res.url || url
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}`, final }
    if (isHomepage(final)) return { ok: false, reason: 'bounced to homepage', final }
    return { ok: true, reason: `HTTP ${res.status}`, final }
  } catch (err) {
    return { ok: false, reason: err.name === 'TimeoutError' ? 'timeout' : err.message, final: url }
  }
}

/** Walk every market entry in the database, yielding {label, entry}. */
function* entries() {
  for (const [host, markets] of Object.entries(db.retailerMap ?? {})) {
    for (const [market, entry] of Object.entries(markets)) {
      if (market.startsWith('_') || typeof entry !== 'object') continue
      yield { label: `retailerMap.${host}.${market}`, entry }
    }
  }
  for (const [host, markets] of Object.entries(db.brands ?? {})) {
    for (const [market, entry] of Object.entries(markets)) {
      if (market.startsWith('_') || market === 'name' || typeof entry !== 'object') continue
      yield { label: `brands.${host}.${market}`, entry }
    }
  }
  for (const scope of ['byHandle', 'byVendor']) {
    for (const [key, markets] of Object.entries(db.shop?.[scope] ?? {})) {
      for (const [market, entry] of Object.entries(markets)) {
        if (market.startsWith('_') || typeof entry !== 'object') continue
        yield { label: `shop.${scope}.${key}.${market}`, entry }
      }
    }
  }
}

const results = { passed: 0, failed: 0, skipped: 0 }

for (const { label, entry } of entries()) {
  if (!all && entry.verified === true) {
    results.skipped++
    continue
  }
  const target = entry.url || (entry.searchUrl || '').replace('{q}', encodeURIComponent(SAMPLE_QUERY))
  if (!target) {
    console.log(`SKIP  ${label} — no url or searchUrl`)
    results.skipped++
    continue
  }

  const { ok, reason, final } = await probe(target)
  if (ok) {
    results.passed++
    console.log(`PASS  ${label} — ${reason}`)
    if (write) entry.verified = true
  } else {
    results.failed++
    console.log(`FAIL  ${label} — ${reason}\n      tried: ${target}\n      final: ${final}`)
    if (write) entry.verified = false
  }
}

if (write) {
  writeFileSync(dbPath, `${JSON.stringify(db, null, 2)}\n`)
  console.log(`\nWrote verified flags to ${dbPath}`)
}

console.log(`\n${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped`)
process.exit(results.failed > 0 && !write ? 1 : 0)
