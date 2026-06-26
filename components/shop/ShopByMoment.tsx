import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyCollection } from '@/types/shopify'

interface Props { collections: ShopifyCollection[] }

export default function ShopByMoment({ collections }: Props) {
  if (!collections.length) return null
  return (
    <section className="max-w-wide mx-auto px-4 py-12 md:py-16">
      <h2 className="text-center mb-2">Shop by Moment</h2>
      <p className="text-center text-charcoal-light text-sm mb-8 max-w-md mx-auto">
        Curated for how you actually live, not just what you need to buy.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {collections.map(c => (
          <Link key={c.id} href={`/shop/collections/${c.handle}`} className="group relative aspect-[3/4] overflow-hidden bg-cream-100 block">
            {c.image && (
              <Image src={c.image.url} alt={c.image.altText ?? c.title} fill
                className="object-cover transition-transform duration-500 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 text-cream font-serif text-lg leading-tight">
              {c.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
