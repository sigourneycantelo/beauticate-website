import type { ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'

interface Props {
  product: ShopifyProduct
  /** Pass true when the image is a model/lifestyle shot — fills the tile edge-to-edge instead of the centred cut-out layout */
  photoMode?: boolean
}

export default function ProductCard({ product: p, photoMode = false }: Props) {
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
      cover={photoMode}
      primarySrc={primary?.url}
      primaryAlt={primary?.altText ?? p.title}
      secondarySrc={secondary?.url}
      secondaryAlt={secondary?.altText ?? p.title}
      cornerLabel="In our shop"
      brand={p.vendor}
      name={p.title}
      price={formatted}
    />
  )
}
