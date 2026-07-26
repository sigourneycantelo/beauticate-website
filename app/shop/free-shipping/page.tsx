import Link from 'next/link'
import { getCollectionFull } from '@/lib/shopify'
import ProductGrid from '@/components/shop/ProductGrid'
import CollectionHero from '@/components/shop/CollectionHero'
import type { Metadata } from 'next'
import type { ShopifyProduct } from '@/types/shopify'
import { SHOP_BRANDS, FREE_SHIPPING_VENDORS } from '@/lib/shop-taxonomy'

const SITE = 'https://www.beauticate.com'

export const metadata: Metadata = {
  title: 'Free Shipping | Beauticate Shop',
  description: 'Shop beauty, wellness and living essentials with free shipping from select Beauticate brands.',
  alternates: { canonical: `${SITE}/shop/free-shipping` },
  openGraph: {
    title: 'Free Shipping — Beauticate Shop',
    description: 'Shop beauty, wellness and living essentials with free shipping from select Beauticate brands.',
  },
}

const FREE_SHIP_HANDLES = SHOP_BRANDS
  .filter(b => FREE_SHIPPING_VENDORS.has(b.name))
  .map(b => b.handle)

export default async function FreeShippingPage() {
  const collections = await Promise.all(
    FREE_SHIP_HANDLES.map(h => getCollectionFull(h, 50))
  )
  const seen = new Set<string>()
  const buckets = new Map<string, ShopifyProduct[]>()
  const brandOrder: string[] = []
  for (const col of collections) {
    for (const p of col?.products?.nodes ?? []) {
      if (seen.has(p.handle)) continue
      seen.add(p.handle)
      const brand = (p.vendor ?? '').toLowerCase()
      if (!buckets.has(brand)) {
        buckets.set(brand, [])
        brandOrder.push(brand)
      }
      buckets.get(brand)!.push(p)
    }
  }
  const maxPerBrand = Math.max(...[...buckets.values()].map(b => b.length), 0)
  const products: ShopifyProduct[] = []
  for (let round = 0; round < maxPerBrand; round++) {
    for (const brand of brandOrder) {
      const bucket = buckets.get(brand)!
      if (round < bucket.length) products.push(bucket[round])
    }
  }

  const crumbs = [
    { name: 'Home', url: `${SITE}/` },
    { name: 'Shop', url: `${SITE}/shop` },
    { name: 'Free Shipping', url: `${SITE}/shop/free-shipping` },
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
        title="Free Shipping"
        description="Complimentary delivery on orders from these select brands — no minimum spend."
      />

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-5">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">Free Shipping</span>
        </nav>

        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light mb-6">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'}
        </p>

        <ProductGrid products={products} />
      </div>
    </div>
  )
}
