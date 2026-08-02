import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCollections } from '@/lib/shopify'
import { GIFTING_MOMENTS } from '@/lib/shop-taxonomy'

const SITE = 'https://www.beauticate.com'

export const metadata: Metadata = {
  title: 'Gifting | Shop',
  description: 'Beauticate gifting edits for every occasion and budget — from Best Friend Birthday to Little Luxuries under $50, Thoughtful Gestures under $100 and Luxe Lovers under $300.',
  alternates: { canonical: `${SITE}/shop/gifting` },
}

export default async function ShopGiftingPage() {
  const collections = await getCollections(100)
  const imgByHandle = new Map<string, string>()
  for (const c of collections) {
    const url = c.image?.url ?? c.products?.nodes?.[0]?.featuredImage?.url
    if (url) imgByHandle.set(c.handle, url)
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SITE}/shop` },
      { '@type': 'ListItem', position: 3, name: 'Gifting', item: `${SITE}/shop/gifting` },
    ],
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="text-center max-w-wide mx-auto px-[clamp(20px,6vw,104px)] pt-[clamp(40px,6vw,80px)] pb-[clamp(4px,2vw,16px)]">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-charcoal-light/60">Shop</p>
        <h1 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1 }}>Gifting</h1>
        <p className="font-serif mx-auto mt-4 max-w-[54ch] text-charcoal-light" style={{ fontSize: 'clamp(15px,1.5vw,18px)' }}>
          Curated gift edits for every occasion and every budget — thoughtfully chosen, beautifully received.
        </p>
      </header>

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-8">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">Gifting</span>
        </nav>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GIFTING_MOMENTS.map(m => {
            const img = imgByHandle.get(m.handle)
            return (
              <Link key={m.handle} href={`/shop/collections/${m.handle}`} className="group block">
                <div className="relative aspect-square overflow-hidden bg-tile mb-3">
                  {img ? (
                    <Image src={img} alt={m.name} fill sizes="(max-width:768px) 100vw, 420px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-serif text-lg italic opacity-30 px-4 text-center">{m.name}</span>
                  )}
                </div>
                <p className="font-serif text-[20px] leading-tight group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]">{m.name}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
