# Beauticate WordPress Sitemap & Structure Audit

Audited from live WordPress backend: beauticate.com
Date: 2026-06-18

---

## Primary Navigation (Header)

| Label | URL |
|---|---|
| Interviews | /interviews/ |
| Beauty & Style | /beauty-style/ |
| Wellness | /wellness/ |
| Destinations | /destination/travel/ |
| Living | /living/ |
| Vodcast | /vodcast/ |
| Sigourney's Edit | /sigourneys-edit/ |
| About | /about-beauticate/ |

## Footer Navigation

| Label | URL |
|---|---|
| About | /about-beauticate/ |
| Advertise With Us | /advertise-with-us/ |
| Privacy Policy | /privacy/ |
| Terms & Conditions | /terms/ |
| Exclusive Offers | /offers/ |

---

## Static Pages (Published)

| Page | Slug | Notes |
|---|---|---|
| Home | / | Front page |
| About Beauticate | /about-beauticate/ | Current about page (Elementor) |
| ABOUT – The Beauticate team | /about/ | Legacy about page |
| Advertise With Us | /advertise-with-us/ | |
| Cart | /cart/ | WooCommerce cart |
| Checkout | /checkout/ | WooCommerce checkout |
| Destinations | /destinations/ | |
| Exclusive Offers | /offers/ | |
| Forgot Password | /forgot-password/ | |
| News | /news/ | WordPress posts page |
| Past Offers | /past-offers/ | |
| Privacy Policy | /privacy/ | |
| Reviews | /reviews/ | |
| Sacred Sixty | /sacred60/ | Editorial campaign page |
| Sacred Sixty Shop | /sacred60shop/ | |
| Shop | /shop/ | WooCommerce shop |
| ShopWP Collections | /collections/ | Shopify integration |
| ShopWP Products | /products/ | Shopify integration |
| Subscriber Terms | /subscriber-terms/ | |
| Terms of Use | /terms/ | |
| Top 100 Competition | /top-100-competition/ | |
| Top 50 Skincare Products | /top-50-skincare-products/ | Lead gen / editorial |
| TRAVEL | /travel/ | |
| Vodcast | /vodcast/ | |
| 404 | /404-2/ | Custom 404 page |

---

## Category Hierarchy (Content Taxonomy)

Numbers in brackets = post count.

```
Beauty & Style [739]
├── Beauty Tips [624]
├── Skin Care [290]
├── Makeup [156]
├── Hair [138]
├── Style [48]
├── Fragrance [35]
├── Cosmetic [33]
├── Nails [25]
└── Technology [6]

Interviews [362]
├── Creatives [161]
├── Founders [103]
├── Tastemakers [66]
├── Actors & Presenters [61]
└── Models [58]

Sigourney's Edit [205]

News [119]

Destination [109]
└── Travel [52]
    └── Hotels & Resorts [4]
        ├── City Guides [2]
        └── Stays [5]

Beauty & Wellness [1]  (under Destination)
├── Clinics [58]
├── Hair Salons [39]
├── Skin Salons [31]
└── Spas & Retreats [59]

Reviews [97]
├── Products [70]
└── Treatments [10]

Lifestyle [97]  (under Living)
├── Interiors [41]
├── Sustainability [30]
└── Outdoors [5]

Wellness [6]
├── Health [149]
├── Fitness [33]
├── Mindset [11]
├── Biohacking [5]
└── Longevity [4]

Living [6]

Vodcast [47]

Ask [5]
└── Hairs [1]

Shop [2]

Uncategorized [7]
```

---

## Post Volume

| Type | Count |
|---|---|
| Published posts (articles) | 1,724 |
| Published pages | 28 |
| Comments (approved) | 2,414 |

---

## SEO Fields in Use (Yoast SEO Premium)

Confirmed fields per post:
- `title` — SEO title
- `meta_description` — meta description
- `og_title` — Open Graph title
- `og_description` — Open Graph description
- `og_image` — Open Graph image
- `twitter_title`
- `twitter_description`
- `twitter_card`
- `canonical_url`
- `robots` (noindex control — some pages set to noindex)
- `focus_keyphrase` — majority of posts have this unset (1,621 posts)
- `schema_type` — Yoast structured data
- Yoast Premium: redirect manager active

---

## Plugins to Replicate / Account For in Next.js

| Plugin | Purpose | Next.js Equivalent |
|---|---|---|
| Yoast SEO Premium | Meta, OG, schema, redirects | `next/head` + `next-seo` + `next.config.js` redirects |
| WooCommerce | Shop/cart/checkout | Shopify Storefront API |
| ShopWP | Shopify product embeds | Native Shopify Storefront API (ShopWP won't be needed) |
| MonsterInsights | Google Analytics | `@next/third-parties` GA4 |
| Elementor Pro | Page builder | React components |
| Blog2Social | Social auto-posting | External tool or API |
| Ad Inserter Pro | Ad placement | React ad components |
| Autoptimize | Performance | Next.js built-in (image optimisation, font optimisation) |
| Smash Balloon | Instagram / YouTube feeds | Instagram Basic Display API / YouTube Data API |
| ACF (Advanced Custom Fields) | Custom meta fields | Frontmatter fields in markdown |
| SUMO | Email capture / popups | Klaviyo or Mailchimp embed |
| Ivory Search | Site search | Algolia or Pagefind |
| Click Social | Social scheduling | External tool |

---

## Social Channels (from footer)

| Platform | Handle / URL |
|---|---|
| Instagram | @beauticate |
| TikTok | @sigourneycantelo |
| Pinterest | /beauticate |
| YouTube | /sigourneycantelo |
| Threads | @sigourneycantelo |
| Twitter / X | @beauticate |
| Facebook | /beauticate |
| Spotify Podcast | The Beautiful Inside by Beauticate |

---

## Key Observations for Next.js Build

1. **Dual shop setup** — WooCommerce + ShopWP (Shopify) both active on WordPress. Next.js consolidates to Shopify Storefront API only.
2. **1,724 articles** — need a migration strategy or phased content import into markdown files.
3. **Majority of posts lack Yoast focus keyphrases** — opportunity to regenerate all SEO metadata with Claude during content migration.
4. **Category URLs are the nav** — the main nav maps directly to category archive pages. Next.js will need dynamic category archive routes.
5. **Vodcast section** — separate content type (47 posts), needs its own template.
6. **Sacred Sixty** — standalone campaign page with a shop component, good example of the editorial+ecommerce integration pattern.
7. **Podcast** — The Beautiful Inside podcast (Spotify) referenced in header banner. May need a dedicated section.
8. **PHP 7.4 (outdated)** — not relevant to Next.js but confirms urgency of migration.
