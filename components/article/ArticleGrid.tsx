import ArticleGridPaginated from './ArticleGridPaginated'

interface Props { articles: any[] }

export default function ArticleGrid({ articles }: Props) {
  if (!articles.length) return null
  return (
    <section className="max-w-wide mx-auto px-4 py-12">
      <ArticleGridPaginated articles={articles} />
    </section>
  )
}
