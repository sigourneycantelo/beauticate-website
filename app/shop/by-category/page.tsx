import { getProductTypes, getProductsByType } from '@/lib/shopify'
import ProductCard from '@/components/shop/ProductCard'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop by Category | Beauticate',
  description: 'Browse the Beauticate edit by category — skincare, fragrance, hair, wellness and more.',
}

export default async function ShopByCategoryPage() {
  const types = await getProductTypes()

  // Fetch up to 8 products per type in parallel
  const sections = await Promise.all(
    types.map(async type => ({
      type,
      products: await getProductsByType(type, 8),
    }))
  )

  // Filter out empty sections
  const populated = sections.filter(s => s.products.length > 0)

  return (
    <div className="max-w-wide mx-auto px-4 py-12 md:py-16">

      <header className="mb-10 md:mb-14">
        <p className="label-editorial mb-2">Browse the edit</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-4">Shop by Category</h1>
        <p className="font-serif text-base text-charcoal/60 max-w-xl leading-relaxed">
          From morning skincare to evening fragrance — every category stocked with the same
          editorial rigour we apply to our content.
        </p>
      </header>

      {/* Jump links */}
      {populated.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-12">
          {populated.map(s => (
            <a
              key={s.type}
              href={`#${s.type.toLowerCase().replace(/\s+/g, '-')}`}
              className="font-sans text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-ink/20 text-charcoal/60 hover:border-ink hover:text-ink transition-colors"
            >
              {s.type}
            </a>
          ))}
        </div>
      )}

      {populated.length === 0 ? (
        <p className="font-serif text-charcoal/50 py-20 text-center">
          Products coming soon.
        </p>
      ) : (
        <div className="space-y-16 md:space-y-20">
          {populated.map(s => (
            <section
              key={s.type}
              id={s.type.toLowerCase().replace(/\s+/g, '-')}
              className="scroll-mt-4"
            >
              <div className="flex items-end justify-between mb-8">
                <h2 className="font-serif text-2xl md:text-3xl text-ink">{s.type}</h2>
                {s.products.length >= 8 && (
                  <Link
                    href={`/shop/category/${encodeURIComponent(s.type.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 hover:text-ink transition-colors"
                  >
                    View all →
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                {s.products.slice(0, 4).map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
