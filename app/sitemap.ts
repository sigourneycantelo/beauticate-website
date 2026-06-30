import type { MetadataRoute } from 'next'
import { getArticleSlugs, getArticleBySlug } from '@/lib/content'

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com').replace(/\/$/, '')

const STATIC: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/about', priority: 0.8 },
  { path: '/press', priority: 0.8 },
  { path: '/archive', priority: 0.8 },
  { path: '/shop', priority: 0.7 },
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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const s of STATIC) {
    entries.push({
      url: `${SITE}${s.path}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: s.priority,
    })
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
    entries.push({
      url: `${SITE}/${s}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    })
  }

  return entries
}
