'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import type { ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'

function formatPrice(p: ShopifyProduct) {
  const num = parseFloat(p.priceRange.minVariantPrice.amount)
  return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`
}

function RailCard({ p }: { p: ShopifyProduct }) {
  const imgs = p.images?.nodes ?? []
  const primary = imgs[0] ?? p.featuredImage
  const secondary = imgs[1]
  return (
    <ProductTile
      href={`/shop/products/${p.handle}`}
      useNextImage
      primarySrc={primary?.url}
      primaryAlt={primary?.altText ?? p.title}
      secondarySrc={secondary?.url}
      secondaryAlt={secondary?.altText ?? p.title}
      cornerLabel="In our shop"
      brand={p.vendor}
      name={p.title}
      price={formatPrice(p)}
    />
  )
}

/**
 * In-article auto-scrolling product rail. Mirrors the homepage ShopStrip feel —
 * a single row that scrolls slowly left-to-right, pausing on hover/touch and
 * looping back to the start — but sized to sit inside an article body.
 */
export default function AutoScrollRail({
  products,
  handle,
  title = "Editor's Essentials",
}: {
  products: ShopifyProduct[]
  handle?: string
  title?: string
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = railRef.current
    if (!el) return

    let raf: number
    const speed = 0.5

    function step() {
      if (!paused && el) {
        el.scrollLeft += speed
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0
        }
      }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  if (!products.length) return null

  return (
    <section className="my-10">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <p className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold text-eucalypt">
            Beauticate Shop
          </p>
          <h3 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(20px,2.6vw,28px)' }}>
            {title}
          </h3>
        </div>
        {handle && (
          <Link
            href={`/shop/collections/${handle}`}
            className="shrink-0 font-sans text-[10.5px] tracking-[0.2em] uppercase hover:text-wine transition-colors"
          >
            See all →
          </Link>
        )}
      </div>

      <div
        ref={railRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="flex overflow-x-auto pb-3 scrollbar-hide"
        style={{
          gap: '16px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {products.map(p => (
          <div key={p.handle} className="shrink-0" style={{ width: '186px' }}>
            <RailCard p={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
