// GA4 Measurement Protocol — server-side event sends.
//
// Used exclusively for the `purchase` event from the orders-created webhook
// (app/api/webhooks/orders-created/route.ts): checkout is Shopify-hosted, so
// there is no browser page on our domain to fire a client-side purchase event
// from. This is the only way GA4 finds out an order completed.
//
// Requires a Measurement Protocol API secret, created in GA4 Admin → Data
// Streams → (the web stream) → Measurement Protocol API secrets → Create.
// That's a different value from the public NEXT_PUBLIC_GA_MEASUREMENT_ID
// (which is fine to reuse server-side too, since it's already public).

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const API_SECRET = process.env.GA_MEASUREMENT_PROTOCOL_API_SECRET
const ENDPOINT = 'https://www.google-analytics.com/mp/collect'
const DEBUG_ENDPOINT = 'https://www.google-analytics.com/debug/mp/collect'

export interface MPItem {
  item_id: string
  item_name: string
  item_brand?: string
  price?: number
  quantity?: number
}

export interface PurchaseParams {
  clientId: string
  transactionId: string
  value: number
  currency: string
  items: MPItem[]
  // Present when the visitor was never seen client-side (no _ga cookie captured
  // on the cart) — falls back to a synthetic per-order client_id so the event
  // still sends, just without tying back to an existing GA4 user/session.
  syntheticClientId?: boolean
}

export function measurementProtocolConfigured(): boolean {
  return Boolean(MEASUREMENT_ID && API_SECRET)
}

function buildPayload(params: PurchaseParams) {
  return {
    client_id: params.clientId,
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: params.transactionId,
          value: params.value,
          currency: params.currency,
          items: params.items,
        },
      },
    ],
  }
}

/**
 * Sends the purchase event to GA4. Graceful no-op if not configured — never
 * throws, so a missing secret can't break order/webhook processing.
 */
export async function sendPurchase(params: PurchaseParams): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!measurementProtocolConfigured()) return { ok: false, skipped: true }
  try {
    const res = await fetch(`${ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(params)),
    })
    // GA4 MP returns 204 No Content on success, with no body to inspect —
    // there is no acceptance confirmation beyond the status code.
    if (!res.ok) {
      console.error('[ga-mp] send failed', res.status)
      return { ok: false }
    }
    return { ok: true }
  } catch (e) {
    console.error('[ga-mp] send error', e)
    return { ok: false }
  }
}

/**
 * Same payload, sent to GA4's validation endpoint instead — returns
 * validationMessages describing anything wrong with the event, used only for
 * verifying the integration (never called from production order processing).
 */
export async function debugValidatePurchase(params: PurchaseParams): Promise<unknown> {
  if (!measurementProtocolConfigured()) return { skipped: true }
  const res = await fetch(`${DEBUG_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildPayload(params)),
  })
  return res.json()
}
