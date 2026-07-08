import Link from 'next/link'
import { getDirectoryListings } from '@/lib/content'

interface Props {
  state: string
}

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

export default function NearbyVenues({ state }: Props) {
  const venues = getDirectoryListings({ state }).slice(0, 4)
  if (!venues.length) return null

  return (
    <div className="mt-12 pt-10 border-t border-cream-200 max-w-[680px]">
      <p className="font-sans text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#A8735A' }}>
        Beautiful places nearby
      </p>
      <h3 className="font-serif text-2xl font-medium mb-5">
        Spas, salons &amp; clinics in {FULL_STATE[state] ?? state}
      </h3>
      <ul className="space-y-3">
        {venues.map(v => {
          const f = v!.frontmatter
          const href = `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
          return (
            <li key={f.slug}>
              <Link href={href} className="group flex items-baseline gap-3">
                <span className="font-serif text-lg group-hover:text-wine transition-colors">{f.title}</span>
                <span className="font-sans text-[10px] tracking-[0.12em] uppercase" style={{ color: '#6E655A' }}>
                  {f.venueType?.replace('-', ' ')}
                </span>
              </Link>
              {f.verdict && (
                <p className="font-serif italic text-sm mt-1 pl-3" style={{ color: '#6E655A', borderLeft: '2px solid #E7DECF' }}>
                  {f.verdict}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      <Link
        href={`/destinations/directory?state=${state}`}
        className="inline-block mt-5 font-sans text-xs tracking-[0.14em] uppercase"
        style={{ color: '#6E655A', borderBottom: '1px solid #DDD3C2', paddingBottom: '2px' }}
      >
        See all in {FULL_STATE[state] ?? state}
      </Link>
    </div>
  )
}
