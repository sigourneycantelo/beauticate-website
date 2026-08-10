import { NextResponse } from 'next/server'
import { sendCapiEvent } from '@/lib/meta/capi'

// Meta Conversions API (server-side) endpoint — browser-facing mirror.
//
// The browser calls this (via lib/meta/pixel.ts `track()`) for every event,
// passing the SAME event_id it used on the browser pixel. Meta deduplicates on
// (event_name, event_id), so each event is counted once across browser+server.
//
// Server-initiated events (e.g. Purchase from the orders-created webhook) call
// sendCapiEvent() from lib/meta/capi.ts directly — they have no browser request
// to relay through this route.

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

  const result = await sendCapiEvent({
    eventName,
    eventId,
    eventSourceUrl,
    customData,
    userData: {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
      fbp: cookies._fbp,
      fbc: cookies._fbc,
    },
  })

  if (result.skipped) return NextResponse.json({ ok: false, skipped: true })
  return NextResponse.json(result, { status: result.ok ? 200 : 502 })
}
