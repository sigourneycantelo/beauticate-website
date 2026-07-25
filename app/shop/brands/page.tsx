import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCollections, brandsFromCollections } from '@/lib/shopify'

const SITE = 'https://www.beauticate.com'

export const metadata: Metadata = {
  title: 'Shop by Brand',
  description: 'Every brand in the Beauticate edit — chosen on merit alone by our editorial team and founder Sigourney Cantelo.',
  alternates: { canonical: `${SITE}/shop/brands` },
}

export default async function ShopBrandsPage() {
  const collections = await getCollections(100)
  const imgByHandle = new Map<string, string>()
  for (const c of collections) {
    const url = c.image?.url ?? c.products?.nodes?.[0]?.featuredImage?.url
    if (url) imgByHandle.set(c.handle, url)
  }

  const brands = brandsFromCollections(collections)   // curated order first, then discovered brands

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SITE}/shop` },
      { '@type': 'ListItem', position: 3, name: 'Brands', item: `${SITE}/shop/brands` },
    ],
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="text-center max-w-wide mx-auto px-[clamp(20px,6vw,104px)] pt-[clamp(40px,6vw,80px)] pb-[clamp(4px,2vw,16px)]">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-charcoal-light/60">Shop</p>
        <h1 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1 }}>Shop by Brand</h1>
        <p className="font-serif mx-auto mt-4 max-w-[54ch] text-charcoal-light" style={{ fontSize: 'clamp(15px,1.5vw,18px)' }}>
          Every brand in the edit is chosen on merit alone — efficacy, values, and whether Sigourney would genuinely recommend it to a friend.
        </p>
      </header>

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-8">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">Brands</span>
        </nav>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map(b => {
            const img = imgByHandle.get(b.handle)
            return (
              <Link key={b.handle} href={`/shop/brands/${b.handle}`} className="group block text-center">
                <div className="relative aspect-square overflow-hidden bg-tile mb-3">
                  {img ? (
                    <Image src={img} alt={b.name} fill sizes="(max-width:768px) 50vw, 300px" className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-serif text-lg italic opacity-30 px-4">{b.name}</span>
                  )}
                </div>
                <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-ink group-hover:text-eucalypt transition-colors">{b.name}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
