import Link from 'next/link'
import { getCollectionByHandle } from '@/lib/shopify'
import ProductCard from '@/components/shop/ProductCard'

interface Props { handle: string; title?: string }

export default async function CollectionEmbed({ handle, title }: Props) {
  const collection = await getCollectionByHandle(handle)
  if (!collection) return null
  const products = collection.products?.edges?.slice(0, 4).map((e: any) => e.node) ?? []

  return (
    <div className="my-8 border-t border-b border-cream-200 py-8">
      <div className="flex justify-between items-baseline mb-6">
        <h3>{title ?? collection.title}</h3>
        <Link href={`/shop/collections/${handle}`} className="text-xs tracking-widest uppercase hover:text-gold">
          See all →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
