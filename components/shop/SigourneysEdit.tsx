import { getProductsByHandles } from '@/lib/shopify'
import ProductCard from './ProductCard'

// Product handles for Sigourney's permanent edit — update as needed
const SIGOURNEYS_PICKS = [
  'the-facial-blend',
  'agati',
]

export default async function SigourneysEdit() {
  const products = await getProductsByHandles(SIGOURNEYS_PICKS)
  return (
    <section className="max-w-wide mx-auto px-4 py-12 md:py-16 border-t border-cream-200">
      <div className="mb-8">
        <h2 className="mb-2">Sigourney's Edit</h2>
        <p className="text-charcoal-light text-sm max-w-md">The products I never run out of.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} showEditorial />)}
      </div>
    </section>
  )
}
