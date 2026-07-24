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

export default function ProductInset({ image, name, url, price, brand, retailer, cover, side = 'left', inline }: Props) {
  const float = inline ? '' : (side === 'left' ? 'float-left mr-7 clear-left' : 'float-right ml-7 clear-right')
  const width = inline ? 'w-full' : 'w-[42%] max-w-[260px]'
  const r = retailer ?? retailerFromUrl(url)
  return (
    <span className={`not-prose ${float} mb-5 ${width} block`}>
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
