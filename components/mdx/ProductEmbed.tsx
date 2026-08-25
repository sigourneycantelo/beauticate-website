import type { ProductLink } from '@/types/content'
import type { ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'
import { retailerFromUrl } from '@/lib/retailer'
import { formatCardPrice } from '@/lib/product-format'

interface Props {
  product: ProductLink
  shopProduct?: ShopifyProduct
}

export default function ProductEmbed({ product, shopProduct }: Props) {
  if (product.type === 'dead') return null

  // ── Own Shopify product ───────────────────────────────────────────
  if (product.type === 'shop' && shopProduct) {
    const formatted = shopProduct.priceRange?.minVariantPrice
      ? formatCardPrice(shopProduct)
      : undefined
    const imgs = shopProduct.images?.nodes ?? []
    const primary = imgs[0] ?? shopProduct.featuredImage
    const secondary = imgs[1]

    return (
      <div className="not-prose my-8">
        <ProductTile
          href={`/shop/products/${shopProduct.handle}`}
          useNextImage
          primarySrc={primary?.url}
          primaryAlt={primary?.altText ?? shopProduct.title}
          secondarySrc={secondary?.url}
          secondaryAlt={secondary?.altText ?? shopProduct.title}
          brand={shopProduct.vendor}
          name={shopProduct.title}
          price={formatted}
        />
      </div>
    )
  }

  // ── Own shop product whose handle no longer resolves ──────────────
  // Archived/unpublished products drop out of the Storefront API, leaving a
  // shop link with no image, name, price or URL of its own. Rendering it below
  // produces an empty greige tile with a "shop from brand" badge and no text —
  // worse than showing nothing. Drop it instead.
  if (product.type === 'shop' && !product.image && !product.url) return null

  // ── Affiliate / external product — self-hosted de-etched image ────
  const href = product.url ?? '#'
  const brand = product.brand || product.retailer || retailerFromUrl(product.url) || product.name?.split(' ')[0] || ''

  return (
    <div className="not-prose my-8">
      <ProductTile
        href={href}
        external
        primarySrc={product.image}
        primaryAlt={product.name}
        cornerLabel="shop from brand"
        brand={brand || undefined}
        name={product.name}
        price={product.price}
      />
    </div>
  )
}
