'use client'

// Klaviyo on-site tracking — shared client helper.
//
// klaviyo.js is loaded once in app/layout.tsx (company id WSuntA). The Shopify
// theme never renders on this headless storefront, so Klaviyo's own Shopify
// integration cannot emit "Viewed Product" or "Added to Cart" — they have to be
// fired from here. Orders and Checkout Started still sync from Shopify; don't
// duplicate them.
//
// The event names are load-bearing: "Viewed Product" and "Added to Cart" are the
// metrics Klaviyo already holds, and a different spelling would create a second,
// empty metric beside them. Keep them exact.
//
// There is deliberately no cookie-consent gate, matching lib/meta/pixel.ts (the
// site is AU-based and under the Privacy Act threshold; klaviyo.js itself already
// loads for every visitor). If a consent gate is ever added, put the check at the
// top of klaviyoTrack() — it is the single choke point for these events.

import type { Cart } from '@/types/shopify'
import { isGiftLine, isGiftVariantId } from '@/lib/gwp'

declare global {
  interface Window {
    klaviyo?: { track?: (event: string, properties?: Record<string, unknown>) => unknown }
    _klOnsite?: unknown[]
  }
}

export type KlaviyoProperties = Record<string, unknown>

/**
 * Fire a Klaviyo custom event. Safe to call before klaviyo.js has finished
 * loading: the real script drains `_klOnsite` on start, so the call is queued
 * rather than lost. Never throws — analytics must not break the storefront.
 */
export function klaviyoTrack(event: string, properties: KlaviyoProperties = {}): void {
  if (typeof window === 'undefined') return
  try {
    if (typeof window.klaviyo?.track === 'function') {
      window.klaviyo.track(event, properties)
      return
    }
    window._klOnsite = window._klOnsite || []
    window._klOnsite.push(['track', event, properties])
  } catch {
    // swallow
  }
}

// ─── Event builders ──────────────────────────────────────────────────────────

const SITE = 'https://www.beauticate.com'

const num = (v?: string | number | null): number | undefined => {
  const n = typeof v === 'string' ? parseFloat(v) : v
  return n != null && Number.isFinite(n) ? n : undefined
}
const gidTail = (id?: string | null) => (id ? id.split('/').pop() || id : undefined)

/** Drop undefined so Klaviyo never stores empty properties. */
function clean<T extends Record<string, unknown>>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '')) as T
}

/** "Viewed Product" — once per product page view. */
export function klaviyoViewedProduct(p: {
  id: string
  handle: string
  title: string
  vendor: string
  productType?: string
  imageUrl?: string | null
  sku?: string | null
  price?: string | number | null
  compareAtPrice?: string | number | null
}): void {
  klaviyoTrack(
    'Viewed Product',
    clean({
      ProductName: p.title,
      ProductID: gidTail(p.id),
      SKU: p.sku ?? undefined,
      Brand: p.vendor,
      Categories: p.productType ? [p.productType] : [],
      Price: num(p.price),
      CompareAtPrice: num(p.compareAtPrice),
      ImageURL: p.imageUrl ?? undefined,
      URL: `${SITE}/shop/products/${p.handle}`,
    })
  )
}

/**
 * "Added to Cart" — call only once the cart API has confirmed the add.
 *
 * `before` is the cart as it stood before the request, so the event reports what
 * this click actually added (a line can be split in two by the gift offset, and a
 * stock-clamped add leaves the quantity unchanged). Returns without firing when
 * nothing was really added, and never fires for a gift-with-purchase line — those
 * are put in the cart by the server (lib/gwp-cart.ts), not by the customer.
 */
export function klaviyoAddedToCart(before: Cart | null | undefined, after: Cart, variantId: string): void {
  if (isGiftVariantId(variantId)) return

  const qtyFor = (c?: Cart | null) =>
    (c?.lines?.nodes ?? []).filter(l => l.merchandise?.id === variantId).reduce((n, l) => n + (l.quantity ?? 0), 0)
  const addedQty = qtyFor(after) - qtyFor(before)
  if (addedQty < 1) return

  const lines = (after.lines?.nodes ?? []).filter(l => !isGiftLine(l))
  const added = lines.find(l => l.merchandise?.id === variantId)
  if (!added) return
  const m = added.merchandise
  const unitPrice = num(added.cost?.amountPerQuantity?.amount) ?? num(m.price?.amount)

  // Merge split lines of the same variant into one Items row.
  const rows = new Map<string, { line: (typeof lines)[number]; qty: number; total: number }>()
  for (const l of lines) {
    const key = l.merchandise.id
    const row = rows.get(key)
    const total = num(l.cost?.totalAmount?.amount) ?? 0
    if (row) {
      row.qty += l.quantity
      row.total += total
    } else {
      rows.set(key, { line: l, qty: l.quantity, total })
    }
  }
  const items = [...rows.values()].map(({ line, qty, total }) =>
    clean({
      ProductID: gidTail(line.merchandise.product?.id),
      SKU: line.merchandise.sku ?? undefined,
      ProductName: line.merchandise.product?.title,
      Quantity: qty,
      ItemPrice: num(line.cost?.amountPerQuantity?.amount) ?? num(line.merchandise.price?.amount),
      RowTotal: total,
      ProductURL: line.merchandise.product?.handle
        ? `${SITE}/shop/products/${line.merchandise.product.handle}`
        : undefined,
      ImageURL: line.merchandise.product?.featuredImage?.url,
      Brand: line.merchandise.product?.vendor,
    })
  )

  klaviyoTrack(
    'Added to Cart',
    clean({
      $value: num(after.cost?.totalAmount?.amount),
      AddedItemProductName: m.product?.title,
      AddedItemProductID: gidTail(m.product?.id),
      AddedItemSKU: m.sku ?? undefined,
      AddedItemPrice: unitPrice,
      AddedItemQuantity: addedQty,
      AddedItemURL: m.product?.handle ? `${SITE}/shop/products/${m.product.handle}` : undefined,
      AddedItemImageURL: m.product?.featuredImage?.url,
      ItemNames: items.map(i => i.ProductName).filter(Boolean),
      CheckoutURL: after.checkoutUrl,
      Items: items,
    })
  )
}
