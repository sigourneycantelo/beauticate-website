import type { ArticleFrontmatter, VodcastFrontmatter } from '@/types/content'
import { getAuthor, buildPersonSchema } from '@/lib/authors'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com'
const SITE_NAME = 'Beauticate'
const PUBLISHER_LOGO = `${SITE_URL}/logo-dark.png`

// Append a brand suffix exactly once. Frontmatter `seo_title` values often
// already end in "| Beauticate", and the root layout's title template
// ('%s | Beauticate') appends another — producing "… | Beauticate | Beauticate".
// Callers use this and return the result as `title: { absolute }` so the root
// template never doubles it. Strips a trailing "| Beauticate" / "| Beautiful
// Inside" (any pipe/dash separator) before re-adding the canonical suffix.
function withBrandSuffix(base: string, suffix: string): string {
  const cleaned = base
    .replace(/\s*[|\-–—]\s*Beauticate\s*$/i, '')
    .replace(/\s*[|\-–—]\s*Beautiful Inside\s*$/i, '')
    .trim()
  return `${cleaned} | ${suffix}`
}

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
  const title = (f.title ?? '').toLowerCase()
  const category = (f.category ?? '').toLowerCase()
  const subcategory = (f.subcategory ?? '').toLowerCase()
  const isReview = tags.includes('review') || title.includes('review') ||
    title.includes('we tried') || title.includes('i tried') ||
    title.includes('we visited') || title.includes('we tested') || title.includes('i tested') ||
    /road.test/.test(title) || title.includes('we put') || title.includes('beauty on trial') ||
    title.includes('tried and tested') || f.review_rating != null
  // Review beats NewsArticle — a hotel review is a review, not news
  if (isReview) return 'Review'
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
  if (title.includes('how to') || title.includes('guide') || tags.includes('how-to')) return 'HowTo'
  return 'Article'
}

function extractHowToSteps(content: string): { name: string; text: string }[] {
  const lines = content.split('\n')
  const steps: { name: string; text: string }[] = []
  let i = 0
  while (i < lines.length) {
    const h2Match = lines[i].match(/^##\s+(.+)/)
    if (h2Match) {
      const name = h2Match[1].replace(/\\\./g, '.').replace(/\*\*/g, '').trim()
      if (/shop|look|related/i.test(name)) { i++; continue }
      const bodyLines: string[] = []
      i++
      while (i < lines.length && !lines[i].match(/^##\s/)) {
        const line = lines[i].trim()
        if (line && !line.startsWith('![') && !line.startsWith('<') && !line.startsWith('#')) {
          bodyLines.push(line.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'))
        }
        i++
      }
      if (bodyLines.length > 0) {
        steps.push({ name, text: bodyLines.slice(0, 3).join(' ') })
      }
    } else {
      i++
    }
  }
  return steps
}

const YOUTUBE_ID_REGEX = /youtube\.com\/(?:embed\/|watch\?v=)([A-Za-z0-9_-]{11})/

function extractFirstYouTubeId(content: string): string | undefined {
  return content.match(YOUTUBE_ID_REGEX)?.[1]
}

export function buildArticleSchema(f: ArticleFrontmatter, url: string, faqs?: { q: string; a: string }[], content?: string) {
  const schemaType = resolveSchemaType(f)
  const articleUrl = `${SITE_URL}${url}`
  const imageUrl = f.featured_image ? `${SITE_URL}${f.featured_image}` : `${SITE_URL}/og-default.jpg`

  const authorData = f.author ? getAuthor(f.author) : undefined
  const authorSchema = authorData
    ? buildPersonSchema(authorData, SITE_URL)
    : { '@type': 'Person', name: f.author ?? 'Beauticate Editorial', url: `${SITE_URL}/about` }

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
          reviewBody: f.meta_description ?? f.excerpt,
          ...(f.review_pros?.length ? {
            positiveNotes: {
              '@type': 'ItemList',
              itemListElement: f.review_pros.map((note, i) => ({
                '@type': 'ListItem', position: i + 1, name: note,
              })),
            },
          } : {}),
          ...(f.review_cons?.length ? {
            negativeNotes: {
              '@type': 'ItemList',
              itemListElement: f.review_cons.map((note, i) => ({
                '@type': 'ListItem', position: i + 1, name: note,
              })),
            },
          } : {}),
        }
      : {}),
    ...(schemaType === 'HowTo' && content
      ? (() => {
          const steps = extractHowToSteps(content)
          return steps.length >= 2
            ? {
                step: steps.map((s, i) => ({
                  '@type': 'HowToStep',
                  position: i + 1,
                  name: s.name,
                  text: s.text,
                })),
              }
            : {}
        })()
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

  const youtubeId = content ? extractFirstYouTubeId(content) : undefined
  if (youtubeId) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${articleUrl}#video`,
      name: f.seo_title ?? f.title,
      description: f.meta_description ?? f.excerpt,
      thumbnailUrl: [imageUrl],
      uploadDate: f.date_published,
      contentUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      publisher: ORGANIZATION_SCHEMA,
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

const VENUE_TYPE_MAP: Record<string, string> = {
  'spa': 'DaySpa',
  'skin-clinic': 'HealthAndBeautyBusiness',
  'salon': 'HairSalon',
  'nail-salon': 'NailSalon',
  'hotel': 'Hotel',
  'retreat': 'Resort',
  'bathhouse': 'DaySpa',
  'wellness': 'HealthAndBeautyBusiness',
}

export function buildLocalBusinessSchema(f: ArticleFrontmatter, url: string) {
  if (!f.venueType) return null

  const pageUrl = `${SITE_URL}${url}`
  const schemaType = VENUE_TYPE_MAP[f.venueType] ?? 'HealthAndBeautyBusiness'
  const imageUrl = f.featured_image ? `${SITE_URL}${f.featured_image}` : undefined

  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${pageUrl}#localbusiness`,
    name: f.venue_name ?? f.title,
    url: pageUrl,
  }

  if (imageUrl) node.image = imageUrl
  if (f.address) {
    node.address = {
      '@type': 'PostalAddress',
      streetAddress: f.address,
    }
  }
  if (f.telephone) node.telephone = f.telephone

  return node
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
  const title = withBrandSuffix(f.seo_title ?? f.title, 'Beauticate')
  const description = f.meta_description ?? f.excerpt ?? ''
  const image = f.featured_image ? `${SITE_URL}${f.featured_image}` : `${SITE_URL}/og-default.jpg`
  const canonical = `${SITE_URL}${url}`
  const schemaType = resolveSchemaType(f)

  return {
    title: { absolute: title },
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

// ─── Category / subcategory archive pages ────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  'beauty-style': 'Beauty & Style',
  wellness: 'Wellness',
  living: 'Living',
  destinations: 'Destinations',
  interviews: 'Interviews',
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'beauty-style': "Skincare, makeup, hair and fragrance — beauty and style edits, product reviews and expert tips from the Beauticate team.",
  wellness: "Health, mindset and the rituals that make life feel better — wellness stories from Beauticate's editors and experts.",
  living: "Lifestyle, home and the little luxuries that make everyday life better, curated by the Beauticate team.",
  destinations: 'Hotel reviews, travel guides and destination edits from Beauticate.',
}

function humanizeSlug(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Next.js Metadata for a category or subcategory archive page (e.g. /wellness,
// /beauty-style/skin-care). Title is left without a "| Beauticate" suffix —
// the root layout's title template already appends it.
export function buildCategoryMetadata(category: string, subcategory?: string) {
  const categoryLabel = CATEGORY_LABELS[category] ?? humanizeSlug(category)
  const path = subcategory ? `/${category}/${subcategory}` : `/${category}`
  const canonical = `${SITE_URL}${path}`

  const title = subcategory ? `${humanizeSlug(subcategory)} — ${categoryLabel}` : categoryLabel
  const description = subcategory
    ? `${humanizeSlug(subcategory)} stories from Beauticate's ${categoryLabel} edit — tips, reviews and expert advice.`
    : (CATEGORY_DESCRIPTIONS[category] ?? `The latest ${categoryLabel} stories, tips and expert advice from Beauticate.`)

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
      type: 'website' as const,
    },
    twitter: {
      card: 'summary_large_image' as const,
      site: '@beauticate',
      title,
      description,
    },
    robots: { index: true, follow: true },
  }
}

// ─── Vodcast / podcast episodes ──────────────────────────────────────────────

const PODCAST = {
  series: 'Beautiful Inside by Beauticate',
  seriesUrl: `${SITE_URL}/vodcast`,
  sameAs: [
    'https://open.spotify.com/show/5su7l0yO5Ue0706K2Lzd8q',
    'https://podcasts.apple.com/au/podcast/beautiful-inside-by-beauticate/id1754804721',
    'https://www.youtube.com/@sigourneycantelo',
  ],
}

// Next.js Metadata for a podcast episode — full parity with articles
// (canonical, Open Graph, Twitter, robots) but branded "| Beautiful Inside".
export function buildVodcastMetadata(f: VodcastFrontmatter, url: string) {
  const title = withBrandSuffix(f.seo_title ?? f.title, 'Beautiful Inside')
  const description = f.meta_description ?? f.excerpt ?? ''
  const image = f.featured_image ? `${SITE_URL}${f.featured_image}` : `${SITE_URL}/og-default.jpg`
  const canonical = `${SITE_URL}${url}`
  const dateModified = (f as { date_modified?: string }).date_modified ?? f.date_published

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_AU',
      type: 'article' as const,
      publishedTime: f.date_published,
      modifiedTime: dateModified,
      images: [{ url: image, width: 1200, height: 630, alt: f.featured_image_alt ?? f.title }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      site: '@beauticate',
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large' as const,
      'max-video-preview': -1,
    },
  }
}

// JSON-LD @graph for a podcast episode: PodcastSeries + PodcastEpisode +
// Article (the written write-up) + VideoObject + FAQPage + BreadcrumbList,
// all carrying author Person + publisher Organization for E-E-A-T / AEO / GEO.
export function buildVodcastSchema(f: VodcastFrontmatter, url: string, audioUrl?: string | null) {
  const pageUrl = `${SITE_URL}${url}`
  const imageUrl = f.featured_image ? `${SITE_URL}${f.featured_image}` : `${SITE_URL}/og-default.jpg`
  const description = f.meta_description ?? f.excerpt
  const datePublished = f.date_published
  const dateModified = (f as { date_modified?: string }).date_modified ?? f.date_published
  const headline = f.seo_title ?? f.title

  const host = getAuthor('Sigourney Cantelo')
  const person = host
    ? buildPersonSchema(host, SITE_URL)
    : { '@type': 'Person', name: 'Sigourney Cantelo', url: `${SITE_URL}/about` }

  const seriesNode = {
    '@type': 'PodcastSeries',
    '@id': `${SITE_URL}/vodcast#series`,
    name: PODCAST.series,
    url: PODCAST.seriesUrl,
    sameAs: PODCAST.sameAs,
    author: person,
    publisher: ORGANIZATION_SCHEMA,
  }

  const episodeNode: Record<string, unknown> = {
    '@type': 'PodcastEpisode',
    '@id': `${pageUrl}#episode`,
    name: headline,
    description,
    url: pageUrl,
    datePublished,
    inLanguage: 'en-AU',
    partOfSeries: { '@id': `${SITE_URL}/vodcast#series` },
    author: person,
    publisher: ORGANIZATION_SCHEMA,
    image: { '@type': 'ImageObject', url: imageUrl },
  }
  if (audioUrl) {
    episodeNode.associatedMedia = { '@type': 'AudioObject', contentUrl: audioUrl, encodingFormat: 'audio/mpeg' }
  }

  const articleNode = {
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline,
    description,
    url: pageUrl,
    datePublished,
    dateModified,
    inLanguage: 'en-AU',
    author: person,
    publisher: ORGANIZATION_SCHEMA,
    image: { '@type': 'ImageObject', url: imageUrl, contentUrl: imageUrl },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    articleSection: 'Podcast',
    isAccessibleForFree: true,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.episode-excerpt'],
    },
  }

  const graph: object[] = [seriesNode, episodeNode, articleNode]

  if (f.youtube_video_id) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${pageUrl}#video`,
      name: headline,
      description,
      thumbnailUrl: [imageUrl],
      uploadDate: datePublished,
      contentUrl: `https://www.youtube.com/watch?v=${f.youtube_video_id}`,
      embedUrl: `https://www.youtube.com/embed/${f.youtube_video_id}`,
      publisher: ORGANIZATION_SCHEMA,
    })
  }

  if (f.faqs && f.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: f.faqs.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    })
  }

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Beautiful Inside', item: `${SITE_URL}/vodcast` },
      { '@type': 'ListItem', position: 3, name: f.title, item: pageUrl },
    ],
  })

  return { '@context': 'https://schema.org', '@graph': graph }
}
