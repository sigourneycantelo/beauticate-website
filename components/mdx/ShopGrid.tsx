import ProductTile from '@/components/shared/ProductTile'

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
 * An affiliate / external product card inside an article. Renders the shared
 * ProductTile so it's visually identical to shop product cards — the only
 * difference is the affiliate cue and that it clicks out to the retailer with
 * no hover state.
 */
export function ShopItem({ image, name, price, url, brand, retailer }: ShopItemProps) {
  return (
    <ProductTile
      href={url}
      external
      primarySrc={image}
      primaryAlt={name}
      cornerLabel={retailer ? `at ${retailer} ↗` : 'Shop ↗'}
      brand={brand}
      name={name}
      price={price}
      priceSuffix={retailer ? ` at ${retailer}` : undefined}
    />
  )
}

interface ShopGridProps {
  children: React.ReactNode
}

/** "Shop the look" strip — three across, like the WordPress originals. */
export function ShopGrid({ children }: ShopGridProps) {
  return (
    <div className="not-prose grid grid-cols-2 md:grid-cols-3 gap-[clamp(16px,2.5vw,32px)] my-10">
      {children}
    </div>
  )
}
