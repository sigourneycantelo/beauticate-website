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

  const mdxComponents = { YouTubeEmbed, ProductEmbed, Portrait, CollectionEmbed, InlineProduct, PullQuote }

  return (
    <article>
      {/* Hero */}
      {f.featured_image && (
        <div className="relative w-full aspect-[16/9] bg-cream-100">
          <Image src={f.featured_image} alt={f.featured_image_alt ?? f.title} fill className="object-cover object-center" priority />
        </div>
      )}

      <div className="max-w-content mx-auto px-4 py-10">
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
          <MDXRemote source={content} components={mdxComponents} />
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
          <div className="max-w-wide mx-auto px-4 py-10">
            <h2 className="mb-8">You might also like</h2>
            <ArticleGrid articles={relatedArticles} />
          </div>
        </div>
      )}
    </article>
  )
}
