import { getArticlesByCategory } from '@/lib/content'
import ArticleGrid from '@/components/article/ArticleGrid'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ category: string }> }

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const articles = getArticlesByCategory(category)
  if (!articles.length) notFound()

  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <h1 className="capitalize mb-8">{category.replace(/-/g, ' ')}</h1>
      <ArticleGrid articles={articles as any} />
    </div>
  )
}
