import type { MetadataRoute } from 'next'
import { getArticleSlugs, getArticleBySlug } from '@/lib/content'
import { getAllProductHandles, getAllCollectionHandles } from '@/lib/shopify'

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com').replace(/\/$/, '')

const STATIC: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/about', priority: 0.8 },
  { path: '/press', priority: 0.8 },
  { path: '/archive', priority: 0.8 },
  { path: '/shop', priority: 0.8 },
  { path: '/shop/beauty', priority: 0.7 },
  { path: '/shop/wellness', priority: 0.7 },
  { path: '/shop/living', priority: 0.7 },
  { path: '/shop/style', priority: 0.4 },
  { path: '/shop/brands', priority: 0.6 },
  { path: '/shop/gifting', priority: 0.6 },
  { path: '/shop/shipping', priority: 0.3 },
  { path: '/shop/refund-policy', priority: 0.3 },
  { path: '/interviews', priority: 0.6 },
  { path: '/sigourneys-edit', priority: 0.6 },
  { path: '/vodcast', priority: 0.6 },
  { path: '/advertise-with-us', priority: 0.4 },
  { path: '/contact', priority: 0.4 },
  { path: '/subscribe', priority: 0.4 },
]

function safeDate(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback
  const d = new Date(value)
  return isNaN(d.getTime()) ? fallback : d
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const s of STATIC) {
    entries.push({ url: `${SITE}${s.path}`, lastModified: now, changeFrequency: 'weekly', priority: s.priority })
  }

  const sections = new Set<string>()
  for (const parts of getArticleSlugs()) {
    const article = getArticleBySlug(parts)
    if (!article || article.frontmatter.published === false) continue
    if (parts.length >= 1) sections.add(parts[0])
    if (parts.length >= 2) sections.add(`${parts[0]}/${parts[1]}`)
    entries.push({
      url: `${SITE}/${parts.join('/')}`,
      lastModified: safeDate(article.frontmatter.date_published, now),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }
  for (const s of sections) {
    entries.push({ url: `${SITE}/${s}`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 })
  }

  try {
    const products = await getAllProductHandles()
    for (const p of products) {
      entries.push({
        url: `${SITE}/shop/products/${p.handle}`,
        lastModified: safeDate(p.updatedAt, now),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
    const collections = await getAllCollectionHandles()
    for (const h of collections) {
      entries.push({ url: `${SITE}/shop/collections/${h}`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 })
    }
  } catch {
    // Shopify unavailable at build — keep the rest of the sitemap.
  }

  return entries
}
