import { getArticlesByCategory } from '@/lib/content'
import ArticleGrid from '@/components/article/ArticleGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sigourney's Edit",
  description: "The products, rituals and discoveries Sigourney can't live without.",
}

export default async function SigourneysEditPage() {
  const articles = getArticlesByCategory('sigourneys-edit')
  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <h1 className="mb-4">Sigourney's Edit</h1>
      <p className="text-lg text-charcoal-light mb-10 max-w-2xl">
        The products, rituals and discoveries I can't live without.
      </p>
      <ArticleGrid articles={articles as any} />
    </div>
  )
}
