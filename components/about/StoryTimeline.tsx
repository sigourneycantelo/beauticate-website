'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Milestone copy is final (house style: Australian spelling, no em dashes).
// `href` wires to a live route; null = plain text (route not ready, e.g. the
// standalone Directory and the Top 100 edit).
const MILESTONES: { year: string; text: string; href: string | null; cta?: string }[] = [
  { year: '2014', text: 'While at Vogue, Sigourney starts Beauticate as a side project. Rapid growth sees her leave to go all in.', href: null },
  { year: '2015', text: 'The GO-TOs Spa and Salon Directory launches and the travel vertical grows.', href: '/destinations', cta: 'Explore Destinations' },
  { year: '2016', text: 'The WHOs series takes off. Polished at-home shoots blend beauty, interiors and the lives of industry insiders.', href: '/interviews', cta: 'Read the Interviews' },
  { year: '2017', text: 'The Top 100 best beauty buys lands, expertly curated.', href: null },
  { year: '2019', text: 'Top 100 Products of All Time cements Beauticate as where readers shop from trusted edits.', href: '/shop', cta: 'Visit the Shop' },
  { year: '2019', text: 'The Interiors section launches and Beauticate becomes a full lifestyle platform.', href: '/living', cta: 'Explore Living' },
  { year: '2022', text: 'Beautiful Inside, the video podcast, launches and debuts at #3 on Apple.', href: '/vodcast', cta: 'Listen to the Podcast' },
  { year: '2024', text: 'GO-TOs expands into wellness and aesthetics, profiling leading clinics and practitioners.', href: '/wellness', cta: 'Explore Wellness' },
  { year: '2025', text: 'Podcast reach triples to 3.1 million a month.', href: '/vodcast', cta: 'Listen to the Podcast' },
  { year: '2026', text: 'The Beauticate Shop launches.', href: '/shop', cta: 'Visit the Shop' },
]

export default function StoryTimeline() {
  const ref = useRef<HTMLElement>(null)
  // `js` gates the hidden-then-reveal state so the milestones are fully visible
  // when JavaScript is off. `shown` triggers the reveal + line draw.
  const [js, setJs] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    setJs(true)
    const el = ref.current
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

  return (
    <section
      ref={ref}
      aria-labelledby="story-heading"
      className={`story bg-[#FBF9F4] border-t border-b border-gray-100 py-16 ${js ? 'story--js' : ''} ${shown ? 'is-shown' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-3 text-center">Our story</p>
        <h2 id="story-heading" className="font-serif text-2xl md:text-3xl text-charcoal mb-12 text-center">
          A decade in the making
        </h2>

        {/* The rail scrolls horizontally on desktop, reflows to a vertical
            timeline on mobile. The connecting line draws itself on reveal. */}
        <div className="story-rail relative">
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
                    className="font-sans text-[11px] tracking-[0.16em] uppercase text-gold hover:text-charcoal transition-colors mt-3 inline-block"
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
    </section>
  )
}
