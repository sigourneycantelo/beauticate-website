'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SHOP_FOUNDERS } from '@/data/shop-founders'

export default function FoundersPanel() {
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
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0
        }
      }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  if (!SHOP_FOUNDERS.length) return null

  return (
    <section className="bg-white px-[clamp(20px,6vw,104px)] py-[clamp(24px,3vw,40px)]">
      <div className="text-center mb-9 max-w-2xl mx-auto">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold text-eucalypt">
          Female-Founded, and Proud of It
        </p>
        <h2
          className="font-serif font-normal mt-3"
          style={{ fontSize: 'clamp(28px,3.4vw,44px)', lineHeight: 1.12 }}
        >
          We&rsquo;ve always backed the women building <em className="italic">beauty and wellness</em> businesses.
        </h2>
        <p
          className="font-serif mt-3 mx-auto"
          style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.4, opacity: 0.7, maxWidth: '46ch' }}
        >
          So the majority of our shop is local, and made by women. Founders we know, products we trust.
        </p>
      </div>

      <div
        ref={railRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="flex overflow-x-auto pb-3 scrollbar-hide"
        style={{
          gap: '20px',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {SHOP_FOUNDERS.map(f => (
          <Link
            key={f.name}
            href={f.href}
            className="snap-start shrink-0 group text-center"
            style={{ width: 'clamp(140px, 14vw, 180px)' }}
          >
            <div className="relative w-full overflow-hidden rounded-[2px]" style={{ aspectRatio: '1' }}>
              <Image
                src={f.image}
                alt={`${f.name}, founder of ${f.brand}`}
                fill
                sizes="(max-width: 768px) 140px, 180px"
                className="object-cover object-[50%_20%] transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <p
              className="font-serif mt-3"
              style={{ fontSize: 'clamp(13px,1.2vw,15px)', lineHeight: 1.25 }}
            >
              {f.name}
            </p>
            <p
              className="font-sans mt-1"
              style={{ fontSize: '10.5px', letterSpacing: '0.06em', opacity: 0.5, textTransform: 'uppercase' }}
            >
              {f.brand}
            </p>
          </Link>
        ))}
      </div>

      <div className="text-center mt-9">
        <Link
          href="/shop/brands"
          className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase border border-ink px-7 py-3 rounded-[1px] hover:bg-ink hover:text-white transition-colors duration-300"
        >
          Explore their brands
        </Link>
      </div>
    </section>
  )
}
