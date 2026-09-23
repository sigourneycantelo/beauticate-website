// Option A: what an international visitor sees instead of a checkout we can't
// fulfil. The shop ships within Australia only (one General shipping profile,
// orders routed to partner brands through Modern Dropship, each brand shipping
// its own). So for readers outside AU/NZ we substitute the buy action for a
// stockist that ships to them, rather than hiding the shop or letting them
// fill a cart that dies at checkout.
//
// Resolved on the server and passed to ProductBuyBox as a prop, so the link
// database never reaches the client bundle.

import linkDatabase from '@/data/link-database.json'
import { retailerFromUrl } from '@/lib/retailer'
import { TARGETED_MARKETS, type TargetedMarket } from '@/lib/geo'

export interface ShopIntlOption {
  url: string
  retailer: string
}

/** Per-market stockists for one shop product. Empty means we have none. */
export type ShopIntlOptions = Partial<Record<TargetedMarket | 'default', ShopIntlOption>>

type Entry = { retailer?: string; url?: string; verified?: boolean }

const db = linkDatabase as unknown as {
  shop?: {
    byHandle?: Record<string, Record<string, Entry>>
    byVendor?: Record<string, Record<string, Entry>>
  }
}

function isUsable(entry: Entry | undefined): entry is Entry & { url: string } {
  return !!entry && entry.verified === true && !!entry.url
}

function collect(source: Record<string, Entry> | undefined, into: ShopIntlOptions) {
  if (!source) return
  for (const market of [...TARGETED_MARKETS, 'default'] as const) {
    if (into[market]) continue
    const entry = source[market]
    if (isUsable(entry)) {
      into[market] = { url: entry.url, retailer: entry.retailer || retailerFromUrl(entry.url) }
    }
  }
}

/**
 * Find stockists that ship to markets outside AU/NZ for a shop product.
 * A per-product entry wins over the brand-wide one.
 */
export function resolveShopIntl(handle?: string, vendor?: string): ShopIntlOptions {
  const options: ShopIntlOptions = {}
  if (handle) collect(db.shop?.byHandle?.[handle.toLowerCase()], options)
  if (vendor) collect(db.shop?.byVendor?.[vendor.trim().toLowerCase()], options)
  return options
}
