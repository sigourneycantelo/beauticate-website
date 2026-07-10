import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCollectionFull, getCollectionProductHandles } from '@/lib/shopify'
import { BROAD_CATEGORIES, getBroad, classifySub } from '@/lib/shop-taxonomy'
import CategoryBrowser, { type BrowsableProduct } from '@/components/shop/CategoryBrowser'

const SITE = 'https://www.beauticate.com'

const CATEGORY_FAQS: Record<string, { q: string; a: string }[]> = {
  beauty: [
    {
      q: 'How does Beauticate choose which beauty products to stock?',
      a: 'Every product in the Beauticate Shop beauty edit is tested by our editorial team and reviewed by our founder Sigourney Cantelo, a 25-year beauty journalist and former Vogue Australia Beauty & Health Director. We only stock what we would personally use and recommend.',
    },
    {
      q: 'Who curates the beauty edit?',
      a: 'Sigourney Cantelo curates the edit alongside Beauticate’s editorial team and The Beauticate Collective, our panel of beauty, wellness and lifestyle experts. Nothing lands in the shop without a genuine editorial endorsement.',
    },
    {
      q: 'Are all beauty products on Beauticate Shop authentic?',
      a: 'Yes. All products are sourced directly from authorised distributors and brand partners. We do not sell grey-market or counterfeit products.',
    },
    {
      q: 'Do you ship beauty products Australia-wide?',
      a: 'Yes. Beauticate Shop ships to all Australian addresses.',
    },
  ],
  wellness: [
    {
      q: 'How does Beauticate choose which wellness products to stock?',
      a: 'Every wellness product is tested and reviewed by our editorial team and founder Sigourney Cantelo, a 25-year beauty and wellness journalist and former Vogue Australia Beauty & Health Director. If it doesn’t genuinely improve how we feel, it doesn’t make the cut.',
    },
    {
      q: 'What kinds of wellness products does Beauticate stock?',
      a: 'Our wellness edit spans supplements, aromatherapy, body care and lifestyle tools. Each product is chosen for real-world efficacy, not trend cycles.',
    },
    {
      q: 'Are the wellness products sourced from trusted brands?',
      a: 'Yes. All products are sourced directly from authorised distributors and brand partners. We carry only authentic stock from brands we trust and use ourselves.',
    },
    {
      q: 'Do you ship wellness products across Australia?',
      a: 'Yes. Beauticate Shop ships Australia-wide.',
    },
  ],
  living: [
    {
      q: 'How does Beauticate choose which home and living products to stock?',
      a: 'Every product in our Living edit is chosen by our founder Sigourney Cantelo, a 25-year lifestyle journalist, and the Beauticate editorial team. We look for pieces that elevate daily rituals, from candles and diffusers to tabletop and textiles.',
    },
    {
      q: 'Who curates the Living edit?',
      a: 'Sigourney Cantelo curates the Living edit alongside Beauticate’s editorial team and The Beauticate Collective, our panel of beauty, wellness and lifestyle experts. Every piece is something we would put in our own homes.',
    },
    {
      q: 'Are all living products on Beauticate Shop authentic?',
      a: 'Yes. All products are sourced directly from authorised brand partners and distributors. We do not sell grey-market goods.',
    },
    {
      q: 'Do you ship living products Australia-wide?',
      a: 'Yes. Beauticate Shop ships to all Australian addresses.',
    },
  ],
}

export function generateStaticParams() {
  return BROAD_CATEGORIES.map(b => ({ category: b.slug }))
}

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ cat?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const broad = getBroad(category)
  if (!broad) return {}
  const title = `${broad.label} | Beauticate Shop`
  const description = broad.comingSoon
    ? `${broad.label} is coming soon to the Beauticate shop.`
    : `Shop the Beauticate ${broad.label} edit — curated by the editors and experts behind Beauticate.`
  return {
    title,
    description,
    alternates: { canonical: `${SITE}/shop/${broad.slug}` },
  }
}

export default async function BroadCategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { cat } = await searchParams
  const broad = getBroad(category)
  if (!broad) notFound()

  const crumbs = [
    { name: 'Home', url: `${SITE}/` },
    { name: 'Shop', url: `${SITE}/shop` },
    { name: broad.label, url: `${SITE}/shop/${broad.slug}` },
  ]
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  }

  // "Coming soon" categories (Style) get a clean holding page.
  if (broad.comingSoon || !broad.handle) {
    return (
      <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(64px,10vw,140px)] text-center">
          <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-charcoal-light/60">Shop</p>
          <h1 className="font-serif font-normal mt-3" style={{ fontSize: 'clamp(40px,6vw,72px)', lineHeight: 1 }}>{broad.label}</h1>
          <p className="font-serif mx-auto mt-5 max-w-[46ch] text-charcoal-light" style={{ fontSize: 'clamp(15px,1.6vw,19px)' }}>
            Our {broad.label} edit is coming soon — we&rsquo;re curating it with the same care as everything else in the shop.
          </p>
          <Link
            href="/shop"
            className="inline-block mt-9 font-sans text-[11px] tracking-[0.22em] uppercase border border-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
          >
            Back to the shop
          </Link>
        </div>
      </div>
    )
  }

  // The category grid is the UNION of the broad collection and its sub-collections.
  // Relying on the broad collection alone hides products that were filed into a
  // sub-collection (e.g. a perfume in `fragrance-1`) but never added to the broad
  // parent — so we merge both and dedupe. Home items (candles, room sprays) that are
  // filed into a beauty sub but really belong in Living are dropped via the Living
  // membership set, so they show under Living only, not Beauty.
  const [collection, livingHandles, ...subCols] = await Promise.all([
    getCollectionFull(broad.handle),
    broad.slug === 'living' ? Promise.resolve<string[]>([]) : getCollectionProductHandles('living-interiors'),
    ...broad.subs.map(s => (s.handle ? getCollectionFull(s.handle) : Promise.resolve(null))),
  ])
  if (!collection) notFound()
  const living = new Set(livingHandles)

  // handle -> every sub-collection it's filed in (a scented body oil can be in both
  // Body and Fragrance, so a product can match more than one filter).
  const subsOf = new Map<string, string[]>()
  const byHandle = new Map<string, (typeof collection.products.nodes)[number]>()
  for (const p of collection.products.nodes) byHandle.set(p.handle, p)
  broad.subs.forEach((s, i) => {
    for (const p of subCols[i]?.products.nodes ?? []) {
      const arr = subsOf.get(p.handle) ?? []
      if (!arr.includes(s.slug)) arr.push(s.slug)
      subsOf.set(p.handle, arr)
      // add sub-only products to the grid, unless they really belong in Living
      if (!byHandle.has(p.handle) && !living.has(p.handle)) byHandle.set(p.handle, p)
    }
  })

  // Filed Shopify sub-collection membership wins; anything filed nowhere is
  // auto-classified from its own product type / tags / title so it still lands in the
  // right filter bucket without touching Shopify.
  const products: BrowsableProduct[] = [...byHandle.values()].map(p => {
    const filed = subsOf.get(p.handle)
    const auto = classifySub(broad, p)
    return { ...p, subSlugs: filed?.length ? filed : auto ? [auto] : [] }
  })

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: broad.label,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/shop/products/${p.handle}`,
      name: p.title,
    })),
  }

  const faqs = CATEGORY_FAQS[broad.slug] ?? []
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null

  const minH = 'clamp(240px,34vw,420px)'

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {collection.image ? (
        <section className="relative w-full overflow-hidden" style={{ minHeight: minH }}>
          <Image src={collection.image.url} alt={collection.image.altText ?? broad.label} fill priority sizes="100vw" className="object-cover" style={{ objectPosition: 'center 30%' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.42))' }} />
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6" style={{ minHeight: minH }}>
            <p className="font-sans text-paper/80 mb-2" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase' }}>Shop</p>
            <h1 className="font-serif font-normal text-paper" style={{ fontSize: 'clamp(34px,5vw,60px)', letterSpacing: '0.04em' }}>{broad.label}</h1>
          </div>
        </section>
      ) : (
        <header className="text-center max-w-wide mx-auto px-[clamp(20px,6vw,104px)] pt-[clamp(40px,6vw,80px)] pb-[clamp(4px,2vw,16px)]">
          <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-charcoal-light/60">Shop</p>
          <h1 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1 }}>{broad.label}</h1>
        </header>
      )}

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-8">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">{broad.label}</span>
        </nav>

        <CategoryBrowser
          products={products}
          subs={broad.subs.map(s => ({ slug: s.slug, label: s.label }))}
          initialSub={cat}
        />
      </div>

      {faqs.length > 0 && (
        <section className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] pb-[clamp(48px,8vw,96px)]">
          <div className="mx-auto max-w-[680px]">
            <h2 className="font-serif font-normal text-center mb-10" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>
              Frequently asked questions
            </h2>
            <dl className="divide-y divide-charcoal-light/10">
              {faqs.map(({ q, a }) => (
                <div key={q} className="py-6">
                  <dt className="font-sans text-[13px] tracking-[0.04em] font-medium text-ink">{q}</dt>
                  <dd className="font-serif text-charcoal-light mt-2" style={{ fontSize: 'clamp(14px,1.4vw,16px)', lineHeight: 1.7 }}>{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}
    </div>
  )
}
