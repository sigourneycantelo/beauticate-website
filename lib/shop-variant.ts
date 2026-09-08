import type { ShopifyImage, ShopifyProduct, ShopifyProductVariant } from '@/types/shopify'

/**
 * Variant selection and the gallery that follows it.
 *
 * Nothing here looks at an option's *name*. Option names across the catalogue are
 * arbitrary — `Colour`, `Color`, `Napier`, `Liquid Lipstick`, `Choose-your-shade`,
 * `Size`, `Option` — so any branch on one silently skips products (Basics By B's
 * Velvet Lip Liner calls its shade option `Napier`). Everything works off the
 * selected variant instead.
 */

/** Images carry cache-busting query strings, so match on media id where we have
 *  one and on the URL minus its query otherwise. */
const imageKey = (img: ShopifyImage) => img.id ?? img.url.split('?')[0]

/**
 * Resolve a `?variant=` deep link. Shopify's own links carry the bare numeric id
 * (`?variant=45527802413125`) while ours are GIDs, so compare the numeric tail
 * and accept either form.
 */
export function findVariantByParam<T extends { id: string }>(
  variants: T[],
  param?: string | null,
): T | undefined {
  if (!param) return undefined
  const wanted = param.trim().split('/').pop()
  if (!wanted) return undefined
  return variants.find(v => v.id.split('/').pop() === wanted)
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

/**
 * Build the gallery for a product page.
 *
 * A variant's photo is frequently *not* in the product's first ten images — on
 * Estetika's HOMEE bag the Blush Pink shot is the 21st — so every variant photo is
 * appended if the product's own list didn't already carry it. `leadVariantId`'s
 * photo is hoisted to the front so the page paints on the right image straight
 * away, including on a `?variant=` deep link, with no scroll-on-mount jump.
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
  // actually has per-variant photos. On a product where no variant has its own
  // image (sizes, mostly), snapping the carousel on every change would yank the
  // reader out of the shots they were browsing for no reason at all.
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
