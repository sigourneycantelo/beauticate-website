'use client'

// GA4 client-side ecommerce events — shared helper.
//
// @next/third-parties' <GoogleAnalytics> component (mounted in app/layout.tsx)
// injects an inline script that synchronously creates `window.dataLayer` and
// pushes the 'js'/'config' commands, then loads the real gtag.js library
// (async). That external script — not the inline snippet — is what defines a
// GLOBAL `window.gtag` function and overrides `dataLayer.push` to actually
// transmit hits to Google's collect endpoint.
//
// IMPORTANT: pushing raw arrays onto `window.dataLayer` before that override
// installs does NOT work the way it looks like it should. The array accepts
// the push silently (it's still a plain array at that point), but unlike the
// 'js'/'config' commands from the inline snippet, gtag.js does not replay
// arbitrary 'event' entries from that backlog once it loads — confirmed by
// production testing: a pushed `['event','view_item',{...}]` entry sat
// visibly in `window.dataLayer` but never produced a network request to
// analytics.google.com/g/collect, while a direct `window.gtag('event', ...)`
// call fired immediately. So we wait for `window.gtag` to exist as a function
// (the real signal that live event firing is wired up) and call it directly,
// exactly like any other gtag.js consumer would.

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Shopify Storefront API ids are full GIDs (e.g. "gid://shopify/Product/123").
// GA4's gtag.js silently drops an event whose item_id contains that shape —
// confirmed by production testing: add_to_cart/view_cart calls carrying a raw
// GID as item_id sat correctly formed in `window.dataLayer` but never produced
// a network hit, while the same call with a bare numeric id worked immediately.
// Always pass ecommerce item ids through this first.
export function gidToId(gid: string): string {
  return gid.split('/').pop() || gid
}

export interface GAItem {
  item_id: string
  item_name: string
  item_brand?: string
  item_category?: string
  price?: number
  quantity?: number
}

const pending: Array<() => void> = []
let flushTimer: ReturnType<typeof setInterval> | null = null

function runOrQueue(fn: () => void) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    fn()
    return
  }
  pending.push(fn)
  if (flushTimer) return
  let tries = 0
  flushTimer = setInterval(() => {
    tries++
    if (typeof window.gtag === 'function') {
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

function gaEvent(name: string, params: Record<string, unknown>) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  runOrQueue(() => {
    window.gtag!('event', name, params)
  })
}

export function gaViewItem(item: GAItem, currency = 'AUD') {
  gaEvent('view_item', { currency, value: item.price, items: [item] })
}

export function gaAddToCart(item: GAItem, currency = 'AUD') {
  gaEvent('add_to_cart', {
    currency,
    value: (item.price ?? 0) * (item.quantity ?? 1),
    items: [item],
  })
}

export function gaViewCart(items: GAItem[], value: number, currency = 'AUD') {
  gaEvent('view_cart', { currency, value, items })
}

export function gaBeginCheckout(items: GAItem[], value: number, currency = 'AUD') {
  gaEvent('begin_checkout', { currency, value, items })
}

export function gaSelectContent(contentType: string, itemId: string, extra?: Record<string, unknown>) {
  gaEvent('select_content', { content_type: contentType, item_id: itemId, ...extra })
}
