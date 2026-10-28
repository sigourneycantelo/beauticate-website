import Link from 'next/link'
import type { Metadata } from 'next'
import CollectionHero from '@/components/shop/CollectionHero'
import ProductTile from '@/components/shared/ProductTile'
import { getProductsByHandles } from '@/lib/shopify'
import { GOODIE_BAG_GROUPS, GOODIE_BAG_HANDLES, GOODIE_BAG_LEAD } from '@/lib/goodie-bag'
import InlineImage from '@/components/mdx/InlineImage'
import { formatCardPrice } from '@/lib/product-format'
import { findVariant, variantHref } from '@/lib/shop-variant'

const SITE = 'https://www.beauticate.com'
const TITLE = 'Shop the Products Our Editors Are Using'
const DESCRIPTION =
  'Hair tools, cult glow, collagen lips and a candle that smells like an Italian summer. Everything our editors took home from the first Beauticate Collective lunch, shoppable in one place.'
const ARTICLE = '/sigourneys-edit/edit/beauticate-collective-lunch-lua-sydney-fish-market'

export const revalidate = 300

export const metadata: Metadata = {
  title: `${TITLE} | Beauticate Shop`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}/shop/collections/goodie-bag` },
  openGraph: { title: TITLE, description: DESCRIPTION },
}

function quote(text: string, above = false) {
  return (
    <blockquote
      className={`not-prose text-center max-w-[860px] mx-auto ${
        above ? 'mt-0 mb-[clamp(28px,4vw,48px)]' : 'mt-[clamp(40px,7vw,88px)]'
      }`}
    >
      <p
        className="font-serif italic text-chocolate md:whitespace-nowrap"
        style={{ fontSize: 'clamp(20px,2.4vw,30px)', lineHeight: 1.2, letterSpacing: '-0.01em' }}
      >
        {text}
      </p>
    </blockquote>
  )
}

export default async function GoodieBagPage() {
  const products = await getProductsByHandles(GOODIE_BAG_HANDLES)
  const byHandle = Object.fromEntries(products.map(p => [p.handle, p]))

  // A product that stops resolving drops out quietly. A product that is out of
  // stock stays on the page and says so.
  const groups = GOODIE_BAG_GROUPS.map(g => ({
    ...g,
    items: g.items.filter(i => byHandle[i.handle]),
  })).filter(g => g.items.length > 0)
  const count = groups.reduce((n, g) => n + g.items.length, 0)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITLE,
    numberOfItems: count,
    itemListElement: groups
      .flatMap(g => g.items)
      .map((i, n) => ({
        '@type': 'ListItem',
        position: n + 1,
        name: byHandle[i.handle].title,
        url: `${SITE}/shop/products/${i.handle}`,
      })),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <CollectionHero eyebrow="The Beauticate Collective Goodie Bag" title={TITLE} description={DESCRIPTION} />

      {/* Lead strip: the lunch, with the products in use. Kate first. */}
      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] mt-[clamp(20px,3vw,40px)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 md:gap-x-4 gap-y-2">
          {GOODIE_BAG_LEAD.map(ph => (
            <InlineImage key={ph.src} src={ph.src} alt={ph.alt} width={1200} height={1800} caption={ph.caption} />
          ))}
        </div>
      </div>

      <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light text-center">
          {count} pieces ·{' '}
          <Link href={ARTICLE} className="underline underline-offset-4 hover:text-ink transition-colors">
            Read about the lunch
          </Link>
        </p>

        {groups.map(g => (
          <section key={g.title} className="mt-[clamp(36px,6vw,72px)]">
            <h2 className="font-serif font-normal text-center mb-6" style={{ fontSize: 'clamp(28px,4.2vw,48px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              {g.title}
            </h2>

            {g.quote && g.quoteAbove && quote(g.quote, true)}

            <div className="grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-8 max-w-[860px] mx-auto">
              {g.items.map(i => {
                const sp = byHandle[i.handle]
                const v = findVariant(sp, i.variant)
                const imgs = sp.images?.nodes ?? []
                // One clean pack shot per tile: no hover swap to a lifestyle or
                // badged image, and an explicit `image` where the listing's own
                // photos carry award medals or NEW badges.
                const primarySrc = i.image ?? (v?.image ?? imgs[0] ?? sp.featuredImage)?.url
                const soldOut = v
                  ? !v.availableForSale
                  : !(sp.variants?.nodes ?? []).some(x => x.availableForSale)
                const price = v
                  ? `$${parseFloat(v.price.amount) % 1 === 0 ? parseFloat(v.price.amount).toFixed(0) : parseFloat(v.price.amount).toFixed(2)}`
                  : sp.priceRange?.minVariantPrice
                    ? formatCardPrice(sp)
                    : undefined
                return (
                  <div key={i.handle}>
                    <ProductTile
                      href={variantHref(sp.handle, v)}
                      useNextImage
                      primarySrc={primarySrc}
                      primaryAlt={sp.title}
                      cover={false}
                      brand={sp.vendor}
                      name={sp.title}
                      price={price}
                      badge={soldOut ? 'Sold out' : undefined}
                    />
                    <p className="font-sans text-[13px] leading-snug text-charcoal-light mt-2">{i.note}</p>
                  </div>
                )
              })}
            </div>

            {g.quote && !g.quoteAbove && quote(g.quote)}

            {g.photos && g.photos.length > 0 && (
              <div
                className={`grid grid-cols-2 gap-x-3 md:gap-x-4 gap-y-2 mx-auto mt-[clamp(20px,3vw,32px)] ${
                  g.photos.length === 1 ? 'max-w-[300px] md:max-w-[340px] !grid-cols-1' : 'max-w-[640px]'
                }`}
              >
                {g.photos.map(ph => (
                  <InlineImage key={ph.src} src={ph.src} alt={ph.alt} width={1200} height={1800} caption={ph.caption} />
                ))}
              </div>
            )}
          </section>
        ))}

        <div className="mt-[clamp(48px,7vw,96px)] text-center max-w-[56ch] mx-auto">
          <p className="font-serif text-[clamp(18px,2vw,22px)] leading-snug">
            The lunch was about saying thank you. Every product in those bags earned its place on that table. Now it can earn one on your bathroom shelf.
          </p>
          <Link
            href={ARTICLE}
            className="inline-block mt-6 font-sans text-[11px] tracking-[0.22em] uppercase text-charcoal-light hover:text-ink transition-colors"
          >
            Read about the lunch →
          </Link>
        </div>
      </div>
    </div>
  )
}
