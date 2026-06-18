import { getArticleBySlug, getArticlesByCategory, getRelatedArticles } from '@/lib/content'
import { getProductsByHandles } from '@/lib/shopify'
import ArticlePage from '@/components/article/ArticlePage'
import ArticleGrid from '@/components/article/ArticleGrid'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

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

  // Otherwise render subcategory archive
  const articles = getArticlesByCategory(category, subcategory)
  if (!articles.length) notFound()

  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <h1 className="capitalize mb-8">{subcategory.replace(/-/g, ' ')}</h1>
      <ArticleGrid articles={articles as any} />
    </div>
  )
}
