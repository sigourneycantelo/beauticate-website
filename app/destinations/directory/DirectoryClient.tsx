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
  const [stateFilter, setStateFilter] = useState(
    STATES.includes(initialState as any) ? initialState : 'all'
  )
  const [typeFilter, setTypeFilter] = useState('all')

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
    <div style={{ background: '#FBF8F2' }}>
      {/* MASTHEAD */}
      <div className="text-center py-[60px] pb-[30px] max-w-[1240px] mx-auto px-8">
        <p className="font-sans text-xs tracking-[0.22em] uppercase mb-[14px]" style={{ color: '#A8735A' }}>
          Destinations · Directory
        </p>
        <h1 className="font-serif font-medium text-[38px] md:text-[52px] tracking-[0.01em]">
          The Beauty &amp; Wellness Directory
        </h1>
        <p className="font-serif text-xl italic mt-[14px]" style={{ color: '#6E655A' }}>
          The spas, salons, skin clinics and bathhouses we actually rate, all around Australia.
        </p>
      </div>

      {/* FILTER BAR */}
      <div
        className="sticky top-[54px] z-20 py-4"
        style={{ background: '#FBF8F2', borderTop: '1px solid #DDD3C2', borderBottom: '1px solid #DDD3C2' }}
      >
        <div className="max-w-[1240px] mx-auto px-8">
          {/* State chips */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="font-sans text-[11px] tracking-[0.16em] uppercase mr-1" style={{ color: '#6E655A' }}>
              State
            </span>
            <Chip active={stateFilter === 'all'} onClick={() => setStateFilter('all')}>All</Chip>
            {STATES.map(s => (
              <Chip key={s} active={stateFilter === s} onClick={() => setStateFilter(s)}>{s}</Chip>
            ))}
            <div className="ml-auto">
              <div
                className="inline-flex rounded-full overflow-hidden"
                style={{ border: '1px solid #DDD3C2' }}
              >
                <span
                  className="px-4 py-2 font-sans text-xs tracking-[0.1em] uppercase"
                  style={{ background: '#211E19', color: '#FBF8F2' }}
                >
                  List
                </span>
                <span
                  className="px-4 py-2 font-sans text-xs tracking-[0.1em] uppercase cursor-not-allowed"
                  style={{ color: '#B6AC9B' }}
                  title="Map view coming in a later phase"
                >
                  Map <small className="text-[9px] tracking-[0.08em]">· soon</small>
                </span>
              </div>
            </div>
          </div>
          {/* Type chips */}
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
              style={{ borderBottom: '1px solid #DDD3C2' }}
            >
              {FULL_STATE[state]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[26px]">
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
      className="font-sans text-xs tracking-[0.1em] uppercase px-[15px] py-2 rounded-full transition-all duration-150 cursor-pointer"
      style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#DDD3C2',
        color: '#6E655A',
        background: '#FBF8F2',
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
    <div>
      <Link href={venueHref(v)} className="block group">
        <div className="relative h-[210px] rounded-[3px] overflow-hidden">
          <span
            className="absolute top-3 left-3 z-10 font-sans text-[10px] tracking-[0.12em] uppercase px-2.5 py-[5px] rounded-[2px]"
            style={{ background: 'rgba(251,246,238,0.94)' }}
          >
            {TYPE_LABELS[v.venueType] ?? v.venueType}
          </span>
          <span
            className="absolute top-3 right-3 z-10 font-sans text-[9.5px] tracking-[0.1em] uppercase px-2.5 py-[5px] rounded-[2px]"
            style={{ background: '#5A5A46', color: '#F4EFE3' }}
          >
            Beauticate approved
          </span>
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
        <h3 className="font-serif font-medium text-[21px] mt-[15px] group-hover:text-wine transition-colors">
          {v.title}
        </h3>
      </Link>
      <p className="font-sans text-[11px] tracking-[0.13em] uppercase mt-[7px]" style={{ color: '#6E655A' }}>
        {v.state}
      </p>
      {v.verdict && (
        <p
          className="font-serif italic text-[16.5px] leading-[1.4] mt-3 pl-3"
          style={{ color: '#211E19', borderLeft: '2px solid #E7DECF' }}
        >
          {v.verdict}
        </p>
      )}
      <div className="flex gap-[10px] mt-4">
        <Link
          href={venueHref(v)}
          className="flex-1 text-center font-sans text-[11px] tracking-[0.12em] uppercase py-[11px] rounded-[3px]"
          style={{ background: '#211E19', color: '#FBF8F2' }}
        >
          Read review
        </Link>
      </div>
    </div>
  )
}
