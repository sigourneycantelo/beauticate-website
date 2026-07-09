'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Venue {
  title: string
  slug: string
  category: string
  subcategory?: string
  venueType: string
  state: string
  image: string
  imageAlt: string
  verdict: string
  isFeatured?: boolean
}

const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const
const FULL_STATE: Record<string, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  WA: 'Western Australia',
  SA: 'South Australia',
  TAS: 'Tasmania',
  ACT: 'ACT',
  NT: 'Northern Territory',
}

const VENUE_TYPES = [
  { value: 'spa', label: 'Spas' },
  { value: 'salon', label: 'Salons' },
  { value: 'skin-clinic', label: 'Skin clinics' },
  { value: 'bathhouse', label: 'Bathhouses' },
  { value: 'retreat', label: 'Retreats' },
  { value: 'hotel', label: 'Hotels' },
] as const

const TYPE_LABELS: Record<string, string> = {
  spa: 'Spa',
  salon: 'Salon',
  'skin-clinic': 'Skin clinic',
  bathhouse: 'Bathhouse',
  retreat: 'Retreat',
  hotel: 'Hotel',
}

function venueHref(v: Venue) {
  return `/${v.category}${v.subcategory ? `/${v.subcategory}` : ''}/${v.slug}`
}

function HeroCarousel({ venues }: { venues: Venue[] }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % venues.length)
    }, 5000)
  }, [venues.length])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetTimer])

  const go = (i: number) => {
    setCurrent(i)
    resetTimer()
  }
  const prev = () => go((current - 1 + venues.length) % venues.length)
  const next = () => go((current + 1) % venues.length)

  if (!venues.length) return null
  const v = venues[current]

  return (
    <section className="relative h-[520px] md:h-[600px] overflow-hidden">
      {venues.map((slide, i) => (
        <Link key={slide.slug} href={venueHref(slide)} className="block absolute inset-0">
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
          >
            {slide.image ? (
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 70% 20%,#C9A98A,#9C7E64 42%,#5E4A3B)' }} />
            )}
          </div>
        </Link>
      ))}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(180deg,rgba(20,18,15,0) 40%,rgba(20,18,15,.72) 100%)' }}
      />
      <div className="relative z-10 h-full flex flex-col justify-end max-w-[1240px] mx-auto w-full px-8 pb-[54px]" style={{ color: '#FBF6EE' }}>
        <p className="font-sans text-xs tracking-[0.22em] uppercase opacity-90 mb-[18px]">
          Destinations · Directory
        </p>
        <h2 className="font-serif font-medium text-[40px] md:text-[60px] leading-[1.02] max-w-[900px] tracking-[0.005em]">
          {v.title}
        </h2>
        {v.verdict && (
          <p className="font-serif text-[21px] italic mt-4 max-w-[620px] opacity-[0.94]">
            {v.verdict}
          </p>
        )}
        <p className="font-sans text-xs tracking-[0.16em] uppercase mt-5 opacity-[0.85]">
          {TYPE_LABELS[v.venueType] ?? v.venueType} · {v.state}
        </p>
      </div>
      {/* Nav arrows */}
      <button
        onClick={(e) => { e.preventDefault(); prev() }}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-[44px] h-[44px] flex items-center justify-center rounded-full cursor-pointer"
        style={{ background: 'rgba(251,246,238,0.18)', backdropFilter: 'blur(6px)' }}
        aria-label="Previous"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBF6EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button
        onClick={(e) => { e.preventDefault(); next() }}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-[44px] h-[44px] flex items-center justify-center rounded-full cursor-pointer"
        style={{ background: 'rgba(251,246,238,0.18)', backdropFilter: 'blur(6px)' }}
        aria-label="Next"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBF6EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {venues.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); go(i) }}
            className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer"
            style={{ background: i === current ? '#FBF6EE' : 'rgba(251,246,238,0.4)' }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default function DirectoryClient({ venues }: { venues: Venue[] }) {
  const searchParams = useSearchParams()
  const initialState = searchParams.get('state') ?? 'all'
  const [stateFilter, setStateFilter] = useState(
    STATES.includes(initialState as any) ? initialState : 'all'
  )
  const [typeFilter, setTypeFilter] = useState('all')

  const heroVenues = useMemo(() => {
    return venues.filter(v => v.isFeatured && v.image).slice(0, 8)
  }, [venues])

  const fallbackHeroes = useMemo(() => {
    if (heroVenues.length >= 3) return heroVenues
    return venues.filter(v => v.image && v.verdict).slice(0, 6)
  }, [venues, heroVenues])

  const filtered = useMemo(() => {
    return venues.filter(v =>
      (stateFilter === 'all' || v.state === stateFilter) &&
      (typeFilter === 'all' || v.venueType === typeFilter)
    )
  }, [venues, stateFilter, typeFilter])

  const grouped = useMemo(() => {
    const groups: Record<string, Venue[]> = {}
    for (const v of filtered) {
      const st = v.state || 'Other'
      if (!groups[st]) groups[st] = []
      groups[st].push(v)
    }
    return STATES
      .filter(s => groups[s]?.length)
      .map(s => ({ state: s, venues: groups[s] }))
  }, [filtered])

  const countLabel = `${filtered.length} place${filtered.length !== 1 ? 's' : ''}${stateFilter !== 'all' ? ` in ${FULL_STATE[stateFilter]}` : ''}${typeFilter !== 'all' ? ` · ${typeFilter.replace('-', ' ')}` : ''}`

  return (
    <div style={{ background: '#FFFFFF' }}>
      {/* HERO CAROUSEL */}
      <HeroCarousel venues={fallbackHeroes} />

      {/* FILTER BAR */}
      <div
        className="sticky top-[54px] z-20 py-4"
        style={{ background: '#FFFFFF', borderBottom: '1px solid #E8E2D8' }}
      >
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="font-sans text-[11px] tracking-[0.16em] uppercase mr-1" style={{ color: '#6E655A' }}>
              State
            </span>
            <Chip active={stateFilter === 'all'} onClick={() => setStateFilter('all')}>All</Chip>
            {STATES.map(s => (
              <Chip key={s} active={stateFilter === s} onClick={() => setStateFilter(s)}>{s}</Chip>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans text-[11px] tracking-[0.16em] uppercase mr-1" style={{ color: '#6E655A' }}>
              Type
            </span>
            <Chip active={typeFilter === 'all'} onClick={() => setTypeFilter('all')} isType>All</Chip>
            {VENUE_TYPES.map(t => (
              <Chip key={t.value} active={typeFilter === t.value} onClick={() => setTypeFilter(t.value)} isType>
                {t.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="max-w-[1240px] mx-auto px-8 py-10 pb-[70px]">
        <p className="font-sans text-xs tracking-[0.14em] uppercase mb-[26px]" style={{ color: '#6E655A' }}>
          {countLabel}
        </p>

        {grouped.length === 0 && (
          <p className="text-center py-[60px] font-serif italic text-xl" style={{ color: '#6E655A' }}>
            Nothing here yet in this filter. Try another state or type.
          </p>
        )}

        {grouped.map(({ state, venues: group }) => (
          <div key={state}>
            <h2
              className="font-serif font-medium text-[28px] mt-9 mb-5 pb-[10px]"
              style={{ borderBottom: '1px solid #E8E2D8' }}
            >
              {FULL_STATE[state]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.map(v => (
                <VenueCard key={v.slug} venue={v} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Chip({ active, onClick, isType, children }: { active: boolean; onClick: () => void; isType?: boolean; children: React.ReactNode }) {
  const activeStyle = isType
    ? { background: '#A8735A', borderColor: '#A8735A', color: '#FBF8F2' }
    : { background: '#211E19', borderColor: '#211E19', color: '#FBF8F2' }

  return (
    <button
      className="font-sans text-xs tracking-[0.1em] uppercase px-[15px] py-2 rounded-[1px] transition-all duration-150 cursor-pointer"
      style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#DDD3C2',
        color: '#6E655A',
        background: '#FFFFFF',
        ...(active ? activeStyle : {}),
      }}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function VenueCard({ venue: v }: { venue: Venue }) {
  return (
    <article className="group">
      <Link href={venueHref(v)} className="block">
        <div className="relative overflow-hidden aspect-square">
          {v.image ? (
            <Image
              src={v.image}
              alt={v.imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'radial-gradient(130% 100% at 50% 30%,#C9A98A,#7E6247)' }} />
          )}
        </div>
        <div className="mt-3">
          <p className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: '#6E655A' }}>
            {TYPE_LABELS[v.venueType] ?? v.venueType}
          </p>
          <h3 className="font-serif text-lg md:text-xl leading-snug group-hover:text-wine transition-colors">
            {v.title}
          </h3>
        </div>
      </Link>
    </article>
  )
}
