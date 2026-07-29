'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import type { ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'

import { formatCardPrice } from '@/lib/product-format'

// Canonical product rail for the whole site. This is the "team favourites"
// format from the home page hero: a slow, self-scrolling rail that pauses on
// hover and only animates while in view. Every product rail across the site
// renders through this component so they all share the same tile size, scroll
// speed and styling — the ONLY thing that varies per rail is `rows` (1 or 2).
export default function ProductRail({
  products,
  rows = 2,
  eyebrow = 'Beauticate Shop',
  heading,
  description,
  badge,
  cta,
  speed = 0.35,
}: {
  products: ShopifyProduct[]
  rows?: 1 | 2
  eyebrow?: string
  heading?: React.ReactNode
  description?: string
  badge?: string
  cta?: { label: string; href: string }
  speed?: number
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el || !inView) return

    let raf: number

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
  }, [paused, inView, speed])

  if (!products.length) return null

  const railRows =
    rows === 2
      ? (() => {
          const half = Math.ceil(products.length / 2)
          return [products.slice(0, half), products.slice(half)]
        })()
      : [products]

  return (
    <section
      ref={sectionRef}
      className="full-bleed reveal"
      style={{ padding: 'clamp(28px,3.5vw,44px) 0' }}
    >
      <div className="text-center mb-7" style={{ padding: '0 clamp(20px,6vw,104px)' }}>
        {eyebrow && (
          <p
            className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold"
            style={{ color: '#8E9A82' }}
          >
            {eyebrow}
          </p>
        )}
        {heading && (
          <h2
            className="font-serif font-normal mt-2"
            style={{ fontSize: 'clamp(24px,3vw,34px)' }}
          >
            {heading}
          </h2>
        )}
        {description && (
          <p className="font-sans mt-3" style={{ fontSize: '13px', opacity: 0.55, lineHeight: 1.6 }}>
            {description}
          </p>
        )}
      </div>

      <div
        ref={railRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: 'clamp(20px,6vw,104px)',
          paddingRight: 'clamp(20px,6vw,104px)',
        }}
      >
        <div className="flex flex-col gap-4" style={{ width: 'max-content' }}>
          {railRows.map((row, ri) => (
            <div key={ri} className="flex gap-4">
              {row.map(p => {
                const imgs = p.images?.nodes ?? []
                const primary = imgs[0] ?? p.featuredImage
                const secondary = imgs[1]
                return (
                  <div
                    key={p.handle}
                    className="shrink-0"
                    style={{ width: 'clamp(156px, 42vw, 210px)' }}
                  >
                    <ProductTile
                      href={`/shop/products/${p.handle}`}
                      useNextImage
                      primarySrc={primary?.url}
                      primaryAlt={primary?.altText ?? p.title}
                      secondarySrc={secondary?.url}
                      secondaryAlt={secondary?.altText ?? p.title}
                      badge={badge}
                      brand={p.vendor}
                      name={p.title}
                      price={formatCardPrice(p)}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link
          href={cta?.href ?? '/shop'}
          className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase px-7 py-3.5 rounded-[1px] transition-colors hover:bg-ink hover:text-white"
          style={{ border: '1px solid #1C1A17' }}
        >
          {cta?.label ?? 'Explore the shop'}
        </Link>
      </div>
    </section>
  )
}
