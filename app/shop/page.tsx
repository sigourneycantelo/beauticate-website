import { getCollections } from '@/lib/shopify'
import ShopHero from '@/components/shop/ShopHero'
import TrustBand from '@/components/shop/TrustBand'
import FounderIntro from '@/components/shop/FounderIntro'
import ShopByMoment from '@/components/shop/ShopByMoment'
import Collective from '@/components/shop/Collective'
import SigourneysEdit from '@/components/shop/SigourneysEdit'
import ShopCategoryGrid from '@/components/shop/ShopCategoryGrid'
import ShopNewsletter from '@/components/shop/ShopNewsletter'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Essentials for a beautiful life. Curated by the editors and experts of Beauticate.',
}

export default async function ShopPage() {
  const collections = await getCollections(24)
  return (
    <div>
      {/* 1. Video hero */}
      <ShopHero />
      {/* 2. Trust band */}
      <TrustBand />
      {/* 3. Founder introduction */}
      <FounderIntro />
      {/* 4. Shop by Moment */}
      <ShopByMoment collections={collections} />
      {/* 5. Meet the Collective */}
      <Collective />
      {/* 6 + 7. Press strip, Sigourney's Edit header and product grid */}
      <SigourneysEdit />
      {/* 8. Shop by Category */}
      <ShopCategoryGrid />
      {/* 9. Newsletter */}
      <ShopNewsletter />
    </div>
  )
}
