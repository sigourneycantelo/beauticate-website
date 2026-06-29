import ProductTile from '@/components/shared/ProductTile'
import { retailerFromUrl } from '@/lib/retailer'

interface ShopItemProps {
  image: string
  /** Combined brand + product name, e.g. "Maison Balzac Le Rêve Candle" */
  name: string
  price?: string
  url: string
  /** Optional uppercase brand line shown above the name, e.g. "Maison Balzac" */
  brand?: string
  /** Retailer for the "shop via {retailer}" cue. Auto-detected from the URL if omitted. */
  retailer?: string
  /** Lifestyle/model shot — fills the tile edge-to-edge (no parchment frame). */
  cover?: boolean
}

/**
 * An affiliate / external product card inside an article. Renders the shared
 * ProductTile so it's visually identical to shop product cards — the only
 * difference is the affiliate cue and that it clicks out to the retailer with
 * no hover state.
 */
export function ShopItem({ image, name, price, url, brand, retailer, cover }: ShopItemProps) {
  const r = retailer ?? retailerFromUrl(url)
  return (
    <ProductTile
      href={url}
      external
      cover={cover}
      primarySrc={image}
      primaryAlt={name}
      cornerLabel={r ? `shop via ${r} ↗` : 'shop ↗'}
      brand={brand}
      name={name}
      price={price}
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
