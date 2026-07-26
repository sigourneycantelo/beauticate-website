// ─── Shopify Admin API (server-only) ──────────────────────────────────────────
//
// SECURITY: this module talks to the Shopify Admin API with a private access
// token. It must only ever run server-side (webhook handler, API routes, scripts).
// Never import it into a client component. The token lives in SHOPIFY_ADMIN_API_TOKEN
// and is never exposed to the browser.
//
// Required custom-app Admin API scopes: read_orders, write_orders
// (write_orders covers order tags via tagsAdd; read_orders covers ordersCount).

import type { GiftBrand } from './gift-campaign'
import { launchDateFor, orderTagFor } from './gift-campaign'

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN
const ADMIN_API_VERSION = '2024-10'
const ADMIN_URL = STORE_DOMAIN
  ? `https://${STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`
  : ''

export function adminConfigured(): boolean {
  return Boolean(STORE_DOMAIN && ADMIN_TOKEN)
}

type AdminResult<T> = { data: T | null; errors?: unknown }

export async function adminFetch<T>(query: string, variables?: object): Promise<AdminResult<T>> {
  if (!adminConfigured()) {
    return { data: null, errors: 'Admin API not configured (missing SHOPIFY_ADMIN_API_TOKEN or store domain)' }
  }
  try {
    const res = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return { data: null, errors: `Admin API HTTP ${res.status}: ${body.slice(0, 300)}` }
    }
    const json = await res.json()
    if (json.errors) return { data: null, errors: json.errors }
    return { data: json.data as T }
  } catch (err) {
    return { data: null, errors: err }
  }
}

// ─── Gift count (cached ~60s, approximate, err generous) ───────────────────────

type CountEntry = { value: number; expires: number }
const countCache = new Map<string, CountEntry>()
const COUNT_TTL_MS = 60_000

/**
 * How many orders have already been tagged `gift-<brand>` since the brand's launch
 * date — i.e. how many gifts have already been dispatched. This is what the cap is
 * measured against and what makes "gift X of 20" correct.
 *
 * Uses Admin `ordersCount` with a tag+date query, which is indexed and cheap (no
 * line-item scanning). Cached for ~60s to avoid rate limits. On any API failure it
 * returns 0 so we err generous (send the gift) rather than silently skip — the tag
 * we then add is still the source of truth and self-corrects the next count.
 */
export async function countGiftsSent(brand: GiftBrand): Promise<number> {
  const cacheKey = brand.key
  const now = Date.now()
  const cached = countCache.get(cacheKey)
  if (cached && cached.expires > now) return cached.value

  const launch = launchDateFor(brand)
  // Shopify search syntax: tag + created_at range, all financial/fulfillment states.
  const search = `tag:'${orderTagFor(brand)}' created_at:>='${launch}' status:any`
  const { data, errors } = await adminFetch<{ ordersCount: { count: number } }>(
    `query GiftCount($q: String) { ordersCount(query: $q) { count } }`,
    { q: search },
  )

  if (errors || !data?.ordersCount) {
    console.warn('[gift] countGiftsSent failed, erring generous (0):', errors)
    return 0
  }
  const value = data.ordersCount.count ?? 0
  countCache.set(cacheKey, { value, expires: now + COUNT_TTL_MS })
  return value
}

/** Drop a brand's cached count — call right after we tag a new gift so the next
 *  order in a burst sees the incremented number. */
export function invalidateGiftCount(brand: GiftBrand): void {
  countCache.delete(brand.key)
}

// ─── Order tagging ─────────────────────────────────────────────────────────────

/** Add tags to an order. `orderGid` is the Admin GraphQL global id
 *  (gid://shopify/Order/1234567890). Returns true on success. */
export async function tagOrder(orderGid: string, tags: string[]): Promise<boolean> {
  const { data, errors } = await adminFetch<{ tagsAdd: { userErrors: { message: string }[] } }>(
    `mutation AddTags($id: ID!, $tags: [String!]!) {
       tagsAdd(id: $id, tags: $tags) { userErrors { field message } }
     }`,
    { id: orderGid, tags },
  )
  const userErrors = data?.tagsAdd?.userErrors
  if (errors || (userErrors && userErrors.length)) {
    console.error('[gift] tagOrder failed:', errors ?? userErrors)
    return false
  }
  return true
}

/** Read the current tags on an order (used as a durable idempotency guard). */
export async function getOrderTags(orderGid: string): Promise<string[]> {
  const { data, errors } = await adminFetch<{ order: { tags: string[] } | null }>(
    `query OrderTags($id: ID!) { order(id: $id) { tags } }`,
    { id: orderGid },
  )
  if (errors || !data?.order) return []
  return data.order.tags ?? []
}

export const toOrderGid = (numericId: string | number) => `gid://shopify/Order/${numericId}`
