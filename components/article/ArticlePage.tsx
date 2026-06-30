import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { ArticleFrontmatter, ProductLink } from '@/types/content'
import type { ShopifyProduct } from '@/types/shopify'
import FAQPanel from '@/components/shared/FAQPanel'
import ProductEmbed from '@/components/mdx/ProductEmbed'
import YouTubeEmbed from '@/components/mdx/YouTubeEmbed'
import Portrait from '@/components/mdx/Portrait'
import ArticleGrid from './ArticleGrid'
import AuthorByline from './AuthorByline'
import { resolveSchemaType } from '@/lib/seo'
import CollectionEmbed from '@/components/mdx/CollectionEmbed'
import PullQuote from '@/components/mdx/PullQuote'
import { ShopGrid, ShopItem } from '@/components/mdx/ShopGrid'
import ProductInset from '@/components/mdx/ProductInset'
import EditorNote from '@/components/mdx/EditorNote'
import QuickAnswer from '@/components/mdx/QuickAnswer'
import AffiliateCTA from '@/components/mdx/AffiliateCTA'
import SplitRow from '@/components/mdx/SplitRow'
import ProductTile from '@/components/shared/ProductTile'
import rehypeImageGrid from '@/lib/rehype-image-grid'

interface Props {
  frontmatter: ArticleFrontmatter
  content: string
  productLinks: ProductLink[]
  shopProducts: ShopifyProduct[]
  relatedArticles: any[]
}

export default function ArticlePage({ frontmatter: f, content, productLinks, shopProducts, relatedArticles }: Props) {
  const shopProductMap = Object.fromEntries(shopProducts.map(p => [p.handle, p]))

  // Inline product card usable in MDX as <InlineProduct handle="reboot" />
  function InlineProduct({ handle }: { handle: string }) {
    const shopProduct = shopProductMap[handle]
    const productLink = productLinks.find(p => p.handle === handle) ?? { name: handle, type: 'shop' as const, handle }
    return <ProductEmbed product={productLink} shopProduct={shopProduct} />
  }

  // <ShopItem handle="..."> for our own products → "In our shop" card using the
  // article's (tightly-cropped) product image for consistent sizing, plus the live
  // Shopify price and an internal link. Falls back to the plain ShopItem for affiliates.
  function ShopItemCard(props: React.ComponentProps<typeof ShopItem>) {
    const sp = props.handle ? shopProductMap[props.handle] : undefined
    if (!sp) return <ShopItem {...props} />
    const mp = sp.priceRange?.minVariantPrice
    const price = mp
      ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: mp.currencyCode }).format(parseFloat(mp.amount))
      : undefined
    return (
      <ProductTile
        href={`/shop/products/${sp.handle}`}
        primarySrc={props.image}
        primaryAlt={props.name}
        cornerLabel="In our shop"
        brand={props.brand}
        name={props.name ?? sp.title}
        price={price}
      />
    )
  }

  const mdxComponents = { YouTubeEmbed, ProductEmbed, Portrait, CollectionEmbed, InlineProduct, PullQuote, ShopGrid, ShopItem: ShopItemCard, ProductInset, EditorNote, QuickAnswer, AffiliateCTA, SplitRow }

  // Cap hero display width to avoid upscaling a low-res holding shot (defaults to 1200px).
  const heroMaxWidth = f.hero_max_width ?? 1200

  return (
    <article>
      {/* Hero — capped to hero_max_width to match the source resolution (never upscaled/stretched) */}
      {f.featured_image && (
        <div
          className="relative w-full mx-auto aspect-[16/9] bg-cream-100"
          style={{ maxWidth: `${heroMaxWidth}px` }}
        >
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            sizes={`(max-width: ${heroMaxWidth}px) 100vw, ${heroMaxWidth}px`}
            className="object-cover object-center"
            priority
          />
        </div>
      )}

      <div className="px-[clamp(20px,6vw,104px)] py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-charcoal-light mb-6 flex gap-2">
          <Link href={`/${f.category}`} className="hover:text-gold capitalize">
            {f.category.replace(/-/g, ' ')}
          </Link>
          {f.subcategory && (
            <>
              <span>/</span>
              <Link href={`/${f.category}/${f.subcategory}`} className="hover:text-gold capitalize">
                {f.subcategory.replace(/-/g, ' ')}
              </Link>
            </>
          )}
        </nav>

        {/* Title */}
        <h1 className="mb-4">{f.title}</h1>
        {f.excerpt && <p className="text-lg text-charcoal-light mb-6 leading-relaxed">{f.excerpt}</p>}

        {/* Meta */}
        <AuthorByline
          name={f.author ?? 'Beauticate Editorial'}
          date={f.date_published}
          readingTime={f.reading_time}
          affiliateDisclosure={f.affiliate_disclosure}
          showDate={resolveSchemaType(f) === 'NewsArticle'}
        />

        {/* Body */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{ mdxOptions: { rehypePlugins: [rehypeImageGrid] } }}
          />
        </div>

        {/* Shop the Edit */}
        {productLinks.length > 0 && (
          <div className="mt-12 pt-10 border-t border-cream-200">
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
          <FAQPanel faqs={f.faqs} />
        )}

        {/* Affiliate disclosure */}
        {f.affiliate_disclosure && (
          <p className="text-xs text-charcoal-light mt-8 pt-6 border-t border-cream-200">
            This article contains affiliate links. Beauticate may receive a small commission on purchases made through these links at no extra cost to you.
          </p>
        )}
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div className="border-t border-cream-200 mt-8">
          <div className="px-[clamp(20px,6vw,104px)] py-10">
            <h2 className="mb-8">You might also like</h2>
            <ArticleGrid articles={relatedArticles} />
          </div>
        </div>
      )}
    </article>
  )
}
