/**
 * Shop brands whose founder Sigourney has interviewed on Beautiful Inside.
 *
 * The interview is the reason many of these brands are in the shop at all, and
 * until now a shopper on the brand page had no idea it existed. Keyed by the
 * Shopify brand collection handle, as it appears in /shop/brands/<handle>.
 *
 * Add a row when a founder episode goes out — the strip reads everything else
 * (video id, platform links, whether there's an episode page to link to) from
 * content/vodcast/episodes/<episode>/.
 */
export type BrandEpisode = {
  /** Vodcast slug under content/vodcast/episodes/ */
  episode: string
  /** Line above the buttons. Name the founder — that's the draw. */
  heading: string
}

export const BRAND_EPISODES: Record<string, BrandEpisode> = {
  'booie-beauty': {
    episode: 'celeste-barber-on-adhd-bullying-boundaries-and-the-battle-with-social-media',
    heading: 'Sigourney interviews BOOIE founder Celeste Barber',
  },
  'jshealth-vitamins': {
    episode: 'jess-sepel-on-ocd-healing-from-disordered-eating-grief-and-building-jshealth-wit',
    heading: 'Sigourney interviews JSHealth founder Jess Sepel',
  },
  'mukti-organics': {
    episode: 'mukti-organics-founder-on-trauma-truth-and-building-a-beauty-brand-with-purpose',
    heading: 'Sigourney interviews Mukti Organics founder Mukti',
  },
}

/** Brand handles carry a `-1` suffix on some duplicated collections. */
export function brandEpisode(handle: string): BrandEpisode | undefined {
  return BRAND_EPISODES[handle] ?? BRAND_EPISODES[handle.replace(/-1$/, '')]
}
