import ArticleCard from './ArticleCard'

interface Props { articles: any[] }

export default function ArticleGrid({ articles }: Props) {
  if (!articles.length) return null
  return (
    <section className="max-w-wide mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, i) => {
          const f = article?.frontmatter
          if (!f) return null
          const href = `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
          return <ArticleCard key={i} frontmatter={f} href={href} />
        })}
      </div>
    </section>
  )
}
