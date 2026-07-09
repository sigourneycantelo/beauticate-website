'use client'

import { useState } from 'react'
import ProductGrid from './ProductGrid'
import type { ShopifyProduct } from '@/types/shopify'

export type BrowsableProduct = ShopifyProduct & { subSlugs?: string[] }

interface Props {
  products: BrowsableProduct[]
  subs: { slug: string; label: string }[]
  initialSub?: string
}

export default function CategoryBrowser({ products, subs, initialSub }: Props) {
  const valid = initialSub && subs.some(s => s.slug === initialSub) ? initialSub : 'all'
  const [active, setActive] = useState(valid)

  const filtered = active === 'all' ? products : products.filter(p => p.subSlugs?.includes(active))

  const btn = (slug: string, label: string) => (
    <button
      key={slug}
      onClick={() => setActive(slug)}
      className={`font-sans text-[11px] tracking-[0.18em] uppercase px-4 py-2 border transition-colors ${
        active === slug
          ? 'border-ink bg-ink text-paper'
          : 'border-ink/20 text-charcoal-light hover:border-ink hover:text-ink'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div>
      {subs.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {btn('all', 'All')}
          {subs.map(s => btn(s.slug, s.label))}
        </div>
      )}

      <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light mb-6">
        {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
      </p>

      {filtered.length > 0 ? (
        <ProductGrid products={filtered} />
      ) : (
        <p className="font-serif text-charcoal-light/60 py-16 text-center">Nothing in this edit just yet.</p>
      )}
    </div>
  )
}
