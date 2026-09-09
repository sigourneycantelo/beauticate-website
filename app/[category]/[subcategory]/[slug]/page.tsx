import { getArticleBySlug, getRelatedArticles } from '@/lib/content'
import { getProductsByHandles } from '@/lib/shopify'
import ArticlePage from '@/components/article/ArticlePage'
import ArticleJsonLd from '@/components/article/ArticleJsonLd'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildArticleMetadata } from '@/lib/seo'

interface Props { params: Promise<{ category: string; subcategory: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory, slug } = await params
  const article = getArticleBySlug([category, subcategory, slug])
  if (!article) return {}
  const url = `/${category}/${subcategory}/${slug}`
  return buildArticleMetadata(article.frontmatter, url)
}

export default async function ArticleRoute({ params }: Props) {
  const { category, subcategory, slug } = await params
  const article = getArticleBySlug([category, subcategory, slug])
  if (!article || article.frontmatter.published === false) notFound()

  const { frontmatter: f, content, products } = article

  // Shop products to fetch: frontmatter product_links + any handle="..." used by
  // <ShopItem handle> in the body, so own-shop cards get live image/price/hover.
  const bodyHandles = [...content.matchAll(/\bhandle="([^"]+)"/g)].map(m => m[1])
  const shopHandles = [...new Set([
    ...products.filter(p => p.type === 'shop').map(p => p.handle!),
    ...bodyHandles,
  ])]
  const shopProducts = await getProductsByHandles(shopHandles)

  const related = getRelatedArticles(slug, category, f.tags ?? [])

  return (
    <>
      <ArticleJsonLd frontmatter={f} segments={[category, subcategory, slug]} content={content} />
      <ArticlePage
        frontmatter={f}
        content={content}
        productLinks={products}
        shopProducts={shopProducts}
        relatedArticles={related as any}
      />
    </>
  )
}
