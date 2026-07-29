import Link from 'next/link'
import { getCollectionByHandle } from '@/lib/shopify'
import ProductRail from '@/components/shared/ProductRail'

// Sigourney's permanent edit is the "Editor's Essentials" Shopify collection.
const EDIT_HANDLE = 'editors-essentials'

export default async function SigourneysEdit() {
  const collection = await getCollectionByHandle(EDIT_HANDLE)
  const products = (collection?.products.nodes ?? []).slice(0, 16)
  if (!products.length) return null

  return (
    <div className="pb-[clamp(24px,4vw,56px)]">
      <ProductRail
        products={products}
        rows={1}
        eyebrow="Sigourney's Edit"
        heading={<>The products I never <em className="italic">run out of</em></>}
        description="Across beauty, wellness, and the rituals in between. The things I always come back to."
        cta={{ label: 'Shop the edit', href: '/shop/collections/editors-essentials' }}
      />

      <p className="text-center font-serif text-charcoal-light/60 mt-4" style={{ fontSize: 'clamp(14px,1.4vw,16px)' }}>
        <Link href="/shop/suggest" className="text-wine hover:text-wine/70 transition-colors">
          Tell us what we should be stocking
        </Link>
      </p>
    </div>
  )
}
