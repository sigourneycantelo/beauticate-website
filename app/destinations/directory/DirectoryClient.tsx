'use client'

import { useState, useMemo } from 'react'
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

export default function DirectoryClient({ venues }: { venues: Venue[] }) {
  const searchParams = useSearchParams()
  const initialState = searchParams.get('state') ?? 'all'
  const initialType = searchParams.get('type') ?? 'all'
  const [stateFilter, setStateFilter] = useState(
    STATES.includes(initialState as any) ? initialState : 'all'
  )
  const [typeFilter, setTypeFilter] = useState(
    VENUE_TYPES.some(t => t.value === initialType) ? initialType : 'all'
  )
  const [hoverVenue, setHoverVenue] = useState<Venue | null>(null)

  const defaultHero = useMemo(() => {
    return venues.find(v => v.isFeatured && v.image) ?? venues.find(v => v.image) ?? null
  }, [venues])

  const heroVenue = hoverVenue ?? defaultHero

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

  const getPreviewForState = (state: string) => venues.find(v => v.state === state && v.image) ?? null
  const getPreviewForType = (type: string) => venues.find(v => v.venueType === type && v.image) ?? null

  return (
    <div style={{ background: '#FFFFFF' }}>
      {/* FULL-BLEED HERO */}
      <section className="relative h-[480px] md:h-[560px] overflow-hidden">
        {heroVenue?.image && (
          <Image
            src={heroVenue.image}
            alt={heroVenue.imageAlt}
            fill
            priority
            className="object-cover transition-opacity duration-500"
            sizes="100vw"
          />
        )}
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(180deg,rgba(20,18,15,0) 30%,rgba(20,18,15,.75) 100%)' }}
        />
        <div className="relative z-10 h-full flex flex-col justify-end max-w-[1240px] mx-auto w-full px-8 pb-[50px]" style={{ color: '#FBF6EE' }}>
          <p className="font-sans text-xs tracking-[0.22em] uppercase opacity-90 mb-[14px]">
            The Beauty &amp; Wellness Directory
          </p>
          {heroVenue ? (
            <Link href={venueHref(heroVenue)} className="group">
              <h1 className="font-serif font-medium text-[36px] md:text-[56px] leading-[1.02] max-w-[900px] tracking-[0.005em] group-hover:underline decoration-1 underline-offset-4">
                {heroVenue.title}
              </h1>
              {heroVenue.verdict && (
                <p className="font-serif text-[19px] italic mt-3 max-w-[620px] opacity-[0.94]">
                  {heroVenue.verdict}
                </p>
              )}
              <p className="font-sans text-xs tracking-[0.16em] uppercase mt-4 opacity-[0.85]">
                {TYPE_LABELS[heroVenue.venueType] ?? heroVenue.venueType} · {heroVenue.state}
              </p>
            </Link>
          ) : (
            <h1 className="font-serif font-medium text-[36px] md:text-[56px] leading-[1.02] max-w-[900px]">
              The spas, salons &amp; clinics we actually rate
            </h1>
          )}
        </div>
      </section>

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
            <Chip
              active={stateFilter === 'all'}
              onClick={() => setStateFilter('all')}
              onMouseEnter={() => setHoverVenue(null)}
              onMouseLeave={() => setHoverVenue(null)}
            >All</Chip>
            {STATES.map(s => (
              <Chip
                key={s}
                active={stateFilter === s}
                onClick={() => setStateFilter(s)}
                onMouseEnter={() => setHoverVenue(getPreviewForState(s))}
                onMouseLeave={() => setHoverVenue(null)}
              >{s}</Chip>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans text-[11px] tracking-[0.16em] uppercase mr-1" style={{ color: '#6E655A' }}>
              Type
            </span>
            <Chip
              active={typeFilter === 'all'}
              onClick={() => setTypeFilter('all')}
              onMouseEnter={() => setHoverVenue(null)}
              onMouseLeave={() => setHoverVenue(null)}
              isType
            >All</Chip>
            {VENUE_TYPES.map(t => (
              <Chip
                key={t.value}
                active={typeFilter === t.value}
                onClick={() => setTypeFilter(t.value)}
                onMouseEnter={() => setHoverVenue(getPreviewForType(t.value))}
                onMouseLeave={() => setHoverVenue(null)}
                isType
              >
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

        {filtered.length === 0 && (
          <p className="text-center py-[60px] font-serif italic text-xl" style={{ color: '#6E655A' }}>
            Nothing here yet in this filter. Try another state or type.
          </p>
        )}

        {stateFilter === 'all' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(v => (
              <VenueCard key={v.slug} venue={v} />
            ))}
          </div>
        ) : (
          grouped.map(({ state, venues: group }) => (
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
          ))
        )}
      </div>
    </div>
  )
}

function Chip({ active, onClick, onMouseEnter, onMouseLeave, isType, children }: {
  active: boolean; onClick: () => void; onMouseEnter?: () => void; onMouseLeave?: () => void; isType?: boolean; children: React.ReactNode
}) {
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
