import type { ProductLink } from '@/types/content'
import type { ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'
import { retailerFromUrl } from '@/lib/retailer'

interface Props {
  product: ProductLink
  shopProduct?: ShopifyProduct
}

export default function ProductEmbed({ product, shopProduct }: Props) {
  if (product.type === 'dead') return null

  // ── Own Shopify product ───────────────────────────────────────────
  if (product.type === 'shop' && shopProduct) {
    const price = shopProduct.priceRange?.minVariantPrice
    const formatted = price
      ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(
          parseFloat(price.amount)
        )
      : undefined
    const imgs = shopProduct.images?.nodes ?? []
    const primary = imgs[0] ?? shopProduct.featuredImage
    const secondary = imgs[1]

    return (
      <div className="not-prose my-8 max-w-[300px] mx-auto">
        <ProductTile
          href={`/shop/products/${shopProduct.handle}`}
          useNextImage
          primarySrc={primary?.url}
          primaryAlt={primary?.altText ?? shopProduct.title}
          secondarySrc={secondary?.url}
          secondaryAlt={secondary?.altText ?? shopProduct.title}
          cornerLabel="In our shop"
          brand={shopProduct.vendor}
          name={shopProduct.title}
          price={formatted}
        />
      </div>
    )
  }

  // ── Affiliate / external product (no product image available) ─────
  const href = product.url ?? '#'
  const retailer = product.retailer ?? retailerFromUrl(product.url)

  return (
    <div className="not-prose my-8 max-w-[300px] mx-auto">
      <ProductTile
        href={href}
        external
        cornerLabel={retailer ? `shop via ${retailer} ↗` : 'shop ↗'}
        brand={retailer || undefined}
        name={product.name}
        price={product.price}
      />
    </div>
  )
}
