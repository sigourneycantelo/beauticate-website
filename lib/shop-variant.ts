import type { ShopifyProduct, ShopifyProductVariant } from '@/types/shopify'

/**
 * Pin an editorial product card to one colourway.
 *
 * Several shop products are a single Shopify listing with a colour variant each
 * (the HOMEE bag is one listing whose variants are Pink, White, Silver, Black and
 * Blush Pink). Without this, a card always shows the listing's default variant —
 * so an article that means the blush one renders the pink one.
 *
 * `variant` matches on the variant title ("Blush Pink"), case-insensitively, or on
 * a raw Shopify variant id. Returns undefined when nothing matches, so the caller
 * falls back to the product's own default rather than rendering the wrong colour.
 */
export function findVariant(
  product: ShopifyProduct,
  variant?: string,
): ShopifyProductVariant | undefined {
  if (!variant) return undefined
  const want = variant.trim().toLowerCase()
  return product.variants?.nodes?.find(
    v => v.title.toLowerCase() === want || v.id === variant || v.id.endsWith(`/${variant}`),
  )
}

/** Product URL, pinned to `variant` when one was matched. */
export function variantHref(handle: string, variant?: ShopifyProductVariant): string {
  const base = `/shop/products/${handle}`
  if (!variant) return base
  const id = variant.id.split('/').pop()
  return id ? `${base}?variant=${id}` : base
}
