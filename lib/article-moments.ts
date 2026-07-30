// ─── Auto-generated "Shop by Moment" pages from shopping articles ─────────────
//
// Any published article whose `product_links` list contains at least
// MOMENT_MIN_PRODUCTS entries is a "shopping story" and automatically gets its
// own moment page at /shop/moments/<slug>, surfaced under Shop by Moment. This
// captures the FULL product mix (affiliate + own-shop items) — unlike a native
// Shopify collection, which can only hold shop products.
//
// Fully build-time: no Shopify write, no manual step. Authors can override the
// tile name/image with `moment_title` / `moment_image`, or opt out entirely with
// `moment_exclude: true`.

import { getArticleSlugs, getArticleBySlug } from './content'
import type { ProductLink } from '@/types/content'

export const MOMENT_MIN_PRODUCTS = 6

export interface ArticleMoment {
  slug: string            // article slug — also the /shop/moments/<slug> segment
  title: string           // tile / hero display title
  articleTitle: string    // the original article headline
  articleUrl: string      // link back to the story
  category: string
  subcategory?: string
  image?: string          // tile / hero image
  excerpt?: string
  products: ProductLink[] // full product list (affiliate + shop), dead links removed
  productCount: number
  date_published: string
}

/** All qualifying article moments, newest-first. */
export function getArticleMoments(): ArticleMoment[] {
  return getArticleSlugs()
    .map(parts => getArticleBySlug(parts))
    .filter((a): a is NonNullable<typeof a> => Boolean(a) && a!.frontmatter.published !== false)
    .map(a => {
      const f = a.frontmatter
      const products = (a.products ?? []).filter(p => p.type !== 'dead')
      return { f, products }
    })
    .filter(({ f, products }) => !f.moment_exclude && products.length >= MOMENT_MIN_PRODUCTS)
    .map(({ f, products }): ArticleMoment => ({
      slug: f.slug,
      title: f.moment_title ?? f.title,
      articleTitle: f.title,
      articleUrl: `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`,
      category: f.category,
      subcategory: f.subcategory,
      image: f.moment_image ?? f.hero_image ?? f.featured_image,
      excerpt: f.excerpt,
      products,
      productCount: products.length,
      date_published: f.date_published,
    }))
    .sort((a, b) =>
      new Date(b.date_published).getTime() - new Date(a.date_published).getTime(),
    )
}

export function getArticleMomentBySlug(slug: string): ArticleMoment | undefined {
  return getArticleMoments().find(m => m.slug === slug)
}
