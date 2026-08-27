import type { ArticleFrontmatter } from '@/types/content'
import {
  SITE, FEED_LIMIT,
  getFeedCandidates, extractProducts, isGuestByline, toPlainText,
  countBodyImages, countWords, FALLBACK_AUTHOR,
  type FeedArticle, type FeedContentType, type FeedProduct, type FeedCollection,
} from '@/lib/feed'
import { resolveImage, type FeedImage } from '@/lib/feed-images'

/**
 * The parts of the feed that need to read images off disk.
 *
 * Split from lib/feed.ts so that /sitemap-news.xml — a dynamic route, and one
 * that carries no images — never pulls lib/feed-images.ts into its import
 * graph. See the note at the top of that file for what happens when it does.
 */

/**
 * The newest `limit` candidates that actually have an image to post.
 *
 * Every consumer of the feed turns the image into a post, so an item whose
 * artwork 404s cannot be acted on. Two published venue listings are in that
 * state — re-filed to a new path with the photo left behind at the old one —
 * and they are broken on the live site too, so they are warned about rather
 * than dropped in silence.
 *
 * The image check runs lazily, walking the sorted list and stopping as soon as
 * `limit` items have been taken. That matters: resolving an image reads the
 * file off disk, and content/ is a 2.8GB tree of nearly two thousand of them.
 * Checking every candidate up front to return fifty would read the lot on every
 * render.
 */
export function getFeedArticles(limit = FEED_LIMIT, now: Date = new Date()): FeedArticle[] {
  const taken: FeedArticle[] = []

  for (const candidate of getFeedCandidates(now)) {
    if (taken.length >= limit) break
    const f = candidate.frontmatter
    if (!resolveImage(f.hero_image) && !resolveImage(f.featured_image) && !resolveImage(f.thumbnailPortrait)) {
      console.warn(
        `[feed] skipping /${candidate.parts.join('/')} — no usable image. ` +
        `featured_image is ${f.featured_image ? `"${f.featured_image}", which is not on disk` : 'unset'}. ` +
        `It is published, so this is broken on the site too.`
      )
      continue
    }
    taken.push(candidate)
  }

  return taken
}

// ─── Item shape ──────────────────────────────────────────────────────────────

export interface FeedItem {
  url: string
  guid: string
  title: string
  description: string
  publishedAt: Date
  author: string
  categories: string[]
  hero?: FeedImage
  thumbnail?: FeedImage
  imageCount: number
  wordCount: number
  isGuestPost: boolean
  contentType: FeedContentType
  /** Set only when it differs from publishedAt, i.e. an updated venue listing. */
  originalPublishedAt?: Date
  shopProducts: FeedProduct[]
  affiliateProducts: FeedProduct[]
  shopCollections: FeedCollection[]
}

/**
 * A stable, non-URL item id (RFC 4151 tag URI).
 *
 * Built on the slug, not the URL, because the URL is the part that moves: this
 * site re-files articles between subcategories, which rewrites the path and
 * leaves the slug untouched — middleware.ts exists to catch exactly that, and
 * data/redirect-slug-map.json keys off the slug for the same reason. A
 * URL-based guid would make every re-filed article look brand new to the
 * automation and get it posted a second time.
 *
 * Note there is no immutable id in the content model; the slug is the most
 * stable identifier that exists today. See the report accompanying this work.
 */
export function feedGuid(frontmatter: ArticleFrontmatter, parts: string[]): string {
  const slug = frontmatter.slug || parts[parts.length - 1]
  return `tag:beauticate.com,2026:article/${slug}`
}

export function toFeedItem(article: FeedArticle): FeedItem {
  const { frontmatter: f, parts, body, publishedAt, originalPublishedAt, contentType } = article
  const products = extractProducts(f, body)

  const category = f.category || parts[0]
  const subcategory = f.subcategory || (parts.length >= 3 ? parts[1] : undefined)

  const description = toPlainText(
    f.excerpt || f.seo_description || f.meta_description || f.og_description || ''
  )

  // hero_image is the landscape holding shot and featured_image the portrait
  // thumbnail (CLAUDE.md). Only 11 articles carry a dedicated hero_image, so
  // the hero falls back to featured_image exactly as HeroWide/ArticleHero do.
  // The emitted width/height let the consumer see which shape it actually got.
  const hero = resolveImage(f.hero_image) ?? resolveImage(f.featured_image)
  const thumbnail = resolveImage(f.thumbnailPortrait) ?? resolveImage(f.featured_image)

  return {
    url: `${SITE}/${parts.join('/')}`,
    guid: feedGuid(f, parts),
    title: toPlainText(f.title ?? ''),
    description,
    publishedAt,
    author: (f.author ?? '').trim() || FALLBACK_AUTHOR,
    categories: [category, subcategory].filter((c): c is string => !!c),
    hero,
    thumbnail,
    imageCount: countBodyImages(body),
    wordCount: countWords(body),
    isGuestPost: isGuestByline(f.author),
    contentType,
    originalPublishedAt: originalPublishedAt.getTime() === publishedAt.getTime() ? undefined : originalPublishedAt,
    shopProducts: products.shop,
    affiliateProducts: products.affiliate,
    shopCollections: products.collections,
  }
}

