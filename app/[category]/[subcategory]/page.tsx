import { getArticleBySlug, getArticlesBySubcategory, getRelatedArticles } from '@/lib/content'
import { getProductsByHandles, getProductsByTag } from '@/lib/shopify'
import ArticlePage from '@/components/article/ArticlePage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import HeroSplit from '@/components/home/HeroSplit'
import StoriesTrio from '@/components/home/StoriesTrio'
import DuoStagger from '@/components/home/DuoStagger'
import DuoLeft from '@/components/home/DuoLeft'
import ShopStrip from '@/components/home/ShopStrip'

interface Props { params: Promise<{ category: string; subcategory: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params
  const article = getArticleBySlug([category, subcategory])
  if (!article) return {}
  const { frontmatter: f } = article
  return {
    title: f.seo_title ?? f.title,
    description: f.seo_description,
    openGraph: {
      title: f.title,
      description: f.seo_description,
      images: f.og_image ? [f.og_image] : [],
      type: 'article',
      publishedTime: f.date_published,
      modifiedTime: f.date_modified,
    },
  }
}

export default async function SubcategoryOrArticlePage({ params }: Props) {
  const { category, subcategory } = await params

  // Check if this is a 2-level article (no subcategory in the path)
  const article = getArticleBySlug([category, subcategory])
  if (article && article.frontmatter.published === false) notFound()
  if (article) {
    const shopProducts = await getProductsByHandles(
      article.products.filter(p => p.type === 'shop').map(p => p.handle!)
    )
    const related = getRelatedArticles(subcategory, category, article.frontmatter.tags ?? [])
    return (
      <ArticlePage
        frontmatter={article.frontmatter}
        content={article.content}
        productLinks={article.products}
        shopProducts={shopProducts}
        relatedArticles={related as any}
      />
    )
  }

  // Otherwise render subcategory archive (folder members + any `also_in` cross-posts)
  const rawArticles = getArticlesBySubcategory(category, subcategory)
  const allArticles = rawArticles.filter((a): a is NonNullable<typeof a> => a != null && a.frontmatter != null)
  if (!allArticles.length) notFound()

  const EDITORIAL_CATEGORIES = new Set(['beauty-style', 'wellness', 'living'])
  if (!EDITORIAL_CATEGORIES.has(category)) {
    const ArticleGrid = (await import('@/components/article/ArticleGrid')).default
    return (
      <div className="max-w-wide mx-auto px-4 py-12">
        <h1 className="font-sans uppercase tracking-[0.34em] text-xs mb-8">{subcategory.replace(/-/g, ' ')}</h1>
        <ArticleGrid articles={allArticles as any} />
      </div>
    )
  }

  const MAX_EDITORIAL = 34
  const articles = allArticles.slice(0, MAX_EDITORIAL)

  const SUBCATEGORY_SHOP_TAG: Record<string, string> = {
    skincare: 'skincare',
    makeup: 'makeup',
    fragrance: 'fragrance',
    hair: 'hair',
    health: 'wellness',
    fitness: 'wellness',
  }
  const shopTag = SUBCATEGORY_SHOP_TAG[subcategory]
  const shopProducts = shopTag ? await getProductsByTag(shopTag, 12) : []

  // Consume articles into layout sections
  let i = 0
  function take(n: number) {
    const slice = articles.slice(i, i + n).filter(Boolean) as typeof articles
    i += n
    return slice
  }

  type Section =
    | { type: 'hero'; article: (typeof articles)[number] }
    | { type: 'trio'; articles: typeof articles }
    | { type: 'duo-stagger'; big: (typeof articles)[number]; small: (typeof articles)[number] }
    | { type: 'duo-left'; articles: typeof articles }
    | { type: 'shop' }

  const sections: Section[] = []
  let cycleCount = 0

  const [hero] = take(1)
  if (hero) sections.push({ type: 'hero', article: hero })

  while (i < articles.length) {
    const trio = take(3)
    if (trio.length) sections.push({ type: 'trio', articles: trio })

    if (cycleCount === 0 && shopProducts.length > 0) {
      sections.push({ type: 'shop' })
    }

    const duo = take(2)
    if (duo.length === 2) {
      sections.push({ type: 'duo-stagger', big: duo[0], small: duo[1] })
    } else if (duo.length === 1) {
      sections.push({ type: 'trio', articles: duo })
      break
    }

    if (i >= articles.length) break

    const trio2 = take(3)
    if (trio2.length) sections.push({ type: 'trio', articles: trio2 })

    if (i >= articles.length) break

    const [split] = take(1)
    if (split) sections.push({ type: 'hero', article: split })

    if (i >= articles.length) break

    const duoL = take(2)
    if (duoL.length >= 2) {
      sections.push({ type: 'duo-left', articles: duoL })
    } else if (duoL.length === 1) {
      sections.push({ type: 'trio', articles: duoL })
    }

    if (i >= articles.length) break

    const trio3 = take(3)
    if (trio3.length) sections.push({ type: 'trio', articles: trio3 })

    cycleCount++
  }

  return (
    <>
      <div
        className="text-center"
        style={{ padding: 'clamp(48px,6vw,82px) clamp(20px,6vw,104px) 0' }}
      >
        <h1
          className="font-sans uppercase tracking-[0.34em] text-xs font-medium"
          style={{ opacity: 0.55 }}
        >
          {subcategory.replace(/-/g, ' ')}
        </h1>
      </div>

      {sections.map((section, idx) => {
        switch (section.type) {
          case 'hero':
            return <HeroSplit key={`hero-${idx}`} article={section.article as any} />
          case 'trio':
            return <StoriesTrio key={`trio-${idx}`} articles={section.articles as any} />
          case 'duo-stagger':
            return <DuoStagger key={`duo-s-${idx}`} big={section.big as any} small={section.small as any} />
          case 'duo-left':
            return <DuoLeft key={`duo-l-${idx}`} articles={section.articles as any} />
          case 'shop':
            return <ShopStrip key={`shop-${idx}`} products={shopProducts} />
          default:
            return null
        }
      })}
    </>
  )
}
