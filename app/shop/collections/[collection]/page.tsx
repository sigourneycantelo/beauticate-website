import Image from 'next/image'
import Link from 'next/link'
import { getCollectionByHandle } from '@/lib/shopify'
import { getArticlesByCategory } from '@/lib/content'
import ProductGrid from '@/components/shop/ProductGrid'
import ArticleGrid from '@/components/article/ArticleGrid'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const SITE = 'https://www.beauticate.com'

interface Props { params: Promise<{ collection: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection: handle } = await params
  const collection = await getCollectionByHandle(handle)
  if (!collection) return {}
  const desc = (collection.description?.slice(0, 160)) || `Shop the ${collection.title} edit — curated by the editors and experts of Beauticate.`
  return {
    title: `${collection.title} | Beauticate Shop`,
    description: desc,
    alternates: { canonical: `${SITE}/shop/collections/${handle}` },
    openGraph: { title: collection.title, description: desc, images: collection.image ? [collection.image.url] : [] },
  }
}

export default async function CollectionPage({ params }: Props) {
  const { collection: handle } = await params
  const collection = await getCollectionByHandle(handle)
  if (!collection) notFound()

  const products = collection.products.nodes
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
  const minH = 'clamp(240px,34vw,420px)'

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {collection.image ? (
        <section className="relative w-full overflow-hidden" style={{ minHeight: minH }}>
          <Image src={collection.image.url} alt={collection.image.altText ?? collection.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.42))' }} />
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6" style={{ minHeight: minH }}>
            <h1 className="font-serif font-normal text-paper" style={{ fontSize: 'clamp(34px,5vw,60px)', letterSpacing: '0.04em' }}>{collection.title}</h1>
            {collection.description && (
              <p className="font-sans text-paper/90 mt-3 max-w-[52ch]" style={{ fontSize: 'clamp(13px,1.4vw,15px)', lineHeight: 1.6 }}>{collection.description}</p>
            )}
          </div>
        </section>
      ) : (
        <header className="text-center max-w-wide mx-auto px-[clamp(20px,6vw,104px)] pt-[clamp(40px,6vw,80px)] pb-[clamp(4px,2vw,16px)]">
          <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-charcoal-light/60">Shop</p>
          <h1 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1 }}>{collection.title}</h1>
          {collection.description && (
            <p className="font-serif mx-auto mt-4 max-w-[54ch]" style={{ fontSize: 'clamp(15px,1.5vw,18px)', opacity: 0.7 }}>{collection.description}</p>
          )}
        </header>
      )}

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-5">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">{collection.title}</span>
        </nav>

        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light mb-6">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'}
        </p>

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
