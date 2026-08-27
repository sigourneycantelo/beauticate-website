import fs from 'fs'
import path from 'path'
import { imageSize } from 'image-size'
import { getArticleSlugs, getArticleBySlug } from '@/lib/content'
import { getAuthor } from '@/lib/authors'
import type { ArticleFrontmatter, ProductLink } from '@/types/content'

/**
 * Shared feed/syndication data layer.
 *
 * Everything machine-readable that lists recent articles — /feed.xml and
 * /sitemap-news.xml — selects its articles here, so the two can never disagree
 * about what counts as a published article. It reads the same content layer
 * as app/sitemap.ts (lib/content.ts walking content/), does no network I/O of
 * its own, and is safe to call during a static render.
 */

export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com').replace(/\/$/, '')

/** Items in /feed.xml. Fixed by the brief; the consuming automation reads exactly this many. */
export const FEED_LIMIT = 50

/** Google News only accepts articles published in the last 48 hours. */
export const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000

/**
 * The date the directory was bulk-imported.
 *
 * 146 of the 148 published venue listings carry `date_published: 2026-01-15`.
 * That is not 146 things being published on a Thursday, it is one import, and
 * treating it as a publication event would put the entire directory into the
 * feed at once — 146 Instagram carousels and Pinterest pins for venues that
 * have been live for months. So a listing only reaches the feed when something
 * actually happened to it after this date: it was added, or it was updated.
 *
 * Delete this constant the day the directory carries real per-listing dates.
 * Until then it is the only thing separating a genuine listing update from an
 * artefact of the migration.
 */
const DIRECTORY_IMPORT_EPOCH = '2026-01-15'

/** What kind of thing an item is. The social treatment differs for each. */
export type FeedContentType = 'article' | 'podcast' | 'venue'

const PUBLIC_DIR = path.join(process.cwd(), 'public')

// ─── Timezone ────────────────────────────────────────────────────────────────

/**
 * Every `date_published` in content/ is a bare `YYYY-MM-DD` with no time and no
 * offset (verified across all 1,845 articles). Read as UTC midnight it lands on
 * the previous calendar day for a large part of the world, so a story published
 * on the 20th syndicates as the 19th. Beauticate is an Australian publisher, so
 * a bare date means midnight in Sydney and that is what we emit.
 */
const PUBLISHER_TZ = 'Australia/Sydney'

/** Minutes that PUBLISHER_TZ is ahead of UTC at a given instant (DST-aware). */
function tzOffsetMinutes(instant: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PUBLISHER_TZ,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(instant)
  const p: Record<string, string> = {}
  for (const part of parts) p[part.type] = part.value
  const asIfUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second)
  return Math.round((asIfUTC - instant.getTime()) / 60000)
}

/**
 * Parse a frontmatter date. A bare `YYYY-MM-DD` becomes midnight in Sydney; a
 * value that already carries a time/offset is parsed as written. Returns null
 * for anything unparseable rather than silently emitting Invalid Date.
 *
 * Two passes: the first offset is looked up against the UTC guess, which can be
 * the wrong side of a DST boundary; re-deriving it from the corrected instant
 * settles that.
 */
export function parsePublishDate(value: string | undefined): Date | null {
  if (!value) return null
  const bare = /^\d{4}-\d{2}-\d{2}$/.exec(value.trim())
  if (!bare) {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }
  const [y, m, d] = value.trim().split('-').map(Number)
  const guess = Date.UTC(y, m - 1, d)
  let instant = guess - tzOffsetMinutes(new Date(guess)) * 60000
  instant = guess - tzOffsetMinutes(new Date(instant)) * 60000
  return new Date(instant)
}

/** RFC 822 date, as RSS 2.0 requires, in the publisher's own timezone. */
export function toRfc822(date: Date): string {
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const offset = tzOffsetMinutes(date)
  const local = new Date(date.getTime() + offset * 60000)
  const pad = (n: number) => String(n).padStart(2, '0')
  const sign = offset < 0 ? '-' : '+'
  const abs = Math.abs(offset)
  return [
    `${DAYS[local.getUTCDay()]},`,
    pad(local.getUTCDate()),
    MONTHS[local.getUTCMonth()],
    local.getUTCFullYear(),
    `${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:${pad(local.getUTCSeconds())}`,
    `${sign}${pad(Math.floor(abs / 60))}${pad(abs % 60)}`,
  ].join(' ')
}

// ─── XML ─────────────────────────────────────────────────────────────────────

/** Escape for an XML text node or attribute value. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Wrap in CDATA. `]]>` is the only sequence that can close a CDATA section, so
 * it is split across two sections — the standard escape, since CDATA has no
 * character-escape mechanism of its own.
 */
export function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

// ─── Text extraction ─────────────────────────────────────────────────────────

/** Plain text from a markdown/MDX-flavoured string: no tags, no delimiters. */
export function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** MDX body stripped down to prose, for word counting. */
function bodyProse(mdx: string): string {
  return mdx
    .replace(/```[\s\S]*?```/g, ' ')          // fenced code
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')    // MDX comments
    .replace(/<!--[\s\S]*?-->/g, ' ')         // HTML comments
    .replace(/<[A-Za-z][^>]*\/>/g, ' ')       // self-closing JSX (product cards, images)
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')      // remaining tags, keeping the text between them
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')    // markdown images (alt text is not prose)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')  // markdown links → their label
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, ' ')
    .replace(/[*_`~|]/g, ' ')
}

export function countWords(mdx: string): number {
  const prose = bodyProse(mdx).trim()
  if (!prose) return 0
  return prose.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length
}

/**
 * In-body images: markdown image syntax plus the MDX components that render an
 * editorial photograph. Product cards (ShopItem / ProductInset / InlineProduct)
 * carry product shots, not article images, and are counted separately as
 * shop/affiliate products — so they are deliberately not included here.
 * BeforeAfterSlider shows two photographs and counts as two.
 */
export function countBodyImages(mdx: string): number {
  const body = mdx.replace(/```[\s\S]*?```/g, ' ')
  const count = (re: RegExp) => (body.match(re) ?? []).length
  return count(/!\[[^\]]*\]\([^)]+\)/g)
    + count(/<(?:Portrait|PortraitQuote|InlineImage|CarouselSlide|img|Image)\b/g)
    + count(/<BeforeAfterSlider\b/g) * 2
}

// ─── Images ──────────────────────────────────────────────────────────────────

export interface FeedImage {
  url: string
  width?: number
  height?: number
  /** File size in bytes — RSS <enclosure> requires a length attribute. */
  bytes?: number
  /** MIME type, for <enclosure type>. */
  mimeType?: string
}

type ImageFacts = { width: number; height: number; bytes: number; mimeType: string }

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
}

const imageFactsCache = new Map<string, ImageFacts | null>()

/**
 * Absolute URL plus intrinsic pixel dimensions for an image referenced from
 * frontmatter. Content images are repo files under public/, so size and byte
 * length are read straight off disk — no network, and no guessing at an aspect
 * ratio.
 *
 * A local path with no file behind it returns undefined, NOT a URL. Some
 * published listings point at a hero.jpg that was left behind when the listing
 * was re-filed to a new path, and a feed item whose only image 404s is worse
 * than no item: Pinterest and the carousel automation both exist to turn that
 * image into a post. Callers fall through to the next candidate, and
 * getFeedArticles drops the item if nothing resolves.
 *
 * A remote URL (legacy WordPress CDN) is returned as-is and unverified —
 * checking it would mean a network call per item.
 */
export function resolveImage(src: string | undefined): FeedImage | undefined {
  if (!src || typeof src !== 'string') return undefined
  const trimmed = src.trim()
  if (!trimmed) return undefined
  if (/^https?:\/\//i.test(trimmed)) return { url: trimmed }
  if (!trimmed.startsWith('/')) return undefined

  const url = `${SITE}${trimmed}`
  if (!imageFactsCache.has(trimmed)) {
    let facts: ImageFacts | null = null
    try {
      const filePath = path.join(PUBLIC_DIR, decodeURIComponent(trimmed))
      // Keep the lookup inside public/ — a frontmatter path is content, and
      // content should never be able to point the reader at another directory.
      if (filePath.startsWith(PUBLIC_DIR) && fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath)
        const { width, height } = imageSize(buffer)
        const mimeType = MIME_BY_EXT[path.extname(filePath).toLowerCase()]
        if (width && height && mimeType) {
          facts = { width, height, bytes: buffer.byteLength, mimeType }
        }
      }
    } catch {
      facts = null
    }
    imageFactsCache.set(trimmed, facts)
  }
  const cached = imageFactsCache.get(trimmed)
  return cached ? { url, ...cached } : undefined
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface FeedProduct {
  /** Shopify product handle — shop products only. */
  handle?: string
  /** Display title as the article gives it. Absent when only a handle is known. */
  title?: string
  /** Absolute URL: the Beauticate Shop product page, or the retailer's page. */
  url: string
  brand?: string
  retailer?: string
}

/**
 * How a product placement is classified.
 *
 * shop      — resolves to a Beauticate Shop listing: a Shopify `handle`, or a
 *             `/shop/products/<handle>` link.
 * affiliate — any outbound product link. The site renders every one of these
 *             with rel="sponsored" (ProductTile), so "outbound product link"
 *             and "affiliate placement" are the same set as far as the rendered
 *             page is concerned; `product_links` type `external` lands here too
 *             for that reason.
 *
 * `type: 'dead'` links render nothing (ProductEmbed returns null) and are
 * excluded from both. So is a product card with no link at all, which is a
 * WordPress-migration leftover rather than a commercial placement.
 */
type ProductBuckets = {
  shop: FeedProduct[]
  affiliate: FeedProduct[]
  collections: FeedCollection[]
}

/**
 * A whole Beauticate Shop collection embedded in the body (<CollectionEmbed>,
 * which renders four shop product cards inline). The individual products are
 * NOT enumerated: the repo holds only the collection handle, and the membership
 * lives in Shopify. Reporting the collection is what keeps `hasShopProducts`
 * honest for an article whose entire commercial content is one of these — the
 * alternative was declaring a shoppable edit to have no shop products at all.
 */
export interface FeedCollection { handle: string; title?: string; url: string }

const SHOP_PATH = '/shop/products/'

function attrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of tag.matchAll(/([A-Za-z][A-Za-z0-9_]*)\s*=\s*"([^"]*)"/g)) out[m[1]] = m[2]
  return out
}

function shopEntry(handle: string, title?: string, brand?: string): FeedProduct {
  return { handle, title: title || undefined, url: `${SITE}${SHOP_PATH}${handle}`, brand: brand || undefined }
}

function addShop(buckets: ProductBuckets, entry: FeedProduct) {
  if (!entry.handle) return
  const existing = buckets.shop.find(p => p.handle === entry.handle)
  if (existing) {
    existing.title ??= entry.title
    existing.brand ??= entry.brand
    return
  }
  buckets.shop.push(entry)
}

function addAffiliate(buckets: ProductBuckets, entry: FeedProduct) {
  if (!/^https?:\/\//i.test(entry.url)) return
  const existing = buckets.affiliate.find(p => p.url === entry.url)
  if (existing) {
    existing.title ??= entry.title
    existing.brand ??= entry.brand
    existing.retailer ??= entry.retailer
    return
  }
  buckets.affiliate.push(entry)
}

/** A URL that points at our own shop → the handle it names, else null. */
function handleFromUrl(url: string | undefined): string | null {
  if (!url) return null
  const withoutHost = url.replace(/^https?:\/\/[^/]+/i, '')
  if (!withoutHost.startsWith(SHOP_PATH)) return null
  const handle = withoutHost.slice(SHOP_PATH.length).split(/[?#/]/)[0]
  return handle || null
}

/**
 * Every product an article places, from both sources the site itself reads:
 * `product_links` frontmatter, and the product components in the MDX body
 * (<InlineProduct>, <ShopItem>, <ProductInset>). The body is not optional —
 * only 38 articles carry `product_links`, against 714 in-body product cards,
 * so frontmatter alone would report almost every commercial article as having
 * no products at all.
 */
export function extractProducts(frontmatter: ArticleFrontmatter, body: string): ProductBuckets {
  const buckets: ProductBuckets = { shop: [], affiliate: [], collections: [] }

  const addCollection = (handle: string | undefined, title?: string) => {
    if (!handle) return
    const existing = buckets.collections.find(c => c.handle === handle)
    if (existing) { existing.title ??= title || undefined; return }
    buckets.collections.push({ handle, title: title || undefined, url: `${SITE}/shop/collections/${handle}` })
  }

  // shop_collection is the article-level collection ArticlePage passes to
  // CollectionRail as `collectionHandle`. The neighbouring `related_products`
  // and `related_collections` frontmatter fields are deliberately NOT read:
  // they are declared in ArticleFrontmatter but set on no article and consumed
  // by no component, so their contents are unverified and guessing at them
  // would put invented handles in the feed.
  addCollection(frontmatter.shop_collection)

  for (const link of (frontmatter.product_links ?? []) as ProductLink[]) {
    if (!link || link.type === 'dead') continue
    const brand = link.brand || link.retailer
    if (link.type === 'shop') {
      const handle = link.handle ?? handleFromUrl(link.url)
      if (handle) addShop(buckets, shopEntry(handle, link.name, brand))
      continue
    }
    const handle = handleFromUrl(link.url)
    if (handle) addShop(buckets, shopEntry(handle, link.name, brand))
    else if (link.url) {
      addAffiliate(buckets, { title: link.name || undefined, url: link.url, brand: link.brand || undefined, retailer: link.retailer || undefined })
    }
  }

  const mdx = body.replace(/```[\s\S]*?```/g, ' ')
  for (const m of mdx.matchAll(/<(InlineProduct|ShopItem|ProductInset)\b([^>]*)>/g)) {
    const a = attrs(m[2])
    const brand = a.brand || a.retailer
    const handle = a.handle || handleFromUrl(a.url)
    if (handle) {
      addShop(buckets, shopEntry(handle, a.name, brand))
      continue
    }
    // No handle and no outbound link: an un-clickable card, not a placement.
    if (!a.url) continue
    addAffiliate(buckets, { title: a.name || undefined, url: a.url, brand: a.brand || undefined, retailer: a.retailer || undefined })
  }

  for (const m of mdx.matchAll(/<(?:CollectionEmbed|CollectionRail)\b([^>]*)>/g)) {
    const a = attrs(m[1])
    addCollection(a.handle, a.title)
  }

  return buckets
}

// ─── Authorship ──────────────────────────────────────────────────────────────

const HOUSE_BYLINES = new Set(['sigourney cantelo', 'beauticate editorial'])

/**
 * Roles held by Beauticate's own masthead rather than by a contributor.
 * "Contributing Editor" is checked first and deliberately does NOT count: the
 * question this answers is whose first person the piece is written in, and a
 * contributing editor writes as a contributor.
 */
const CONTRIBUTOR_ROLE = /^Contributing\b/i
const HOUSE_ROLE = /\bEditor(ial|-in-Chief)?\b/i

export const FALLBACK_AUTHOR = 'Beauticate Editorial'

/**
 * True when the byline is a guest contributor rather than Beauticate's own
 * masthead. The automation needs this because a guest piece is written in
 * someone else's first person, which changes the voice of the social post.
 * An unknown byline is treated as a guest: assuming a stranger is staff is the
 * worse error of the two.
 */
export function isGuestByline(author: string | undefined): boolean {
  if (!author) return false
  const name = author.trim()
  if (!name) return false
  if (HOUSE_BYLINES.has(name.toLowerCase())) return false
  const role = getAuthor(name)?.role
  if (!role || CONTRIBUTOR_ROLE.test(role)) return true
  return !HOUSE_ROLE.test(role)
}

// ─── Article selection ───────────────────────────────────────────────────────

export interface FeedArticle {
  /** Path segments under content/, which are also the URL segments. */
  parts: string[]
  frontmatter: ArticleFrontmatter
  body: string
  /** The date the feed orders and stamps this item by. See feedDate(). */
  publishedAt: Date
  /** Original publication date, which for an updated venue listing is earlier. */
  originalPublishedAt: Date
  modifiedAt?: Date
  contentType: FeedContentType
}

export function contentTypeOf(frontmatter: ArticleFrontmatter, parts: string[]): FeedContentType {
  if (frontmatter.venueType) return 'venue'
  if (parts[0] === 'vodcast') return 'podcast'
  return 'article'
}

/**
 * The date an item enters the feed by.
 *
 * For an article and a podcast episode this is `date_published`, never
 * `date_modified`: the site does not treat an edit as a republish (app/sitemap.ts
 * and the article pages both read `date_published`), so neither does the feed.
 *
 * A venue listing is the exception, and deliberately so. Re-visiting a venue and
 * refreshing its listing IS the editorial event — that is the thing worth a
 * social post — so a listing is dated by whichever of the two is later.
 */
function feedDate(contentType: FeedContentType, published: Date, modified?: Date): Date {
  if (contentType !== 'venue' || !modified) return published
  return modified.getTime() > published.getTime() ? modified : published
}

/**
 * Published editorial articles, newest first.
 *
 * Excluded, and why:
 *  • `published: false` — drafts, and the deliberately-hidden directory
 *    listings described in CLAUDE.md.
 *  • A venue listing that has not been added or updated since the directory was
 *    bulk-imported — see DIRECTORY_IMPORT_EPOCH. New and freshly-updated
 *    listings DO belong in the feed; the 146 that merely carry the import date
 *    do not, and would otherwise swamp a 50-item feed with one day's migration.
 *  • A `date_published` in the future — scheduled, not yet published.
 *  • An unparseable or missing `date_published` — nothing to sort or stamp it by.
 *
 * Vodcast episodes ARE included: they are published editorial with a title,
 * date, excerpt, byline and image, they live at their own article-shaped URL,
 * and new episodes need to reach social like anything else.
 *
 * Nothing else in the tree can reach this list — index pages, static pages, the
 * shop and the homepage are app routes, not content/ directories, and
 * getArticleSlugs() only yields a directory that contains its own `<name>.mdx`.
 *
 * Sorted by date and then by path: `date_published` has day precision, so
 * without the second key the order within a day would be filesystem-dependent
 * and the feed would reshuffle itself between builds for no reason.
 */
export function getFeedCandidates(now: Date = new Date()): FeedArticle[] {
  const articles: FeedArticle[] = []
  const epoch = parsePublishDate(DIRECTORY_IMPORT_EPOCH)!.getTime()

  for (const parts of getArticleSlugs()) {
    const article = getArticleBySlug(parts)
    if (!article) continue
    const f = article.frontmatter
    if (f.published === false) continue

    const originalPublishedAt = parsePublishDate(f.date_published)
    if (!originalPublishedAt) continue
    const modifiedAt = parsePublishDate(f.date_modified) ?? undefined
    const contentType = contentTypeOf(f, parts)
    const publishedAt = feedDate(contentType, originalPublishedAt, modifiedAt)

    if (publishedAt.getTime() > now.getTime()) continue
    if (contentType === 'venue' && publishedAt.getTime() <= epoch) continue

    articles.push({ parts, frontmatter: f, body: article.content, publishedAt, originalPublishedAt, modifiedAt, contentType })
  }

  articles.sort((a, b) => {
    const diff = b.publishedAt.getTime() - a.publishedAt.getTime()
    if (diff !== 0) return diff
    return a.parts.join('/').localeCompare(b.parts.join('/'))
  })

  return articles
}

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
