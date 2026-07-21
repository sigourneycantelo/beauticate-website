'use client'

interface VenueCTAProps {
  instagram?: string
  bookingUrl?: string
}

function websiteFromBooking(url: string): string | null {
  try {
    const u = new URL(url)
    return u.origin
  } catch {
    return null
  }
}

export default function VenueCTA({ instagram, bookingUrl }: VenueCTAProps) {
  if (!instagram && !bookingUrl) return null

  const website = bookingUrl ? websiteFromBooking(bookingUrl) : null

  return (
    <div className="flex items-center justify-center gap-3 mt-6 mb-10">
      {bookingUrl && (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-charcoal/20 text-charcoal text-[11px] font-sans font-medium tracking-[0.14em] uppercase rounded-[1px] hover:border-charcoal/40 transition-colors"
        >
          Book Now
        </a>
      )}
      {instagram && (
        <a
          href={`https://www.instagram.com/${instagram}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-charcoal/20 text-charcoal text-[11px] font-sans font-medium tracking-[0.14em] uppercase rounded-[1px] hover:border-charcoal/40 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          See Their Vibe
        </a>
      )}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-charcoal/20 text-charcoal text-[11px] font-sans font-medium tracking-[0.14em] uppercase rounded-[1px] hover:border-charcoal/40 transition-colors"
        >
          Visit Website
        </a>
      )}
    </div>
  )
}
