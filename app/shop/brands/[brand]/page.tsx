import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBrandCollection } from '@/lib/shopify'
import ProductGrid from '@/components/shop/ProductGrid'
import SortSelect from '@/components/shop/SortSelect'
import { sortProducts } from '@/lib/product-sort'
import CollectionHero from '@/components/shop/CollectionHero'
import { BRAND_HEROES } from '@/data/brand-heroes'
import { SHOP_FOUNDERS } from '@/data/shop-founders'
import { brandEpisode } from '@/data/brand-episodes'
import { resolveArticleEpisode } from '@/lib/content'
import EpisodeStrip from '@/components/vodcast/EpisodeStrip'

const SITE = 'https://www.beauticate.com'

interface Props {
  params: Promise<{ brand: string }>
  searchParams: Promise<{ sort?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params
  const collection = await getBrandCollection(brand)
  if (!collection) return {}
  const desc = (collection.description?.slice(0, 160)) || `Shop ${collection.title} at Beauticate — curated by our editorial team and founder Sigourney Cantelo.`
  return {
    title: `${collection.title} | Shop`,
    description: desc,
    alternates: { canonical: `${SITE}/shop/brands/${brand}` },
    openGraph: { title: collection.title, description: desc, images: collection.image ? [collection.image.url] : [] },
  }
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { brand } = await params
  const { sort } = await searchParams
  const collection = await getBrandCollection(brand)
  if (!collection) notFound()

  const products = sortProducts(collection.products.nodes, sort)

  // The founder interview, where there is one. Many of these brands are in the
  // shop *because* of the conversation, and the brand page never said so.
  const be = brandEpisode(brand)
  const episode = be
    ? resolveArticleEpisode({ podcast_episode: be.episode, podcast_heading: be.heading, podcast_strip: 'compact' })
    : null
  const crumbs = [
    { name: 'Home', url: `${SITE}/` },
    { name: 'Shop', url: `${SITE}/shop` },
    { name: 'Brands', url: `${SITE}/shop/brands` },
    { name: collection.title, url: `${SITE}/shop/brands/${brand}` },
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
      '@type': 'ListItem', position: i + 1, url: `${SITE}/shop/products/${p.handle}`, name: p.title,
    })),
  }
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <CollectionHero
        image={BRAND_HEROES[brand] ? { url: BRAND_HEROES[brand], altText: collection.title } : collection.image}
        eyebrow="Brand"
        title={collection.title}
        description={collection.description}
        founder={(() => {
          const f = SHOP_FOUNDERS.find(f => {
            const h = f.href.replace('/shop/brands/', '')
            return h === brand || `${h}-1` === brand || h === brand.replace(/-1$/, '')
          })
          return f ? { name: f.name, image: f.image, brand: f.brand } : undefined
        })()}
      />

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-5">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop/brands" className="hover:text-ink transition-colors">Brands</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">{collection.title}</span>
        </nav>

        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light">
            {products.length} {products.length === 1 ? 'piece' : 'pieces'}
          </p>
          {products.length > 1 && <SortSelect />}
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="font-serif text-charcoal-light/60 py-16 text-center">Nothing in this edit just yet.</p>
        )}

        {/* The founder interview sits under the products, not above them. At the
            top of a phone screen it read as an ad you had to scroll past to
            reach the thing you came for. */}
        {episode && (
          <div className="mt-[clamp(32px,5vw,64px)]">
            <EpisodeStrip {...episode} />
          </div>
        )}
      </div>
    </div>
  )
}
