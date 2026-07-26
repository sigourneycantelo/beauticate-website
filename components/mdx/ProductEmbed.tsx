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

  // ── Affiliate / external product (no product image available) ─────
  const href = product.url ?? '#'
  const retailer = (product.retailer ?? retailerFromUrl(product.url)) || product.name?.split(' ')[0] || ''

  return (
    <div className="not-prose my-8">
      <ProductTile
        href={href}
        external
        cornerLabel="shop from brand"
        brand={retailer || undefined}
        name={product.name}
        price={product.price}
      />
    </div>
  )
}
