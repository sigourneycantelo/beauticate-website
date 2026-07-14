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
  const count = articles.length
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const advance = useCallback(() => {
    setActive(prev => (prev + 1) % count)
  }, [count])

  useEffect(() => {
    if (count <= 1 || paused || prefersReducedMotion.current) return
    timerRef.current = setInterval(advance, 4500)
    return () => clearInterval(timerRef.current)
  }, [count, paused, advance])

  const goTo = (i: number) => {
    setActive(i)
    clearInterval(timerRef.current)
  }

  if (!articles.length) return null

  const activeAspect = articles[active]?.frontmatter.hero_aspect

  return (
    <section
      className="hero-carousel relative overflow-hidden max-w-[1200px] mx-auto"
      style={activeAspect ? { aspectRatio: activeAspect } as React.CSSProperties : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        .hero-carousel { aspect-ratio: 4/5; transition: aspect-ratio .6s ease; }
        @media (min-width: 768px) { .hero-carousel { aspect-ratio: 12/5; min-height: 420px; } }
        .hero-slide {
          position: absolute; inset: 0;
          opacity: 0; transition: opacity 1s ease;
        }
        .hero-slide.is-active { opacity: 1; z-index: 2; }
        @media (prefers-reduced-motion: reduce) {
          .hero-slide { transition: none; }
        }
        .hero-dots {
          position: absolute; bottom: clamp(14px,3vw,28px); left: 50%;
          transform: translateX(-50%); z-index: 10;
          display: flex; gap: 10px;
        }
        .hero-dot {
          width: 28px; height: 2px; background: rgba(255,255,255,.4);
          cursor: pointer; border: none; padding: 0; transition: background .3s;
        }
        .hero-dot.is-active { background: rgba(255,255,255,.95); }
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
              style={{ background: 'linear-gradient(to top,rgba(10,10,10,.88) 0%,rgba(10,10,10,.65) 30%,rgba(10,10,10,.3) 55%,rgba(10,10,10,.08) 80%,transparent 100%)' }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 z-10 text-white text-left"
              style={{ width: 'min(840px,92%)', margin: '0 auto', paddingBottom: 'clamp(40px,6vw,80px)' }}
            >
              <span
                className="block font-sans text-[11px] tracking-[0.34em] uppercase mb-3.5 font-medium"
                style={{ color: 'rgba(255,255,255,.85)' }}
              >
                {eyebrow}
              </span>
              <h2
                className="font-serif font-normal leading-[1.08] whitespace-nowrap"
                style={{
                  fontSize: 'clamp(20px,2.8vw,38px)',
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

      {/* Invisible spacer to hold the aspect ratio since slides are position:absolute */}
      <div className="invisible" aria-hidden>
        <div style={{ aspectRatio: 'inherit' }} />
      </div>

      {count > 1 && (
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
      )}
    </section>
  )
}
