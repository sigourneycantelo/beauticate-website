import type { ArticleFrontmatter } from '@/types/content'
import { getAuthor, buildPersonSchema } from '@/lib/authors'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com'
const SITE_NAME = 'Beauticate'
const PUBLISHER_LOGO = `${SITE_URL}/logo-dark.png`

const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: PUBLISHER_LOGO },
  sameAs: [
    'https://www.instagram.com/beauticate/',
    'https://au.pinterest.com/beauticate/',
    'https://www.facebook.com/beauticate/',
    'https://x.com/Beauticate',
    'https://www.youtube.com/channel/UCfuyyVnNfbiwoCH1NZK_aJw',
    'https://www.tiktok.com/@sigourneycantelo',
  ],
}

export type SchemaType = 'Article' | 'NewsArticle' | 'Review' | 'HowTo' | 'FAQPage'

export function resolveSchemaType(f: ArticleFrontmatter): SchemaType {
  const tags = (f.tags ?? []).join(' ').toLowerCase()
  const title = f.title.toLowerCase()
  const category = (f.category ?? '').toLowerCase()
  const subcategory = (f.subcategory ?? '').toLowerCase()
  // NewsArticle: explicitly flagged, or interviews, travel/destinations, news/trending tags
  if (
    f.is_news ||
    category === 'interviews' ||
    category === 'destinations' ||
    subcategory === 'travel' ||
    tags.includes('news') ||
    tags.includes('trending') ||
    tags.includes('interview')
  ) return 'NewsArticle'
  if (tags.includes('review') || title.includes('review') || title.includes('we tried')) return 'Review'
  if (title.includes('how to') || title.includes('guide') || tags.includes('how-to')) return 'HowTo'
  return 'Article'
}

export function buildArticleSchema(f: ArticleFrontmatter, url: string, faqs?: { q: string; a: string }[]) {
  const schemaType = resolveSchemaType(f)
  const articleUrl = `${SITE_URL}${url}`
  const imageUrl = f.featured_image ? `${SITE_URL}${f.featured_image}` : `${SITE_URL}/og-default.jpg`

  const authorData = f.author ? getAuthor(f.author) : undefined
  const authorSchema = authorData
    ? buildPersonSchema(authorData, SITE_URL)
    : { '@type': 'Person', name: f.author ?? 'Beauticate Editorial', url: `${SITE_URL}/about-beauticate` }

  const articleNode = {
    '@type': schemaType,
    '@id': `${articleUrl}#article`,
    headline: f.seo_title ?? f.title,
    description: f.meta_description ?? f.excerpt,
    url: articleUrl,
    datePublished: f.date_published,
    dateModified: f.date_modified ?? f.date_published,
    inLanguage: 'en-AU',
    author: authorSchema,
    publisher: ORGANIZATION_SCHEMA,
    image: { '@type': 'ImageObject', url: imageUrl, contentUrl: imageUrl },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    keywords: f.tags?.join(', '),
    articleSection: f.category,
    isAccessibleForFree: true,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.article-excerpt', '.article-body p:first-of-type'],
    },
    ...(schemaType === 'NewsArticle' ? { dateline: 'Sydney, Australia', printEdition: SITE_NAME } : {}),
    // Review-specific fields (only emitted when the article supplies a rating)
    ...(schemaType === 'Review' && f.review_rating
      ? {
          itemReviewed: {
            '@type': 'Product',
            name: f.review_item ?? f.title,
            ...(f.review_brand ? { brand: { '@type': 'Brand', name: f.review_brand } } : {}),
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: String(f.review_rating),
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  }

  const graph: object[] = [articleNode]

  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${articleUrl}#faq`,
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
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
  const schemaType = resolveSchemaType(f)

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
      images: [{ url: image, alt: f.featured_image_alt ?? f.title }],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large' as const,
      'max-video-preview': -1,
    },
    other: {
      'article:published_time': f.date_published,
      'article:author': f.author ?? 'Beauticate Editorial',
      'article:section': f.category,
      'article:tag': (f.tags ?? []).join(','),
      ...(schemaType === 'NewsArticle' ? { 'news_keywords': (f.tags ?? []).join(', ') } : {}),
    },
  }
}
