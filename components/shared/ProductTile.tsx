import Link from 'next/link'
import Image from 'next/image'
import { cleanProductTitle } from '@/lib/product-format'

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-full h-full">
      <path d="M12 21s-7-4.6-9.3-9C1.2 9 2.3 5.8 5.4 5.2 7.3 4.8 9 6 12 8.5 15 6 16.7 4.8 18.6 5.2c3.1.6 4.2 3.8 2.7 6.8C19 16.4 12 21 12 21z" />
    </svg>
  )
}

export interface ProductTileProps {
  href?: string
  external?: boolean
  follow?: boolean
  primarySrc?: string
  primaryAlt?: string
  secondarySrc?: string
  secondaryAlt?: string
  useNextImage?: boolean
  cover?: boolean
  cornerLabel?: string
  badge?: string
  brand?: string
  name: string
  price?: string
  priceSuffix?: string
  className?: string
  hideMeta?: boolean
  /** Force the de-etched greige tile treatment regardless of `cover` — used to make
   *  a whole grid share one background colour (see ShopGrid `tile`). */
  forceTile?: boolean
}

export default function ProductTile({
  href, external = false, follow = false,
  primarySrc, primaryAlt = '', secondarySrc, secondaryAlt = '',
  useNextImage = false, cover = true,
  cornerLabel, badge, brand, name, price, priceSuffix, className = '', hideMeta = false,
  forceTile = false,
}: ProductTileProps) {
  const hasHover = !!secondarySrc
  // forceTile collapses cover/lifestyle shots into the same de-etched greige treatment
  // so a mixed grid reads as one consistent background.
  const effCover = cover && !forceTile
  const fit = effCover ? 'object-cover' : 'object-contain px-4 pt-[11px] pb-4'
  const displayName = cleanProductTitle(name)

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
      {/* Image area — square so the (mostly square) product shots fill full-bleed
          with no crop. Full-bleed (cover) sits on white so transparent shots blend
          into the card; de-etched (contain) keeps the greige backdrop. */}
      <div className={`relative aspect-[3/4] overflow-hidden ${effCover ? 'bg-white' : 'bg-tile'}`}>
        {primarySrc
          ? renderImg(primarySrc, primaryAlt, `transition-opacity duration-500 ${hasHover ? 'group-hover:opacity-0' : ''}`)
          : (
            <span className="absolute inset-0 flex items-center justify-center font-serif text-sm italic opacity-30 px-4 text-center">
              {displayName}
            </span>
          )}
        {secondarySrc && renderImg(secondarySrc, secondaryAlt, 'opacity-0 transition-opacity duration-500 group-hover:opacity-100')}

        {cornerLabel && (
          <span className="absolute top-3 left-3 font-sans text-[8.5px] tracking-[0.16em] uppercase font-semibold z-10 px-1.5 py-0.5 rounded-sm text-white bg-black/30 backdrop-blur-[2px]">
            {cornerLabel}
          </span>
        )}

        <span className="absolute top-3 right-3 w-[18px] h-[18px] z-10 text-ink opacity-60 [filter:drop-shadow(0_1px_2px_rgba(255,255,255,0.85))]">
          <HeartIcon />
        </span>
      </div>

      {/* Text area — always white */}
      {!hideMeta && (
        <div className="bg-white pt-3 pb-1">
          {brand && (
            <p className="font-sans text-[10.5px] tracking-[0.22em] uppercase font-semibold opacity-60 mb-1">
              {brand}
            </p>
          )}
          <h3 className={`font-serif text-[19px] leading-[1.2] ${hasHover ? 'group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]' : ''}`}>
            {displayName}
          </h3>
          {price && (
            <p className="font-serif text-[13px] opacity-65 mt-1">
              {price}
              {priceSuffix && <span className="italic opacity-80">{priceSuffix}</span>}
            </p>
          )}
          {badge && (
            <p className="font-sans text-[9px] tracking-[0.14em] uppercase text-eucalypt font-semibold mt-1.5">
              {badge}
            </p>
          )}
        </div>
      )}
    </>
  )

  const cls = `block text-left ${hasHover ? 'group' : ''} ${className}`

  if (!href) return <div className={cls}>{inner}</div>

  // Outbound "shop this" links fire an AffiliateProductClick (Meta) / select_content
  // (GA4) via the delegated listener in MetaPixel. Only external (affiliate / brand)
  // links are tagged — internal tiles just navigate to a PDP, which fires its own
  // ViewContent / view_item.
  const trackAttrs = external
    ? {
        'data-mp-addtocart': '',
        'data-mp-name': displayName,
        ...(brand ? { 'data-mp-brand': brand } : {}),
        ...(price ? { 'data-mp-price': price.replace(/[^0-9.]/g, '') } : {}),
        'data-mp-currency': 'AUD',
      }
    : {}

  return external ? (
    <a href={href} target="_blank" rel={follow ? 'noopener' : 'sponsored noopener'} className={cls} {...trackAttrs}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}
