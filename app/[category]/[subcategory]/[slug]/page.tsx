import { getArticleBySlug, getRelatedArticles } from '@/lib/content'
import { getProductsByHandles } from '@/lib/shopify'
import ArticlePage from '@/components/article/ArticlePage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props { params: Promise<{ category: string; subcategory: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory, slug } = await params
  const article = getArticleBySlug([category, subcategory, slug])
  if (!article) return {}
  const { frontmatter: f } = article
  return {
    title: f.seo_title ?? f.title,
    description: f.meta_description,
    openGraph: {
      title: f.og_title ?? f.title,
      description: f.og_description ?? f.meta_description,
      images: f.og_image ? [f.og_image] : [],
      type: 'article',
      publishedTime: f.date_published,
      modifiedTime: f.date_modified,
    },
  }
}

export default async function ArticleRoute({ params }: Props) {
  const { category, subcategory, slug } = await params
  const article = getArticleBySlug([category, subcategory, slug])
  if (!article) notFound()

  const shopProducts = await getProductsByHandles(
    article.products.filter(p => p.type === 'shop').map(p => p.handle!)
  )

  const related = getRelatedArticles(slug, category, article.frontmatter.tags)

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
