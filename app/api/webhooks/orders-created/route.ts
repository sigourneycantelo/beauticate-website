// ─── Shopify webhook: orders/create → gift-with-purchase notifications ─────────
//
// The core loop. On a verified new order we:
//   1. Verify the X-Shopify-Hmac-Sha256 signature (reject if invalid).
//   2. Dedupe (per-order claim + per-brand order tags) so nothing emails twice.
//   3. Find participating brands from the line items' vendors.
//   4. For each brand: count gifts already sent, apply cap + min-spend, and if it
//      qualifies, email the warehouse, tag the order gift-<brand>, and write the
//      per-brand state the storefront can later read (claimed flag).
//
// Runtime = nodejs (we need the raw body + node crypto for HMAC). Never runs on the edge.

import crypto from 'crypto'
import { NextResponse } from 'next/server'
import {
  matchBrandsInOrder,
  meetsMinSpend,
  capFor,
  orderTagFor,
  PROCESSED_TAG,
  type OrderLineItem,
} from '@/lib/gift-campaign'
import {
  adminConfigured,
  countGiftsSent,
  invalidateGiftCount,
  tagOrder,
  getOrderTags,
} from '@/lib/shopify-admin'
import { claimOnce, releaseInFlight } from '@/lib/gift-idempotency'
import { sendGiftEmail, emailConfigured } from '@/lib/gift-email'
import { writeGiftState } from '@/lib/gift-state'
import { giftLog } from '@/lib/gift-log'
import { sendCapiEvent } from '@/lib/meta/capi'
import { sendPurchase } from '@/lib/ga/measurement-protocol'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET

// ─── HMAC verification ─────────────────────────────────────────────────────────

function verifyHmac(rawBody: string, hmacHeader: string | null): boolean {
  if (!WEBHOOK_SECRET || !hmacHeader) return false
  const digest = crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody, 'utf8').digest('base64')
  const a = Buffer.from(digest)
  const b = Buffer.from(hmacHeader)
  // timingSafeEqual throws if lengths differ — guard first.
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

// ─── Shopify order payload (only the fields we read) ───────────────────────────

type ShopifyOrderPayload = {
  id: number
  admin_graphql_api_id?: string // "gid://shopify/Order/123"
  name?: string // "#1042"
  order_number?: number
  total_price?: string
  current_total_price?: string
  currency?: string
  email?: string | null
  phone?: string | null
  customer?: { email?: string | null; phone?: string | null } | null
  note_attributes?: { name: string; value: string }[]
  line_items?: (OrderLineItem & {
    vendor?: string | null
    title?: string
    product_id?: number | string
    variant_id?: number | string
    sku?: string | null
  })[]
  shipping_address?: { city?: string | null; province_code?: string | null; province?: string | null } | null
  billing_address?: { city?: string | null; province_code?: string | null; province?: string | null } | null
}

function noteAttr(order: ShopifyOrderPayload, name: string): string | undefined {
  return order.note_attributes?.find(a => a.name === name)?.value || undefined
}

// checkout_completed: Meta Purchase (CAPI) + GA4 purchase (Measurement Protocol).
// note_attributes carries ga_client_id/fbp/fbc/user_agent through from the cart
// (see lib/attribution.ts + lib/shopify.ts `updateCartAttributes`) — Shopify
// copies cart.attributes onto the order automatically, which is the only bridge
// available since this webhook is a server-to-server call with no browser cookies.
async function sendPurchaseAnalytics(order: ShopifyOrderPayload, orderName: string): Promise<void> {
  const value = parseFloat(order.total_price ?? order.current_total_price ?? '0') || 0
  const currency = order.currency || 'AUD'
  const email = order.email || order.customer?.email || undefined
  const phone = order.phone || order.customer?.phone || undefined
  const gaClientId = noteAttr(order, 'ga_client_id')
  const fbp = noteAttr(order, 'fbp')
  const fbc = noteAttr(order, 'fbc')
  const userAgent = noteAttr(order, 'user_agent')

  const metaContentIds = (order.line_items ?? []).map(li => (li.product_id != null ? String(li.product_id) : li.sku ?? undefined)).filter(Boolean) as string[]
  const metaContents = (order.line_items ?? []).map(li => ({
    id: li.product_id != null ? String(li.product_id) : li.sku,
    quantity: li.quantity ?? 1,
    item_price: parseFloat(li.price ?? '0') || 0,
  }))

  const gaItems = (order.line_items ?? []).map(li => ({
    item_id: li.product_id != null ? String(li.product_id) : (li.sku ?? 'unknown'),
    item_name: li.title ?? 'Unknown product',
    item_brand: li.vendor ?? undefined,
    price: parseFloat(li.price ?? '0') || 0,
    quantity: li.quantity ?? 1,
  }))

  const [metaResult, gaResult] = await Promise.all([
    sendCapiEvent({
      eventName: 'Purchase',
      // Stable per-order id — Meta dedupes repeated (event_name, event_id), so
      // a Shopify webhook retry for the same order never double-counts revenue.
      eventId: `purchase-${order.id}`,
      actionSource: 'website',
      customData: {
        content_type: 'product',
        content_ids: metaContentIds,
        contents: metaContents,
        value,
        currency,
        order_id: String(order.id),
      },
      userData: {
        client_user_agent: userAgent,
        fbp,
        fbc,
        email,
        phone,
      },
    }),
    sendPurchase({
      clientId: gaClientId ?? `order-${order.id}`, // synthetic fallback if never captured client-side
      syntheticClientId: !gaClientId,
      transactionId: String(order.id),
      value,
      currency,
      items: gaItems,
    }),
  ])

  giftLog('analytics_sent', {
    order: orderName,
    meta: metaResult,
    ga: gaResult,
    hadGaClientId: Boolean(gaClientId),
    hadFbp: Boolean(fbp),
    hadFbc: Boolean(fbc),
  })
}

function shipToLabel(order: ShopifyOrderPayload): string {
  const addr = order.shipping_address ?? order.billing_address ?? null
  const suburb = addr?.city?.trim() || ''
  const state = addr?.province_code?.trim() || addr?.province?.trim() || ''
  return [suburb, state].filter(Boolean).join(', ') || 'address on order'
}

// ─── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const rawBody = await req.text()
  const hmac = req.headers.get('x-shopify-hmac-sha256')
  const topic = req.headers.get('x-shopify-topic') ?? ''
  const webhookId = req.headers.get('x-shopify-webhook-id') ?? ''

  // 1) Verify signature. Reject anything that doesn't match — do no work.
  if (!verifyHmac(rawBody, hmac)) {
    giftLog('invalid_hmac', { topic, webhookId })
    return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 })
  }

  let order: ShopifyOrderPayload
  try {
    order = JSON.parse(rawBody)
  } catch {
    giftLog('error', { reason: 'unparseable body', webhookId })
    return NextResponse.json({ error: 'Bad payload' }, { status: 400 })
  }

  const orderName = order.name ?? (order.order_number ? `#${order.order_number}` : String(order.id))
  const orderGid = order.admin_graphql_api_id ?? `gid://shopify/Order/${order.id}`
  const claimKey = `order:${order.id}`

  giftLog('received', { order: orderName, webhookId, topic })

  // checkout_completed — Meta Purchase (CAPI) + GA4 purchase (Measurement
  // Protocol). Runs for every order regardless of gift-with-purchase eligibility
  // or config, and is deliberately NOT gated behind the gift claimOnce lock below
  // (a retry re-sending this is harmless: both destinations dedupe on the stable
  // event_id/transaction_id derived from the order id, so a duplicate delivery
  // never double-counts revenue). Awaited (not fire-and-forget) — a Vercel
  // serverless function isn't guaranteed to keep running background work after
  // the response ships, so an un-awaited send could get dropped. Wrapped so an
  // analytics failure can never affect gift-with-purchase processing.
  await sendPurchaseAnalytics(order, orderName).catch(err => {
    giftLog('error', { order: orderName, reason: 'analytics failed', error: String(err) })
  })

  // Config sanity — if we can't act, ask Shopify to retry (self-heals once fixed).
  if (!adminConfigured() || !emailConfigured()) {
    giftLog('error', { order: orderName, reason: 'not configured', admin: adminConfigured(), email: emailConfigured() })
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  // 2a) Concurrency claim (KV atomic if configured, else in-memory). Durable
  //     cross-retry dedup is the per-brand order tag, checked below.
  const won = await claimOnce(claimKey)
  if (!won) {
    giftLog('duplicate', { order: orderName, reason: 'claim held', webhookId })
    return NextResponse.json({ ok: true, duplicate: true })
  }

  try {
    // 3) Which participating brands are in this order?
    const matches = matchBrandsInOrder(order.line_items ?? [])
    if (matches.length === 0) {
      giftLog('no_match', { order: orderName })
      return NextResponse.json({ ok: true, matched: 0 })
    }

    // Durable idempotency guard: brands already tagged on this order were emailed
    // on a previous delivery — never email them again.
    const existingTags = (await getOrderTags(orderGid)).map(t => t.toLowerCase())
    const orderTotal = parseFloat(order.total_price ?? order.current_total_price ?? '0') || 0
    const shipTo = shipToLabel(order)

    let anyFailure = false
    const results: Record<string, string> = {}

    for (const { brand, brandSubtotal } of matches) {
      const brandTag = orderTagFor(brand).toLowerCase()
      if (existingTags.includes(brandTag)) {
        giftLog('duplicate', { order: orderName, brand: brand.key, reason: 'already tagged' })
        results[brand.key] = 'duplicate'
        continue
      }

      // Min spend gate.
      if (!meetsMinSpend(brand, brandSubtotal, orderTotal)) {
        giftLog('below_min_spend', { order: orderName, brand: brand.key, brandSubtotal, orderTotal, minSpend: brand.minSpend })
        results[brand.key] = 'below_min_spend'
        continue
      }

      // 4) Count already-sent gifts (cached ~60s, approximate, err generous).
      const alreadySent = await countGiftsSent(brand)
      const cap = capFor(brand)

      // 8) Over cap → do nothing.
      if (alreadySent >= cap) {
        giftLog('over_cap', { order: orderName, brand: brand.key, alreadySent, cap })
        results[brand.key] = 'over_cap'
        continue
      }

      const giftIndex = alreadySent + 1 // this order is gift #giftIndex
      const isFinal = giftIndex === cap // 7) reaching the cap
      giftLog('eligible', { order: orderName, brand: brand.key, giftIndex, cap, isFinal })

      // 5) Email the warehouse.
      const emailResult = await sendGiftEmail({
        to: brand.warehouseEmail,
        orderNumber: orderName,
        shipTo,
        giftName: brand.giftName,
        giftIndex,
        cap,
        isFinal,
      })

      if (!emailResult.ok) {
        // Leave the order UNtagged so a Shopify retry re-attempts just this brand.
        giftLog('email_failed', { order: orderName, brand: brand.key, provider: emailResult.provider, error: emailResult.error })
        results[brand.key] = 'email_failed'
        anyFailure = true
        continue
      }
      giftLog('emailed', { order: orderName, brand: brand.key, giftIndex, cap, provider: emailResult.provider, id: emailResult.id, isFinal })
      if (isFinal) giftLog('final_gift', { order: orderName, brand: brand.key, cap })

      // 6) Tag the order for our records (and as the durable dedup marker).
      const tags = [orderTagFor(brand), PROCESSED_TAG]
      if (isFinal) tags.push(`gift-${brand.key}-final`)
      const tagged = await tagOrder(orderGid, tags)
      if (tagged) {
        giftLog('tagged', { order: orderName, brand: brand.key, tags })
      } else {
        // Email already sent; tagging failed. Do NOT retry (would double-email).
        // Logged loudly so it can be reconciled by hand.
        giftLog('tag_failed', { order: orderName, brand: brand.key, tags, note: 'email sent — reconcile manually to avoid double gift' })
      }

      // Refresh count + write the storefront-readable state (claimed flag at cap).
      invalidateGiftCount(brand)
      await writeGiftState(brand, giftIndex)
      giftLog('state_written', { order: orderName, brand: brand.key, sent: giftIndex, claimed: giftIndex >= cap })

      results[brand.key] = isFinal ? 'emailed_final' : 'emailed'
    }

    // If a transient email failure occurred, 500 so Shopify retries. Already-tagged
    // brands are skipped on the retry, so this is safe.
    if (anyFailure) {
      return NextResponse.json({ ok: false, order: orderName, results }, { status: 500 })
    }
    return NextResponse.json({ ok: true, order: orderName, results })
  } catch (err) {
    giftLog('error', { order: orderName, error: String(err) })
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  } finally {
    releaseInFlight(claimKey)
  }
}

// A quick liveness check (not a Shopify endpoint) — GET returns config readiness
// without exposing secrets. Handy while wiring things up.
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'orders-created',
    ready: {
      hmacSecret: Boolean(WEBHOOK_SECRET),
      admin: adminConfigured(),
      email: emailConfigured(),
    },
  })
}
