'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { VodcastFrontmatter } from '@/types/content'

interface Props {
  episodes: { frontmatter: VodcastFrontmatter }[]
}

const CURATED_SLUGS = [
  'miranda-kerr-on-faith-family-and-that-first-date-where-he-fell-asleep',
  'trinny-woodall-on-purpose-pressure-and-picking-yourself-back-up',
  'celeste-barber-on-adhd-bullying-boundaries-and-the-battle-with-social-media',
  'gabby-bernstein-on-manifesting-with-compassion-healing-shame-living-the-dream',
  'lindsay-price-on-healing-childhood-trauma-life-with-curtis-stone-and-her-hollywo',
  'dr-shefali-tsabary-the-truth-about-conscious-parenting-screens-and-shame',
  'pip-edwards-from-perfectionism-to-self-compassion',
  'susan-yara-on-reinvention-resilience-and-rebuilding-trust',
  'tanya-ali-jalani-on-awakening-mental-health-and-the-human-side-of-healing',
  'davinia-taylor-on-alcohol-addiction-mental-health',
  'guy-sebastian-on-identity-inner-circles-and-rebuilding-self-worth',
]

function ReelCard({ ep }: { ep: { frontmatter: VodcastFrontmatter } }) {
  const f = ep.frontmatter
  const href = f.youtube_video_id
    ? `https://www.youtube.com/watch?v=${f.youtube_video_id}`
    : `/vodcast/episodes/${f.slug}`
  const external = !!f.youtube_video_id

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group block"
    >
      <div
        className="relative overflow-hidden rounded-[3px]"
        style={{ aspectRatio: '9/16', border: '1px solid rgba(28,26,23,.10)' }}
      >
        {f.featured_image ? (
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            className="object-cover"
            sizes="20vw"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(150deg,#d9cfc6,#a99a8d)' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46px] h-[46px] rounded-full border border-white/90 z-10 flex items-center justify-center">
          <span className="border-l-[12px] border-l-white border-y-[7px] border-y-transparent ml-1" />
        </div>
        {external && (
          <span className="absolute top-2.5 left-2.5 z-10 font-sans text-[8.5px] tracking-[0.18em] uppercase text-white bg-black/40 px-2 py-1 rounded-[1px]">
            YouTube
          </span>
        )}
      </div>
      <h4 className="font-serif font-normal leading-[1.25] mt-3" style={{ fontSize: 'clamp(16px,1.4vw,17px)', color: '#1C1A17', textTransform: 'none', letterSpacing: 'normal' }}>
        {f.title}
      </h4>
    </a>
  )
}

export default function PodcastSection({ episodes }: Props) {
  const railRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  const sorted = useMemo(() => {
    const slugIndex = new Map(CURATED_SLUGS.map((s, i) => [s, i]))
    const curated: typeof episodes = []
    const rest: typeof episodes = []
    for (const ep of episodes) {
      if (slugIndex.has(ep.frontmatter.slug)) {
        curated.push(ep)
      } else {
        rest.push(ep)
      }
    }
    curated.sort((a, b) => (slugIndex.get(a.frontmatter.slug) ?? 0) - (slugIndex.get(b.frontmatter.slug) ?? 0))
    return [...curated, ...rest]
  }, [episodes])

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

  if (!episodes.length) return null

  return (
    <section
      className="full-bleed reveal"
      style={{
        background: '#E8E3DB',
        padding: 'clamp(34px,4.5vw,58px) clamp(20px,6vw,104px)',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-end gap-5 flex-wrap mb-7">
        <div>
          <p className="font-sans text-[11px] tracking-[0.34em] uppercase" style={{ opacity: 0.55, color: '#1C1A17' }}>
            Beautiful Inside
          </p>
          <h2 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(24px,3vw,38px)', color: '#1C1A17' }}>
            The <em className="italic">podcast</em>
          </h2>
        </div>
        <Link
          href="/vodcast"
          className="font-sans text-[10.5px] tracking-[0.2em] uppercase px-5 py-3.5 rounded-[1px] transition-colors hover:bg-ink hover:text-white"
          style={{ border: '1px solid rgba(28,26,23,.4)', color: '#1C1A17' }}
        >
          All episodes
        </Link>
      </div>

      {/* Auto-scrolling rail */}
      <div
        ref={railRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="flex overflow-x-auto pb-3 scrollbar-hide"
        style={{
          gap: '16px',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {sorted.map((ep, i) => (
          <div key={ep.frontmatter.slug ?? i} className="snap-start shrink-0" style={{ width: 'clamp(150px, 18vw, 190px)' }}>
            <ReelCard ep={ep} />
          </div>
        ))}
      </div>
    </section>
  )
}
