'use client'
import { useEffect, useRef } from 'react'

interface Props { query: string }

export default function SearchResults({ query }: Props) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/pagefind/pagefind-ui.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = '/pagefind/pagefind-ui.js'
    script.onload = () => {
      // @ts-ignore — pagefind-ui.js is a generated static file, not an npm package
      new window.PagefindUI({
        element: '#pagefind-search',
        showSubResults: true,
        defaultValue: query,
      })
    }
    document.head.appendChild(script)
  }, []) // init once — Pagefind owns its own input state after mount

  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-ink mb-8">
        {query ? `Results for "${query}"` : 'Search'}
      </h1>
      <div id="pagefind-search" />
    </div>
  )
}
