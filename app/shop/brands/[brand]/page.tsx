import { getCollectionByHandle } from '@/lib/shopify'
import ProductGrid from '@/components/shop/ProductGrid'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ brand: string }> }

export default async function BrandPage({ params }: Props) {
  const { brand } = await params
  const collection = await getCollectionByHandle(brand)
  if (!collection) notFound()

  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <h1 className="mb-4">{collection.title}</h1>
      <ProductGrid products={collection.products.nodes} />
    </div>
  )
}
