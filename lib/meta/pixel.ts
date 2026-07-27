'use client'

// Meta (Facebook) Pixel + Conversions API — shared client helper.
//
// Every tracked event flows through `track()`, which fires the browser pixel
// AND mirrors the event to our CAPI endpoint (`/api/meta/capi`) with the SAME
// `event_id`. Meta deduplicates on (event_name, event_id), so each event is
// counted once even though it arrives from both browser and server.
//
// There is deliberately no cookie-consent gate (see the plan / privacy policy):
// the site is AU-based and under the Privacy Act threshold, so the pixel fires
// for all visitors. If a consent gate is ever needed, add the check at the top
// of `track()` — this is the single choke point for all Meta events.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export type MetaCustomData = Record<string, unknown>

export function newEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

// The fbq base snippet defines a queueing stub synchronously, so calls made
// before fbevents.js finishes loading are queued. This guards the rarer race
// where `track()` runs before the base snippet has executed at all.
const pending: Array<() => void> = []
let flushTimer: ReturnType<typeof setInterval> | null = null

function runOrQueue(fn: () => void) {
  if (typeof window === 'undefined') return
  if (typeof window.fbq === 'function') {
    fn()
    return
  }
  pending.push(fn)
  if (flushTimer) return
  let tries = 0
  flushTimer = setInterval(() => {
    tries++
    if (typeof window.fbq === 'function') {
      pending.splice(0).forEach((f) => f())
    } else if (tries < 50) {
      return // keep waiting (~5s max)
    }
    if (flushTimer) {
      clearInterval(flushTimer)
      flushTimer = null
    }
    pending.length = 0
  }, 100)
}

/**
 * Fire a Meta event from the browser pixel and mirror it to CAPI with a shared
 * event_id for server/browser deduplication. Returns the event_id used.
 */
export function track(eventName: string, customData?: MetaCustomData, eventId?: string): string | undefined {
  if (!META_PIXEL_ID || typeof window === 'undefined') return
  const id = eventId ?? newEventId()
  const data = customData ?? {}

  // 1) Browser pixel
  runOrQueue(() => {
    window.fbq!('track', eventName, data, { eventID: id })
  })

  // 2) Server (CAPI) mirror — sendBeacon so it survives outbound navigation.
  try {
    const payload = JSON.stringify({
      eventName,
      eventId: id,
      eventSourceUrl: typeof location !== 'undefined' ? location.href : undefined,
      customData: data,
    })
    const url = '/api/meta/capi'
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }))
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    // Never let analytics break the page.
  }

  return id
}
