/**
 * Judge.me reviews — server-side data layer.
 *
 * Beauticate runs headless: Shopify handles checkout and has no published theme,
 * so Judge.me's widgets (which are Shopify theme app blocks) have nowhere to
 * install. Reviews are collected fine; this module is what makes them visible.
 *
 * ─── Why the PRIVATE token, when the brief said public ───────────────────────
 *
 * Judge.me issues two tokens. The public one works only on `/widgets/*` and is
 * 403 on `/api/v1/reviews` ("You are using a public token which does not have
 * enough permissions"). The widget endpoints are per-product, so a public-only
 * build needs one HTTP request per product just to put a star rating on a card —
 * ~200 requests to warm a listing page. The private token reads every review in
 * one call, which is the whole reason card ratings can be free.
 *
 * Everything here is server-only. The token is read from the environment inside
 * React Server Components and never serialised into a payload; only the
 * normalised `Review`/`Rating` shapes below cross to the client. Note the
 * env vars deliberately have no NEXT_PUBLIC_ prefix — that prefix is what would
 * inline a value into the browser bundle.
 *
 * ─── PII ─────────────────────────────────────────────────────────────────────
 *
 * The raw payload carries `ip_address` and `reviewer.email` on every review.
 * Neither is ever copied into the normalised shape. That stripping is the point
 * of normalising at all — do not widen `Review` to pass raw objects through.
 *
 * ─── API behaviour worth knowing (verified 23 Sep 2026, not documented) ──────
 *
 *  • `/api/v1/reviews?product_id=…` SILENTLY IGNORES the filter and returns
 *    every review in the shop. It does not error. Anything relying on it would
 *    render every review on every product and look perfectly healthy.
 *    Per-product grouping therefore happens here, in our own code.
 *  • The widget endpoint (`/widgets/product_review?json_request=true`) returns
 *    `{reviews, total_pages, current_page, per_page}` — no average and no total.
 *    Aggregates live on separate endpoints.
 *  • A shop-level review (someone reviewing Beauticate rather than a product)
 *    arrives with `product_external_id: 0`. Those are kept out of the product
 *    maps and counted only in the shop-wide aggregate.
 */

import { cache } from 'react'

const SHOP_DOMAIN = process.env.JUDGEME_SHOP_DOMAIN
const PRIVATE_TOKEN = process.env.JUDGEME_PRIVATE_TOKEN
const API = 'https://api.judge.me/api/v1'

/** Reviews change rarely. An hour of staleness is invisible to a reader and
 *  keeps Judge.me out of the render path entirely. */
const REVALIDATE_SECONDS = 60 * 60

/** Judge.me caps per_page at 100. The safety cap stops a pagination bug from
 *  turning into an unbounded loop against someone else's API. */
const PER_PAGE = 100
const MAX_PAGES = 50

// ─── Public shapes ───────────────────────────────────────────────────────────

export interface Review {
  id: number
  /** 1–5. */
  rating: number
  title: string | null
  body: string
  /** Display name only — never the reviewer's email. */
  author: string
  /** ISO 8601. */
  createdAt: string
  /** Judge.me's `verified` is a string enum; true here means a confirmed buyer. */
  verified: boolean
  /** Shopify numeric product id as a string, or null for a shop-level review. */
  productId: string | null
  productHandle: string | null
}

export interface Rating {
  /** Mean rating, rounded to one decimal place. */
  average: number
  count: number
}

export interface ReviewIndex {
  byProductId: Record<string, Review[]>
  byHandle: Record<string, Review[]>
  /** Shop-wide aggregate, including reviews of Beauticate itself. */
  shop: Rating
}

const EMPTY_INDEX: ReviewIndex = { byProductId: {}, byHandle: {}, shop: { average: 0, count: 0 } }

// ─── Fetching ────────────────────────────────────────────────────────────────

interface RawReview {
  id: number
  rating: number | null
  title: string | null
  body: string | null
  created_at: string
  verified: string | null
  published: boolean
  hidden: boolean
  curated: string | null
  product_external_id: number | null
  product_handle: string | null
  reviewer?: { name?: string | null }
}

/**
 * One page of reviews. Returns null on any failure — a Judge.me outage must
 * degrade to "no reviews", never to a broken product page.
 */
async function fetchPage(page: number): Promise<{ reviews: RawReview[]; totalPages: number } | null> {
  if (!SHOP_DOMAIN || !PRIVATE_TOKEN) return null

  const url =
    `${API}/reviews?shop_domain=${encodeURIComponent(SHOP_DOMAIN)}` +
    `&api_token=${encodeURIComponent(PRIVATE_TOKEN)}` +
    `&per_page=${PER_PAGE}&page=${page}`

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
    if (!res.ok) {
      console.warn(`Judge.me API error: ${res.status} ${res.statusText}`)
      return null
    }
    const data = await res.json()
    return {
      reviews: Array.isArray(data?.reviews) ? data.reviews : [],
      // Judge.me omits total_pages on some responses; one page is the safe read.
      totalPages: typeof data?.total_pages === 'number' ? data.total_pages : 1,
    }
  } catch (err) {
    console.warn('Judge.me fetch failed (page will render without reviews):', err)
    return null
  }
}

/**
 * Only reviews a reader is allowed to see. This gate is also what keeps the
 * JSON-LD honest: schema markup may only describe reviews actually displayed,
 * so the same filter feeds both the visible block and the structured data.
 */
function isDisplayable(r: RawReview): boolean {
  if (r.published !== true) return false
  if (r.hidden === true) return false
  if (r.curated === 'spam') return false
  return typeof r.rating === 'number' && r.rating > 0
}

function normalise(r: RawReview): Review {
  const id = r.product_external_id
  return {
    id: r.id,
    rating: r.rating as number,
    title: r.title?.trim() ? r.title.trim() : null,
    body: (r.body ?? '').trim(),
    author: r.reviewer?.name?.trim() || 'Anonymous',
    createdAt: r.created_at,
    // 'verified-purchase' and 'buyer' both mean a real customer; 'unverified' doesn't.
    verified: r.verified === 'verified-purchase' || r.verified === 'buyer',
    // 0 is Judge.me's marker for a review of the shop rather than a product.
    productId: id && id > 0 ? String(id) : null,
    productHandle: r.product_handle ?? null,
  }
}

function aggregate(reviews: Review[]): Rating {
  if (reviews.length === 0) return { average: 0, count: 0 }
  const total = reviews.reduce((sum, r) => sum + r.rating, 0)
  return { average: Math.round((total / reviews.length) * 10) / 10, count: reviews.length }
}

/**
 * Every displayable review in the shop, grouped by product.
 *
 * `cache` dedupes this across one render pass, so a listing page rendering 48
 * cards plus its own aggregate makes a single set of requests, not 49. Across
 * requests, Next's fetch cache holds it for REVALIDATE_SECONDS.
 */
export const getReviewIndex = cache(async (): Promise<ReviewIndex> => {
  const first = await fetchPage(1)
  if (!first) return EMPTY_INDEX

  const raw = [...first.reviews]
  const pages = Math.min(first.totalPages, MAX_PAGES)
  if (pages > 1) {
    const rest = await Promise.all(
      Array.from({ length: pages - 1 }, (_, i) => fetchPage(i + 2))
    )
    // A failed page loses those reviews rather than the whole index — a partial
    // set of real reviews beats an empty page.
    for (const p of rest) if (p) raw.push(...p.reviews)
  }

  const all = raw.filter(isDisplayable).map(normalise)

  const byProductId: Record<string, Review[]> = {}
  const byHandle: Record<string, Review[]> = {}
  for (const review of all) {
    if (!review.productId) continue // shop-level review; counted in `shop` only
    ;(byProductId[review.productId] ??= []).push(review)
    if (review.productHandle) (byHandle[review.productHandle] ??= []).push(review)
  }

  // Newest first, everywhere.
  const newestFirst = (a: Review, b: Review) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  for (const list of Object.values(byProductId)) list.sort(newestFirst)
  for (const list of Object.values(byHandle)) list.sort(newestFirst)

  return { byProductId, byHandle, shop: aggregate(all) }
})

// ─── Lookups ─────────────────────────────────────────────────────────────────

/** `gid://shopify/Product/123` → `123`. Judge.me keys on the numeric id. */
export function productIdFromGid(gid: string | undefined | null): string | null {
  if (!gid) return null
  const tail = gid.split('/').pop()
  return tail && /^\d+$/.test(tail) ? tail : null
}

/**
 * Reviews for one product. Matches on Shopify id first and falls back to handle,
 * because a product re-created in Shopify keeps its handle but gets a new id —
 * which would otherwise orphan its entire review history.
 */
export async function getProductReviews(gid?: string | null, handle?: string | null): Promise<Review[]> {
  const index = await getReviewIndex()
  const id = productIdFromGid(gid)
  if (id && index.byProductId[id]) return index.byProductId[id]
  if (handle && index.byHandle[handle]) return index.byHandle[handle]
  return []
}

/** Aggregate for one product, or null when it has no reviews yet. */
export async function getProductRating(gid?: string | null, handle?: string | null): Promise<Rating | null> {
  const reviews = await getProductReviews(gid, handle)
  return reviews.length > 0 ? aggregate(reviews) : null
}

/**
 * Ratings for many products in one shot — the listing-page path. Builds from the
 * single cached index, so a grid of any size costs no extra requests. Products
 * with no reviews are simply absent from the map.
 */
export async function getRatingMap(
  products: { id?: string; handle: string }[],
): Promise<Record<string, Rating>> {
  const index = await getReviewIndex()
  const map: Record<string, Rating> = {}
  for (const p of products) {
    const id = productIdFromGid(p.id)
    const reviews = (id && index.byProductId[id]) || index.byHandle[p.handle]
    if (reviews?.length) map[p.handle] = aggregate(reviews)
  }
  return map
}

/** Shop-wide aggregate, for trust bands and the reviews landing page. */
export async function getShopRating(): Promise<Rating> {
  return (await getReviewIndex()).shop
}
