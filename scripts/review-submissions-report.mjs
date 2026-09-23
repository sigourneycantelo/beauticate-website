#!/usr/bin/env node
/**
 * Reads brand product submissions from /how-we-review out of Vercel Blob.
 *
 * This is the only way to see them until an email provider is configured
 * (RESEND_API_KEY or POSTMARK_SERVER_TOKEN), so check it periodically. Each
 * submission is somebody waiting to hear whether to post their product.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=... node scripts/review-submissions-report.mjs
 *   BLOB_READ_WRITE_TOKEN=... node scripts/review-submissions-report.mjs --days 14
 *   BLOB_READ_WRITE_TOKEN=... node scripts/review-submissions-report.mjs --csv > submissions.csv
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
  const page = await list({ prefix: 'review-submissions/', cursor, limit: 1000 })
  cursor = page.cursor
  for (const b of page.blobs) {
    if (cutoff && new Date(b.uploadedAt).getTime() < cutoff) continue
    try {
      entries.push(await (await fetch(b.url)).json())
    } catch {}
  }
} while (cursor)

entries.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1))

if (asCsv) {
  const cell = v => `"${String(v ?? '').replace(/"/g, '""')}"`
  console.log('submitted_at,brand,contact,email,website,category,product,about')
  for (const e of entries) {
    console.log([e.submittedAt, e.brandName, e.name, e.email, e.website,
      e.category, e.productName, e.about].map(cell).join(','))
  }
  process.exit(0)
}

if (entries.length === 0) {
  console.log('No submissions recorded.')
  console.log('Note that anything submitted before this shipped was lost — the old')
  console.log('route returned an error and stored nothing.')
  process.exit(0)
}

console.log(`${entries.length} submission${entries.length === 1 ? '' : 's'}\n`)

for (const e of entries) {
  console.log(`${e.submittedAt.slice(0, 16).replace('T', ' ')}  ${e.brandName}`)
  console.log(`  Product   ${e.productName}${e.category ? `  (${e.category})` : ''}`)
  console.log(`  Contact   ${e.name} <${e.email}>`)
  console.log(`  Website   ${e.website}`)
  console.log(`  About     ${String(e.about).replace(/\s+/g, ' ').slice(0, 300)}`)
  console.log()
}
