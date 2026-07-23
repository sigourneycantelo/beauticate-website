'use client'

// Sub-category filters render as large image tiles (two rows of four), with a second
// row of product-type filter buttons for whichever sub-category is selected.
import { useState, useRef } from 'react'
import Image from 'next/image'
import ProductGrid from './ProductGrid'
import type { ShopifyProduct } from '@/types/shopify'

export type BrowsableProduct = ShopifyProduct & { subSlugs?: string[] }

export interface SubTile { slug: string; label: string; image?: string; comingSoon?: boolean }

interface Props {
  products: BrowsableProduct[]
  subs: SubTile[]
  initialSub?: string
  allImage?: string
}

export default function CategoryBrowser({ products, subs, initialSub, allImage }: Props) {
  const valid = initialSub && subs.some(s => s.slug === initialSub && !s.comingSoon) ? initialSub : 'all'
  const [active, setActive] = useState(valid)
  const [activeType, setActiveType] = useState('all')
  const resultsRef = useRef<HTMLDivElement>(null)

  const inSub = active === 'all' ? products : products.filter(p => p.subSlugs?.includes(active))
  const filtered = activeType === 'all' ? inSub : inSub.filter(p => (p.productType ?? '').trim() === activeType)

  // Obvious product types within the selected sub-category (those with 2+ pieces).
  const typeCounts = new Map<string, number>()
  for (const p of inSub) {
    const t = (p.productType ?? '').trim()
    if (t) typeCounts.set(t, (typeCounts.get(t) ?? 0) + 1)
  }
  const types = [...typeCounts.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).map(([t]) => t)
  const showTypes = active !== 'all' && types.length > 1

  const pick = (slug: string) => {
    setActive(slug)
    setActiveType('all')
    if (window.innerWidth < 768) {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }

  const tiles: SubTile[] = [{ slug: 'all', label: 'All', image: allImage }, ...subs]

  const Tile = ({ slug, label, image, comingSoon }: SubTile) => {
    const on = active === slug
    const inner = (
      <>
        <div className={`relative aspect-square overflow-hidden bg-tile mb-3 rounded-[2px] ring-1 transition-all duration-200 ${on ? 'ring-ink' : 'ring-transparent group-hover:ring-ink/30'} ${comingSoon ? 'opacity-70' : ''}`}>
          {image ? (
            <Image src={image} alt={label} fill sizes="(max-width:768px) 46vw, 300px" className={`object-cover transition-opacity duration-200 ${on ? '' : 'opacity-95 group-hover:opacity-100'}`} />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center font-serif italic text-sm opacity-30 px-2 text-center">{label}</span>
          )}
          {comingSoon && (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-[9px] tracking-[0.2em] uppercase text-ink bg-white/90 px-3 py-1.5 rounded-full whitespace-nowrap">Coming Soon</span>
          )}
          {on && <span className="absolute inset-0 bg-ink/10" aria-hidden />}
        </div>
        <span className={`font-sans text-[11px] tracking-[0.18em] uppercase transition-colors ${comingSoon ? 'text-charcoal-light/50' : on ? 'text-ink font-semibold' : 'text-charcoal-light group-hover:text-ink'}`}>{label}</span>
      </>
    )
    if (comingSoon) return <div key={slug} className="text-center cursor-default">{inner}</div>
    return (
      <button key={slug} onClick={() => pick(slug)} className="group text-center" aria-pressed={on}>{inner}</button>
    )
  }

  const typeBtn = (slug: string, label: string) => (
    <button
      key={slug}
      onClick={() => setActiveType(slug)}
      className={`font-sans text-[10.5px] tracking-[0.16em] uppercase px-4 py-2 border transition-colors ${
        activeType === slug ? 'border-ink bg-ink text-paper' : 'border-ink/20 text-charcoal-light hover:border-ink hover:text-ink'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div>
      {subs.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {tiles.map(t => <Tile key={t.slug} {...t} />)}
        </div>
      )}

      {showTypes && (
        <div className="flex flex-wrap gap-2 mb-8">
          {typeBtn('all', `All ${subs.find(s => s.slug === active)?.label ?? ''}`.trim())}
          {types.map(t => typeBtn(t, t))}
        </div>
      )}

      <p ref={resultsRef} className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light mb-6">
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
