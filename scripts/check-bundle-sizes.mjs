#!/usr/bin/env node
/**
 * Fails the build when a serverless function bundle gets too big.
 *
 * This exists because the tracing excludes in next.config.ts are a
 * hand-maintained list, and a new route silently falls off it. Adding
 * /feed-editorial.xml did exactly that: one route, 3,389MB of article
 * photography traced into its bundle, and nothing complained. The build
 * before it was 0.58GB; the build after was 3.97GB.
 *
 * Left alone that path ends at `ENOSPC: no space left on device` while
 * collecting build traces — an error that appears ten minutes in, after every
 * page has generated fine, and names nothing connected to the cause. It cost
 * four deploy cycles to find the first time. See docs/build-output.md.
 *
 * Runs after `next build`, because the traces do not exist until then.
 */
import fs from 'node:fs'
import path from 'node:path'

/**
 * Vercel's own uncompressed limit for a serverless function. Not a number
 * picked to fit today's output — the point at which a deploy actually breaks.
 */
const MAX_BUNDLE_BYTES = 250_000_000

/** Total across all bundles. Healthy is well under 1GB; the machine has 8GB. */
const WARN_TOTAL_BYTES = 2_000_000_000

const root = '.next/server'
if (!fs.existsSync(root)) {
  console.error('[bundles] no .next/server — run this after next build.')
  process.exit(1)
}

const traces = []
;(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith('.nft.json')) traces.push(p)
  }
})(root)

let total = 0
const sized = traces.map(t => {
  const base = path.dirname(t)
  let bytes = 0
  for (const f of JSON.parse(fs.readFileSync(t, 'utf8')).files) {
    try { bytes += fs.statSync(path.resolve(base, f)).size } catch { /* pruned by tracing */ }
  }
  total += bytes
  return { route: t.replace(`${root}/app/`, '').replace('.nft.json', ''), bytes }
}).sort((a, b) => b.bytes - a.bytes)

const oversized = sized.filter(s => s.bytes > MAX_BUNDLE_BYTES)

if (oversized.length) {
  console.error('\n[bundles] These function bundles exceed Vercel\'s 250MB limit:\n')
  for (const s of oversized) {
    console.error(`  ${(s.bytes / 1e6).toFixed(0).padStart(6)} MB  ${s.route}`)
  }
  console.error(`
Almost certainly @vercel/nft tracing public/ into the bundle, because the route
can reach code that reads a filesystem path built from a runtime value.

Either stop that route reaching such code, or — only if it never reads an image
at request time — add it to outputFileTracingExcludes in next.config.ts beside
the other feed routes. Do NOT widen that exclude to '*': the article routes read
public/ per request and would break quietly in production.

docs/build-output.md has the long version.
`)
  process.exit(1)
}

if (total > WARN_TOTAL_BYTES) {
  console.warn(`[bundles] total output ${(total / 1e9).toFixed(2)}GB across ${sized.length} bundles — worth a look.`)
}
console.log(`[bundles] ${sized.length} bundles, ${(total / 1e9).toFixed(2)}GB total, largest ${(sized[0].bytes / 1e6).toFixed(0)}MB (${sized[0].route}).`)
