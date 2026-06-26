import Link from 'next/link'
import { getCollectionByHandle } from '@/lib/shopify'
import ProductCard from './ProductCard'

// Sigourney's permanent edit is the "Editor's Essentials" Shopify collection.
const EDIT_HANDLE = 'editors-essentials'

export default async function SigourneysEdit() {
  const collection = await getCollectionByHandle(EDIT_HANDLE)
  const products = (collection?.products.nodes ?? []).slice(0, 8)
  if (!products.length) return null

  return (
    <section className="max-w-wide mx-auto px-[clamp(20px,6vw,104px)] py-[clamp(48px,7vw,90px)] border-t border-cream-200">
      {/* Press strip */}
      <p className="text-center font-sans" style={{ fontSize: '10.5px', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.5 }}>
        As featured in Vogue, Marie Claire, The Daily Telegraph, Daily Mail, Body+Soul and Mumbrella
      </p>

      {/* Edit header */}
      <div className="text-center mt-10 mb-9">
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/shop/collections/editors-essentials"
          className="inline-block font-sans text-ink"
          style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: '1px solid currentColor', paddingBottom: '2px' }}
        >
          Shop the edit
        </Link>
      </div>
    </section>
  )
}
