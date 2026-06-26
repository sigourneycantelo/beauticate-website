import Image from 'next/image'
import Link from 'next/link'
import type { ProductLink } from '@/types/content'
import type { ShopifyProduct } from '@/types/shopify'

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
      <path d="M12 21s-7-4.6-9.3-9C1.2 9 2.3 5.8 5.4 5.2 7.3 4.8 9 6 12 8.5 15 6 16.7 4.8 18.6 5.2c3.1.6 4.2 3.8 2.7 6.8C19 16.4 12 21 12 21z" />
    </svg>
  )
}

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
      : null
    const image = shopProduct.images?.nodes?.[0] ?? shopProduct.featuredImage

    return (
      <div className="not-prose my-8 max-w-[200px] mx-auto">
        <Link href={`/shop/products/${shopProduct.handle}`} className="group block text-center">
          <div className="relative aspect-square bg-[#EEE9E1] rounded-sm overflow-hidden flex items-center justify-center mb-3">
            {image && (
              <Image
                src={image.url}
                alt={image.altText ?? shopProduct.title}
                width={400}
                height={400}
                className="w-[64%] h-auto transition-transform duration-700 group-hover:scale-[1.04]"
                style={{ mixBlendMode: 'multiply' }}
              />
            )}
            <span className="absolute top-2.5 left-3 font-sans text-[8.5px] tracking-[0.16em] uppercase font-semibold opacity-50">
              In our shop
            </span>
            <span className="absolute top-2.5 right-3 w-[19px] h-[19px] text-ink opacity-55">
              <HeartIcon />
            </span>
          </div>
          <p className="font-sans text-[10px] tracking-[0.22em] uppercase font-semibold opacity-60">
            {shopProduct.vendor}
          </p>
          <h3 className="font-serif text-lg leading-[1.16] mt-0.5 mb-0.5 group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]">
            {shopProduct.title}
          </h3>
          {formatted && <p className="font-serif text-base">{formatted}</p>}
        </Link>
      </div>
    )
  }

  // ── Affiliate / external product ──────────────────────────────────
  const href = product.url ?? '#'
  const retailer = product.retailer ?? ''

  return (
    <div className="not-prose my-8 max-w-[200px] mx-auto">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group block text-center"
      >
        <div className="relative aspect-square bg-[#EEE9E1] rounded-sm overflow-hidden flex items-center justify-center mb-3">
          <span className="font-sans text-[8px] tracking-[0.12em] uppercase opacity-30">
            {retailer}
          </span>
          <span className="absolute top-2.5 right-3 w-[19px] h-[19px] text-ink opacity-55">
            <HeartIcon />
          </span>
        </div>
        <p className="font-sans text-[10px] tracking-[0.22em] uppercase font-semibold opacity-60">
          {retailer}
        </p>
        <h3 className="font-serif text-lg leading-[1.16] mt-0.5 mb-0.5 group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]">
          {product.name}
        </h3>
        {product.price && (
          <p className="font-serif text-base">
            {product.price}{' '}
            {retailer && (
              <span className="text-[13px] opacity-60 italic">at {retailer} ↗</span>
            )}
          </p>
        )}
      </a>
    </div>
  )
}
