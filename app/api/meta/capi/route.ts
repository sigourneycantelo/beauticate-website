import { NextResponse } from 'next/server'

// Meta Conversions API (server-side) endpoint.
//
// The browser calls this (via lib/meta/pixel.ts `track()`) for every event,
// passing the SAME event_id it used on the browser pixel. Meta deduplicates on
// (event_name, event_id), so each event is counted once across browser+server.
//
// The access token is read from a Vercel environment variable — never hard-coded.

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE
const GRAPH_VERSION = 'v21.0'

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const k = part.slice(0, idx).trim()
    const v = part.slice(idx + 1).trim()
    if (k) out[k] = decodeURIComponent(v)
  }
  return out
}

export async function POST(req: Request) {
  // Graceful no-op if the server side isn't configured — the browser pixel
  // still works, and nothing errors on the client.
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ ok: false, skipped: true })
  }

  let body: {
    eventName?: string
    eventId?: string
    eventSourceUrl?: string
    customData?: Record<string, unknown>
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const { eventName, eventId, eventSourceUrl, customData } = body
  if (!eventName || !eventId) {
    return NextResponse.json({ ok: false, error: 'missing event' }, { status: 400 })
  }

  const cookies = parseCookies(req.headers.get('cookie'))
  const clientIp = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || undefined
  const userAgent = req.headers.get('user-agent') || undefined

  const userData: Record<string, unknown> = {}
  if (clientIp) userData.client_ip_address = clientIp
  if (userAgent) userData.client_user_agent = userAgent
  if (cookies._fbp) userData.fbp = cookies._fbp
  if (cookies._fbc) userData.fbc = cookies._fbc
  // NOTE: no email/phone is collected here, so no hashing is required. If a
  // logged-in user's email/phone is ever added, SHA-256 hash it (lowercased and
  // trimmed) before sending — Meta requires em/ph fields to be hashed.

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    ...(eventSourceUrl ? { event_source_url: eventSourceUrl } : {}),
    action_source: 'website',
    user_data: userData,
    ...(customData && Object.keys(customData).length ? { custom_data: customData } : {}),
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
      return NextResponse.json({ ok: false }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[meta-capi] send failed', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
