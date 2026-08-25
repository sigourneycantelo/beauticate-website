import Link from 'next/link'
import { isPaidPlacement } from '@/lib/content'
import { hasArticleMoment } from '@/lib/article-moments'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { ArticleFrontmatter, ProductLink } from '@/types/content'
import type { ShopifyProduct } from '@/types/shopify'
import { formatCardPrice } from '@/lib/product-format'
import FAQPanel from '@/components/shared/FAQPanel'
import ProductEmbed from '@/components/mdx/ProductEmbed'
import YouTubeEmbed from '@/components/mdx/YouTubeEmbed'
import Portrait from '@/components/mdx/Portrait'
import PortraitQuote from '@/components/mdx/PortraitQuote'
import ArticleGrid from './ArticleGrid'
import ReaderQuestion from './ReaderQuestion'
import AuthorByline from './AuthorByline'
import ArticleHero from './ArticleHero'
import ShareButtons from './ShareButtons'
import { resolveSchemaType } from '@/lib/seo'
import CollectionEmbed from '@/components/mdx/CollectionEmbed'
import CollectionRail from '@/components/mdx/CollectionRail'
import PullQuote from '@/components/mdx/PullQuote'
import ImageCarousel, { CarouselSlide } from '@/components/mdx/ImageCarousel'
import { ShopGrid, ShopItem, ShopCTA } from '@/components/mdx/ShopGrid'
import ProductInset from '@/components/mdx/ProductInset'
import EditorNote from '@/components/mdx/EditorNote'
import EditorIntro from '@/components/mdx/EditorIntro'
import QuickAnswer from '@/components/mdx/QuickAnswer'
import AffiliateCTA from '@/components/mdx/AffiliateCTA'
import SplitRow from '@/components/mdx/SplitRow'
import StickyScroll from '@/components/mdx/StickyScroll'
import NumberedSection from '@/components/mdx/NumberedSection'
import BeforeAfterSlider from '@/components/mdx/BeforeAfterSlider'
import Caption from '@/components/mdx/Caption'
import InlineImage from '@/components/mdx/InlineImage'
import TravelWidget from '@/components/mdx/TravelWidget'
import FoundersPanel from '@/components/shop/FoundersPanel'
import StatBand, { Stat } from '@/components/mdx/StatBand'
import ProductTile from '@/components/shared/ProductTile'
import SubscribeBand from '@/components/shared/SubscribeBand'
import MetaViewContent from '@/components/analytics/MetaViewContent'
import rehypeImageGrid from '@/lib/rehype-image-grid'
import rehypePullQuotes from '@/lib/rehype-pull-quotes'
import rehypePortraitImages from '@/lib/rehype-portrait-images'
import rehypeShopGrid from '@/lib/rehype-shop-grid'
import rehypeVenueContact from '@/lib/rehype-venue-contact'
import rehypePortraitFloat from '@/lib/rehype-portrait-float'
import NearbyVenues from './NearbyVenues'
import ShopEditRail from './ShopEditRail'
import VenueCTA from './VenueCTA'
import VenueContact from './VenueContact'

interface Props {
  frontmatter: ArticleFrontmatter
  content: string
  productLinks: ProductLink[]
  shopProducts: ShopifyProduct[]
  relatedArticles: any[]
}

function withSubscribeBand(content: string): string {
  const marker = '\n\n<SubscribeBand />\n\n'
  if (content.includes('<SubscribeBand')) return content
  const textOnly = content.replace(/<[^>]+>/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  if (textOnly.length < 1500) return content

  const headingRe = /^#{1,4}\s/
  const lo = Math.floor(content.length * 0.4)
  const hi = Math.floor(content.length * 0.9)

  // Find paragraph breaks immediately before a heading within the 40–90% window.
  const candidates: Array<{ pos: number }> = []
  let pos = 0
  while ((pos = content.indexOf('\n\n', pos)) !== -1) {
    if (pos >= lo && pos <= hi) {
      const after = content.slice(pos + 2)
      const nextLine = after.split('\n')[0]
      if (headingRe.test(nextLine)) {
        candidates.push({ pos })
      }
    }
    pos += 2
  }

  // Pick the candidate closest to 60% (midpoint of the window).
  const target = Math.floor(content.length * 0.6)
  candidates.sort((a, b) => Math.abs(a.pos - target) - Math.abs(b.pos - target))
  const best = candidates[0]?.pos ?? -1
  if (best === -1) return content + marker
  return content.slice(0, best) + marker + content.slice(best)
}

export default function ArticlePage({ frontmatter: f, content, productLinks, shopProducts, relatedArticles }: Props) {
  const shopProductMap = Object.fromEntries(shopProducts.map(p => [p.handle, p]))
  const isLandscape = !!(f.hero_image || f.featured_image)
  const articleUrl = `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`

  // Shopping stories get an auto-generated /shop/moments/<slug> page holding the
  // full product mix in one place. It has always linked back to the story; this
  // is the link forward to it, so readers can shop the whole edit in one spot.
  const momentHref = hasArticleMoment(f, productLinks.filter(p => p.type !== 'dead'))
    ? `/shop/moments/${f.slug}`
    : null

  /**
   * An own-shop product card in the article body. On its own it floats left
   * with the copy wrapping beside it; pass `inline` to get the bare tile so
   * several can sit side by side inside a grid wrapper — same convention as
   * <ProductInset inline> uses for affiliate cards.
   */
  function InlineProduct({ handle, inline }: { handle: string; inline?: boolean }) {
    const sp = shopProductMap[handle]
    if (!sp) {
      const productLink = productLinks.find(p => p.handle === handle) ?? { name: handle, type: 'shop' as const, handle }
      return <ProductEmbed product={productLink} />
    }
    const formatted = sp.priceRange?.minVariantPrice ? formatCardPrice(sp) : undefined
    const imgs = sp.images?.nodes ?? []
    const primary = imgs[0] ?? sp.featuredImage
    const secondary = imgs[1]
    const tile = (
      <ProductTile
        href={`/shop/products/${sp.handle}`}
        useNextImage
        primarySrc={primary?.url}
        primaryAlt={primary?.altText ?? sp.title}
        secondarySrc={secondary?.url}
        secondaryAlt={secondary?.altText ?? sp.title}
        cornerLabel="In our shop"
        brand={sp.vendor}
        name={sp.title}
        price={formatted}
      />
    )
    if (inline) return tile
    return (
      <span className="not-prose sm:float-left sm:mr-7 sm:clear-left mb-5 w-full sm:w-[42%] max-w-[260px] block mx-auto sm:mx-0">
        {tile}
      </span>
    )
  }

  function ShopItemCard(props: React.ComponentProps<typeof ShopItem>) {
    const sp = props.handle ? shopProductMap[props.handle] : undefined
    if (!sp) return <ShopItem {...props} />
    const price = sp.priceRange?.minVariantPrice ? formatCardPrice(sp) : undefined
    const imgs = sp.images?.nodes ?? []
    const usingShopImage = !props.image
    return (
      <ProductTile
        href={`/shop/products/${sp.handle}`}
        useNextImage={usingShopImage}
        primarySrc={props.image ?? (imgs[0] ?? sp.featuredImage)?.url}
        primaryAlt={props.name ?? sp.title}
        secondarySrc={usingShopImage ? imgs[1]?.url : undefined}
        brand={props.brand}
        name={props.name ?? sp.title}
        price={price}
      />
    )
  }

  const mdxComponents = {
    YouTubeEmbed, ProductEmbed, Portrait, PortraitQuote, CollectionEmbed, CollectionRail,
    InlineProduct, PullQuote, ImageCarousel, CarouselSlide, ShopGrid, ShopItem: ShopItemCard, ShopCTA,
    ProductInset, EditorNote, EditorIntro, QuickAnswer, AffiliateCTA, SplitRow, StickyScroll, NumberedSection, StatBand, Stat, SubscribeBand, Caption, InlineImage, BeforeAfterSlider, TravelWidget, FoundersPanel,
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const isExternal = props.href && !props.href.startsWith('/') && !props.href.startsWith('#')
      return (
        <a {...props} target="_blank" rel={isExternal ? 'noopener noreferrer' : 'noopener'} />
      )
    },
  }

  const bodyContent = withSubscribeBand(content)

  return (
    <article className="pb-16 md:pb-0">
      {/* Meta Pixel + CAPI: ViewContent for this article */}
      <MetaViewContent
        contentType="article"
        contentIds={[f.slug]}
        contentName={f.title}
        contentCategory={f.subcategory ? `${f.category}/${f.subcategory}` : f.category}
      />
      {/* Hero: full-bleed landscape or editorial split */}
      <ArticleHero frontmatter={f} />

      <div className="max-w-wide mx-auto px-[clamp(20px,3vw,34px)] py-10">
        {/* Title / meta — only in landscape mode; split mode has them in the hero panel */}
        {isLandscape && (
          <>
            <nav className="text-[11.5px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal-light mb-6 flex gap-3 flex-wrap items-center">
              <Link href={`/${f.category}`} className="hover:text-charcoal transition-colors">
                {f.category.replace(/-/g, ' ')}
              </Link>
              {f.subcategory && (
                <>
                  <span>/</span>
                  <Link href={`/${f.category}/${f.subcategory}`} className="hover:text-charcoal transition-colors">
                    {f.subcategory.replace(/-/g, ' ')}
                  </Link>
                </>
              )}
            </nav>

            <h1 className="mb-4">{f.title}</h1>
            {f.excerpt && (
              <p className="font-serif text-[18px] leading-[1.65] text-charcoal-light mb-6">
                {f.excerpt}
              </p>
            )}

            <AuthorByline
              name={f.author ?? 'Beauticate Editorial'}
              date={f.date_published}
              readingTime={f.reading_time}
              showDate={resolveSchemaType(f) === 'NewsArticle'}
              lastUpdated={f.date_modified && f.date_modified > f.date_published ? f.date_modified : undefined}
            />

            {f.venueType && (
              <VenueCTA instagram={f.instagram} bookingUrl={f.booking_url} website={f.website} />
            )}
          </>
        )}

        {/* Body — three-tier width system: narrow (720px) default, wide (1200px) breakout */}
        <div
          className="prose prose-lg max-w-none article-body"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr min(720px, 100%) 1fr',
          }}
        >
          <MDXRemote
            source={bodyContent}
            components={mdxComponents}
            options={{ mdxOptions: { rehypePlugins: [rehypeImageGrid, rehypePullQuotes, rehypePortraitImages, rehypeShopGrid, rehypeVenueContact, rehypePortraitFloat] } }}
          />
        </div>

        {/* Venue contact — structured component replaces the old markdown ## CONTACT */}
        {f.venueType && (
          <VenueContact
            name={f.title}
            address={f.address}
            telephone={f.telephone}
            instagram={f.instagram}
            bookingUrl={f.booking_url}
          />
        )}

        {/* Shop the Edit */}
        {productLinks.length > 0 && (
          <div className="mt-12 pt-10 border-t border-cream-200">
            <h4 className="font-sans text-xs tracking-[0.34em] uppercase mb-6">Shop the Edit</h4>
            <div className={`grid gap-4 ${productLinks.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
              {productLinks.map((p, i) => (
                <ProductEmbed
                  key={i}
                  product={p}
                  shopProduct={p.type === 'shop' && p.handle ? shopProductMap[p.handle] : undefined}
                />
              ))}
            </div>
            {momentHref && (
              <div className="mt-7">
                <Link
                  href={momentHref}
                  className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase px-7 py-3 rounded-[1px] transition-colors hover:bg-ink hover:text-white border border-ink"
                >
                  Shop the full edit
                </Link>
              </div>
            )}
            <p className="mt-6 font-serif text-charcoal-light/60 text-sm">
              Not finding what you&apos;re after?{' '}
              <a href="/shop/suggest" className="text-wine hover:text-wine/70 transition-colors">Tell us what we should be stocking.</a>
            </p>
          </div>
        )}

        {/* Shop the Edit — product rail from shop_products */}
        {f.shop_products && f.shop_products.length > 0 && (
          <ShopEditRail
            products={f.shop_products}
            collectionHandle={f.shop_collection}
          />
        )}

        {/* Nearby venues — only on flagged travel articles */}
        {f.showNearbyVenues && f.state && (
          <NearbyVenues state={f.state} />
        )}

        {/* FAQ Panel */}
        {f.faqs && f.faqs.length > 0 && (
          <div className="max-w-[680px]">
            <FAQPanel faqs={f.faqs} title={f.faqs_title} />
          </div>
        )}

        {/* Affiliate disclosure */}
        {f.affiliate_disclosure && (
          <p className="text-xs text-charcoal-light mt-8 pt-6 border-t border-cream-200">
            This article contains affiliate links. Beauticate may receive a small commission on purchases made through these links at no extra cost to you.
          </p>
        )}

        {/* Paid placement disclosure — foot of the page, beside the affiliate
            line above, and deliberately the only place it appears. No byline
            marker, nothing above the body: Australian law sets no
            top-of-article requirement and the house pattern is foot-of-page. */}
        {isPaidPlacement(f) && (
          <p className="text-xs text-charcoal-light mt-8 pt-6 border-t border-cream-200">
            This is a paid listing. The venue has paid to appear in the Beauticate directory.
          </p>
        )}

        {/* Share */}
        <div className="max-w-[680px]">
          <ShareButtons
            url={articleUrl}
            title={f.title}
            image={f.featured_image}
          />
        </div>

        {/* Reader question */}
        <ReaderQuestion
          category={f.category}
          articleTitle={f.title}
          articleUrl={articleUrl}
        />
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div className="border-t border-cream-200">
          <div className="max-w-wide mx-auto px-[clamp(20px,3vw,34px)] py-10">
            <h2 className="mb-8">You might also like</h2>
            <ArticleGrid articles={relatedArticles} />
          </div>
        </div>
      )}
    </article>
  )
}
