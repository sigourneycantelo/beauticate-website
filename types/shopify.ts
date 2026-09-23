export interface ShopifyImage {
  /** Shopify media GID. Used to match a variant's photo to the product's own
   *  image list — URLs carry cache-busting query strings, ids don't. */
  id?: string
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyPrice {
  amount: string
  currencyCode: string
}

export interface ShopifyProductVariant {
  id: string
  title: string
  availableForSale: boolean
  sku: string | null
  barcode: string | null
  price: ShopifyPrice
  compareAtPrice: ShopifyPrice | null
  selectedOptions: { name: string; value: string }[]
  image?: ShopifyImage | null
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  /** ISO 8601 timestamp — used for the "Newest" grid sort. */
  createdAt?: string
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  featuredImage: ShopifyImage | null
  images: { nodes: ShopifyImage[] }
  variants: { nodes: ShopifyProductVariant[] }
  priceRange: {
    minVariantPrice: ShopifyPrice
    maxVariantPrice: ShopifyPrice
  }
  metafields?: {
    key: string
    value: string
  }[]
  // Beauticate editorial fields.
  // `editorial_note` is populated two ways: as a flat field by
  // scripts/sync-shopify.ts, and from the `metafields` array above on live
  // pages. Read it with editorialNote() from lib/shopify.ts, which handles both.
  editorial_note?: string
  // Declared but never set and never read (0 uses, checked Sept 2026). No
  // Shopify metafield definition exists for any of them, so they would come
  // back null from the Storefront API even if requested. Don't build on these
  // without creating the definition first.
  related_articles?: string[]
  collective_member?: string
  social_origin_url?: string
}

export interface ShopifyCollection {
  id: string
  handle: string
  title: string
  description: string
  image: ShopifyImage | null
  products: { nodes: ShopifyProduct[] }
}

export interface CartLine {
  id: string
  quantity: number
  cost: {
    amountPerQuantity: ShopifyPrice
    totalAmount: ShopifyPrice
  }
  merchandise: {
    id: string
    title: string
    product: Pick<ShopifyProduct, 'id' | 'handle' | 'title' | 'featuredImage' | 'vendor'>
    price: ShopifyPrice
    selectedOptions: { name: string; value: string }[]
  }
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: ShopifyPrice
    totalAmount: ShopifyPrice
  }
  lines: { nodes: CartLine[] }
}
