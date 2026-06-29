import ProductTile from '@/components/shared/ProductTile'
import { retailerFromUrl } from '@/lib/retailer'

interface ShopItemProps {
  image: string
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
  /** Lifestyle/model shot — fills the tile edge-to-edge (no parchment frame). */
  cover?: boolean
}

/**
 * An affiliate / external product card inside an article. Renders the shared
 * ProductTile so it's visually identical to shop product cards — the only
 * difference is the affiliate cue and that it clicks out to the retailer with
 * no hover state.
 */
export function ShopItem({ image, name, price, url, handle, brand, retailer, cover }: ShopItemProps) {
  // Our own product → internal link + "In our shop". Otherwise affiliate/external.
  const internal = !!handle
  const href = internal ? `/shop/products/${handle}` : url
  const r = !internal && url ? (retailer ?? retailerFromUrl(url)) : ''
  const cornerLabel = internal
    ? 'In our shop'
    : url
      ? (r ? `shop via ${r} ↗` : 'shop ↗')
      : undefined
  return (
    <ProductTile
      href={href}
      external={!internal && !!url}
      cover={cover}
      primarySrc={image}
      primaryAlt={name}
      cornerLabel={cornerLabel}
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
