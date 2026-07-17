'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

const MILESTONES: {
  year: string
  text: string
  href: string | null
  cta?: string
  image?: string
  imageAlt?: string
}[] = [
  {
    year: '2014',
    text: 'While at Vogue, Sigourney starts Beauticate as a side project. Rapid growth sees her leave to go all in.',
    href: null,
    image: '/images/sigourney-about.jpg',
    imageAlt: 'Sigourney Cantelo, founder of Beauticate',
  },
  {
    year: '2015',
    text: 'The GO-TOs Spa and Salon Directory launches and the travel vertical grows.',
    href: '/destinations',
    cta: 'Explore Destinations',
  },
  {
    year: '2016',
    text: 'The WHOs series takes off. Polished at-home shoots blend beauty, interiors and the lives of industry insiders.',
    href: '/interviews',
    cta: 'Read the Interviews',
  },
  {
    year: '2017',
    text: 'The Top 100 best beauty buys lands, expertly curated.',
    href: null,
  },
  {
    year: '2019',
    text: 'Top 100 Products of All Time cements Beauticate as where readers shop from trusted edits.',
    href: '/shop',
    cta: 'Visit the Shop',
  },
  {
    year: '2019',
    text: 'The Interiors section launches and Beauticate becomes a full lifestyle platform.',
    href: '/living',
    cta: 'Explore Living',
  },
  {
    year: '2022',
    text: 'Beautiful Inside, the video podcast, launches and debuts at #3 on Apple.',
    href: '/vodcast',
    cta: 'Listen to the Podcast',
    image: '/images/podcast/cover.jpg',
    imageAlt: 'Beautiful Inside podcast',
  },
  {
    year: '2024',
    text: 'GO-TOs expands into wellness and aesthetics, profiling leading clinics and practitioners.',
    href: '/wellness',
    cta: 'Explore Wellness',
  },
  {
    year: '2025',
    text: 'Podcast reach triples to 3.1 million a month.',
    href: '/vodcast',
    cta: 'Listen to the Podcast',
  },
  {
    year: '2026',
    text: 'Beauticate rebuilt for the AI age. The Beauticate Shop launches, and the Collective forms.',
    href: '/shop',
    cta: 'Visit the Shop',
    image: '/images/beauticate-collective.jpg',
    imageAlt: 'The Beauticate Collective',
  },
]

export default function StoryTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [js, setJs] = useState(false)
  const [shown, setShown] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const el = railRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    setJs(true)
    const el = sectionRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setShown(true); return }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { setShown(true); io.disconnect() } }),
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scroll = (dir: 'left' | 'right') => {
    const el = railRef.current
    if (!el) return
    const amount = el.clientWidth * 0.7
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="story-heading"
      className={`story bg-[#FBF9F4] border-t border-b border-gray-100 py-16 ${js ? 'story--js' : ''} ${shown ? 'is-shown' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted mb-3 text-center">Our story</p>
        <h2 id="story-heading" className="font-serif text-2xl md:text-3xl text-charcoal mb-4 text-center">
          A decade in the making
        </h2>
        <p className="font-sans text-[12px] tracking-wide text-charcoal/40 mb-10 text-center hidden md:block">
          Swipe or drag to explore &rarr;
        </p>

        <div className="story-rail-wrap relative">
          {/* Left/right arrows — desktop only */}
          <button
            aria-label="Scroll left"
            onClick={() => scroll('left')}
            className={`story-arrow story-arrow--left ${canScrollLeft ? 'is-visible' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scroll('right')}
            className={`story-arrow story-arrow--right ${canScrollRight ? 'is-visible' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div ref={railRef} className="story-rail relative">
            <span aria-hidden="true" className="story-line" />
            <ol className="story-track">
              {MILESTONES.map((m, i) => (
                <li key={`${m.year}-${i}`} className="milestone" style={{ transitionDelay: `${Math.min(i * 70, 560)}ms` }}>
                  <span aria-hidden="true" className="story-dot" />

                  {m.image && (
                    <div className="milestone-img">
                      <Image
                        src={m.image}
                        alt={m.imageAlt || ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 240px"
                      />
                    </div>
                  )}

                  <time dateTime={m.year} className="font-serif text-[34px] md:text-[40px] leading-none text-charcoal block mb-3">
                    {m.year}
                  </time>
                  <p className="font-sans text-[13.5px] leading-relaxed text-charcoal/75">{m.text}</p>
                  {m.href && (
                    <Link
                      href={m.href}
                      className="font-sans text-[11px] tracking-[0.16em] uppercase text-wine hover:text-charcoal transition-colors mt-3 inline-block"
                    >
                      {m.cta} →
                    </Link>
                  )}
                </li>
              ))}
            </ol>
            <span aria-hidden="true" className="story-fade" />
          </div>
        </div>
      </div>
    </section>
  )
}
