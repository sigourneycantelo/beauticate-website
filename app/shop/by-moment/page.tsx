import { getCollections } from '@/lib/shopify'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop by Moment | Beauticate',
  description: 'Curated beauty edits for every moment — from your morning ritual to the weekend away.',
}

export default async function ShopByMomentPage() {
  const collections = await getCollections(48)

  return (
    <div className="max-w-wide mx-auto px-4 py-12 md:py-16">

      <header className="mb-10 md:mb-14">
        <p className="label-editorial mb-2">Curated edits</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-4">Shop by Moment</h1>
        <p className="font-serif text-base text-charcoal/60 max-w-xl leading-relaxed">
          Not just what you need — but when and how you need it. Each collection is built around a
          real moment in your day, your week, your season.
        </p>
      </header>

      {collections.length === 0 ? (
        <p className="font-serif text-charcoal/50">Collections coming soon.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {collections.map(c => (
            <Link
              key={c.id}
              href={`/shop/collections/${c.handle}`}
              className="group relative aspect-[3/4] overflow-hidden bg-parchment block"
            >
              {c.image ? (
                <Image
                  src={c.image.url}
                  alt={c.image.altText ?? c.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-camel/30 to-parchment" />
              )}
              {/* Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-serif text-paper text-lg leading-tight">{c.title}</p>
                {c.description && (
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-paper/60 mt-1 line-clamp-1">
                    {c.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
