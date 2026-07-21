import ProductTile from '@/components/shared/ProductTile'
import { retailerFromUrl } from '@/lib/retailer'

interface Props {
  image: string
  name: string
  url: string
  price?: string
  brand?: string
  retailer?: string
  /** Lifestyle/model shot — fills the tile edge-to-edge. */
  cover?: boolean
  /** Which side the card floats to so body text wraps beside it. Alternate down a listicle. */
  side?: 'left' | 'right'
}

/**
 * A single product card inset into article body text — the same ProductTile used
 * everywhere, floated like <Portrait> so the product's description wraps beside it.
 * Used for "listicle" articles where each product has its own paragraph.
 */
export default function ProductInset({ image, name, url, price, brand, retailer, cover, side = 'left' }: Props) {
  const float = side === 'left' ? 'float-left mr-7 clear-left' : 'float-right ml-7 clear-right'
  const r = retailer ?? retailerFromUrl(url)
  return (
    <span className={`not-prose ${float} mb-5 w-[42%] max-w-[260px] block`}>
      <ProductTile
        href={url}
        external
        hideMeta
        cover={cover}
        primarySrc={image}
        primaryAlt={name}
        cornerLabel={r ? `shop via ${r} ↗` : 'shop ↗'}
        name={name}
      />
    </span>
  )
}
