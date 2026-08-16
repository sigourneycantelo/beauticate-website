import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getCollectionFull } from '@/lib/shopify'
import { BROAD_CATEGORIES } from '@/lib/shop-taxonomy'
import CategoryBrowser, { type BrowsableProduct } from '@/components/shop/CategoryBrowser'
import CollectionHero from '@/components/shop/CollectionHero'

const SITE = 'https://www.beauticate.com'

export const metadata: Metadata = {
  title: 'Shop by Category | Beauticate Shop',
  description: 'Browse beauty, wellness and living essentials — curated by the editors and experts behind Beauticate.',
  alternates: { canonical: `${SITE}/shop/by-category` },
}

export default async function ShopByCategoryPage() {
  const liveCats = BROAD_CATEGORIES.filter(b => !b.comingSoon && b.handle)

  const collections = await Promise.all(
    liveCats.map(b => getCollectionFull(b.handle!))
  )

  const seen = new Set<string>()
  const products: BrowsableProduct[] = []
  const tiles = liveCats.map((cat, i) => {
    const col = collections[i]
    for (const p of col?.products?.nodes ?? []) {
      if (!seen.has(p.handle)) {
        seen.add(p.handle)
        products.push({ ...p, subSlugs: [cat.slug] })
      }
    }
    return {
      slug: cat.slug,
      label: cat.label,
      image: col?.image?.url,
      comingSoon: cat.comingSoon,
    }
  })

  const crumbs = [
    { name: 'Home', url: `${SITE}/` },
    { name: 'Shop', url: `${SITE}/shop` },
    { name: 'Shop by Category', url: `${SITE}/shop/by-category` },
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
        title="Shop by Category"
        description="Browse our complete edit — beauty, wellness and living, curated by the editors and experts behind Beauticate."
      />

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-8">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">Shop by Category</span>
        </nav>

        <Suspense fallback={null}>
          <CategoryBrowser
            products={products}
            subs={tiles}
            allImage={collections[0]?.image?.url}
          />
        </Suspense>
      </div>
    </div>
  )
}
