import type { ArticleFrontmatter } from '@/types/content'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com'
const SITE_NAME = 'Beauticate'
const PUBLISHER_LOGO = `${SITE_URL}/logo-dark.png`

export type SchemaType = 'Article' | 'NewsArticle' | 'ReviewNaN' | 'HowTo' | 'FAQPage'

// Determine schema type from frontmatter tags/category
export function resolveSchemaType(f: ArticleFrontmatter): SchemaType {
  const tags = (f.tags ?? []).join(' ').toLowerCase()
  const title = f.title.toLowerCase()
  if (f.is_news || tags.includes('news') || tags.includes('trending')) return 'NewsArticle'
  if (tags.includes('review') || title.includes('review') || title.includes('we tried')) return 'ReviewNaN'
  if (title.includes('how to') || title.includes('guide') || tags.includes('how-to')) return 'HowTo'
  return 'Article'
}

export function buildArticleSchema(f: ArticleFrontmatter, url: string, faqs?: { q: string; a: string }[]) {
  const schemaType = resolveSchemaType(f)
  const articleUrl = `${SITE_URL}${url}`
  const imageUrl = f.featured_image ? `${SITE_URL}${f.featured_image}` : `${SITE_URL}/og-default.jpg`

  const base = {
    '@context': 'https://schema.org',
    '@type': schemaType === 'ReviewNaN' ? 'Article' : schemaType,
    headline: f.seo_title ?? f.title,
    description: f.meta_description ?? f.excerpt,
    url: articleUrl,
    datePublished: f.date_published,
    dateModified: f.date_modified ?? f.date_published,
    inLanguage: 'en-AU',
    author: {
      '@type': 'Person',
      name: f.author ?? 'Beauticate Editorial',
      url: `${SITE_URL}/about-beauticate`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: PUBLISHER_LOGO },
    },
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    keywords: f.tags?.join(', '),
    articleSection: f.category,
    isAccessibleForFree: true,
    ...(schemaType === 'NewsArticle' ? {
      dateline: 'Sydney, Australia',
      printEdition: SITE_NAME,
    } : {}),
  }

  // If there are FAQs, wrap in @graph with both Article + FAQPage
  if (faqs && faqs.length > 0) {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { ...base, '@context': undefined },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        },
      ],
    }
  }

  return base
}

export function buildBreadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.url}`,
    })),
  }
}

// Generate Next.js Metadata object for an article
export function buildArticleMetadata(f: ArticleFrontmatter, url: string) {
  const title = f.seo_title ?? `${f.title} | Beauticate`
  const description = f.meta_description ?? f.excerpt ?? ''
  const image = f.featured_image ? `${SITE_URL}${f.featured_image}` : `${SITE_URL}/og-default.jpg`
  const canonical = `${SITE_URL}${url}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_AU',
      type: 'article',
      publishedTime: f.date_published,
      modifiedTime: f.date_modified ?? f.date_published,
      authors: [f.author ?? 'Beauticate Editorial'],
      images: [{ url: image, width: 1200, height: 630, alt: f.featured_image_alt ?? f.title }],
      tags: f.tags,
    },
    twitter: {
      card: 'summary_large_image' as const,
      site: '@beauticate',
      title,
      description,
      images: [image],
    },
    other: {
      // Google News signals
      'article:published_time': f.date_published,
      'article:author': f.author ?? 'Beauticate Editorial',
      'article:section': f.category,
      'article:tag': (f.tags ?? []).join(','),
    },
  }
}
