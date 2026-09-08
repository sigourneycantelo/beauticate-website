import type { ShopifyImage, ShopifyProduct, ShopifyProductVariant } from '@/types/shopify'

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

/**
 * Which variant a product page opens on: the cheapest in-stock one, so the price
 * shown matches the card's "From $X" (Shopify's first variant is often not the
 * cheapest). Falls back to cheapest overall, then to the first variant.
 */
export function pickDefaultVariant(
  variants: ShopifyProductVariant[],
  availability?: Record<string, boolean>,
): ShopifyProductVariant | undefined {
  const cheapestFirst = [...variants].sort(
    (a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount),
  )
  return (
    cheapestFirst.find(v => (availability?.[v.id] ?? v.availableForSale)) ??
    cheapestFirst[0] ??
    variants[0]
  )
}

export interface ProductGallery {
  /** The images the carousel renders, in order. */
  images: ShopifyImage[]
  /** variant id → index of that variant's own photo. Variants without one are absent. */
  variantImageIndex: Record<string, number>
  /** Where a variant with no photo of its own sends the gallery.
   *  `undefined` when no variant has a photo at all — then the gallery is left alone. */
  fallbackIndex?: number
}

/** Images carry cache-busting query strings, so match on media id where we have
 *  one and on the URL minus its query otherwise. */
const imageKey = (img: ShopifyImage) => img.id ?? img.url.split('?')[0]

/**
 * Build the gallery for a product page, so choosing a colourway moves the photo.
 *
 * Nothing here reads an option's *name*. Names across the catalogue are arbitrary —
 * `Colour`, `Color`, `Napier`, `Liquid Lipstick`, `Choose-your-shade`, `Size`,
 * `Option` — so any branch on one silently skips products. This works off the
 * selected variant alone.
 *
 * A variant's photo is frequently not among the product's first ten images — on the
 * HOMEE bag the Blush Pink shot is the 21st — so every variant photo is appended if
 * the product's own list didn't already carry it. `leadVariantId`'s photo is hoisted
 * to the front, so the page paints on the right image straight away, including on a
 * `?variant=` deep link, with no scroll-on-mount jump.
 */
export function buildGallery(
  product: Pick<ShopifyProduct, 'images' | 'featuredImage' | 'variants'>,
  leadVariantId?: string,
): ProductGallery {
  const images: ShopifyImage[] = []
  const indexByKey = new Map<string, number>()

  const push = (img?: ShopifyImage | null) => {
    if (!img?.url) return
    const key = imageKey(img)
    if (indexByKey.has(key)) return
    indexByKey.set(key, images.length)
    images.push(img)
  }

  const variants = product.variants?.nodes ?? []
  // Nothing to follow on a product with a single variant — it has no selector, so
  // leave its gallery exactly as the editor ordered it.
  const following = variants.length > 1

  if (following) push(variants.find(v => v.id === leadVariantId)?.image)
  for (const img of product.images?.nodes ?? []) push(img)
  push(product.featuredImage)
  if (following) for (const v of variants) push(v.image)

  const variantImageIndex: Record<string, number> = {}
  for (const v of following ? variants : []) {
    if (!v.image?.url) continue
    const i = indexByKey.get(imageKey(v.image))
    if (i !== undefined) variantImageIndex[v.id] = i
  }

  // Only send a photo-less variant back to the featured shot when the product
  // actually has per-variant photos. Where no variant has its own image (sizes,
  // mostly), snapping the carousel on every change would yank the reader out of
  // the shots they were browsing for no reason at all.
  const hasVariantImages = Object.keys(variantImageIndex).length > 0
  const featuredIndex = product.featuredImage
    ? indexByKey.get(imageKey(product.featuredImage))
    : undefined

  return {
    images,
    variantImageIndex,
    fallbackIndex: hasVariantImages ? featuredIndex ?? 0 : undefined,
  }
}
