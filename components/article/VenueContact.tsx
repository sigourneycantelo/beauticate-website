'use client'

interface VenueContactProps {
  name: string
  address?: string
  telephone?: string
  instagram?: string
  bookingUrl?: string
}

function websiteFromBooking(url: string): string | null {
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

function IconPin() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-charcoal-light">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-charcoal-light">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-charcoal-light">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

export default function VenueContact({ name, address, telephone, instagram, bookingUrl }: VenueContactProps) {
  const hasDetails = address || telephone || instagram
  if (!hasDetails && !bookingUrl) return null

  const website = bookingUrl ? websiteFromBooking(bookingUrl) : null

  return (
    <div className="not-prose border-t border-charcoal/[0.08] mt-8 pt-6">
      <h2 className="font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal-light font-semibold mb-4">
        Contact
      </h2>

      <p className="font-serif text-xl text-charcoal mb-3">{name}</p>

      {hasDetails && (
        <div className="flex flex-col gap-1.5 mb-5">
          {address && (
            <span className="flex items-center gap-2 text-sm text-charcoal">
              <IconPin />
              {address}
            </span>
          )}
          {telephone && (
            <a href={`tel:${telephone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-charcoal underline decoration-charcoal/15 underline-offset-[3px] hover:decoration-charcoal/50 transition-colors">
              <IconPhone />
              {telephone}
            </a>
          )}
          {instagram && (
            <a href={`https://www.instagram.com/${instagram}/`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-charcoal underline decoration-charcoal/15 underline-offset-[3px] hover:decoration-charcoal/50 transition-colors">
              <IconInstagram />
              @{instagram}
            </a>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-charcoal/15 text-charcoal text-[11px] font-sans font-medium tracking-[0.14em] uppercase rounded-[1px] hover:border-charcoal/40 transition-colors"
          >
            Book now
          </a>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-charcoal/15 text-charcoal text-[11px] font-sans font-medium tracking-[0.14em] uppercase rounded-[1px] hover:border-charcoal/40 transition-colors"
          >
            Visit website
          </a>
        )}
        {instagram && (
          <a
            href={`https://www.instagram.com/${instagram}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-charcoal/15 text-charcoal text-[11px] font-sans font-medium tracking-[0.14em] uppercase rounded-[1px] hover:border-charcoal/40 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            See their vibe
          </a>
        )}
      </div>
    </div>
  )
}
