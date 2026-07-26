#!/usr/bin/env tsx
/**
 * Fire a correctly-signed fake `orders/create` webhook at the gift endpoint, so you
 * can test the whole loop end-to-end without placing real orders.
 *
 * Usage:
 *   # against local dev (npm run dev)
 *   npx tsx scripts/test-gift-webhook.ts
 *
 *   # against a deployed URL, custom vendor / order number / total
 *   TARGET=https://your-preview.vercel.app \
 *   VENDOR="Maison Balzac" ORDER="#TEST-1" TOTAL=120 SUBURB="Bondi" STATE="NSW" \
 *   npx tsx scripts/test-gift-webhook.ts
 *
 *   # simulate a bad signature (expect 401)
 *   BAD_SIG=1 npx tsx scripts/test-gift-webhook.ts
 *
 * Reads SHOPIFY_WEBHOOK_SECRET from the environment (.env.local) to sign the body —
 * it must match the secret the server verifies with.
 */
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

// Minimal .env.local loader (no dotenv dependency in this repo).
function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const p = path.resolve(process.cwd(), file)
    if (!fs.existsSync(p)) continue
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}
loadEnv()

const SECRET = process.env.SHOPIFY_WEBHOOK_SECRET
if (!SECRET) {
  console.error('✗ SHOPIFY_WEBHOOK_SECRET not set (add it to .env.local). Cannot sign the request.')
  process.exit(1)
}

const TARGET = process.env.TARGET ?? 'http://localhost:3000'
const VENDOR = process.env.VENDOR ?? 'Maison Balzac'
const ORDER = process.env.ORDER ?? `#TEST-${Math.floor(Math.random() * 100000)}`
const TOTAL = process.env.TOTAL ?? '120.00'
const SUBURB = process.env.SUBURB ?? 'Bondi'
const STATE = process.env.STATE ?? 'NSW'
const orderId = Math.floor(Math.random() * 1_000_000_000)

const payload = {
  id: orderId,
  admin_graphql_api_id: `gid://shopify/Order/${orderId}`,
  name: ORDER,
  order_number: orderId,
  total_price: TOTAL,
  current_total_price: TOTAL,
  line_items: [
    { vendor: VENDOR, quantity: 1, price: TOTAL, title: `${VENDOR} test product` },
  ],
  shipping_address: { city: SUBURB, province_code: STATE, province: STATE },
}

const rawBody = JSON.stringify(payload)
let hmac = crypto.createHmac('sha256', SECRET).update(rawBody, 'utf8').digest('base64')
if (process.env.BAD_SIG) hmac = 'this-is-not-a-valid-signature'

async function main() {
  const url = `${TARGET}/api/webhooks/orders-created`
  console.log(`→ POST ${url}`)
  console.log(`  order=${ORDER} vendor="${VENDOR}" total=${TOTAL} ship="${SUBURB}, ${STATE}"${process.env.BAD_SIG ? '  [BAD SIGNATURE]' : ''}`)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Hmac-Sha256': hmac,
      'X-Shopify-Topic': 'orders/create',
      'X-Shopify-Webhook-Id': `test-${orderId}`,
    },
    body: rawBody,
  })
  const text = await res.text()
  console.log(`← ${res.status} ${res.statusText}`)
  console.log(text)
  if (process.env.BAD_SIG && res.status === 401) console.log('✓ Bad signature correctly rejected (401).')
}

main().catch(e => { console.error(e); process.exit(1) })
