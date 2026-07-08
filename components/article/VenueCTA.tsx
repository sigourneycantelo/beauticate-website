'use client'

interface VenueCTAProps {
  instagram?: string
  bookingUrl?: string
}

export default function VenueCTA({ instagram, bookingUrl }: VenueCTAProps) {
  if (!instagram && !bookingUrl) return null

  return (
    <div className="flex items-center gap-3 mt-6 mb-2">
      {bookingUrl && (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white text-[11px] font-sans font-medium tracking-[0.14em] uppercase hover:bg-charcoal-light transition-colors"
        >
          Book Now
        </a>
      )}
      {instagram && (
        <a
          href={`https://www.instagram.com/${instagram}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-charcoal/20 text-charcoal text-[11px] font-sans font-medium tracking-[0.14em] uppercase hover:border-charcoal/40 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          See Their Vibe
        </a>
      )}
    </div>
  )
}
