import ArticleGridPaginated from './ArticleGridPaginated'

interface Props { articles: any[] }

export default function ArticleGrid({ articles }: Props) {
  if (!articles.length) return null
  return <ArticleGridPaginated articles={articles} />
}
