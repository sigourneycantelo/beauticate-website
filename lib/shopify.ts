import type { ShopifyProduct, ShopifyCollection, Cart } from '@/types/shopify'
import { NON_BRAND_COLLECTION_HANDLES, type ShopBrand } from './shop-taxonomy'
import { GWP, stripHidden } from './gwp'

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const PRIVATE_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
const API_URL = STORE_DOMAIN ? `https://${STORE_DOMAIN}/api/2024-10/graphql.json` : ''

async function shopifyFetch<T>(query: string, variables?: object, opts?: { noStore?: boolean }): Promise<T> {
  if (!STORE_DOMAIN || !PRIVATE_TOKEN) return { data: null } as T
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': PRIVATE_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      // Cart requests must always hit Shopify live — caching a cart read for even
      // a few minutes serves a stale snapshot (e.g. missing a just-added item),
      // which is how items "disappear" after navigating away and back. Everything
      // else (products/collections) is fine to cache for 5 min so freshly curated
      // shop content shows quickly.
      ...(opts?.noStore ? { cache: 'no-store' } : { next: { revalidate: 300 } }),
    })

    if (!res.ok) {
      console.warn(`Shopify API error: ${res.status} ${res.statusText}`)
      return { data: null } as T
    }
    const { data, errors } = await res.json()
    if (errors) {
      console.warn('Shopify GraphQL errors:', errors[0]?.message)
      return { data: null } as T
    }
    return data
  } catch (err) {
    console.warn('Shopify fetch failed (build will continue without shop data):', err)
    return { data: null } as T
  }
}

// ─── Fragments ───────────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    createdAt
    description
    descriptionHtml
    vendor
    productType
    tags
    featuredImage { url altText width height }
    images(first: 10) { nodes { url altText width height } }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        sku
        barcode
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
        # Per-colourway shot, so an editorial card pinned to one variant
        # (e.g. Blush Pink) shows that colour rather than the product's default.
        image { url altText width height }
      }
    }
  }
`

// Cart line prices are resolved in the cart's market context, so a cart is always
// created with an AU buyer identity to match the AUD storefront pricing shown on
// product pages. Line-level `cost` is the canonical "what the customer pays" figure
// (already quantity-inclusive); `merchandise.price` is kept as a per-unit fallback.
const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          amountPerQuantity { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            selectedOptions { name value }
            product { id handle title vendor featuredImage { url altText width height } }
          }
        }
      }
    }
  }
`

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(`
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) { ...ProductFields }
    }
  `, { handle })
  return (data as any)?.product ?? null
}

export async function getProductsByHandles(handles: string[]): Promise<ShopifyProduct[]> {
  const products = await Promise.all(handles.map(h => getProductByHandle(h)))
  return products.filter(Boolean) as ShopifyProduct[]
}

export async function getProducts(first = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(`
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!) {
      products(first: $first, sortKey: UPDATED_AT, reverse: true) {
        nodes { ...ProductFields }
      }
    }
  `, { first })
  return stripHidden((data as any)?.products?.nodes ?? [])
}

// Round-robin interleave: take up to `perBrand` products from each of the last
// `maxBrands` onboarded brands, ordered A1 B1 C1 … A2 B2 C2 … so adjacent cards
// are always different brands.
export async function getNewArrivals(maxBrands = 6, perBrand = 4): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(`
    ${PRODUCT_FRAGMENT}
    query NewArrivals($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        nodes { ...ProductFields }
      }
    }
  `, { first: 200 })
  const all = stripHidden<ShopifyProduct>((data as any)?.products?.nodes ?? [])
  const buckets = new Map<string, ShopifyProduct[]>()
  const brandOrder: string[] = []
  for (const p of all) {
    const brand = (p.vendor ?? '').toLowerCase()
    if (!buckets.has(brand)) {
      buckets.set(brand, [])
      brandOrder.push(brand)
    }
    const bucket = buckets.get(brand)!
    if (bucket.length < perBrand) bucket.push(p)
    if (brandOrder.length >= maxBrands && [...buckets.values()].every(b => b.length >= perBrand)) break
  }
  const picks: ShopifyProduct[] = []
  for (let round = 0; round < perBrand; round++) {
    for (const brand of brandOrder.slice(0, maxBrands)) {
      const bucket = buckets.get(brand)!
      if (round < bucket.length) picks.push(bucket[round])
    }
  }
  return picks
}

// A collection with a fuller product list than getCollectionByHandle (which caps at 24) —
// used by the broad category pages that need every product in the group.
export async function getCollectionFull(handle: string, first = 250): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>(`
    ${PRODUCT_FRAGMENT}
    query GetCollectionFull($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        id handle title description
        image { url altText width height }
        products(first: $first) { nodes { ...ProductFields } }
      }
    }
  `, { handle, first })
  return (data as any)?.collection ?? null
}

// Just the product handles in a collection — for cheaply tagging which sub-collection
// (filter bucket) each product on a broad category page belongs to.
export async function getCollectionProductHandles(handle: string, first = 250): Promise<string[]> {
  const data = await shopifyFetch<{ collection: { products: { nodes: { handle: string }[] } } | null }>(`
    query CollectionHandles($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) { nodes { handle } }
      }
    }
  `, { handle, first })
  return (data as any)?.collection?.products?.nodes?.map((n: { handle: string }) => n.handle).filter(Boolean) ?? []
}

export async function getProductsByTag(tag: string, first = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(`
    ${PRODUCT_FRAGMENT}
    query ProductsByTag($query: String!, $first: Int!) {
      products(first: $first, query: $query, sortKey: UPDATED_AT, reverse: true) {
        nodes { ...ProductFields }
      }
    }
  `, { query: `tag:${tag}`, first })
  return stripHidden((data as any)?.products?.nodes ?? [])
}

// ─── Collections ─────────────────────────────────────────────────────────────

export async function getCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>(`
    ${PRODUCT_FRAGMENT}
    query GetCollection($handle: String!) {
      collection(handle: $handle) {
        id handle title description
        image { url altText width height }
        products(first: 24) { nodes { ...ProductFields } }
      }
    }
  `, { handle })
  return (data as any)?.collection ?? null
}

export async function getProductTypes(): Promise<string[]> {
  const data = await shopifyFetch<{ productTypes: { edges: { node: string }[] } }>(`
    { productTypes(first: 50) { edges { node } } }
  `)
  return data.productTypes?.edges.map(e => e.node).filter(Boolean) ?? []
}

export async function getProductsByType(type: string, first = 8, vendor?: string): Promise<ShopifyProduct[]> {
  const query = vendor
    ? `product_type:${type} vendor:${vendor}`
    : `product_type:${type}`
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(`
    query ProductsByType($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        nodes { ...ProductFields }
      }
    }
    ${PRODUCT_FRAGMENT}
  `, { query, first })
  return stripHidden(data.products?.nodes ?? [])
}

export async function getCollections(first = 20): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{ collections: { nodes: ShopifyCollection[] } }>(`
    query GetCollections($first: Int!) {
      collections(first: $first) {
        nodes {
          id handle title description
          image { url altText width height }
          products(first: 4) { nodes {
            id handle title
            featuredImage { url altText width height }
            priceRange { minVariantPrice { amount currencyCode } }
          }}
        }
      }
    }
  `, { first })
  return (data as any)?.collections?.nodes ?? []
}

// ─── Brands ──────────────────────────────────────────────────────────────────

// The full "Shop by Brand" list: every brand collection in Shopify (not a category,
// moment, or curator edit), named from its title and sorted alphabetically. Keeps the
// brand menu / index complete as new brands onboard, with no code change. Pure — pass
// already-fetched collections to avoid a second fetch.
export function brandsFromCollections(collections: ShopifyCollection[]): ShopBrand[] {
  const seen = new Set<string>()
  const brands: ShopBrand[] = []
  for (const c of collections) {
    if (NON_BRAND_COLLECTION_HANDLES.has(c.handle) || seen.has(c.handle)) continue
    seen.add(c.handle)
    // Name + image + description all come from the (smart) collection — the single source
    // for each brand's presentation, shared with the brand page hero. Keep the collection
    // title aligned to the vendor name in Shopify so the menu and page stay consistent.
    brands.push({ name: c.title, handle: c.handle })
  }
  return brands.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
}

// Same list, fetching the collections itself — for callers that don't already have them.
export async function getShopBrands(): Promise<ShopBrand[]> {
  return brandsFromCollections(await getCollections(100))
}

// Products filed under a vendor — the fallback for a brand page when no collection
// matches the handle (a drifted/absent collection handle, or a vendor-only brand).
// vendor matches product.vendor exactly.
export async function getProductsByVendor(vendor: string, first = 250): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(`
    ${PRODUCT_FRAGMENT}
    query ProductsByVendor($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        nodes { ...ProductFields }
      }
    }
  `, { query: `vendor:"${vendor.replace(/"/g, '\\"')}"`, first })
  return stripHidden((data as any)?.products?.nodes ?? [])
}

// A brand page's collection resolved leniently: the real Shopify collection for the
// handle if one exists, else a synthetic collection built from the matching vendor's
// products — so a drifted or absent collection handle degrades to a working brand page
// instead of a 404. Returns null only when neither path yields products.
export async function getBrandCollection(handle: string): Promise<ShopifyCollection | null> {
  const collection = await getCollectionFull(handle)
  if (collection) return collection

  // Guess the vendor from the handle: "subtle-energies" -> "Subtle Energies".
  const vendorGuess = handle
    .replace(/-\d+$/, '')            // drop Shopify's -1/-2 handle-dedupe suffix
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  const products = await getProductsByVendor(vendorGuess)
  if (!products.length) return null

  return {
    id: `vendor:${handle}`,
    handle,
    title: products[0].vendor || vendorGuess,
    description: '',
    image: products[0].featuredImage ?? null,
    products: { nodes: products },
  }
}

// ─── Product types / categories ──────────────────────────────────────────────

// ─── Cart ────────────────────────────────────────────────────────────────────

export async function createCart(): Promise<Cart | null> {
  if (!STORE_DOMAIN || !PRIVATE_TOKEN) return null
  const data = await shopifyFetch<{ cartCreate: { cart: Cart } }>(`
    ${CART_FRAGMENT}
    mutation CreateCart {
      cartCreate(input: { buyerIdentity: { countryCode: AU } }) {
        cart { ...CartFields }
      }
    }
  `, undefined, { noStore: true })
  return (data as any)?.cartCreate?.cart ?? null
}

export async function getCart(cartId: string): Promise<Cart | null> {
  if (!STORE_DOMAIN || !PRIVATE_TOKEN) return null
  const data = await shopifyFetch<{ cart: Cart }>(`
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
  `, { cartId }, { noStore: true })
  return (data as any)?.cart ?? null
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1,
  attributes?: { key: string; value: string }[]
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>(`
    ${CART_FRAGMENT}
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
      }
    }
  `, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity, ...(attributes?.length ? { attributes } : {}) }],
  }, { noStore: true })
  return data.cartLinesAdd.cart
}

// Set an existing line's quantity. Used to clamp the gift-with-purchase line back
// to one if anything ever pushes it higher; the storefront has no other quantity
// control on a cart line.
export async function updateCartLineQuantity(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>(`
    ${CART_FRAGMENT}
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
      }
    }
  `, { cartId, lines: [{ id: lineId, quantity }] }, { noStore: true })
  return data.cartLinesUpdate.cart
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>(`
    ${CART_FRAGMENT}
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
      }
    }
  `, { cartId, lineIds }, { noStore: true })
  return data.cartLinesRemove.cart
}

// Writes analytics attribution (GA4 client_id, Meta fbp/fbc, user agent) onto the
// cart as custom attributes. Shopify carries cart.attributes through to the
// order's note_attributes on checkout, which is the only way the orders-created
// webhook (a server-to-server call from Shopify, with no browser cookies) can
// attribute a completed Purchase back to the session that made it. Best-effort:
// callers should fire-and-forget this, never block the UI on it.
export async function updateCartAttributes(cartId: string, attributes: Record<string, string>): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartAttributesUpdate: { cart: Cart } }>(`
    ${CART_FRAGMENT}
    mutation UpdateCartAttributes($cartId: ID!, $attributes: [AttributeInput!]!) {
      cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
        cart { ...CartFields }
      }
    }
  `, { cartId, attributes: Object.entries(attributes).map(([key, value]) => ({ key, value })) }, { noStore: true })
  return (data as any)?.cartAttributesUpdate?.cart ?? null
}

// Real-time per-variant availability. The plain product query's `availableForSale`
// is unreliable when the Storefront token lacks the product-inventory scope — it
// defaults to `true` even for sold-out items. A cart, however, resolves inventory
// for real, so we probe by creating a throwaway cart containing every variant and
// seeing which lines Shopify clamps to quantity 0. Returns { [variantId]: true } when
// purchasable. Fails open: an empty map means "assume available", so an API hiccup
// never hides a sellable product (the cart drawer still catches a true out-of-stock).
export async function getVariantAvailability(variantIds: string[]): Promise<Record<string, boolean>> {
  if (!STORE_DOMAIN || !PRIVATE_TOKEN || variantIds.length === 0) return {}
  const data = await shopifyFetch<{
    cartCreate: { cart: { lines: { nodes: { quantity: number; merchandise: { id: string } }[] } } | null }
  }>(`
    mutation ProbeAvailability($lines: [CartLineInput!]!) {
      cartCreate(input: { buyerIdentity: { countryCode: AU }, lines: $lines }) {
        cart {
          lines(first: 100) {
            nodes {
              quantity
              merchandise { ... on ProductVariant { id } }
            }
          }
        }
      }
    }
  `, { lines: variantIds.map(id => ({ merchandiseId: id, quantity: 1 })) })

  const nodes = (data as any)?.cartCreate?.cart?.lines?.nodes
  if (!nodes) return {}
  const map: Record<string, boolean> = {}
  for (const n of nodes) {
    const id = n?.merchandise?.id
    if (id) map[id] = (n.quantity ?? 0) >= 1
  }
  return map
}

// ─── Sitemap helpers (lightweight, paginated) ─────────────────────────────────

type ProductHandleConn = { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: { handle: string; updatedAt?: string }[] }

export async function getAllProductHandles(): Promise<{ handle: string; updatedAt?: string }[]> {
  const out: { handle: string; updatedAt?: string }[] = []
  let cursor: string | null = null
  for (let i = 0; i < 20; i++) {
    const data: { products?: ProductHandleConn } = await shopifyFetch<{ products?: ProductHandleConn }>(`
      query AllProductHandles($cursor: String) {
        products(first: 250, after: $cursor, sortKey: UPDATED_AT, reverse: true) {
          pageInfo { hasNextPage endCursor }
          nodes { handle updatedAt }
        }
      }
    `, { cursor })
    const conn: ProductHandleConn | undefined = data?.products
    if (!conn) break
    // The gift-with-purchase SKU is seo.hidden in Shopify and must not be indexed.
    for (const n of conn.nodes ?? []) if (n?.handle && n.handle !== GWP.giftHandle) out.push({ handle: n.handle, updatedAt: n.updatedAt })
    if (!conn.pageInfo?.hasNextPage) break
    cursor = conn.pageInfo.endCursor
  }
  return out
}

export async function getAllCollectionHandles(): Promise<string[]> {
  const data: { collections?: { nodes: { handle: string }[] } } = await shopifyFetch<{ collections?: { nodes: { handle: string }[] } }>(`
    { collections(first: 250) { nodes { handle } } }
  `)
  return (data?.collections?.nodes ?? []).map(n => n.handle).filter(Boolean)
}

// ─── The team "Edit" product rail — single source of truth ────────────────────
// The curated carousel that appears as "Essentials for living beautifully"
// (home page ShopGrid) and "What the team is buying this week" (shop home page).
// BOTH pages must feed from this one function so the two rails never drift apart.
// Feeds from three levels, deduped by handle and capped at TEAM_RAIL_MAX:
//   • TEAM_RAIL_TAG         — any PRODUCT carrying this Shopify product tag
//   • TEAM_RAIL_VENDORS     — whole BRANDS, by exact Shopify vendor name
//   • TEAM_RAIL_COLLECTIONS — whole COLLECTIONS, by Shopify collection handle
// Note: Shopify collections can't carry storefront-readable tags, so brands and
// collections are curated by name/handle here (not by tagging them in Shopify).
export const TEAM_RAIL_TAG = 'team'
export const TEAM_RAIL_VENDORS: string[] = []
export const TEAM_RAIL_COLLECTIONS = ['team-picks', 'editors-essentials', 'autumn-edit']
export const TEAM_RAIL_MAX = 48

export async function getTeamRailProducts(max = TEAM_RAIL_MAX): Promise<ShopifyProduct[]> {
  const [taggedProducts, vendorProductLists, curatedCollections] = await Promise.all([
    getProductsByTag(TEAM_RAIL_TAG, max),
    Promise.all(TEAM_RAIL_VENDORS.map(v => getProductsByVendor(v, max))),
    Promise.all(TEAM_RAIL_COLLECTIONS.map(h => getCollectionFull(h, max))),
  ])
  const vendorProducts = vendorProductLists.flat()
  const collectionProducts = curatedCollections.flatMap(c => c?.products?.nodes ?? [])
  const seen = new Set<string>()
  return [...taggedProducts, ...vendorProducts, ...collectionProducts]
    .filter(p => {
      if (seen.has(p.handle)) return false
      seen.add(p.handle)
      return true
    })
    .slice(0, max)
}
