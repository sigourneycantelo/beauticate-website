'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import type { ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'

import { formatCardPrice } from '@/lib/product-format'

function ProductCard({ p }: { p: ShopifyProduct }) {
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
      brand={p.vendor}
      name={p.title}
      price={formatCardPrice(p)}
    />
  )
}

const MOBILE_PAGE_SIZE = 6

export default function ShopStrip({
  products,
  eyebrow = 'Beauticate Shop',
  heading,
  subheading = 'Curated by the Beauticate Collective',
  cta,
}: {
  products: ShopifyProduct[]
  eyebrow?: string
  heading?: React.ReactNode
  subheading?: string
  cta?: { label: string; href: string }
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [mobilePage, setMobilePage] = useState(0)

  const totalMobilePages = Math.ceil(products.length / MOBILE_PAGE_SIZE)

  useEffect(() => {
    const el = railRef.current
    if (!el) return

    let raf: number
    const speed = 0.5

    function step() {
      if (!paused && el) {
        el.scrollLeft += speed
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0
        }
      }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  const onMobileScroll = useCallback(() => {
    const el = mobileRef.current
    if (!el) return
    const page = Math.round(el.scrollLeft / el.clientWidth)
    setMobilePage(page)
  }, [])

  const goToMobilePage = useCallback((page: number) => {
    const el = mobileRef.current
    if (!el) return
    el.scrollTo({ left: page * el.clientWidth, behavior: 'smooth' })
  }, [])

  if (!products.length) return null

  return (
    <section
      className="full-bleed reveal"
      style={{ padding: 'clamp(34px,4.5vw,58px) clamp(20px,6vw,104px)' }}
    >
      {/* Shop explainer */}
      <div className="text-center mb-10 mx-auto" style={{ maxWidth: '540px' }}>
        <p
          className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold"
          style={{ color: '#8E9A82' }}
        >
          {eyebrow}
        </p>
        <h2
          className="font-serif font-normal mt-3"
          style={{ fontSize: 'clamp(24px,3vw,34px)' }}
        >
          {heading ?? <>Essentials for living beautifully.<br /><em className="italic">Curated by editors and experts, not algorithms.</em></>}
        </h2>
        <p className="font-sans mt-3" style={{ fontSize: '13px', opacity: 0.55, lineHeight: 1.6 }}>
          {subheading}
        </p>
      </div>

      {/* Desktop: auto-scroll rail */}
      <div
        ref={railRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="hidden md:flex overflow-x-auto pb-3 scrollbar-hide"
        style={{
          gap: '18px',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {products.map(p => (
          <div key={p.handle} className="snap-start shrink-0" style={{ width: '186px' }}>
            <ProductCard p={p} />
          </div>
        ))}
      </div>

      {/* Mobile: 3-col × 2-row swipeable grid */}
      <div className="md:hidden">
        <div
          ref={mobileRef}
          onScroll={onMobileScroll}
          className="flex overflow-x-auto scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {Array.from({ length: totalMobilePages }, (_, pageIdx) => {
            const start = pageIdx * MOBILE_PAGE_SIZE
            const pageProducts = products.slice(start, start + MOBILE_PAGE_SIZE)
            return (
              <div
                key={pageIdx}
                className="grid grid-cols-3 gap-3 shrink-0 w-full"
                style={{ scrollSnapAlign: 'start' }}
              >
                {pageProducts.map(p => (
                  <div key={p.handle}>
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {/* Pagination dots */}
        {totalMobilePages > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: totalMobilePages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToMobilePage(i)}
                aria-label={`Page ${i + 1}`}
                className="transition-colors"
                style={{
                  width: i === mobilePage ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === mobilePage ? '#1C1A17' : 'rgba(28,26,23,.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'width .3s ease, background .3s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="text-center mt-9">
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
