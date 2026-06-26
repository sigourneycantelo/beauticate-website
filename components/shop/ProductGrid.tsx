import ProductCard from './ProductCard'
import type { ShopifyProduct } from '@/types/shopify'

interface Props { products: ShopifyProduct[] }

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
