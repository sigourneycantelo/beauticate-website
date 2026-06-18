import { getArticlesByCategory } from '@/lib/content'
import ArticleGrid from '@/components/article/ArticleGrid'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ category: string; subcategory: string }> }

export default async function SubcategoryPage({ params }: Props) {
  const { category, subcategory } = await params
  const articles = getArticlesByCategory(category, subcategory)
  if (!articles.length) notFound()

  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <h1 className="capitalize mb-8">{subcategory.replace(/-/g, ' ')}</h1>
      <ArticleGrid articles={articles as any} />
    </div>
  )
}
