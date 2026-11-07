'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { HeroSlide } from '@/lib/hero'

function Slide({
  slide,
  isActive,
  index,
}: {
  slide: HeroSlide
  isActive: boolean
  index: number
}) {
  const heroImage = slide.image
  const focus = slide.focus ?? 'center 25%'

  return (
    <Link
      href={slide.href}
      className={`hero-slide block${isActive ? ' is-active' : ''}`}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      <Image
        src={heroImage}
        alt={slide.imageAlt}
        fill
        priority={index === 0}
        loading={index === 0 ? 'eager' : 'lazy'}
        className="object-cover"
        style={{ objectPosition: focus }}
        sizes="(max-width: 1200px) 100vw, 1200px"
        unoptimized={heroImage.endsWith('.gif')}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(to top,rgba(10,10,10,.62) 0%,rgba(10,10,10,.38) 25%,rgba(10,10,10,.14) 50%,transparent 75%)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-10 text-white text-left"
        style={{ width: 'min(840px,88%)', margin: '0 auto', paddingBottom: 'clamp(56px,7vw,88px)' }}
      >
        <span
          className="block font-sans text-[11px] tracking-[0.34em] uppercase mb-3 font-medium"
          style={{ color: 'rgba(255,255,255,.85)' }}
        >
          {slide.eyebrow}
        </span>
        <h2
          className="font-serif font-normal leading-[1.15]"
          style={{
            fontSize: 'clamp(24px,3vw,40px)',
            letterSpacing: '-.01em',
            textShadow: '0 1px 20px rgba(0,0,0,.35)',
          }}
        >
          {slide.title}
        </h2>
        {slide.excerpt && (
          <p
            className="hidden sm:block font-sans mt-3 overflow-hidden whitespace-nowrap text-ellipsis"
            style={{ fontSize: '13px', opacity: 0.88, maxWidth: '52ch' }}
          >
            {slide.excerpt}
          </p>
        )}
        <span
          className="inline-block mt-4 font-sans text-[10.5px] tracking-[0.2em] uppercase font-medium"
          style={{ color: 'rgba(255,255,255,.85)', borderBottom: '1px solid rgba(255,255,255,.5)', paddingBottom: '2px' }}
        >
          {slide.cta}
        </span>
      </div>
    </Link>
  )
}

export default function HeroWide({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)
  const count = slides.length
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMounted(true)
  }, [])

  const advance = useCallback(() => {
    setActive(prev => (prev + 1) % count)
  }, [count])

  const goTo = useCallback((i: number) => {
    setActive(i)
    clearInterval(timerRef.current)
  }, [])

  const goPrev = useCallback(() => {
    setActive(prev => (prev - 1 + count) % count)
    clearInterval(timerRef.current)
  }, [count])

  const goNext = useCallback(() => {
    setActive(prev => (prev + 1) % count)
    clearInterval(timerRef.current)
  }, [count])

  useEffect(() => {
    if (count <= 1 || paused || prefersReducedMotion.current) return
    timerRef.current = setInterval(advance, 4500)
    return () => clearInterval(timerRef.current)
  }, [count, paused, advance])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDelta.current = 0
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchDelta.current = e.touches[0].clientX - touchStartX.current
  }, [])

  const onTouchEnd = useCallback(() => {
    if (Math.abs(touchDelta.current) > 50) {
      if (touchDelta.current < 0) goNext()
      else goPrev()
    }
    touchDelta.current = 0
  }, [goNext, goPrev])

  if (!slides.length) return null

  return (
    <section
      className="hero-carousel relative overflow-hidden max-w-[1200px] mx-auto bg-[#1C1A17]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <style>{`
        .hero-carousel { aspect-ratio: 1/1; }
        @media (min-width: 901px) { .hero-carousel { aspect-ratio: 12/5; min-height: 420px; } }
        .hero-slide {
          position: absolute; inset: 0;
          opacity: 0; transition: opacity 1s ease;
        }
        .hero-slide.is-active { opacity: 1; z-index: 2; }
        @media (prefers-reduced-motion: reduce) {
          .hero-slide { transition: none; }
        }
        .hero-arrow {
          position: absolute; top: 50%; z-index: 10;
          transform: translateY(-50%);
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.15); backdrop-filter: blur(4px);
          border: none; cursor: pointer; color: #fff;
          transition: background .2s;
        }
        .hero-arrow:hover { background: rgba(255,255,255,.3); }
        .hero-arrow--prev { left: 12px; }
        .hero-arrow--next { right: 12px; }
        @media (max-width: 900px) {
          .hero-arrow { width: 44px; height: 44px; }
          .hero-arrow--prev { left: 8px; }
          .hero-arrow--next { right: 8px; }
        }
        .hero-dots {
          position: absolute; bottom: clamp(18px,3vw,28px); left: 50%;
          transform: translateX(-50%); z-index: 10;
          display: flex; gap: 12px;
        }
        .hero-dot {
          width: 28px; height: 2px; background: rgba(255,255,255,.4);
          cursor: pointer; border: none; padding: 12px 8px; transition: background .3s;
          background-clip: content-box;
        }
        .hero-dot.is-active { background: rgba(255,255,255,.95); background-clip: content-box; }
      `}</style>

      {/* First slide always renders (SSR + priority preload) */}
      <Slide slide={slides[0]} isActive={active === 0} index={0} />

      {/* Remaining slides deferred until hydration to avoid competing for bandwidth */}
      {mounted && slides.slice(1).map((slide, i) => (
        <Slide key={slide.key} slide={slide} isActive={active === i + 1} index={i + 1} />
      ))}

      <div className="invisible" aria-hidden>
        <div style={{ aspectRatio: 'inherit' }} />
      </div>

      {count > 1 && (
        <>
          <button
            className="hero-arrow hero-arrow--prev"
            onClick={(e) => { e.preventDefault(); goPrev() }}
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            className="hero-arrow hero-arrow--next"
            onClick={(e) => { e.preventDefault(); goNext() }}
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hero-dot${i === active ? ' is-active' : ''}`}
                onClick={(e) => { e.preventDefault(); goTo(i) }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
