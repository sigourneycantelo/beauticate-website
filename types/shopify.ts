export interface ShopifyImage {
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
  price: ShopifyPrice
  compareAtPrice: ShopifyPrice | null
  selectedOptions: { name: string; value: string }[]
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
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
  // Beauticate editorial fields (Shopify metafields)
  editorial_note?: string
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
  merchandise: {
    id: string
    title: string
    product: Pick<ShopifyProduct, 'id' | 'handle' | 'title' | 'featuredImage'>
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
