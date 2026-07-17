import Link from 'next/link'
import { getCollectionByHandle } from '@/lib/shopify'
import EditCarousel from './EditCarousel'

// Sigourney's permanent edit is the "Editor's Essentials" Shopify collection.
const EDIT_HANDLE = 'editors-essentials'

export default async function SigourneysEdit() {
  const collection = await getCollectionByHandle(EDIT_HANDLE)
  const products = (collection?.products.nodes ?? []).slice(0, 16)
  if (!products.length) return null

  return (
    <section className="max-w-wide mx-auto px-[clamp(20px,6vw,104px)] pt-[clamp(24px,3vw,40px)] pb-[clamp(48px,7vw,90px)]">
      {/* Edit header */}
      <div className="text-center mb-9">
        <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase', opacity: 0.55 }}>
          Sigourney's Edit
        </p>
        <h2 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(24px,3vw,38px)' }}>
          The products I never <em className="italic">run out of</em>
        </h2>
        <p className="font-serif mx-auto mt-3 max-w-[46ch]" style={{ fontSize: 'clamp(15px,1.5vw,18px)', opacity: 0.7 }}>
          Across beauty, wellness, and the rituals in between. The things I always come back to.
        </p>
      </div>

      <EditCarousel products={products} />

      <div className="text-center mt-10 space-y-4">
        <Link
          href="/shop/collections/editors-essentials"
          className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase border border-ink px-7 py-3 rounded-[1px] hover:bg-ink hover:text-white transition-colors duration-300"
        >
          Shop the edit
        </Link>
        <p className="font-serif text-charcoal-light/60" style={{ fontSize: 'clamp(14px,1.4vw,16px)' }}>
          <Link href="/shop/suggest" className="text-wine hover:text-wine/70 transition-colors">
            Tell us what we should be stocking
          </Link>
        </p>
      </div>
    </section>
  )
}
