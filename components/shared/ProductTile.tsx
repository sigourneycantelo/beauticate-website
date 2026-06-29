import Link from 'next/link'
import Image from 'next/image'

// Heart / wishlist icon — inline so there's no icon-library dependency.
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-full h-full">
      <path d="M12 21s-7-4.6-9.3-9C1.2 9 2.3 5.8 5.4 5.2 7.3 4.8 9 6 12 8.5 15 6 16.7 4.8 18.6 5.2c3.1.6 4.2 3.8 2.7 6.8C19 16.4 12 21 12 21z" />
    </svg>
  )
}

export interface ProductTileProps {
  href: string
  /** External (affiliate) link — opens in a new tab and gets nofollow. */
  external?: boolean
  /** Primary deep-etched / product image. */
  primarySrc?: string
  primaryAlt?: string
  /** Optional second image (shop products only) — crossfades in on hover. */
  secondarySrc?: string
  secondaryAlt?: string
  /** Use next/image (remote Shopify URLs). Article images on /content use a plain <img>. */
  useNextImage?: boolean
  /** Lifestyle/model shot — fills the tile edge-to-edge instead of the centred cut-out. */
  cover?: boolean
  /** Top-left badge: "In our shop" for shop products, "at {retailer} ↗" for affiliate. */
  cornerLabel?: string
  brand?: string
  name: string
  price?: string
  /** e.g. " at Mecca" — appended faintly after the price for affiliate links. */
  priceSuffix?: string
  /** Extra wrapper classes — e.g. a max-width for a single inset card. */
  className?: string
}

/**
 * The single, canonical Beauticate product card — used everywhere (shop pages
 * and inside articles) so every product looks identical, SheerLuxe / Net-a-Porter
 * style: a portrait tile in the shop's parchment background, a deep-etched product,
 * then left-aligned brand / name / price with a smaller price.
 *
 *  • Shop products  → whole card links to the product page; hover reveals the
 *    second Shopify image.
 *  • Affiliate      → no hover; the card simply clicks out to the retailer.
 */
export default function ProductTile({
  href, external = false,
  primarySrc, primaryAlt = '', secondarySrc, secondaryAlt = '',
  useNextImage = false, cover = false,
  cornerLabel, brand, name, price, priceSuffix, className = '',
}: ProductTileProps) {
  const hasHover = !!secondarySrc
  const fit = cover ? 'object-cover' : 'object-contain p-4'

  const renderImg = (src: string, alt: string, extra: string) => {
    const cls = `absolute inset-0 w-full h-full ${fit} ${extra}`
    return useNextImage ? (
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 50vw, 320px" className={cls} />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={cls} />
    )
  }

  const inner = (
    <>
      {/* Tile — parchment matches the shop background exactly */}
      <div className="relative aspect-[3/4] bg-parchment rounded-sm overflow-hidden mb-3">
        {primarySrc
          ? renderImg(primarySrc, primaryAlt, `transition-opacity duration-500 ${hasHover ? 'group-hover:opacity-0' : ''}`)
          : (
            <span className="absolute inset-0 flex items-center justify-center font-serif text-sm italic opacity-30 px-4 text-center">
              {name}
            </span>
          )}
        {secondarySrc && renderImg(secondarySrc, secondaryAlt, 'opacity-0 transition-opacity duration-500 group-hover:opacity-100')}

        {cornerLabel && (
          <span className="absolute top-3 left-3 font-sans text-[8.5px] tracking-[0.16em] uppercase font-semibold opacity-50">
            {cornerLabel}
          </span>
        )}
      </div>

      {/* Meta — left aligned, with the wishlist heart on the name row (SheerLuxe) */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {brand && (
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase font-semibold opacity-55 mb-0.5">
              {brand}
            </p>
          )}
          <h3 className={`font-serif text-[15px] leading-[1.25] ${hasHover ? 'group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]' : ''}`}>
            {name}
          </h3>
        </div>
        <span className="shrink-0 mt-0.5 w-[17px] h-[17px] text-ink opacity-50">
          <HeartIcon />
        </span>
      </div>
      {price && (
        <p className="font-serif text-[12.5px] opacity-70 mt-1">
          {price}
          {priceSuffix && <span className="italic opacity-80">{priceSuffix}</span>}
        </p>
      )}
    </>
  )

  const cls = `block text-left ${hasHover ? 'group' : ''} ${className}`

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}
