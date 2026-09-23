import ProductCard from './ProductCard'
import type { ShopifyProduct } from '@/types/shopify'
import type { Rating } from '@/lib/judgeme'

interface Props {
  products: ShopifyProduct[]
  /** Judge.me aggregates keyed by product handle, fetched once by the page (see
   *  getRatingMap) rather than per card. Absent ⇒ cards render without stars.
   *  This grid stays sync on purpose: CategoryBrowser is a client component and
   *  renders it, so it cannot be an async server component. */
  ratings?: Record<string, Rating>
}

export default function ProductGrid({ products, ratings }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(p => (
        <ProductCard key={p.id} product={p} rating={ratings?.[p.handle]} />
      ))}
    </div>
  )
}
