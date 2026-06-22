'use client'

import { useState } from 'react'
import ArticleCard from './ArticleCard'

const PAGE_SIZE = 12

interface Article {
  frontmatter: {
    title: string
    slug: string
    category: string
    subcategory?: string
    excerpt?: string
    featured_image?: string
    featured_image_alt?: string
  }
}

function articleHref(f: Article['frontmatter']) {
  return `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
}

export default function ArticleGridPaginated({ articles }: { articles: Article[] }) {
  const [count, setCount] = useState(PAGE_SIZE)
  const visible = articles.slice(0, count)
  const hasMore = count < articles.length

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visible.map((article, i) => {
          const f = article?.frontmatter
          if (!f) return null
          return <ArticleCard key={f.slug ?? i} frontmatter={f} href={articleHref(f)} />
        })}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setCount(c => c + PAGE_SIZE)}
            className="font-sans text-[10px] tracking-[0.3em] uppercase border border-charcoal px-8 py-3 hover:bg-charcoal hover:text-cream transition-colors duration-300"
          >
            Load more
          </button>
        </div>
      )}
    </>
  )
}
