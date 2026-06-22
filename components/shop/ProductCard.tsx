import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/types/shopify'

// Heart icon — inline so there's no icon-library dependency
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
      <path d="M12 21s-7-4.6-9.3-9C1.2 9 2.3 5.8 5.4 5.2 7.3 4.8 9 6 12 8.5 15 6 16.7 4.8 18.6 5.2c3.1.6 4.2 3.8 2.7 6.8C19 16.4 12 21 12 21z" />
    </svg>
  )
}

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

  return (
    <Link
      href={`/shop/products/${p.handle}`}
      className="group block text-center"
    >
      {/* Tile */}
      <div className="relative aspect-square bg-[#EEE9E1] rounded-sm overflow-hidden flex items-center justify-center mb-3">
        {p.featuredImage && (
          <Image
            src={p.featuredImage.url}
            alt={p.featuredImage.altText ?? p.title}
            fill={photoMode}
            width={photoMode ? undefined : 400}
            height={photoMode ? undefined : 400}
            className={
              photoMode
                ? 'object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.04]'
                : 'w-[64%] h-auto transition-transform duration-700 group-hover:scale-[1.04]'
            }
            style={photoMode ? undefined : { mixBlendMode: 'multiply' }}
          />
        )}

        {/* "In our shop" corner badge */}
        <span className="absolute top-2.5 left-3 font-sans text-[8.5px] tracking-[0.16em] uppercase font-semibold opacity-50">
          In our shop
        </span>

        {/* Wishlist heart */}
        <span className="absolute top-2.5 right-3 w-[19px] h-[19px] text-ink opacity-55">
          <HeartIcon />
        </span>
      </div>

      {/* Meta */}
      <p className="font-sans text-[10px] tracking-[0.22em] uppercase font-semibold opacity-60">
        {p.vendor}
      </p>
      <h3 className="font-serif text-lg leading-[1.16] mt-0.5 mb-0.5 group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]">
        {p.title}
      </h3>
      <p className="font-serif text-base">{formatted}</p>
    </Link>
  )
}
