'use client'

// GA4 client-side ecommerce events — shared helper.
//
// @next/third-parties' <GoogleAnalytics> component (mounted in app/layout.tsx)
// injects an inline script that synchronously creates `window.dataLayer` and
// pushes the 'js'/'config' commands, then loads gtag.js (async) to process the
// queue. It does NOT expose a global `window.gtag` function — the supported way
// to send additional events is pushing directly onto `window.dataLayer`.
//
// Because that init script uses Next's "afterInteractive" Script strategy, a
// component higher in the tree can attempt to fire an event before the init
// script has run. Pushing to `window.dataLayer` before 'config' has been queued
// would misorder the queue (event before config), so — mirroring the queue used
// in lib/meta/pixel.ts for the same race against fbq — we wait for
// `window.dataLayer` to exist (it only ever comes into existence already
// containing 'js' + 'config', pushed synchronously in one script) before
// sending our own events.

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

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
  if (Array.isArray(window.dataLayer)) {
    fn()
    return
  }
  pending.push(fn)
  if (flushTimer) return
  let tries = 0
  flushTimer = setInterval(() => {
    tries++
    if (Array.isArray(window.dataLayer)) {
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
    window.dataLayer!.push(['event', name, params])
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
