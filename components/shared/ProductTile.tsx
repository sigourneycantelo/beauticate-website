import Link from 'next/link'
import Image from 'next/image'

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
  brand?: string
  name: string
  price?: string
  priceSuffix?: string
  className?: string
  hideMeta?: boolean
}

export default function ProductTile({
  href, external = false, follow = false,
  primarySrc, primaryAlt = '', secondarySrc, secondaryAlt = '',
  useNextImage = false, cover = false,
  cornerLabel, brand, name, price, priceSuffix, className = '', hideMeta = false,
}: ProductTileProps) {
  const hasHover = !!secondarySrc
  const fit = cover ? 'object-cover' : 'object-contain p-6'

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
      {/* Image area — greige for de-etched, full-bleed for lifestyle */}
      <div className="relative aspect-[3/4] overflow-hidden bg-tile rounded-lg">
        {primarySrc
          ? renderImg(primarySrc, primaryAlt, `transition-opacity duration-500 ${hasHover ? 'group-hover:opacity-0' : ''}`)
          : (
            <span className="absolute inset-0 flex items-center justify-center font-serif text-sm italic opacity-30 px-4 text-center">
              {name}
            </span>
          )}
        {secondarySrc && renderImg(secondarySrc, secondaryAlt, 'opacity-0 transition-opacity duration-500 group-hover:opacity-100')}

        {cornerLabel && (
          <span className="absolute top-3 left-3 font-sans text-[11px] tracking-[0.06em] uppercase font-semibold z-10" style={{ color: '#7A7570' }}>
            {cornerLabel}
          </span>
        )}

        <span className={`absolute top-3 right-3 w-[18px] h-[18px] z-10 ${cover ? 'text-white opacity-90 drop-shadow' : 'text-ink opacity-55'}`}>
          <HeartIcon />
        </span>
      </div>

      {/* Text area — always white */}
      {!hideMeta && (
        <div className="bg-white pt-3 pb-1">
          {brand && (
            <p className="font-sans text-[12px] tracking-[0.06em] uppercase font-semibold mb-1" style={{ color: '#7A7570' }}>
              {brand}
            </p>
          )}
          <h3 className={`font-serif text-[19px] leading-[1.2] ${hasHover ? 'group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]' : ''}`}>
            {name}
          </h3>
          {price && (
            <p className="font-serif text-[16px] mt-1" style={{ color: '#1A1A1A' }}>
              {price}
              {priceSuffix && <span className="italic opacity-80">{priceSuffix}</span>}
            </p>
          )}
        </div>
      )}
    </>
  )

  const cls = `block text-left ${hasHover ? 'group' : ''} ${className}`

  if (!href) return <div className={cls}>{inner}</div>

  return external ? (
    <a href={href} target="_blank" rel={follow ? 'noopener' : 'sponsored noopener'} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}
