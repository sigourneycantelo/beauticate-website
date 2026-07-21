import { Children } from 'react'
import Link from 'next/link'
import ProductTile from '@/components/shared/ProductTile'
import { retailerFromUrl } from '@/lib/retailer'

interface ShopItemProps {
  image: string
  /** Image alt text. Falls back to the product name when omitted. */
  alt?: string
  /** Combined brand + product name, e.g. "Maison Balzac Le Rêve Candle" */
  name: string
  price?: string
  /** Affiliate/retailer link. Omit for a product with no link yet — card is un-clickable. */
  url?: string
  /** Shopify product handle — when set, this is OUR product: "In our shop", links to the product page. */
  handle?: string
  /** Optional uppercase brand line shown above the name, e.g. "Maison Balzac" */
  brand?: string
  /** Retailer for the "shop via {retailer}" cue. Auto-detected from the URL if omitted. */
  retailer?: string
  /** First-party store link (e.g. our own beauticate.shop) — rendered as a normal followed link, not sponsored. */
  follow?: boolean
  /** Lifestyle/model shot — fills the tile edge-to-edge (no parchment frame). */
  cover?: boolean
}

/**
 * An affiliate / external product card inside an article. Renders the shared
 * ProductTile so it's visually identical to shop product cards — the only
 * difference is the affiliate cue and that it clicks out to the retailer with
 * no hover state.
 */
export function ShopItem({ image, alt, name, price, url, handle, brand, retailer, follow, cover }: ShopItemProps) {
  const internal = !!handle
  const href = internal ? `/shop/products/${handle}` : url
  const detected = !internal && url ? (retailer ?? retailerFromUrl(url)) : ''
  const r = detected || brand || ''
  const cornerLabel = internal
    ? 'In our shop'
    : url
      ? (r ? `shop via ${r} ↗` : 'shop ↗')
      : undefined
  return (
    <ProductTile
      href={href}
      external={!internal && !!url}
      follow={follow}
      cover={cover}
      primarySrc={image}
      primaryAlt={alt ?? name}
      cornerLabel={cornerLabel}
      brand={brand}
      name={name}
      price={price}
    />
  )
}

interface ShopCTAProps {
  label: string
  href: string
}

export function ShopCTA({ label, href }: ShopCTAProps) {
  return (
    <Link href={href} className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-tile flex items-center justify-center px-6">
        <p className="font-serif italic text-center text-[clamp(18px,1.8vw,24px)] leading-[1.4] text-charcoal group-hover:text-wine transition-colors">
          {label}
        </p>
      </div>
      <div className="bg-white pt-3 pb-4 px-2 text-center">
        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal/60 group-hover:text-wine transition-colors">
          Shop the collection →
        </p>
      </div>
    </Link>
  )
}

interface ShopGridProps {
  children: React.ReactNode
}

export function ShopGrid({ children }: ShopGridProps) {
  const count = Children.count(children)
  const cols = Math.min(count, 3)

  if (cols === 1) {
    return (
      <div className="not-prose my-10 flex justify-center">
        <div style={{ maxWidth: '420px', width: '100%' }}>
          {children}
        </div>
      </div>
    )
  }

  const is3up = cols === 3

  return (
    <div className={`not-prose my-10 ${is3up ? '-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 sm:overflow-visible snap-x snap-mandatory sm:snap-none' : ''}`}>
      <div
        className={is3up ? 'flex gap-4 sm:grid sm:grid-cols-3 sm:gap-4' : 'grid gap-5'}
        style={is3up ? undefined : { gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {is3up
          ? Children.map(children, (child) => (
              <div className="flex-none w-[70vw] snap-start sm:w-auto sm:flex-auto">
                {child}
              </div>
            ))
          : children}
      </div>
    </div>
  )
}
