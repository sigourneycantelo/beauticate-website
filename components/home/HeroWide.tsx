'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Article {
  frontmatter: {
    title: string
    slug: string
    category: string
    subcategory?: string
    excerpt?: string
    featured_image?: string
    featured_image_alt?: string
    hero_image?: string
    hero_title?: string
    hero_eyebrow?: string
    hero_aspect?: string
    hero_focus?: string
  }
}

function articleHref(f: Article['frontmatter']) {
  return `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
}

const CATEGORY_LABELS: Record<string, string> = {
  'beauty-style': 'Beauty & Style',
  'sigourneys-edit': "Sigourney's Edit",
  wellness: 'Wellness',
  living: 'Living',
  destinations: 'Destinations',
  interviews: 'Interviews',
  vodcast: 'Podcast',
}

export default function HeroWide({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)
  const count = articles.length
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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

  if (!articles.length) return null

  return (
    <section
      className="hero-carousel relative overflow-hidden max-w-[1200px] mx-auto"
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
          .hero-arrow { width: 36px; height: 36px; }
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
          cursor: pointer; border: none; padding: 10px 0; transition: background .3s;
          background-clip: content-box;
        }
        .hero-dot.is-active { background: rgba(255,255,255,.95); background-clip: content-box; }
      `}</style>

      {articles.map((article, i) => {
        const f = article.frontmatter
        const heroImage = f.hero_image ?? f.featured_image ?? '/images/hero-home.png'
        const heroTitle = f.hero_title ?? f.title
        const eyebrow = f.hero_eyebrow ?? CATEGORY_LABELS[f.category] ?? f.category
        const focus = f.hero_focus ?? 'center 25%'

        return (
          <Link
            key={f.slug}
            href={articleHref(f)}
            className={`hero-slide block${i === active ? ' is-active' : ''}`}
            aria-hidden={i !== active}
            tabIndex={i === active ? 0 : -1}
          >
            <Image
              src={heroImage}
              alt={f.featured_image_alt ?? f.title}
              fill
              priority={i === 0}
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
                {eyebrow}
              </span>
              <h2
                className="font-serif font-normal leading-[1.15]"
                style={{
                  fontSize: 'clamp(24px,3vw,40px)',
                  letterSpacing: '-.01em',
                  textShadow: '0 1px 20px rgba(0,0,0,.35)',
                }}
              >
                {heroTitle}
              </h2>
              {f.excerpt && (
                <p
                  className="hidden sm:block font-sans mt-3 overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ fontSize: '13px', opacity: 0.88, maxWidth: '52ch' }}
                >
                  {f.excerpt}
                </p>
              )}
              <span
                className="inline-block mt-4 font-sans text-[10.5px] tracking-[0.2em] uppercase font-medium"
                style={{ color: 'rgba(255,255,255,.85)', borderBottom: '1px solid rgba(255,255,255,.5)', paddingBottom: '2px' }}
              >
                Read the story
              </span>
            </div>
          </Link>
        )
      })}

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
            {articles.map((_, i) => (
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
