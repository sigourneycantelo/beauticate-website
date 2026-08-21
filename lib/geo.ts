// Two-lane geo model for links and commerce.
//
//   Home  (AU/NZ) -> the Beauticate shop, Adore, direct margin. Everything we
//                    already ship and already earn on.
//   Intl  (rest)  -> a retailer the reader can actually buy from, monetised by
//                    affiliate. Better than sending them to a locked checkout.
//
// Deliberately NOT one lane per country. Add a dedicated market only once it
// earns one; until then US/GB just get the best hand-picked intl link and
// everyone else falls through to the same place.

export type Lane = 'home' | 'intl'

/** Markets served by the shop and by AU retailer links. */
export const HOME_COUNTRIES = new Set(['AU', 'NZ'])

/**
 * Markets with hand-picked destinations in the link database. Anything else
 * resolves to the generic `intl` entry (usually the brand's own DTC store, or
 * a bare URL for Skimlinks to monetise).
 */
export const TARGETED_MARKETS = ['US', 'GB'] as const
export type TargetedMarket = (typeof TARGETED_MARKETS)[number]

/** Cookie written by middleware from Vercel's `x-vercel-ip-country`. */
export const COUNTRY_COOKIE = 'bc-country'

/** Country used when the header is missing (local dev, bots, unknown IPs). */
export const DEFAULT_COUNTRY = 'AU'

/** Normalise anything header/cookie-shaped into a 2-letter uppercase code. */
export function normaliseCountry(raw: string | null | undefined): string {
  const code = (raw ?? '').trim().toUpperCase()
  return /^[A-Z]{2}$/.test(code) ? code : DEFAULT_COUNTRY
}

export function laneFor(country: string | null | undefined): Lane {
  return HOME_COUNTRIES.has(normaliseCountry(country)) ? 'home' : 'intl'
}

export function isHomeMarket(country: string | null | undefined): boolean {
  return laneFor(country) === 'home'
}

/**
 * Which set of hand-picked links applies. `null` means "no dedicated market",
 * i.e. use the generic intl entry.
 */
export function marketFor(country: string | null | undefined): TargetedMarket | null {
  const code = normaliseCountry(country)
  return (TARGETED_MARKETS as readonly string[]).includes(code)
    ? (code as TargetedMarket)
    : null
}
