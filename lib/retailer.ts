// Derive a readable retailer name from an affiliate URL so cards can say
// "shop via {retailer}" while keeping the original tracking link intact.

// Clean display names for hosts that don't title-case nicely (multi-word brands).
const NAMES: Record<string, string> = {
  'mecca.com': 'Mecca',
  'adorebeauty.com.au': 'Adore Beauty',
  'sephora.com.au': 'Sephora',
  'sephora.com': 'Sephora',
  'net-a-porter.com': 'Net-a-Porter',
  'cultbeauty.com': 'Cult Beauty',
  'thesecretskincare.com': 'The Secret Skincare',
  'ultraviolette.com.au': 'Ultra Violette',
  'mesoestetic.com.au': 'Mesoestetic',
  'motherspf.com': 'Mother SPF',
  'muktiorganics.com': 'Mukti Organics',
  'fucaorganic.com': 'Fuca',
  'littleurchin.com.au': 'Little Urchin',
  'sunbum.com.au': 'Sun Bum',
  'standardprocedure.com': 'Standard Procedure',
  'wearefeelgoodinc.com.au': 'We Are Feel Good Inc',
  'airyday.co': 'Airyday',
  'lornamurray.com.au': 'Lorna Murray',
  'jacebanu.com': 'Jace Banu',
  'lackofcolor.com.au': 'Lack of Color',
}

const SHORTENERS = /^(bit\.ly|tinyurl\.com|t\.co|rebrand\.ly|go\.redirectingat\.com)$/i

/**
 * Unwrap an affiliate wrapper to the retailer URL it actually points at.
 * Handles Skimlinks (`?url=`), Commission Factory (`?Url=`), Impact (`?u=`),
 * Awin (`?ued=`) and Partnerize (`/destination:<encoded>`). Returns the input
 * unchanged when it isn't a wrapper.
 */
export function destinationUrl(url: string): string {
  let dest = url
  try {
    const u = new URL(url)
    const enc =
      u.searchParams.get('url') ||
      u.searchParams.get('Url') ||
      u.searchParams.get('u') ||
      u.searchParams.get('ued')
    if (enc) dest = decodeURIComponent(enc)
  } catch { /* not a full URL */ }
  const destMatch = url.match(/destination:([^?#\s]+)/i) // e.g. prf.hn/click/.../destination:ENCODED
  if (destMatch) { try { dest = decodeURIComponent(destMatch[1]) } catch { /* ignore */ } }
  return dest
}

/** Bare lowercase hostname of a URL's true destination, or '' if unparseable. */
export function destinationHost(url?: string): string {
  if (!url) return ''
  try {
    return new URL(destinationUrl(url)).hostname.replace(/^www\./, '').toLowerCase()
  } catch { return '' }
}

/** Returns a readable retailer name, or '' when it can't be determined (e.g. a shortener). */
export function retailerFromUrl(url?: string): string {
  if (!url) return ''
  const host = destinationHost(url)
  if (!host) return ''
  if (SHORTENERS.test(host)) return ''
  if (NAMES[host]) return NAMES[host]
  // Fallback: title-case the first domain label (e.g. "simka.com" -> "Simka").
  const label = host.split('.')[0]
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : ''
}
