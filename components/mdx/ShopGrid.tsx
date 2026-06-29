// Heart icon — inline so there's no icon-library dependency.
// Kept identical to ProductEmbed / ProductCard so every card matches.
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
      <path d="M12 21s-7-4.6-9.3-9C1.2 9 2.3 5.8 5.4 5.2 7.3 4.8 9 6 12 8.5 15 6 16.7 4.8 18.6 5.2c3.1.6 4.2 3.8 2.7 6.8C19 16.4 12 21 12 21z" />
    </svg>
  )
}

interface ShopItemProps {
  image: string
  /** Combined brand + product name, e.g. "Maison Balzac Le Rêve Candle" */
  name: string
  price?: string
  url: string
  /** Optional uppercase brand line shown above the name, e.g. "Maison Balzac" */
  brand?: string
  /** Optional retailer for the affiliate cue, e.g. "Mecca" → "at Mecca ↗" */
  retailer?: string
}

/**
 * An affiliate / external product card. Visually identical to the in-shop
 * ProductCard and ProductEmbed (the locked "buttonless" design) — beige tile,
 * deep-etched image, brand / name / price, no Add-to-Bag button. The whole card
 * links out. The only difference from a shop card is the affiliate cue: a
 * retailer label top-left and a "↗ at {retailer}" on the price line, making it
 * clear the reader is clicking off-site.
 */
export function ShopItem({ image, name, price, url, brand, retailer }: ShopItemProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group block text-center"
    >
      {/* Tile */}
      <div className="relative aspect-square bg-[#EEE9E1] rounded-sm overflow-hidden flex items-center justify-center mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="w-[64%] h-auto transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Affiliate cue — names the retailer when known, otherwise a quiet outbound arrow */}
        <span className="absolute top-2.5 left-3 font-sans text-[8.5px] tracking-[0.16em] uppercase font-semibold opacity-50">
          {retailer ? `at ${retailer} ↗` : 'Shop ↗'}
        </span>

        {/* Wishlist heart */}
        <span className="absolute top-2.5 right-3 w-[19px] h-[19px] text-ink opacity-55">
          <HeartIcon />
        </span>
      </div>

      {/* Meta */}
      {brand && (
        <p className="font-sans text-[10px] tracking-[0.22em] uppercase font-semibold opacity-60">
          {brand}
        </p>
      )}
      <h3 className="font-serif text-lg leading-[1.16] mt-0.5 mb-0.5 group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]">
        {name}
      </h3>
      {price && (
        <p className="font-serif text-base">
          {price}
          {retailer && <span className="text-[13px] opacity-60 italic"> at {retailer}</span>}
        </p>
      )}
    </a>
  )
}

interface ShopGridProps {
  children: React.ReactNode
}

export function ShopGrid({ children }: ShopGridProps) {
  return (
    <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-[clamp(14px,2vw,26px)] my-8">
      {children}
    </div>
  )
}
