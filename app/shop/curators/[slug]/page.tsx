import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCuratorCollections, getCuratorBySlug } from '@/lib/curator-collections'
import { getProductsByHandles } from '@/lib/shopify'
import type { ShopifyProduct } from '@/types/shopify'
import CollectionHero from '@/components/shop/CollectionHero'
import ProductEmbed from '@/components/mdx/ProductEmbed'

const SITE = 'https://www.beauticate.com'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getCuratorCollections().map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const curator = getCuratorBySlug(slug)
  if (!curator) return {}
  const title = `${curator.name}'s Favourites`
  const desc = `Every product ${curator.name} has recommended on Beauticate, in one place — ${curator.productCount} pieces chosen by our ${curator.role.toLowerCase()}.`
  return {
    title: `${title} | Beauticate Shop`,
    description: desc,
    alternates: { canonical: `${SITE}/shop/curators/${curator.slug}` },
    openGraph: { title, description: desc, images: curator.photo ? [curator.photo] : [] },
  }
}

export default async function CuratorPage({ params }: Props) {
  const { slug } = await params
  const curator = getCuratorBySlug(slug)
  if (!curator) notFound()

  const shopHandles = curator.products
    .filter(p => p.type === 'shop' && p.handle)
    .map(p => p.handle as string)
  const shopProducts = shopHandles.length ? await getProductsByHandles(shopHandles) : []
  const shopMap: Record<string, ShopifyProduct> = Object.fromEntries(
    shopProducts.map(p => [p.handle, p]),
  )

  const title = `${curator.name}'s Favourites`

  // The stories these picks came from, newest first, deduped.
  const stories = [...new Map(
    curator.products.map(p => [p.sourceUrl, { url: p.sourceUrl, title: p.sourceTitle, date: p.sourceDate }]),
  ).values()].sort((a, b) => b.date.localeCompare(a.date))

  const crumbs = [
    { name: 'Home', url: `${SITE}/` },
    { name: 'Shop', url: `${SITE}/shop` },
    { name: 'Shop by Curator', url: `${SITE}/shop/by-curator` },
    { name: title, url: `${SITE}/shop/curators/${curator.slug}` },
  ]
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  }
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    numberOfItems: curator.products.length,
    itemListElement: curator.products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      // Prefer the live Shopify title. Frontmatter product_links often carry
      // only a handle, and the handle-derived fallback ("Excellent Bb Cream 1")
      // should never be what search engines read.
      name: (p.type === 'shop' && p.handle ? shopMap[p.handle]?.title : undefined) ?? p.name,
      ...(p.type === 'shop' && p.handle
        ? { url: `${SITE}/shop/products/${p.handle}` }
        : p.url
          ? { url: p.url }
          : {}),
    })),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <CollectionHero
        image={curator.photo ? { url: curator.photo, altText: curator.name } : null}
        eyebrow="Shop by Curator"
        title={title}
        description={curator.bio}
      />

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-5">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop/by-curator" className="hover:text-ink transition-colors">Shop by Curator</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">{title}</span>
        </nav>

        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light">
            {curator.productCount} {curator.productCount === 1 ? 'piece' : 'pieces'} · {curator.role}
          </p>
          {curator.instagram && (
            <a
              href={curator.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine hover:text-wine/70 transition-colors"
            >
              Follow →
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 [&>div]:my-0">
          {curator.products.map((p, i) => (
            <ProductEmbed
              key={i}
              product={p}
              shopProduct={p.type === 'shop' && p.handle ? shopMap[p.handle] : undefined}
            />
          ))}
        </div>

        <p className="mt-8 font-sans text-[11px] text-charcoal-light">Some links are affiliate links.</p>

        {stories.length > 0 && (
          <section className="mt-[clamp(48px,7vw,96px)] text-center">
            <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-eucalypt font-semibold mb-4">
              {stories.length === 1 ? 'From the story' : 'From the stories'}
            </p>
            <div className="flex flex-col gap-3">
              {stories.map(s => (
                <Link
                  key={s.url}
                  href={s.url}
                  className="font-serif text-[20px] italic underline [text-decoration-thickness:0.5px] [text-underline-offset:3px] hover:text-wine transition-colors"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
