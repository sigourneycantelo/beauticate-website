// Geo link resolver. Turns one AU product link into the pair of links the two
// lanes need: the Home (AU/NZ) link we already earn on, and an intl link a
// reader outside the region can actually buy from.
//
// Runs at BUILD time, in server components. The result is baked into the HTML
// as data attributes; GeoProvider does the swap on the client from the country
// cookie. Nothing here runs per-request, so article pages stay static.

import linkDatabase from '@/data/link-database.json'
import { destinationHost, destinationUrl, retailerFromUrl } from '@/lib/retailer'
import { TARGETED_MARKETS, type TargetedMarket } from '@/lib/geo'

/** One resolved destination for a market outside AU/NZ. */
export interface IntlLink {
  url: string
  retailer: string
  /** How much we trust it: a hand-picked product link, or a generated search. */
  tier: 'hero' | 'brand' | 'search'
}

/** What a product card needs to serve both lanes. */
export interface ResolvedProductLink {
  /** The AU/NZ link, always the untouched original. */
  homeUrl: string
  homeRetailer: string
  /** Per-market intl destinations. Empty when we have nothing better than the AU link. */
  intl: Partial<Record<TargetedMarket | 'default', IntlLink>>
}

type MarketEntry = {
  retailer?: string
  url?: string
  searchUrl?: string
  verified?: boolean
}

type ProductEntry = {
  name?: string
  auUrl?: string
  auUrls?: string[]
  intlUrl?: string | Record<string, string>
  intlRetailer?: string
  tier?: string
  deepLinkSupported?: boolean
}

type BrandEntry = { name?: string } & Partial<Record<string, MarketEntry>>

const db = linkDatabase as unknown as {
  retailerMap: Record<string, Record<string, MarketEntry | string>>
  brands: Record<string, BrandEntry>
  products: Record<string, ProductEntry>
}

/**
 * Canonical form of a product URL for matching: true destination, no scheme,
 * no `www.`, no query or hash, no trailing slash. Two links to the same product
 * through different affiliate wrappers collapse to the same key.
 */
export function linkKey(url: string): string {
  const dest = destinationUrl(url)
  try {
    const u = new URL(dest)
    const host = u.hostname.replace(/^www\./, '').toLowerCase()
    const path = u.pathname.replace(/\/+$/, '')
    return `${host}${path}`.toLowerCase()
  } catch {
    return dest.trim().toLowerCase()
  }
}

/** AU URL -> product-database key, built once from auUrl/auUrls. */
const productIndex: Map<string, string> = (() => {
  const index = new Map<string, string>()
  for (const [slug, entry] of Object.entries(db.products ?? {})) {
    const urls = [entry.auUrl, ...(entry.auUrls ?? [])].filter(Boolean) as string[]
    for (const u of urls) index.set(linkKey(u), slug)
  }
  return index
})()

/** An entry is inert until someone has actually loaded the link and confirmed it. */
function isUsable(entry: MarketEntry | string | undefined): entry is MarketEntry {
  return !!entry && typeof entry === 'object' && entry.verified === true
}

function buildSearchUrl(template: string, query: string): string {
  return template.replace('{q}', encodeURIComponent(query))
}

/**
 * Resolve a product's links for both lanes.
 *
 * @param url  The AU/NZ link exactly as it appears in the article or component.
 * @param name Product name, used to build a retailer search when we have no
 *             hand-picked intl link. Without it, search fallback is skipped.
 */
export function resolveProductLink(url: string, name?: string): ResolvedProductLink {
  const homeRetailer = retailerFromUrl(url)
  const resolved: ResolvedProductLink = { homeUrl: url, homeRetailer, intl: {} }

  // 1. Hand-picked per-product link.
  const slug = productIndex.get(linkKey(url))
  const product = slug ? db.products[slug] : undefined
  if (product?.intlUrl) {
    const retailer = product.intlRetailer || ''
    if (typeof product.intlUrl === 'string') {
      resolved.intl.default = {
        url: product.intlUrl,
        retailer: retailer || retailerFromUrl(product.intlUrl),
        tier: 'hero',
      }
    } else {
      for (const [market, marketUrl] of Object.entries(product.intlUrl)) {
        if (!marketUrl) continue
        const key = market === 'default' ? 'default' : (market.toUpperCase() as TargetedMarket)
        resolved.intl[key] = {
          url: marketUrl,
          retailer: retailer || retailerFromUrl(marketUrl),
          tier: 'hero',
        }
      }
    }
  }

  const host = destinationHost(url)
  if (!host) return resolved

  // 2. Brand-level intl store.
  const brand = db.brands?.[host]
  if (brand) {
    for (const market of TARGETED_MARKETS) {
      if (resolved.intl[market] || resolved.intl.default) continue
      const entry = brand[market]
      if (isUsable(entry) && entry.url) {
        resolved.intl[market] = {
          url: entry.url,
          retailer: entry.retailer || retailerFromUrl(entry.url),
          tier: 'brand',
        }
      }
    }
  }

  // 3. AU retailer -> intl retailer search. Needs a product name to search for.
  const mapped = db.retailerMap?.[host]
  if (mapped && name) {
    for (const market of TARGETED_MARKETS) {
      if (resolved.intl[market] || resolved.intl.default) continue
      const entry = mapped[market]
      if (isUsable(entry) && entry.searchUrl) {
        resolved.intl[market] = {
          url: buildSearchUrl(entry.searchUrl, name),
          retailer: entry.retailer || retailerFromUrl(entry.searchUrl),
          tier: 'search',
        }
      }
    }
  }

  // 4. Nothing better than the AU link — leave it bare for Skimlinks.
  return resolved
}

/**
 * Serialise a resolved link into the `data-*` attributes GeoProvider reads.
 * Returns {} when there's nothing to swap, so cards stay byte-identical to
 * before wherever the database has no intl entry.
 */
export function intlLinkAttrs(resolved: ResolvedProductLink): Record<string, string> {
  const markets = Object.entries(resolved.intl)
  if (markets.length === 0) return {}
  const payload: Record<string, { u: string; r: string }> = {}
  for (const [market, link] of markets) {
    if (link) payload[market] = { u: link.url, r: link.retailer }
  }
  return { 'data-intl': JSON.stringify(payload) }
}

/** Convenience: resolve and serialise in one step. */
export function intlAttrsFor(url?: string, name?: string): Record<string, string> {
  if (!url) return {}
  return intlLinkAttrs(resolveProductLink(url, name))
}
