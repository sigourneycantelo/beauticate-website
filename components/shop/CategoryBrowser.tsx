'use client'

// Sub-category filters render as visual image tiles (see /shop/[category]).
import { useState } from 'react'
import Image from 'next/image'
import ProductGrid from './ProductGrid'
import type { ShopifyProduct } from '@/types/shopify'

export type BrowsableProduct = ShopifyProduct & { subSlugs?: string[] }

export interface SubTile { slug: string; label: string; image?: string }

interface Props {
  products: BrowsableProduct[]
  subs: SubTile[]
  initialSub?: string
  allImage?: string
}

export default function CategoryBrowser({ products, subs, initialSub, allImage }: Props) {
  const valid = initialSub && subs.some(s => s.slug === initialSub) ? initialSub : 'all'
  const [active, setActive] = useState(valid)

  const filtered = active === 'all' ? products : products.filter(p => p.subSlugs?.includes(active))

  const tiles: SubTile[] = [{ slug: 'all', label: 'All', image: allImage }, ...subs]

  const Tile = ({ slug, label, image }: SubTile) => {
    const on = active === slug
    return (
      <button key={slug} onClick={() => setActive(slug)} className="group text-center" aria-pressed={on}>
        <div className={`relative aspect-square overflow-hidden bg-tile mb-2 rounded-[2px] ring-1 transition-all duration-200 ${on ? 'ring-ink' : 'ring-transparent group-hover:ring-ink/30'}`}>
          {image ? (
            <Image src={image} alt={label} fill sizes="(max-width:768px) 28vw, 130px" className={`object-cover transition-opacity duration-200 ${on ? '' : 'opacity-90 group-hover:opacity-100'}`} />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center font-serif italic text-[11px] opacity-30 px-1 text-center">{label}</span>
          )}
          {on && <span className="absolute inset-0 bg-ink/10" aria-hidden />}
        </div>
        <span className={`font-sans text-[10px] tracking-[0.16em] uppercase transition-colors ${on ? 'text-ink font-semibold' : 'text-charcoal-light group-hover:text-ink'}`}>{label}</span>
      </button>
    )
  }

  return (
    <div>
      {subs.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-4 mb-10">
          {tiles.map(t => <Tile key={t.slug} {...t} />)}
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
