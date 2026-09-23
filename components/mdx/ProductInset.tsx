import ProductTile from '@/components/shared/ProductTile'
import { retailerFromUrl } from '@/lib/retailer'
import { intlAttrsFor } from '@/lib/product-links'

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
export default function ProductInset({ image, name, url, price, brand, retailer, cover, side = 'left', inline }: Props) {
  const r = retailer ?? retailerFromUrl(url)

  const tile = (
    <ProductTile
      href={url}
      external
      dataAttrs={intlAttrsFor(url, name)}
      cover={cover}
      primarySrc={image}
      primaryAlt={name}
      cornerLabel="shop from brand"
      brand={brand}
      name={name}
      price={price}
    />
  )

  if (inline) return tile

  const float = side === 'left' ? 'sm:float-left sm:mr-7 sm:clear-left' : 'sm:float-right sm:ml-7 sm:clear-right'
  return (
    <span className={`not-prose ${float} mb-5 w-full sm:w-[42%] max-w-[260px] block mx-auto sm:mx-0`}>
      {tile}
    </span>
  )
}
