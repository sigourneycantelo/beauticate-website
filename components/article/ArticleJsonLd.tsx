import type { ArticleFrontmatter } from '@/types/content'
import { buildArticleSchema, buildBreadcrumbSchema, buildLocalBusinessSchema } from '@/lib/seo'

interface Props {
  frontmatter: ArticleFrontmatter
  /** Path segments below the site root, e.g. ['wellness','health','my-slug'] for a
   *  3-level article or ['sigourneys-edit','my-slug'] for one filed straight under
   *  a category. The last segment is the article; the rest become breadcrumbs. */
  segments: string[]
  /** Raw MDX body. Feeds the HowTo step extraction and the YouTube id scan that
   *  produces the VideoObject, so never omit it. */
  content: string
}

/**
 * The article JSON-LD block, shared by both article routes.
 *
 * It lives here rather than in the 3-level route because the 2-level route —
 * `app/[category]/[subcategory]/page.tsx`, which serves articles filed directly
 * under a category — rendered <ArticlePage> with no structured data at all.
 * Every published 2-level article emitted only the site-level graph: no Article,
 * no FAQPage even with hand-written FAQs, no BreadcrumbList. Keep both routes
 * rendering this component so the two can't drift apart again.
 */
export default function ArticleJsonLd({ frontmatter: f, segments, content }: Props) {
  const url = `/${segments.join('/')}`
  const articleSchema = buildArticleSchema(f, url, f.faqs?.map(faq => ({ q: faq.question, a: faq.answer })), content)
  const localBusinessSchema = buildLocalBusinessSchema(f, url)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    ...segments.slice(0, -1).map((segment, i) => ({
      name: segment.replace(/-/g, ' '),
      url: `/${segments.slice(0, i + 1).join('/')}`,
    })),
    { name: f.title, url },
  ])

  return (
    <>
      {/* JSON-LD rendered as plain <script> in this server component so it is
          present in the initial SSR HTML (next/script's afterInteractive default
          injects client-side only, which is less reliably crawled). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      )}
    </>
  )
}
