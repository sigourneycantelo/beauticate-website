import { getArticleBySlug, getArticlesBySubcategory, getRelatedArticles } from '@/lib/content'
import { getProductsByHandles, getProductsByTag } from '@/lib/shopify'
import { buildCategoryMetadata } from '@/lib/seo'
import ArticlePage from '@/components/article/ArticlePage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import EditorialSections from '@/components/shared/EditorialSections'

interface Props { params: Promise<{ category: string; subcategory: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params
  const article = getArticleBySlug([category, subcategory])
  if (article) {
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

  // Not a 2-level article — check whether it's a subcategory archive instead
  if (!getArticlesBySubcategory(category, subcategory).length) return {}
  return buildCategoryMetadata(category, subcategory)
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
      <div className="max-w-wide mx-auto px-4 py-6 sm:py-12">
        <h1 className="font-sans uppercase tracking-[0.34em] text-xs mb-6 sm:mb-8">{subcategory.replace(/-/g, ' ')}</h1>
        <ArticleGrid articles={allArticles as any} />
      </div>
    )
  }

  const MAX_EDITORIAL = 34
  const articles = allArticles.slice(0, MAX_EDITORIAL).map(a => ({
    frontmatter: a.frontmatter,
  }))

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

      <EditorialSections articles={articles as any} shopProducts={shopProducts} />
    </>
  )
}
