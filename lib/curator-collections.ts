// ─── Auto-generated "Shop by Curator" pages from Collective members' articles ──
//
// Every Beauticate Collective member (an author in AUTHORS carrying a
// `shopCollection` handle) gets a page at /shop/curators/<slug> gathering the
// products they have recommended across the site, surfaced under Shop by
// Curator.
//
// Products come from two places:
//
//   1. Articles they wrote. Both `product_links` in frontmatter and any
//      <ShopItem> used in the body, since plenty of articles only have the
//      latter.
//
//   2. Team articles they contributed to (the seasonal Winter/Summer Edit and
//      the like), where a dozen curators each get a <PortraitQuote name="...">
//      followed by their own picks. Only the products under that curator's own
//      quote are attributed to them.
//
// Like article moments this is fully build-time: no Shopify write, no manual
// step. It deliberately captures affiliate links as well as own-shop products,
// which a native Shopify collection cannot hold.

import fs from 'fs'
import path from 'path'
import { getArticleSlugs, getArticleBySlug } from './content'
import { AUTHORS, type Author } from './authors'
import type { ProductLink } from '@/types/content'

export interface CuratorProduct extends ProductLink {
  /** Where this pick came from, so the page can credit the story. */
  sourceTitle: string
  sourceUrl: string
  sourceDate: string
}

export interface CuratorCollection {
  slug: string            // author slug — also the /shop/curators/<slug> segment
  name: string
  role: string
  bio?: string
  photo?: string
  instagram?: string
  collectionHandle: string // the `shopCollection` handle from AUTHORS
  products: CuratorProduct[]
  productCount: number
  articleCount: number     // how many stories fed this page
}

/**
 * Names are written inconsistently across articles — "Dr. Amy Chahal" in one
 * place and "Dr Amy Chahal" in another. Without this, a curator silently ends
 * up with zero products, which looks like an empty page rather than a bug.
 */
function normaliseName(name: string): string {
  return name.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim()
}

/** Parse the attributes of a single <ShopItem .../> tag into a ProductLink. */
function parseShopItem(attrs: string): ProductLink | null {
  const attr = (key: string): string | undefined =>
    attrs.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1]

  const handle = attr('handle')
  const url = attr('url')
  const name = attr('name')
  if (!handle && !url) return null // a card with neither is not shoppable

  return {
    name: name ?? handle ?? url!,
    type: handle ? 'shop' : 'affiliate',
    ...(handle ? { handle } : {}),
    ...(url ? { url } : {}),
    ...(attr('retailer') ? { retailer: attr('retailer') } : {}),
    ...(attr('price') ? { price: attr('price') } : {}),
    ...(attr('image') ? { image: attr('image') } : {}),
    ...(attr('brand') ? { brand: attr('brand') } : {}),
  }
}

/** Every <ShopItem> in a slice of MDX body, in document order. */
function parseShopItems(body: string): ProductLink[] {
  return [...body.matchAll(/<ShopItem\b([^>]*?)\/>/g)]
    .map(m => parseShopItem(m[1]))
    .filter((p): p is ProductLink => p !== null)
}

/**
 * Split a team article body by <PortraitQuote name="..."> and return each
 * curator's own products — everything from their quote up to the next one.
 * Anything before the first quote is the article's own intro, not a pick.
 */
function productsByContributor(body: string): Map<string, ProductLink[]> {
  const out = new Map<string, ProductLink[]>()
  const quotes = [...body.matchAll(/<PortraitQuote\b[^>]*?\bname="([^"]+)"/g)]

  quotes.forEach((quote, i) => {
    const start = quote.index!
    const end = i + 1 < quotes.length ? quotes[i + 1].index! : body.length
    const key = normaliseName(quote[1])
    const found = parseShopItems(body.slice(start, end))
    out.set(key, [...(out.get(key) ?? []), ...found])
  })

  return out
}

/**
 * Frontmatter `product_links` often carry only `{ type, handle }` — the real
 * title is resolved from Shopify at render. Give those a readable fallback so
 * they never surface as "undefined" in schema or alt text.
 */
function withFallbackName(p: ProductLink): ProductLink {
  if (p.name) return p
  const from = p.handle ?? p.url ?? ''
  const readable = from
    .replace(/^https?:\/\//, '')
    .split(/[/?#]/)[0]
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
  return { ...p, name: readable || 'Product' }
}

/** Identity for de-duplication: the same product should not appear twice. */
function productKey(p: ProductLink): string {
  return p.handle ? `handle:${p.handle}` : p.url ? `url:${p.url}` : `name:${p.name.toLowerCase()}`
}

/**
 * The large square Collective portrait if one exists, falling back to the small
 * byline headshot. The byline photos are 200px, too small to carry a hero.
 */
function curatorPortrait(a: Author): string | undefined {
  for (const ext of ['png', 'jpg']) {
    const rel = `/images/collective/${a.slug}.${ext}`
    if (fs.existsSync(path.join(process.cwd(), 'public', rel))) return rel
  }
  return a.photo
}

/** The Collective — authors carrying a shopCollection handle. */
export function getCurators(): Author[] {
  return AUTHORS.filter(a => a.shopCollection)
}

/**
 * Build every curator's collection. One pass over the articles, so adding
 * curators stays cheap.
 */
export function getCuratorCollections(): CuratorCollection[] {
  const curators = getCurators()
  const byName = new Map(curators.map(c => [normaliseName(c.name), c]))

  const picks = new Map<string, CuratorProduct[]>()
  const sources = new Map<string, Set<string>>()

  const add = (curatorSlug: string, products: ProductLink[], meta: Omit<CuratorProduct, keyof ProductLink>) => {
    if (!products.length) return
    const list = picks.get(curatorSlug) ?? []
    list.push(...products.map(p => ({ ...p, ...meta })))
    picks.set(curatorSlug, list)
    sources.set(curatorSlug, (sources.get(curatorSlug) ?? new Set()).add(meta.sourceUrl))
  }

  for (const parts of getArticleSlugs()) {
    const article = getArticleBySlug(parts)
    if (!article || article.frontmatter.published === false) continue

    const f = article.frontmatter
    const meta = {
      sourceTitle: f.title,
      sourceUrl: `/${f.category}/${f.subcategory ? `${f.subcategory}/` : ''}${f.slug}`,
      sourceDate: f.date_published,
    }

    // 1. Articles written by a curator — frontmatter links plus body cards.
    const author = f.author ? byName.get(normaliseName(f.author)) : undefined
    if (author) {
      const own = [...(article.products ?? []), ...parseShopItems(article.content)]
        .filter(p => p.type !== 'dead')
        .map(withFallbackName)
      add(author.slug, own, meta)
    }

    // 2. Team articles — attribute each curator only their own picks.
    if (f.contributors?.length) {
      const attributed = productsByContributor(article.content)
      for (const [name, products] of attributed) {
        const curator = byName.get(name)
        // Skip the author's own quote; it was already taken in full above.
        if (!curator || curator.slug === author?.slug) continue
        add(curator.slug, products.filter(p => p.type !== 'dead').map(withFallbackName), meta)
      }
    }
  }

  return curators
    .map((c): CuratorCollection => {
      const seen = new Set<string>()
      const products = (picks.get(c.slug) ?? []).filter(p => {
        const key = productKey(p)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      return {
        slug: c.slug,
        name: c.name,
        role: c.role,
        bio: c.bio,
        photo: curatorPortrait(c),
        instagram: c.instagram,
        collectionHandle: c.shopCollection!,
        products,
        productCount: products.length,
        articleCount: sources.get(c.slug)?.size ?? 0,
      }
    })
    .filter(c => c.productCount > 0) // an empty curator page is worse than none
    .sort((a, b) => b.productCount - a.productCount)
}

export function getCuratorBySlug(slug: string): CuratorCollection | undefined {
  return getCuratorCollections().find(c => c.slug === slug)
}
