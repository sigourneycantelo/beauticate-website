import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { ArticleFrontmatter, ProductLink } from '@/types/content'
import type { ShopifyProduct } from '@/types/shopify'
import FAQPanel from '@/components/shared/FAQPanel'
import ProductEmbed from '@/components/mdx/ProductEmbed'
import ArticleGrid from './ArticleGrid'

interface Props {
  frontmatter: ArticleFrontmatter
  content: string
  productLinks: ProductLink[]
  shopProducts: ShopifyProduct[]
  relatedArticles: any[]
}

export default function ArticlePage({ frontmatter: f, content, productLinks, shopProducts, relatedArticles }: Props) {
  const shopProductMap = Object.fromEntries(shopProducts.map(p => [p.handle, p]))

  return (
    <article>
      {/* Hero */}
      {f.featured_image && (
        <div className="relative h-[50vh] md:h-[60vh] bg-cream-100">
          <Image src={f.featured_image} alt={f.featured_image_alt ?? f.title} fill className="object-cover object-top" priority />
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
        <div className="flex items-center gap-4 text-xs text-charcoal-light mb-10 pb-6 border-b border-cream-200">
          <span>By {f.author}</span>
          <span>{new Date(f.date_published).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          {f.reading_time && <span>{f.reading_time} min read</span>}
          {f.affiliate_disclosure && <span className="text-gold">Affiliate links</span>}
        </div>

        {/* Body */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={content} />
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
