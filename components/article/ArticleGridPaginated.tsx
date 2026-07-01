'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

function Card({ article }: { article: Article }) {
  const f = article.frontmatter
  return (
    <article className="group">
      <Link href={articleHref(f)} className="block">
        <div className="relative overflow-hidden bg-parchment aspect-square">
          {f.featured_image && (
            <Image
              src={f.featured_image}
              alt={f.featured_image_alt ?? f.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <div className="mt-3">
          {f.category && (
            <p className="text-xs tracking-widest uppercase text-charcoal-light mb-1">
              {f.category.replace(/-/g, ' ')}
            </p>
          )}
          <h3 className="font-serif text-lg md:text-xl leading-snug group-hover:text-wine transition-colors">
            {f.title}
          </h3>
          {f.excerpt && (
            <p className="text-sm text-charcoal-light mt-1 line-clamp-2">{f.excerpt}</p>
          )}
        </div>
      </Link>
    </article>
  )
}

export default function ArticleGridPaginated({ articles }: { articles: any[] }) {
  const [count, setCount] = useState(PAGE_SIZE)
  const visible = articles.slice(0, count)
  const hasMore = count < articles.length

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visible.map((article, i) => {
          const f = article?.frontmatter
          if (!f) return null
          return <Card key={f.slug ?? i} article={article} />
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
