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
      const ui = new window.PagefindUI({
        element: '#pagefind-search',
        showSubResults: true,
        showImages: true,
        // Group results by record type (Article / Product / Brand). Pagefind reads
        // the `type` filter baked into each record at build time and renders the
        // filter panel automatically.
        filters: { type: true },
      })
      // Run the query from the URL (?q=). PagefindUI has no `defaultValue`
      // option — triggerSearch fills the box and executes the search.
      if (query) ui.triggerSearch(query)
    }
    document.head.appendChild(script)
  }, []) // init once — Pagefind owns its own input state after mount

  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-ink mb-8">
        {query ? `Results for "${query}"` : 'Search'}
      </h1>
      <div id="pagefind-search" />
      <p className="mt-10 text-center font-serif text-charcoal-light/60" style={{ fontSize: 'clamp(14px,1.4vw,16px)' }}>
        Not finding what you&apos;re after?{' '}
        <a href="/shop/suggest" className="text-wine hover:text-wine/70 transition-colors">Tell us what we should be stocking.</a>
      </p>
    </div>
  )
}
