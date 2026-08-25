export type ProductLinkType = 'shop' | 'affiliate' | 'external' | 'dead'

export interface ProductLink {
  name: string
  type: ProductLinkType
  handle?: string        // for type: 'shop' — matches Shopify product handle
  variant?: string       // for type: 'shop' — pin the card to one colourway, by variant
                         // title ("Blush Pink") or variant id. Without it the card shows
                         // the listing's default variant, which on a multi-colour product
                         // is often not the colour the article means.
  url?: string           // for type: 'affiliate' | 'external'
  retailer?: string      // e.g. 'MECCA', 'Sephora', 'Brand direct'
  note?: string          // e.g. "Sigourney's Edit", "Reader favourite"
  price?: string         // optional fallback display price
  image?: string         // REQUIRED for affiliate/external — de-etched product shot self-hosted in the repo
                         // (e.g. /content/<cat>/<sub>/<slug>/<product>.jpg). Shop products get images from Shopify.
  brand?: string         // display brand for affiliate cards (falls back to retailer)
}

export interface ShopProduct {
  name: string
  brand: string
  image: string
  price: string
  url: string
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
  thumbnailPortrait?: string
  thumbnailPortrait_alt?: string

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
  focus_keyphrase?: string          // primary keyphrase the article targets (documentation/SEO reference)
  faqs?: FAQ[]
  faqs_title?: string               // visible heading for the FAQ panel (defaults to "Frequently Asked Questions")
  reading_time?: number

  // Review schema (only emitted for Review-type articles that supply a rating)
  review_rating?: number            // e.g. 4.5
  review_item?: string              // product/service reviewed, e.g. "Qure Micro-Infusion Facial System"
  review_brand?: string             // brand of the reviewed product, e.g. "Qure Skincare"
  review_pros?: string[]
  review_cons?: string[]

  // Commerce
  shop_collection?: string
  shop_products?: ShopProduct[]
  product_links?: ProductLink[]
  moment_title?: string             // display name for the auto-generated Shop-by-Moment page (defaults to article title)
  moment_image?: string             // tile/hero image for the moment page (defaults to hero_image → featured_image)
  moment_exclude?: boolean          // opt OUT of auto-moment generation even with 6+ products
  related_products?: string[]
  related_collections?: string[]
  youtube_embed?: string

  // Hero
  is_hero?: boolean            // true = this article is the curated home page hero
  hero_order?: number
  home_rank?: number           // pin to the top of the home grid (1 = position 2 on the page); unranked = newest-first
  hero_image?: string          // dedicated landscape/holding shot for HeroWide; falls back to featured_image
  hero_focus?: string          // CSS object-position for hero crop, e.g. "50% 12%"; defaults to "center center"
  nav_image_position?: string  // CSS object-position for mega-menu thumbnail crop, e.g. "left top"
  hero_max_width?: number      // cap the in-article hero display width (px) to avoid upscaling a low-res shot; defaults to 1200
  hero_aspect?: string         // CSS aspect-ratio for hero image, e.g. "16/9"; defaults to 16/9

  // Destinations taxonomy
  travelType?: 'guide' | 'hotel-review' | 'travel-beauty' | 'sigs-edit'
  venueType?: 'spa' | 'salon' | 'skin-clinic' | 'nail-salon' | 'bathhouse' | 'retreat' | 'hotel' | 'wellness'
  address?: string              // street address for LocalBusiness schema
  telephone?: string            // phone number for LocalBusiness schema
  instagram?: string            // Instagram handle (without @), e.g. "auroraspaandbathhouse"
  booking_url?: string          // direct booking/enquiry URL
  /**
   * The venue's own site. Kept separate from booking_url because that often
   * points at Fresha, Kitomba or Timely, and the "Visit Website" button must
   * not send readers to a booking platform's homepage.
   */
  website?: string
  state?: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'
  feeling?: string[]
  feeling_images?: Record<string, string>
  verdict?: string
  showNearbyVenues?: boolean
  isTravelHero?: boolean

  // Editorial flags
  published?: boolean          // false = draft/hidden; omitting defaults to published
  draft_reason?: string        // why this is unpublished — required context before ever republishing.
                                // Never bulk-flip `published` back to true without checking this per-listing;
                                // see "Directory listings" in CLAUDE.md.
  reviewed?: boolean           // true = SEO/AEO review done; used by /admin/review-queue
  is_featured?: boolean
  is_news?: boolean            // true = NewsArticle schema + Google News signals
  featured?: boolean
  editorial_flag?: string
  sigourneys_edit?: boolean
  sponsored?: boolean          // declared but never rendered; see paid_placement_until
  affiliate_disclosure?: boolean
  /**
   * Directory listings are sold as annual placements. This is the date the
   * current placement lapses, NOT a boolean, because a boolean rots: the year
   * ends, nobody clears the flag, and the page keeps declaring a commercial
   * relationship that no longer exists. Disclosure has to be accurate in both
   * directions. Set it when a slot is sold; the label disappears on its own.
   */
  paid_placement_until?: string  // ISO date, e.g. '2027-08-23'
  contributors?: string[]        // collective members featured in team/collaborative articles
}

export interface VodcastFrontmatter {
  title: string
  slug: string
  date_published: string
  excerpt: string
  featured_image: string
  featured_image_alt: string
  hero_aspect?: string        // CSS aspect-ratio for the hero, e.g. "4/5" for portrait shots; defaults to "16/9"
  hero_focus?: string         // CSS object-position for cropping the holding shot (e.g. "50% 12%"); defaults to a face-friendly top bias
  card_position?: string      // CSS object-position for the listing card image (e.g. "50% 18%"); defaults to top
  meta_description: string
  seo_title?: string
  spotify_episode_id?: string
  apple_episode_url?: string
  youtube_video_id?: string
  guests?: string[]
  topics?: string[]
  faqs?: FAQ[]
  related_products?: string[]

  // Podcast page editorial fields
  themes?: string[]
  standfirst?: string
  pull_quote?: string
  pull_quote_author?: string
  guest_name?: string
  guest_role?: string
  marquee_rank?: number
}

export interface EmailFrontmatter {
  subject: string
  preview_text: string
  segment: string
  send_date: string
  articles: string[]    // article slugs featured in this email
}
