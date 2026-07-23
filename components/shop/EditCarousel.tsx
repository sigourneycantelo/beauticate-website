'use client'

import { useEffect, useRef, useState } from 'react'
import ProductCard from './ProductCard'
import type { ShopifyProduct } from '@/types/shopify'

// Single-line horizontal strip for Sigourney's Edit: creeps along slowly on its own,
// pauses on hover, and gives arrow controls so you can drive it manually.
export default function EditCarousel({ products }: { products: ShopifyProduct[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    let paused = false
    let raf = 0
    const enter = () => { paused = true }
    const leave = () => { paused = false }
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    const step = () => {
      if (!paused && el.scrollWidth > el.clientWidth) {
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) el.scrollLeft = 0
        else el.scrollLeft += 0.5
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mouseleave', leave)
    }
  }, [])

  const nudge = (dir: number) => ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })

  const arrow = (dir: number, label: string, side: string) => (
    <button
      onClick={() => nudge(dir)}
      aria-label={label}
      className={`absolute top-1/2 -translate-y-1/2 ${side} z-10 hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-ink/15 text-ink hover:bg-white transition-colors`}
      style={{ boxShadow: '0 2px 12px rgba(42,38,33,.14)' }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
        {dir < 0 ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  )

  return (
    <div className="relative">
      {overflows && arrow(-1, 'Scroll left', 'left-1')}
      {overflows && arrow(1, 'Scroll right', 'right-1')}
      <div ref={ref} className="flex gap-6 overflow-x-auto scrollbar-none" style={{ scrollSnapType: 'x proximity' }}>
        {products.map(p => (
          <div key={p.id} className="shrink-0 w-[clamp(190px,44vw,250px)]" style={{ scrollSnapAlign: 'start' }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
