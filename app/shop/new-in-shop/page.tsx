import Link from 'next/link'
import { getNewArrivals } from '@/lib/shopify'
import ProductGrid from '@/components/shop/ProductGrid'
import CollectionHero from '@/components/shop/CollectionHero'
import type { Metadata } from 'next'

const SITE = 'https://www.beauticate.com'

export const metadata: Metadata = {
  title: 'New In Shop | Beauticate Shop',
  description: 'Our picks from the latest brands to join Beauticate shop — beauty, wellness and living essentials from the newest names in the edit.',
  alternates: { canonical: `${SITE}/shop/new-in-shop` },
  openGraph: {
    title: 'New In Shop — Beauticate Shop',
    description: 'Our picks from the latest brands to join Beauticate shop.',
  },
}

export const dynamic = 'force-dynamic'

export default async function NewInShopPage() {
  const products = await getNewArrivals(6, 4)

  const crumbs = [
    { name: 'Home', url: `${SITE}/` },
    { name: 'Shop', url: `${SITE}/shop` },
    { name: 'New In Shop', url: `${SITE}/shop/new-in-shop` },
  ]
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <CollectionHero
        image={null}
        eyebrow="Shop"
        title="New In Shop"
        description="Our picks from the latest brands to join Beauticate shop."
      />

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-5">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">New In Shop</span>
        </nav>

        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light mb-6">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'}
        </p>

        <ProductGrid products={products} />
      </div>
    </div>
  )
}
