import Link from 'next/link'
import { getCollectionByHandle } from '@/lib/shopify'
import { getArticlesByCategory } from '@/lib/content'
import ProductGrid from '@/components/shop/ProductGrid'
import SortSelect from '@/components/shop/SortSelect'
import { sortProducts } from '@/lib/product-sort'
import ArticleGrid from '@/components/article/ArticleGrid'
import CollectionHero from '@/components/shop/CollectionHero'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const SITE = 'https://www.beauticate.com'

interface Props {
  params: Promise<{ collection: string }>
  searchParams: Promise<{ sort?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection: handle } = await params
  const collection = await getCollectionByHandle(handle)
  if (!collection) return {}
  const desc = (collection.description?.slice(0, 160)) || `Shop the ${collection.title} edit — curated by the editors and experts of Beauticate.`
  return {
    title: `${collection.title} | Shop`,
    description: desc,
    alternates: { canonical: `${SITE}/shop/collections/${handle}` },
    openGraph: { title: collection.title, description: desc, images: collection.image ? [collection.image.url] : [] },
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { collection: handle } = await params
  const { sort } = await searchParams
  const collection = await getCollectionByHandle(handle)
  if (!collection) notFound()

  const products = sortProducts(collection.products.nodes, sort)
  const relatedArticles = getArticlesByCategory('sigourneys-edit').slice(0, 3)

  const crumbs = [
    { name: 'Home', url: `${SITE}/` },
    { name: 'Shop', url: `${SITE}/shop` },
    { name: collection.title, url: `${SITE}/shop/collections/${handle}` },
  ]
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  }
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: collection.title,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/shop/products/${p.handle}`,
      name: p.title,
    })),
  }
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <CollectionHero image={collection.image} eyebrow="Shop" title={collection.title} description={collection.description} />

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-5">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">{collection.title}</span>
        </nav>

        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light">
            {products.length} {products.length === 1 ? 'piece' : 'pieces'}
          </p>
          {products.length > 1 && <SortSelect />}
        </div>

        <ProductGrid products={products} />

        {relatedArticles.length > 0 && (
          <section className="mt-[clamp(48px,7vw,96px)]">
            <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-eucalypt font-semibold text-center mb-8">From the edit</p>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ArticleGrid articles={relatedArticles as any} />
          </section>
        )}
      </div>
    </div>
  )
}
