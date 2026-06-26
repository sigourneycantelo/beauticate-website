import type { ShopifyProduct, ShopifyCollection, Cart } from '@/types/shopify'

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const PRIVATE_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
const API_URL = STORE_DOMAIN ? `https://${STORE_DOMAIN}/api/2024-10/graphql.json` : ''

async function shopifyFetch<T>(query: string, variables?: object): Promise<T> {
  if (!STORE_DOMAIN || !PRIVATE_TOKEN) return { data: null } as T
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Shopify-Storefront-Private-Token': PRIVATE_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 }, // cache 1 hour
  })

  if (!res.ok) throw new Error(`Shopify API error: ${res.statusText}`)
  const { data, errors } = await res.json()
  if (errors) throw new Error(errors[0].message)
  return data
}

// ─── Fragments ───────────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
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
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
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
  return (data as any)?.products?.nodes ?? []
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

export async function getProductsByType(type: string, first = 8): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(`
    query ProductsByType($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        nodes { ...ProductFields }
      }
    }
    ${PRODUCT_FRAGMENT}
  `, { query: `product_type:${type}`, first })
  return data.products?.nodes ?? []
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

// ─── Cart ────────────────────────────────────────────────────────────────────

export async function createCart(): Promise<Cart | null> {
  if (!STORE_DOMAIN || !PRIVATE_TOKEN) return null
  const data = await shopifyFetch<{ cartCreate: { cart: Cart } }>(`
    mutation CreateCart {
      cartCreate {
        cart {
          id checkoutUrl totalQuantity
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
          lines(first: 100) { nodes {
            id quantity
            merchandise {
              ... on ProductVariant {
                id title
                price { amount currencyCode }
                selectedOptions { name value }
                product { id handle title featuredImage { url altText width height } }
              }
            }
          }}
        }
      }
    }
  `)
  return (data as any)?.cartCreate?.cart ?? null
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>(`
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id checkoutUrl totalQuantity
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
          lines(first: 100) { nodes {
            id quantity
            merchandise {
              ... on ProductVariant {
                id title
                price { amount currencyCode }
                selectedOptions { name value }
                product { id handle title featuredImage { url altText width height } }
              }
            }
          }}
        }
      }
    }
  `, { cartId, lines: [{ merchandiseId: variantId, quantity }] })
  return data.cartLinesAdd.cart
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>(`
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id checkoutUrl totalQuantity
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
          lines(first: 100) { nodes {
            id quantity
            merchandise {
              ... on ProductVariant {
                id title
                price { amount currencyCode }
                selectedOptions { name value }
                product { id handle title featuredImage { url altText width height } }
              }
            }
          }}
        }
      }
    }
  `, { cartId, lineIds })
  return data.cartLinesRemove.cart
}
