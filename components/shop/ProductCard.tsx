import type { ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'
import { isFreeShipping } from '@/lib/shop-taxonomy'
import { formatCardPrice } from '@/lib/product-format'
import type { Rating } from '@/lib/judgeme'

interface Props {
  product: ShopifyProduct
  /** Deprecated — kept for call-site compatibility. Shop cards are always full-bleed now. */
  photoMode?: boolean
  /** Judge.me aggregate for this product. Omitted ⇒ no stars, which is the
   *  correct look for an unreviewed product. Grids fetch these in bulk (see
   *  ProductGrid) rather than each card fetching its own. */
  rating?: Rating | null
}

export default function ProductCard({ product: p, rating }: Props) {
  // Shop cards reveal the second Shopify image on hover (a "this is ours" cue).
  const imgs = p.images?.nodes ?? []
  const primary = imgs[0] ?? p.featuredImage
  const secondary = imgs[1]

  return (
    <ProductTile
      href={`/shop/products/${p.handle}`}
      useNextImage
      cover
      primarySrc={primary?.url}
      primaryAlt={primary?.altText ?? p.title}
      secondarySrc={secondary?.url}
      secondaryAlt={secondary?.altText ?? p.title}
      badge={isFreeShipping(p.vendor) ? 'Free Shipping' : undefined}
      brand={p.vendor}
      name={p.title}
      price={formatCardPrice(p)}
      rating={rating?.average}
      reviewCount={rating?.count}
    />
  )
}
