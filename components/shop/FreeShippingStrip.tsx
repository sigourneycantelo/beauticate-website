'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import type { ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'
import { isFreeShipping } from '@/lib/shop-taxonomy'

function formatPrice(p: ShopifyProduct) {
  const num = parseFloat(p.priceRange.minVariantPrice.amount)
  return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`
}

function Card({ p }: { p: ShopifyProduct }) {
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
      badge="Free Shipping"
      brand={p.vendor}
      name={p.title}
      price={formatPrice(p)}
    />
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function FreeShippingStrip({ products }: { products: ShopifyProduct[] }) {
  const railRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  const eligible = useMemo(() => products.filter(p => isFreeShipping(p.vendor)), [products])
  const [shuffled, setShuffled] = useState(eligible)
  useEffect(() => { setShuffled(shuffle(eligible)) }, [eligible])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    let raf: number
    const speed = 0.5
    function step() {
      if (!paused && el) {
        el.scrollLeft += speed
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) el.scrollLeft = 0
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  if (!shuffled.length) return null

  return (
    <section
      className="full-bleed reveal"
      style={{ padding: 'clamp(34px,4.5vw,58px) clamp(20px,6vw,104px)' }}
    >
      <div className="text-center mb-8">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold text-eucalypt">
          Free Shipping
        </p>
        <h2 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(22px,2.8vw,32px)' }}>
          Complimentary delivery on select brands
        </h2>
      </div>

      <div
        ref={railRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="flex overflow-x-auto pb-3 scrollbar-hide"
        style={{ gap: '18px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {shuffled.map(p => (
          <div key={p.handle} className="snap-start shrink-0" style={{ width: '186px' }}>
            <Card p={p} />
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/shop/free-shipping"
          className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase px-7 py-3 rounded-[1px] transition-colors hover:bg-ink hover:text-white"
          style={{ border: '1px solid #1C1A17' }}
        >
          Shop free shipping
        </Link>
      </div>
    </section>
  )
}
