import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { ArticleFrontmatter, ProductLink } from '@/types/content'
import type { ShopifyProduct } from '@/types/shopify'
import FAQPanel from '@/components/shared/FAQPanel'
import ProductEmbed from '@/components/mdx/ProductEmbed'
import YouTubeEmbed from '@/components/mdx/YouTubeEmbed'
import Portrait from '@/components/mdx/Portrait'
import PortraitQuote from '@/components/mdx/PortraitQuote'
import ArticleGrid from './ArticleGrid'
import AuthorByline from './AuthorByline'
import ArticleHero from './ArticleHero'
import ShareButtons from './ShareButtons'
import { resolveSchemaType } from '@/lib/seo'
import CollectionEmbed from '@/components/mdx/CollectionEmbed'
import PullQuote from '@/components/mdx/PullQuote'
import { ShopGrid, ShopItem } from '@/components/mdx/ShopGrid'
import ProductInset from '@/components/mdx/ProductInset'
import EditorNote from '@/components/mdx/EditorNote'
import QuickAnswer from '@/components/mdx/QuickAnswer'
import AffiliateCTA from '@/components/mdx/AffiliateCTA'
import SplitRow from '@/components/mdx/SplitRow'
import Caption from '@/components/mdx/Caption'
import ProductTile from '@/components/shared/ProductTile'
import SubscribeBand from '@/components/shared/SubscribeBand'
import rehypeImageGrid from '@/lib/rehype-image-grid'

interface Props {
  frontmatter: ArticleFrontmatter
  content: string
  productLinks: ProductLink[]
  shopProducts: ShopifyProduct[]
  relatedArticles: any[]
}

// Inject <SubscribeBand /> at the paragraph break nearest to 50% through the content.
function withSubscribeBand(content: string): string {
  const marker = '\n\n<SubscribeBand />\n\n'
  // Don't inject if already present
  if (content.includes('<SubscribeBand')) return content
  const mid = Math.floor(content.length / 2)
  let best = -1
  let bestDist = Infinity
  let pos = 0
  while ((pos = content.indexOf('\n\n', pos)) !== -1) {
    const dist = Math.abs(pos - mid)
    if (dist < bestDist) { bestDist = dist; best = pos }
    pos += 2
  }
  if (best === -1) return content
  return content.slice(0, best) + marker + content.slice(best + 2)
}

export default function ArticlePage({ frontmatter: f, content, productLinks, shopProducts, relatedArticles }: Props) {
  const shopProductMap = Object.fromEntries(shopProducts.map(p => [p.handle, p]))
  const isLandscape = !!f.hero_image
  const articleUrl = `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`

  function InlineProduct({ handle }: { handle: string }) {
    const shopProduct = shopProductMap[handle]
    const productLink = productLinks.find(p => p.handle === handle) ?? { name: handle, type: 'shop' as const, handle }
    return <ProductEmbed product={productLink} shopProduct={shopProduct} />
  }

  function ShopItemCard(props: React.ComponentProps<typeof ShopItem>) {
    const sp = props.handle ? shopProductMap[props.handle] : undefined
    if (!sp) return <ShopItem {...props} />
    const mp = sp.priceRange?.minVariantPrice
    const price = mp
      ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: mp.currencyCode }).format(parseFloat(mp.amount))
      : undefined
    const imgs = sp.images?.nodes ?? []
    const usingShopImage = !props.image
    return (
      <ProductTile
        href={`/shop/products/${sp.handle}`}
        useNextImage={usingShopImage}
        primarySrc={props.image ?? (imgs[0] ?? sp.featuredImage)?.url}
        primaryAlt={props.name ?? sp.title}
        secondarySrc={usingShopImage ? imgs[1]?.url : undefined}
        cornerLabel="In our shop"
        brand={props.brand}
        name={props.name ?? sp.title}
        price={price}
      />
    )
  }

  const mdxComponents = {
    YouTubeEmbed, ProductEmbed, Portrait, PortraitQuote, CollectionEmbed,
    InlineProduct, PullQuote, ShopGrid, ShopItem: ShopItemCard,
    ProductInset, EditorNote, QuickAnswer, AffiliateCTA, SplitRow, SubscribeBand, Caption,
  }

  const bodyContent = withSubscribeBand(content)

  return (
    <article className="pb-16 md:pb-0">
      {/* Hero: full-bleed landscape or editorial split */}
      <ArticleHero frontmatter={f} />

      <div className="px-[clamp(20px,6vw,104px)] py-10">
        {/* Title / meta — only in landscape mode; split mode has them in the hero panel */}
        {isLandscape && (
          <>
            <nav className="text-[11px] font-sans tracking-[0.18em] uppercase text-charcoal-light mb-6 flex gap-2 flex-wrap">
              <Link href={`/${f.category}`} className="hover:text-charcoal capitalize transition-colors">
                {f.category.replace(/-/g, ' ')}
              </Link>
              {f.subcategory && (
                <>
                  <span>/</span>
                  <Link href={`/${f.category}/${f.subcategory}`} className="hover:text-charcoal capitalize transition-colors">
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
              affiliateDisclosure={f.affiliate_disclosure}
              showDate={resolveSchemaType(f) === 'NewsArticle'}
              lastUpdated={f.date_modified && f.date_modified > f.date_published ? f.date_modified : undefined}
            />
          </>
        )}

        {/* Body — capped measure for readability */}
        <div className="prose prose-lg max-w-[680px]">
          <MDXRemote
            source={bodyContent}
            components={mdxComponents}
            options={{ mdxOptions: { rehypePlugins: [rehypeImageGrid] } }}
          />
        </div>

        {/* Shop the Edit */}
        {productLinks.length > 0 && (
          <div className="mt-12 pt-10 border-t border-cream-200 max-w-[680px]">
            <h4 className="font-sans text-xs tracking-[0.34em] uppercase mb-6">Shop the Edit</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productLinks.map((p, i) => (
                <ProductEmbed
                  key={i}
                  product={p}
                  shopProduct={p.type === 'shop' && p.handle ? shopProductMap[p.handle] : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* FAQ Panel */}
        {f.faqs && f.faqs.length > 0 && (
          <div className="max-w-[680px]">
            <FAQPanel faqs={f.faqs} title={f.faqs_title} />
          </div>
        )}

        {/* Affiliate disclosure */}
        {f.affiliate_disclosure && (
          <p className="text-xs text-charcoal-light mt-8 pt-6 border-t border-cream-200 max-w-[680px]">
            This article contains affiliate links. Beauticate may receive a small commission on purchases made through these links at no extra cost to you.
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
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div className="border-t border-cream-200">
          <div className="px-[clamp(20px,6vw,104px)] py-10">
            <h2 className="mb-8">You might also like</h2>
            <ArticleGrid articles={relatedArticles} />
          </div>
        </div>
      )}
    </article>
  )
}
