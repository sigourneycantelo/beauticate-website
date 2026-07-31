import Link from 'next/link'
import type { Metadata } from 'next'
import CollectionHero from '@/components/shop/CollectionHero'
import ProductTile from '@/components/shared/ProductTile'
import { WINTER_EDIT_PRODUCTS } from '@/lib/winter-edit-products'
import { retailerFromUrl } from '@/lib/retailer'

const SITE = 'https://www.beauticate.com'
const TITLE = 'The Winter Edit'
const DESCRIPTION =
  'Everything the Beauticate team is buying for winter, shoppable in one place — the coats, creams, candles and fragrances from our editors and experts.'
const ARTICLE = '/beauty-style/fragrance/beauticate-team-winter-edit'

// This is a LOCAL, code-managed collection (not a Shopify collection) so it can hold
// affiliate products alongside our own shop products — mirroring the team edit article.
// Our shop items (handle) link to their PDP; affiliate items open out to the brand.

export const metadata: Metadata = {
  title: `${TITLE} | Beauticate Shop`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}/shop/collections/winter-edit` },
  openGraph: { title: TITLE, description: DESCRIPTION },
}

export default function WinterEditCollectionPage() {
  const products = WINTER_EDIT_PRODUCTS

  const crumbs = [
    { name: 'Home', url: `${SITE}/` },
    { name: 'Shop', url: `${SITE}/shop` },
    { name: TITLE, url: `${SITE}/shop/collections/winter-edit` },
  ]
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  }
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITLE,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      ...(p.handle ? { url: `${SITE}/shop/products/${p.handle}` } : p.url ? { url: p.url } : {}),
    })),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <CollectionHero eyebrow="Shop" title={TITLE} description={DESCRIPTION} />

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-5">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">{TITLE}</span>
        </nav>

        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light">
            {products.length} pieces
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
          {products.map(p => {
            const internal = !!p.handle
            const href = internal ? `/shop/products/${p.handle}` : p.url
            const detected = !internal && p.url ? (p.retailer ?? retailerFromUrl(p.url)) : ''
            return (
              <ProductTile
                key={p.name}
                href={href}
                external={!internal && !!p.url}
                useNextImage
                primarySrc={p.image}
                primaryAlt={p.name}
                brand={p.brand}
                name={p.name}
                price={p.price}
                cornerLabel={!internal && p.url ? 'shop from brand' : undefined}
                cover={p.cover ?? false}
                badge={detected ? `via ${detected}` : undefined}
              />
            )
          })}
        </div>

        <div className="mt-[clamp(40px,6vw,80px)] text-center">
          <Link
            href={ARTICLE}
            className="font-sans text-[11px] tracking-[0.22em] uppercase text-charcoal-light hover:text-ink transition-colors"
          >
            Read the edit →
          </Link>
        </div>
      </div>
    </div>
  )
}
