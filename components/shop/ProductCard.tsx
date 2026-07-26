import type { ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'
import { isFreeShipping } from '@/lib/shop-taxonomy'

interface Props {
  product: ShopifyProduct
  /** Deprecated — kept for call-site compatibility. Shop cards are always full-bleed now. */
  photoMode?: boolean
}

export default function ProductCard({ product: p }: Props) {
  const price = p.priceRange.minVariantPrice
  const formatted = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(parseFloat(price.amount))

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
      price={formatted}
    />
  )
}
