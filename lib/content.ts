import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ArticleFrontmatter, VodcastFrontmatter } from '@/types/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const VODCAST_DIR = path.join(CONTENT_DIR, 'vodcast', 'episodes')

// ─── Articles ────────────────────────────────────────────────────────────────

export function getArticleSlugs(): string[][] {
  const slugs: string[][] = []

  function walk(dir: string, parts: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const mdxPath = path.join(dir, entry.name, `${entry.name}.mdx`)
        if (fs.existsSync(mdxPath)) {
          slugs.push([...parts, entry.name])
        } else {
          walk(path.join(dir, entry.name), [...parts, entry.name])
        }
      }
    }
  }

  if (fs.existsSync(CONTENT_DIR)) walk(CONTENT_DIR, [])
  return slugs
}

export function getArticleBySlug(slugParts: string[]): {
  frontmatter: ArticleFrontmatter
  content: string
  products: import('@/types/content').ProductLink[]
} | null {
  const articleDir = path.join(CONTENT_DIR, ...slugParts)
  const slug = slugParts[slugParts.length - 1]
  const mdxPath = path.join(articleDir, `${slug}.mdx`)
  const productsPath = path.join(articleDir, 'products.json')

  if (!fs.existsSync(mdxPath)) return null

  const raw = fs.readFileSync(mdxPath, 'utf-8')
  const { data, content } = matter(raw)

  // product_links live in frontmatter; fall back to products.json for legacy articles
  const products = (data.product_links as import('@/types/content').ProductLink[] | undefined)
    ?? (fs.existsSync(productsPath) ? JSON.parse(fs.readFileSync(productsPath, 'utf-8')) : [])

  return {
    frontmatter: data as ArticleFrontmatter,
    content,
    products,
  }
}

function isPublished(a: { frontmatter: ArticleFrontmatter } | null): boolean {
  if (!a) return false
  return a.frontmatter.published !== false
}

export function getArticlesByCategory(category: string, subcategory?: string) {
  const allSlugs = getArticleSlugs()
  return allSlugs
    .filter(parts => {
      if (subcategory) return parts[0] === category && parts[1] === subcategory
      return parts[0] === category
    })
    .map(parts => getArticleBySlug(parts))
    .filter(isPublished)
    .sort((a, b) => {
      const dateA = new Date(a?.frontmatter.date_published ?? '2000-01-01').getTime()
      const dateB = new Date(b?.frontmatter.date_published ?? '2000-01-01').getTime()
      return dateB - dateA
    })
}

// Subcategory archive listing: folder members PLUS any published article that
// opts in via `also_in: ["<category>/<subcategory>"]` (explicit cross-listing —
// e.g. a fragrance interview that lives under /interviews but should also appear
// in the fragrance archive). Deduped by slug, newest first.
export function getArticlesBySubcategory(category: string, subcategory: string) {
  const key = `${category}/${subcategory}`
  const inFolder = getArticlesByCategory(category, subcategory)
  const seen = new Set(inFolder.map(a => a?.frontmatter.slug))
  const crossListed = getArticleSlugs()
    .map(parts => getArticleBySlug(parts))
    .filter(isPublished)
    .filter(a => (a?.frontmatter.also_in ?? []).includes(key))
    .filter(a => !seen.has(a?.frontmatter.slug))
  return [...inFolder, ...crossListed].sort((a, b) => {
    const dateA = new Date(a?.frontmatter.date_published ?? '2000-01-01').getTime()
    const dateB = new Date(b?.frontmatter.date_published ?? '2000-01-01').getTime()
    return dateB - dateA
  })
}

export function getHeroArticle() {
  const allSlugs = getArticleSlugs()
  return allSlugs
    .map(parts => getArticleBySlug(parts))
    .filter(isPublished)
    .find(a => a?.frontmatter.is_hero) ?? null
}

export function getFeaturedArticles(limit = 6) {
  const allSlugs = getArticleSlugs()
  return allSlugs
    .map(parts => getArticleBySlug(parts))
    .filter(isPublished)
    .filter(a => a?.frontmatter.is_featured)
    .slice(0, limit)
}

// Returns all published articles with images for the home page grid.
// Articles with `home_rank` are pinned to the top in ascending rank order
// (editorial curation — e.g. keep a just-demoted hero or a launch piece up top);
// everything else flows newest-first by date_published.
// Use excludeSlugs to avoid repeating articles already shown elsewhere on the page.
export function getAllArticles(limit = 20, excludeSlugs: string[] = []) {
  const allSlugs = getArticleSlugs()
  return allSlugs
    .map(parts => getArticleBySlug(parts))
    .filter(isPublished)
    .filter(a => a?.frontmatter.featured_image)
    .filter(a => !excludeSlugs.includes(a!.frontmatter.slug))
    .sort((a, b) => {
      const rankA = a?.frontmatter.home_rank ?? Infinity
      const rankB = b?.frontmatter.home_rank ?? Infinity
      if (rankA !== rankB) return rankA - rankB   // pinned articles first, by rank
      const dateA = new Date(a?.frontmatter.date_published ?? '2000-01-01').getTime()
      const dateB = new Date(b?.frontmatter.date_published ?? '2000-01-01').getTime()
      return dateB - dateA
    })
    .slice(0, limit)
}

export function getRelatedArticles(
  currentSlug: string,
  category: string,
  tags: string[],
  limit = 4
) {
  return getArticlesByCategory(category)
    .filter(isPublished)
    .filter(a => a?.frontmatter.slug !== currentSlug)
    .sort((a, b) => {
      const aMatches = (a?.frontmatter.tags ?? []).filter(t => tags.includes(t)).length
      const bMatches = (b?.frontmatter.tags ?? []).filter(t => tags.includes(t)).length
      return bMatches - aMatches
    })
    .slice(0, limit)
}

// ─── Vodcast ─────────────────────────────────────────────────────────────────

export function getVodcastEpisodes(): {
  frontmatter: VodcastFrontmatter
  content: string
}[] {
  if (!fs.existsSync(VODCAST_DIR)) return []

  return fs
    .readdirSync(VODCAST_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => {
      const mdxPath = path.join(VODCAST_DIR, e.name, `${e.name}.mdx`)
      if (!fs.existsSync(mdxPath)) return null
      const raw = fs.readFileSync(mdxPath, 'utf-8')
      const { data, content } = matter(raw)
      return { frontmatter: data as VodcastFrontmatter, content }
    })
    .filter(Boolean)
    .sort((a, b) => {
      const dateA = new Date(a?.frontmatter.date_published ?? '2000-01-01').getTime()
      const dateB = new Date(b?.frontmatter.date_published ?? '2000-01-01').getTime()
      return dateB - dateA
    }) as { frontmatter: VodcastFrontmatter; content: string }[]
}

export function getVodcastEpisode(slug: string): { frontmatter: VodcastFrontmatter; content: string } | null {
  const mdxPath = path.join(VODCAST_DIR, slug, `${slug}.mdx`)
  if (!fs.existsSync(mdxPath)) return null
  const raw = fs.readFileSync(mdxPath, 'utf-8')
  const { data, content } = matter(raw)
  return { frontmatter: data as VodcastFrontmatter, content }
}
