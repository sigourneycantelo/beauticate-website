export type ProductLinkType = 'shop' | 'affiliate' | 'external' | 'dead'

export interface ProductLink {
  name: string
  type: ProductLinkType
  handle?: string        // for type: 'shop' — matches Shopify product handle
  url?: string           // for type: 'affiliate' | 'external'
  retailer?: string      // e.g. 'MECCA', 'Sephora', 'Brand direct'
  note?: string          // e.g. "Sigourney's Edit", "Reader favourite"
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
  excerpt: string
  featured_image: string
  featured_image_alt: string

  // SEO
  seo_title?: string
  meta_description: string
  canonical_url?: string
  robots?: string
  og_title?: string
  og_description?: string
  og_image?: string

  // AEO
  schema_type: 'Article' | 'HowTo' | 'FAQPage' | 'Review' | 'NewsArticle'
  faqs?: FAQ[]
  reading_time?: number

  // Commerce
  related_products?: string[]       // Shopify product handles
  related_collections?: string[]    // Shopify collection handles (for Shop by Moment)
  social_origin?: {
    platform: 'instagram' | 'tiktok' | 'pinterest' | 'podcast'
    caption?: string
    url?: string
  }

  // Editorial flags
  featured?: boolean                // surface on homepage hero
  sigourneys_edit?: boolean         // include in Sigourney's Edit
  sponsored?: boolean               // disclosure
  affiliate_disclosure?: boolean
}

export interface VodcastFrontmatter {
  title: string
  slug: string
  date_published: string
  excerpt: string
  featured_image: string
  featured_image_alt: string
  meta_description: string
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
