'use client'
import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'

interface Article {
  title: string
  slug: string
  url: string
  category: string
  subcategory: string
  author: string
  date: string
  excerpt: string
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-eucalypt/20 text-ink">{p}</mark>
      : p
  )
}

function formatCategory(cat: string, sub: string) {
  const label = (sub || cat).replace(/-/g, ' ')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export default function SearchResults({ query }: { query: string }) {
  const [index, setIndex] = useState<Article[]>([])
  const [results, setResults] = useState<Article[]>([])
  const [, startTransition] = useTransition()

  useEffect(() => {
    fetch('/search-index.json')
      .then(r => r.json())
      .then(setIndex)
      .catch(() => setIndex([]))
  }, [])

  useEffect(() => {
    if (!index.length) return
    const q = query.toLowerCase().trim()
    if (!q) { setResults([]); return }
    startTransition(() => {
      const terms = q.split(/\s+/)
      const scored = index
        .map(a => {
          const haystack = [a.title, a.author, a.category, a.subcategory, a.excerpt]
            .join(' ').toLowerCase()
          const score = terms.reduce((s, t) => {
            if (a.title.toLowerCase().includes(t)) return s + 3
            if (haystack.includes(t)) return s + 1
            return s
          }, 0)
          return { ...a, score }
        })
        .filter(a => a.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 40)
      setResults(scored)
    })
  }, [query, index])

  if (!query.trim()) {
    return (
      <div className="max-w-wide mx-auto px-4 py-12">
        <p className="font-hanken text-sm tracking-widest uppercase text-ink/50">
          Enter a search term above
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <div className="mb-8 flex items-baseline gap-4">
        <h1 className="font-garamond text-3xl">
          {results.length > 0
            ? <>Results for <em>"{query}"</em></>
            : <>No results for <em>"{query}"</em></>}
        </h1>
        {results.length > 0 && (
          <span className="font-hanken text-xs tracking-widest uppercase text-ink/40">
            {results.length} article{results.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {results.length === 0 && index.length > 0 && (
        <p className="font-garamond text-lg text-ink/60">
          Try a different keyword, author name or category.
        </p>
      )}

      {index.length === 0 && (
        <p className="font-hanken text-sm tracking-widest uppercase text-ink/40">
          Loading…
        </p>
      )}

      <ul className="divide-y divide-ink/10">
        {results.map(a => (
          <li key={a.slug} className="py-5">
            <Link href={a.url} className="group block">
              <div className="mb-1 flex items-center gap-3">
                <span className="font-hanken text-[10px] tracking-widest uppercase text-eucalypt">
                  {formatCategory(a.category, a.subcategory)}
                </span>
                {a.author && (
                  <span className="font-hanken text-[10px] tracking-widest uppercase text-ink/35">
                    {a.author}
                  </span>
                )}
                {a.date && (
                  <span className="font-hanken text-[10px] tracking-widest uppercase text-ink/30">
                    {new Date(a.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
              <h2 className="font-garamond text-xl leading-snug transition-colors group-hover:text-eucalypt">
                {highlight(a.title, query)}
              </h2>
              {a.excerpt && (
                <p className="mt-1 line-clamp-2 font-garamond text-sm text-ink/60">
                  {highlight(a.excerpt, query)}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
