import ProductTile from '@/components/shared/ProductTile'
import { retailerFromUrl } from '@/lib/retailer'

interface Props {
  image: string
  name: string
  url: string
  price?: string
  brand?: string
  retailer?: string
  cover?: boolean
  side?: 'left' | 'right'
  inline?: boolean
}

/**
 * A single product card inset into article body text — the same ProductTile used
 * everywhere, floated like <Portrait> so the product's description wraps beside it.
 * Used for "listicle" articles where each product has its own paragraph.
 */
export default function ProductInset({ image, name, url, price, brand, retailer, cover, side = 'left' }: Props) {
  const float = side === 'left' ? 'sm:float-left sm:mr-7 sm:clear-left' : 'sm:float-right sm:ml-7 sm:clear-right'
  const r = retailer ?? retailerFromUrl(url)
  return (
    <span className={`not-prose ${float} mb-5 w-full sm:w-[42%] max-w-[260px] block mx-auto sm:mx-0`}>
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
    </span>
  )
}
