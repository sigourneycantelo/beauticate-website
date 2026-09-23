'use client'

interface VenueCTAProps {
  instagram?: string
  bookingUrl?: string
  /** The venue's own site. Takes precedence over anything inferred below. */
  website?: string
}

/**
 * Third-party booking platforms. A booking_url on one of these says nothing
 * about where the venue's own site lives, so its origin must never become the
 * "Visit Website" destination — that sent readers to fresha.com rather than to
 * the salon.
 */
const BOOKING_PLATFORMS = [
  'fresha.com', 'kitomba.com', 'phorest.com', 'gettimely.com', 'timely.com',
  'spatime.com', 'mylocalsalon.com', 'shortcutssoftware.com', 'bookwell.com.au',
  'hwbw.link', 'squareup.com', 'setmore.com', 'simplybook.me', 'vagaro.com',
  'styleseat.com', 'bookeo.com', 'schedulista.com',
]

/**
 * Fall back to the booking link's origin only when it is plainly the venue's
 * own domain. Returns null for a booking platform, so the button is hidden
 * rather than pointed somewhere wrong.
 */
function websiteFromBooking(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (BOOKING_PLATFORMS.some(p => host === p || host.endsWith(`.${p}`))) return null
    return u.origin
  } catch {
    return null
  }
}

export default function VenueCTA({ instagram, bookingUrl, website }: VenueCTAProps) {
  if (!instagram && !bookingUrl && !website) return null

  const websiteUrl = website ?? (bookingUrl ? websiteFromBooking(bookingUrl) : null)

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
      {websiteUrl && (
        <a
          href={websiteUrl}
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
