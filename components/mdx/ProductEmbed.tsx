import Image from 'next/image'
import type { ProductLink } from '@/types/content'
import type { ShopifyProduct } from '@/types/shopify'
import AddToCartButton from '@/components/shop/AddToCartButton'

interface Props {
  product: ProductLink
  shopProduct?: ShopifyProduct
}

export default function ProductEmbed({ product, shopProduct }: Props) {
  if (product.type === 'dead') return null

  const price = shopProduct?.priceRange?.minVariantPrice
    ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
        .format(parseFloat(shopProduct.priceRange.minVariantPrice.amount))
    : null

  if (product.type === 'shop' && shopProduct) {
    const variant = shopProduct.variants?.nodes?.[0]
    const image = shopProduct.images?.nodes?.[0]
    return (
      <div className="my-6 border border-cream-200 max-w-xs mx-auto">
        {image && (
          <div className="relative w-full aspect-square bg-cream-100">
            <Image src={image.url} alt={image.altText ?? shopProduct.title} fill className="object-cover" />
          </div>
        )}
        <div className="p-4 text-center">
          <p className="text-xs text-charcoal-light mb-1">{shopProduct.vendor}</p>
          <p className="font-medium text-sm mb-1 leading-tight">{shopProduct.title}</p>
          {price && <p className="text-sm text-gold mb-3">{price}</p>}
          {variant && (
            <AddToCartButton
              variantId={variant.id}
              variantTitle={variant.title}
              productTitle={shopProduct.title}
              productImage={image ?? undefined}
              price={variant.price}
            />
          )}
        </div>
      </div>
    )
  }

  const href = product.type === 'affiliate' || product.type === 'external' ? product.url : '#'
  return (
    <div className="my-6 border border-cream-200 p-4 flex gap-4 items-center justify-between">
      <div>
        <p className="text-xs text-charcoal-light mb-1">{product.retailer ?? ''}</p>
        <p className="font-medium text-sm">{product.name}</p>
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="btn-secondary text-xs whitespace-nowrap">
        {product.type === 'affiliate' ? 'Shop Now' : 'View Product'} →
      </a>
    </div>
  )
}
