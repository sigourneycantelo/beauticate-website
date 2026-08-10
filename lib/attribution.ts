'use client'

// Carries analytics identifiers from the browser onto the Shopify cart, so the
// orders-created webhook (a server-to-server Shopify → us call with no browser
// cookies) can attribute a completed Purchase back to the right GA4 client and
// Meta pixel visitor. Shopify copies cart.attributes onto the order's
// note_attributes at checkout, which is the only bridge available in a headless
// setup — see lib/shopify.ts `updateCartAttributes`.
//
// Deliberately narrow: this captures the two platforms' own visitor identifiers
// (GA4 client_id, Meta fbp/fbc) plus user agent for match quality — not UTM/
// campaign data, which is a separate, not-yet-built piece of work.

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

// The _ga cookie value looks like "GA1.1.<client_id_part1>.<client_id_part2>" —
// the client_id GA4 expects (and what Measurement Protocol requires) is just the
// last two dot-separated segments.
function gaClientIdFromCookie(): string | null {
  const raw = readCookie('_ga')
  if (!raw) return null
  const parts = raw.split('.')
  if (parts.length < 4) return null
  return parts.slice(-2).join('.')
}

export interface Attribution {
  ga_client_id?: string
  fbp?: string
  fbc?: string
  user_agent?: string
}

export function readAttribution(): Attribution {
  const attribution: Attribution = {}
  const gaClientId = gaClientIdFromCookie()
  const fbp = readCookie('_fbp')
  const fbc = readCookie('_fbc')
  if (gaClientId) attribution.ga_client_id = gaClientId
  if (fbp) attribution.fbp = fbp
  if (fbc) attribution.fbc = fbc
  if (typeof navigator !== 'undefined' && navigator.userAgent) attribution.user_agent = navigator.userAgent
  return attribution
}

// Fire-and-forget sync onto the cart. Never awaited by callers — analytics
// attribution must never delay a cart mutation or the checkout redirect.
export function syncAttributionToCart(cartId: string) {
  try {
    const attribution = readAttribution()
    if (Object.keys(attribution).length === 0) return
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'attributes', cartId, attributes: attribution }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Never let attribution capture break the cart.
  }
}
