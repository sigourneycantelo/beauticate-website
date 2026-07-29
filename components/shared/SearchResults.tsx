'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductTile from './ProductTile'

interface Props { query: string }

// A single Pagefind result once its data() has resolved.
interface Hit {
  url: string
  excerpt: string
  meta: {
    type?: 'Article' | 'Product' | 'Brand'
    title?: string
    image?: string
    image_alt?: string
    brand?: string
    price?: string
    excerpt?: string
  }
}

type Tab = 'all' | 'Product' | 'Brand' | 'Article'

// Pagefind's low-level bundle is a static file in /public, not an npm module —
// import it at runtime and keep webpack from trying to resolve it at build time.
let pagefindPromise: Promise<any> | null = null
function loadPagefind(): Promise<any> {
  if (!pagefindPromise) {
    // pagefind.js is generated into /public at build time, so it isn't a
    // resolvable module at type-check time. Hold the path in a variable so
    // TypeScript treats this as a dynamic import (Promise<any>) instead of
    // trying — and failing — to resolve the specifier.
    const pagefindSrc = '/pagefind/pagefind.js'
    pagefindPromise = import(/* webpackIgnore: true */ pagefindSrc)
      .then(async (pf: any) => { await pf.options?.({ excerptLength: 20 }); await pf.init?.(); return pf })
  }
  return pagefindPromise
}

// How many cards each group shows in the combined "All" view before "View all".
const PREVIEW = { Product: 8, Brand: 6, Article: 6 } as const

export default function SearchResults({ query }: Props) {
  const router = useRouter()
  const [term, setTerm] = useState(query)
  const [hits, setHits] = useState<Hit[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('all')
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) { setHits([]); setLoading(false); return }
    setLoading(true)
    try {
      const pf = await loadPagefind()
      const search = await pf.search(trimmed)
      const data: Hit[] = await Promise.all(search.results.map((r: any) => r.data()))
      setHits(data)
    } catch {
      setHits([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Re-run when the URL query changes (e.g. arriving from the header search bar).
  useEffect(() => {
    setTerm(query)
    runSearch(query)
  }, [query, runSearch])

  const onChange = (v: string) => {
    setTerm(v)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => {
      runSearch(v)
      // Keep the URL shareable without stacking history entries.
      router.replace(v.trim() ? `/search?q=${encodeURIComponent(v.trim())}` : '/search')
    }, 220)
  }

  const groups = {
    Product: (hits ?? []).filter(h => h.meta.type === 'Product'),
    Brand: (hits ?? []).filter(h => h.meta.type === 'Brand'),
    Article: (hits ?? []).filter(h => h.meta.type === 'Article'),
  }
  const total = (hits ?? []).length

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: total },
    { key: 'Article', label: 'Stories', count: groups.Article.length },
    { key: 'Product', label: 'Products', count: groups.Product.length },
    { key: 'Brand', label: 'Brands', count: groups.Brand.length },
  ]

  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-ink mb-6">
        {term ? <>Results for &ldquo;{term}&rdquo;</> : 'Search'}
      </h1>

      {/* Search box */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 border-b border-charcoal focus-within:border-wine transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 opacity-50">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            autoFocus type="search" value={term}
            onChange={e => onChange(e.target.value)}
            placeholder="Search articles, products, brands..."
            className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Type tabs */}
      {total > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 border-b border-charcoal/10 pb-3">
          {tabs.filter(t => t.count > 0 || t.key === 'all').map(t => (
            <button
              key={t.key} onClick={() => setTab(t.key)}
              className={`font-sans text-xs tracking-[0.18em] uppercase transition-colors ${
                tab === t.key ? 'text-wine' : 'text-charcoal-light/70 hover:text-ink'
              }`}
            >
              {t.label} <span className="opacity-50">({t.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* States */}
      {loading && hits === null && (
        <p className="mt-10 font-serif text-charcoal-light/60">Searching…</p>
      )}
      {!loading && hits !== null && total === 0 && term.trim() && (
        <p className="mt-10 font-serif text-charcoal-light/70">
          No results for &ldquo;{term}&rdquo;.
        </p>
      )}

      {/* Sections — editorial first: Stories lead whenever there are article
          matches, then the shop. Sections only render when they have results, so
          a query with no articles falls back to Products/Brands leading. In a
          dedicated tab, only that group renders (uncapped). */}
      <div className="mt-8 space-y-14">
        {(tab === 'all' || tab === 'Article') && groups.Article.length > 0 && (
          <Section
            title="Stories" count={groups.Article.length}
            showAll={tab === 'Article'} onViewAll={() => setTab('Article')}
          >
            <div className="divide-y divide-charcoal/10 border-t border-charcoal/10">
              {(tab === 'all' ? groups.Article.slice(0, PREVIEW.Article) : groups.Article).map(h => (
                <ArticleRow key={h.url} hit={h} />
              ))}
            </div>
          </Section>
        )}

        {(tab === 'all' || tab === 'Product') && groups.Product.length > 0 && (
          <Section
            title="Products" count={groups.Product.length}
            showAll={tab === 'Product'} onViewAll={() => setTab('Product')}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {(tab === 'all' ? groups.Product.slice(0, PREVIEW.Product) : groups.Product).map(h => (
                <ProductTile
                  key={h.url} href={h.url} cover={false}
                  primarySrc={h.meta.image} primaryAlt={h.meta.image_alt || h.meta.title}
                  brand={h.meta.brand} name={h.meta.title || ''} price={h.meta.price}
                />
              ))}
            </div>
          </Section>
        )}

        {(tab === 'all' || tab === 'Brand') && groups.Brand.length > 0 && (
          <Section
            title="Brands" count={groups.Brand.length}
            showAll={tab === 'Brand'} onViewAll={() => setTab('Brand')}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {(tab === 'all' ? groups.Brand.slice(0, PREVIEW.Brand) : groups.Brand).map(h => (
                <ProductTile
                  key={h.url} href={h.url} cover
                  primarySrc={h.meta.image} primaryAlt={h.meta.image_alt || h.meta.title}
                  cornerLabel="Brand" name={h.meta.title || ''}
                />
              ))}
            </div>
          </Section>
        )}
      </div>

      <p className="mt-16 text-center font-serif text-charcoal-light/60" style={{ fontSize: 'clamp(14px,1.4vw,16px)' }}>
        Not finding what you&apos;re after?{' '}
        <a href="/shop/suggest" className="text-wine hover:text-wine/70 transition-colors">Tell us what we should be stocking.</a>
      </p>
    </div>
  )
}

function Section({
  title, count, showAll, onViewAll, children,
}: {
  title: string; count: number; showAll: boolean; onViewAll: () => void; children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-sans text-xs tracking-[0.22em] uppercase text-ink">{title}</h2>
        {!showAll && count > 0 && (
          <button onClick={onViewAll} className="font-sans text-[11px] tracking-[0.14em] uppercase text-wine hover:text-wine/70">
            View all {count} →
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

function ArticleRow({ hit }: { hit: Hit }) {
  return (
    <Link href={hit.url} className="group flex gap-5 py-6 items-start">
      {hit.meta.image && (
        <div className="relative shrink-0 w-28 h-20 md:w-40 md:h-28 overflow-hidden bg-tile">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hit.meta.image} alt={hit.meta.image_alt || hit.meta.title || ''}
            className="absolute inset-0 w-full h-full object-cover object-[50%_20%]"
          />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="font-serif text-lg md:text-xl leading-snug text-ink group-hover:underline [text-underline-offset:3px] [text-decoration-thickness:0.5px]">
          {hit.meta.title}
        </h3>
        <p
          className="mt-1.5 font-serif text-sm text-charcoal-light/75 line-clamp-2 [&_mark]:bg-transparent [&_mark]:text-wine [&_mark]:font-medium"
          dangerouslySetInnerHTML={{ __html: hit.excerpt }}
        />
      </div>
    </Link>
  )
}
