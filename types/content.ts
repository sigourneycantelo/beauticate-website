export type ProductLinkType = 'shop' | 'affiliate' | 'external' | 'dead'

export interface ProductLink {
  name: string
  type: ProductLinkType
  handle?: string        // for type: 'shop' — matches Shopify product handle
  url?: string           // for type: 'affiliate' | 'external'
  retailer?: string      // e.g. 'MECCA', 'Sephora', 'Brand direct'
  note?: string          // e.g. "Sigourney's Edit", "Reader favourite"
  price?: string         // optional fallback display price
}

export interface FAQ {
  question: string
  answer: string
}

export interface ArticleFrontmatter {
  title: string
  slug: string
  author: string
  date_published: string
  date_modified: string
  category: string
  subcategory?: string
  tags: string[]
  also_in?: string[]   // extra "<category>/<subcategory>" archives to cross-list this article into (primary home stays category/subcategory)
  excerpt: string
  featured_image: string
  featured_image_alt: string

  // SEO
  seo_title?: string
  seo_description?: string
  meta_description?: string         // legacy alias
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string

  // AEO
  schema_type?: 'Article' | 'HowTo' | 'FAQPage' | 'Review' | 'NewsArticle'
  faqs?: FAQ[]
  reading_time?: number

  // Commerce
  product_links?: ProductLink[]
  related_products?: string[]
  related_collections?: string[]
  youtube_embed?: string

  // Hero
  is_hero?: boolean            // true = this article is the curated home page hero
  home_rank?: number           // pin to the top of the home grid (1 = position 2 on the page); unranked = newest-first
  hero_image?: string          // dedicated landscape/holding shot for HeroWide; falls back to featured_image
  hero_max_width?: number      // cap the in-article hero display width (px) to avoid upscaling a low-res shot; defaults to 1200

  // Editorial flags
  published?: boolean          // false = draft/hidden; omitting defaults to published
  reviewed?: boolean           // true = SEO/AEO review done; used by /admin/review-queue
  is_featured?: boolean
  is_news?: boolean            // true = NewsArticle schema + Google News signals
  featured?: boolean
  editorial_flag?: string
  sigourneys_edit?: boolean
  sponsored?: boolean
  affiliate_disclosure?: boolean
}

export interface VodcastFrontmatter {
  title: string
  slug: string
  date_published: string
  excerpt: string
  featured_image: string
  featured_image_alt: string
  hero_aspect?: string        // CSS aspect-ratio for the hero, e.g. "4/5" for portrait shots; defaults to "16/9"
  meta_description: string
  seo_title?: string
  spotify_episode_id?: string
  apple_episode_url?: string
  youtube_video_id?: string
  guests?: string[]
  topics?: string[]
  faqs?: FAQ[]
  related_products?: string[]
}

export interface EmailFrontmatter {
  subject: string
  preview_text: string
  segment: string
  send_date: string
  articles: string[]    // article slugs featured in this email
}
