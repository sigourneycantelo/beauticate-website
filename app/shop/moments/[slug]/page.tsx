import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticleMoments, getArticleMomentBySlug } from '@/lib/article-moments'
import { getProductsByHandles } from '@/lib/shopify'
import type { ShopifyProduct } from '@/types/shopify'
import CollectionHero from '@/components/shop/CollectionHero'
import ProductEmbed from '@/components/mdx/ProductEmbed'

// Shopify data on this page is baked at build time by generateStaticParams, so
// without this it stays frozen until someone redeploys — a product that gets
// archived, relisted, restocked or repriced shows stale indefinitely. 300s
// matches the revalidate already used on the Shopify fetches in lib/shopify.ts.
export const revalidate = 300

const SITE = 'https://www.beauticate.com'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getArticleMoments().map(m => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const moment = getArticleMomentBySlug(slug)
  if (!moment) return {}
  const desc =
    moment.excerpt?.slice(0, 160) ||
    `Shop every piece from ${moment.articleTitle} — the full edit, curated by Beauticate.`
  return {
    title: `${moment.title} | Beauticate Shop`,
    description: desc,
    alternates: { canonical: `${SITE}/shop/moments/${moment.slug}` },
    openGraph: { title: moment.title, description: desc, images: moment.image ? [moment.image] : [] },
  }
}

export default async function MomentPage({ params }: Props) {
  const { slug } = await params
  const moment = getArticleMomentBySlug(slug)
  if (!moment) notFound()

  const shopHandles = moment.products
    .filter(p => p.type === 'shop' && p.handle)
    .map(p => p.handle as string)
  const shopProducts = shopHandles.length ? await getProductsByHandles(shopHandles) : []
  const shopMap: Record<string, ShopifyProduct> = Object.fromEntries(
    shopProducts.map(p => [p.handle, p]),
  )

  const crumbs = [
    { name: 'Home', url: `${SITE}/` },
    { name: 'Shop', url: `${SITE}/shop` },
    { name: 'Shop by Moment', url: `${SITE}/shop/by-moment` },
    { name: moment.title, url: `${SITE}/shop/moments/${moment.slug}` },
  ]
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  }
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: moment.title,
    numberOfItems: moment.products.length,
    itemListElement: moment.products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
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
        image={moment.image ? { url: moment.image, altText: moment.title } : null}
        eyebrow="Shop the Story"
        title={moment.title}
        description={moment.excerpt}
      />

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-5">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop/by-moment" className="hover:text-ink transition-colors">Shop by Moment</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">{moment.title}</span>
        </nav>

        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light">
            {moment.products.length} {moment.products.length === 1 ? 'piece' : 'pieces'}
          </p>
          <Link
            href={moment.articleUrl}
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine hover:text-wine/70 transition-colors"
          >
            Read the story →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 [&>div]:my-0">
          {moment.products.map((p, i) => (
            <ProductEmbed
              key={i}
              product={p}
              shopProduct={p.type === 'shop' && p.handle ? shopMap[p.handle] : undefined}
            />
          ))}
        </div>

        <section className="mt-[clamp(48px,7vw,96px)] text-center">
          <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-eucalypt font-semibold mb-4">From the edit</p>
          <Link
            href={moment.articleUrl}
            className="font-serif text-[20px] italic underline [text-decoration-thickness:0.5px] [text-underline-offset:3px] hover:text-wine transition-colors"
          >
            {moment.articleTitle}
          </Link>
        </section>
      </div>
    </div>
  )
}
