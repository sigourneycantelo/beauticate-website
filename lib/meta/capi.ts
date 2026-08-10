import crypto from 'crypto'

// Meta Conversions API — shared server-side sender.
//
// Used by two callers:
//   1. app/api/meta/capi/route.ts — mirrors every browser pixel event (has
//      access to the request's cookies/IP/UA, no PII).
//   2. app/api/webhooks/orders-created/route.ts — sends Purchase, which has no
//      browser request to read cookies/IP from (Shopify calls this webhook
//      server-to-server), but does have the order's email/phone for higher
//      match quality.
//
// The access token is read from a Vercel environment variable — never hard-coded.

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE
const GRAPH_VERSION = 'v21.0'

export function capiConfigured(): boolean {
  return Boolean(PIXEL_ID && ACCESS_TOKEN)
}

export interface CapiUserData {
  client_ip_address?: string
  client_user_agent?: string
  fbp?: string
  fbc?: string
  /** Raw (unhashed) email — hashed here before sending. */
  email?: string
  /** Raw (unhashed) phone — hashed here before sending. */
  phone?: string
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

function buildUserData(input: CapiUserData): Record<string, unknown> {
  const userData: Record<string, unknown> = {}
  if (input.client_ip_address) userData.client_ip_address = input.client_ip_address
  if (input.client_user_agent) userData.client_user_agent = input.client_user_agent
  if (input.fbp) userData.fbp = input.fbp
  if (input.fbc) userData.fbc = input.fbc
  // Meta requires em/ph to be SHA-256 hashed (lowercased + trimmed) — never send raw.
  if (input.email) userData.em = sha256(input.email)
  if (input.phone) userData.ph = sha256(input.phone.replace(/[^0-9]/g, ''))
  return userData
}

export interface SendCapiEventInput {
  eventName: string
  eventId: string
  eventSourceUrl?: string
  actionSource?: 'website' | 'system_generated' | 'other'
  userData: CapiUserData
  customData?: Record<string, unknown>
}

export async function sendCapiEvent(input: SendCapiEventInput): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!capiConfigured()) return { ok: false, skipped: true }

  const event = {
    event_name: input.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
    action_source: input.actionSource ?? 'website',
    user_data: buildUserData(input.userData),
    ...(input.customData && Object.keys(input.customData).length ? { custom_data: input.customData } : {}),
  }

  const payload: Record<string, unknown> = {
    data: [event],
    access_token: ACCESS_TOKEN,
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  }

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[meta-capi] Graph API error', res.status, text)
      return { ok: false }
    }
    return { ok: true }
  } catch (e) {
    console.error('[meta-capi] send failed', e)
    return { ok: false }
  }
}
