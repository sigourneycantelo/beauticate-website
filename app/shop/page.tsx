import { getCollections } from '@/lib/shopify'
import ShopByMoment from '@/components/shop/ShopByMoment'
import BrandGrid from '@/components/shop/BrandGrid'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Curated beauty, wellness and lifestyle — recommended by the editors and experts of Beauticate.',
}

export default async function ShopPage() {
  const collections = await getCollections(24)
  return (
    <div>
      <ShopByMoment collections={collections} />
      <BrandGrid />
    </div>
  )
}
