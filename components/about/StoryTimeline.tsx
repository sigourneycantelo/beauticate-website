'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

const MILESTONES: {
  year: string
  text: ReactNode
  href: string | null
  cta?: string
}[] = [
  {
    year: '2014',
    text: "While at Vogue, Sigourney starts Beauticate (the WHO's and HOW-TO's of Beauty) as a side project. Rapid growth sees her leave to go all in.",
    href: null,
  },
  {
    year: '2015',
    text: 'The WHOs series takes off. Polished at-home shoots blend beauty, interiors and the lives of industry insiders.',
    href: '/interviews',
    cta: 'Read the Interviews',
  },
  {
    year: '2016',
    text: <>Sigourney launches GO-TO&apos;s Australia&apos;s first Spa &amp; Salon Directory and the <Link href="/destinations/travel" className="text-wine hover:text-charcoal transition-colors underline underline-offset-2">travel</Link> vertical grows.</>,
    href: '/destinations/directory',
    cta: 'Explore Beauty & Wellness Directory',
  },
  {
    year: '2017',
    text: 'The Top 100 best beauty buys lands, expertly curated.',
    href: '/shop',
    cta: 'Visit the Shop',
  },
  {
    year: '2018',
    text: 'The Interiors section launches and Beauticate becomes a full lifestyle platform.',
    href: '/living/interiors',
    cta: 'Explore Interiors',
  },
  {
    year: '2019',
    text: 'Top 100 Products of All Time cements Beauticate as where readers shop from trusted edits.',
    href: '/shop',
    cta: 'Visit the Shop',
  },
  {
    year: '2021',
    text: 'Beauticate launches Cosmetic section to keep abreast of the latest cosmeceuticals and clinical treatments interviewing top dermatologists and practitioners.',
    href: '/beauty-style/cosmetic',
    cta: 'Explore Cosmetic',
  },
  {
    year: '2022',
    text: 'Beautiful Inside, the video podcast, launches and debuts at #3 on Apple in the Arts & Culture category.',
    href: '/podcast',
    cta: 'Listen to the Podcast',
  },
  {
    year: '2024',
    text: 'The site expands into wellness, longevity and aesthetics with new verticals and adds wellness clinics and practitioners. GO-TOs becomes Beauty & Wellness Directory.',
    href: '/destinations/directory',
    cta: 'Explore Beauty & Wellness Directory',
  },
  {
    year: '2025',
    text: "The podcast launch and new social audiences triple Beauticate's reach across editorial, audio and social.",
    href: '/advertise-with-us',
    cta: 'Advertise with Us',
  },
  {
    year: '2026',
    text: 'Beauticate rebuilt for the AI age. The Beauticate Shop launches, and the Collective forms.',
    href: '/shop',
    cta: 'Visit the Shop',
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
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3 text-center">Our story</p>
        <h2 id="story-heading" className="font-serif text-2xl md:text-3xl text-charcoal mb-2 text-center">
          A decade in the making
        </h2>
        <div className="w-10 h-[1.5px] bg-wine/40 mx-auto mb-4" />
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scroll('right')}
            className={`story-arrow story-arrow--right ${canScrollRight ? 'is-visible' : ''}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div ref={railRef} className="story-rail relative">
            <span aria-hidden="true" className="story-line" />
            <ol className="story-track">
              {MILESTONES.map((m, i) => (
                <li key={`${m.year}-${i}`} className="milestone" style={{ transitionDelay: `${Math.min(i * 70, 560)}ms` }}>
                  <span aria-hidden="true" className="story-dot" />

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
