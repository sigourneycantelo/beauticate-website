/**
 * Travelpayouts widget configuration.
 *
 * Every travel widget on the site is built from this file, so an editor writes
 * `<TravelWidget type="hotel_search" city="Sydney" />` and never touches a URL.
 *
 * WHY A CONFIG FILE RATHER THAN PASTED EMBED CODES
 * The first version of TravelWidget took a raw `src` copied out of the
 * Travelpayouts dashboard. That shipped one widget, on the Kerala guide, with
 * no `promo_id` in the URL — so it returned HTTP 400 and left a 472px empty
 * box mid-article for two months. Nothing errored, because a script tag that
 * 400s fails silently. Holding the URL in code means there is one place to get
 * it right and one place to fix it.
 *
 * FILLING IN THE IDS
 * `promoId` and `campaignId` identify which brand's widget Travelpayouts
 * serves; they cannot be guessed and the endpoint 400s without them. Get them
 * from Travelpayouts → Tools → Widgets → "Customize and copy", then read them
 * out of the copied <script src="...">. Until a type has a promoId it renders
 * nothing at all — see the quiet-fail rule in TravelWidget.
 */

/** Public affiliate marker. Absent in local dev and preview unless set. */
/** Partner/programme id for the Beauticate project. */
export const TRS = '539775'

/** Public affiliate marker. Absent in local dev and preview unless set. */
export const MARKER = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER ?? ''

/**
 * House palette, passed to the widget as colour parameters.
 *
 * Travelpayouts widgets ship a default blue/orange scheme that sits badly on
 * the greige page, which is the single most visible thing about them. These
 * map the widget's controls onto the tailwind brand colours so a search box
 * reads as part of the article rather than an ad unit.
 */
/**
 * The one accent colour every widget uses — button, icons, active states.
 *
 * Swapping the house accent is this single line. Wine is the current choice;
 * ink ('#2a2621') is the quieter alternative that was trialled beside it.
 */
const ACCENT = '#7a2733' // wine

export const THEME: Record<string, string> = {
  primary_override: ACCENT,
  color_button: ACCENT,
  color_icons: ACCENT,
  color_focused: '#8E9A82', // eucalypt — the focus ring, as links use on hover
  color_border: '#d8d3ca',
  dark: '#2a2621', // body text stays ink regardless of the accent
  border_radius: '0', // square corners, like everything else on the site
  plain: 'false',
}

export type WidgetType = 'hotel_search' | 'tours' | 'map' | 'calendar' | 'flights'

interface WidgetConfig {
  /** Travelpayouts promo id — the widget itself. No id, no widget. */
  promoId: string
  /** Campaign id — the brand programme the widget books through. */
  campaignId: string
  /** Partner/programme id, the `trs` parameter. */
  trs: string
  /**
   * Query parameter this widget uses to preset the destination. Differs per
   * widget, and not cosmetically: the Agoda hotel form takes a place NAME
   * ("Byron Bay"), the GetYourGuide tours card takes an IATA CITY CODE
   * ("PAR"). Read it off a real embed code built for a known city — do not
   * assume, a wrong name is silently ignored and the widget opens unfiltered.
   */
  destinationParam: string
  /**
   * Turns what an editor writes into what the widget's parameter wants.
   * Returning null means this widget cannot serve that destination, and the
   * component renders nothing rather than something wrong.
   */
  toDestination: (city: string) => string | null
  /** Whether the widget accepts the house colour parameters. Tours does not. */
  themed: boolean
  locale: string
  /** Reserved height, so the article doesn't reflow when the widget paints. */
  height: number
  /** Fallback caption when the editor doesn't write one. */
  label: string
}

/**
 * Cities GetYourGuide will actually serve a tours card for.
 *
 * This list is explicit because an IATA code is NOT proof of coverage. Mudgee
 * has a code (DGE) and no tours: the widget renders a generic "View activities
 * at GetYourGuide" panel with a blurry stock photo and no button. It looks
 * broken and earns nothing. Every entry below was checked by rendering it in a
 * browser and confirming the card shows the city's own name, its own copy and
 * a working "Find Things to Do" button.
 *
 * Adding one: `node scripts/resolve-travel-destination.mjs --iata "<city>"`
 * gives the code, then render it and look before adding it here.
 */
export const TOURS_CITIES: Record<string, string> = {
  bangkok: 'BKK',
  denpasar: 'DPS',
  'gold coast': 'OOL',
  'ho chi minh city': 'SGN',
  ibiza: 'IBZ',
  kochi: 'COK',
  'los angeles': 'LAX',
  melbourne: 'MEL',
  paris: 'PAR',
  'phu quoc': 'PQC',
  seoul: 'SEL',
  sydney: 'SYD',
}

/** The place itself, without the country Agoda appends or a state code. */
const placeKey = (s: string) =>
  s.split(',')[0].replace(/\s*\([^)]*\)/g, '').trim().toLowerCase()

export const WIDGETS: Record<WidgetType, WidgetConfig> = {
  // Agoda Hotels Search Form. Chosen over Booking.com's form, which pays less
  // (3-5% vs 6%) and — the deciding factor — exposes no colour or destination
  // options at all, so it can only ever render as a blue Booking.com box that
  // opens on an empty search.
  hotel_search: {
    promoId: '8303',
    campaignId: '104',
    trs: TRS,
    destinationParam: 'default_destination',
    toDestination: (city) => city,
    themed: true,
    locale: 'en',
    height: 220,
    label: 'Search hotels',
  },
  // GetYourGuide "Things to Do in a City". Pays 8% on a 31-day cookie against
  // Agoda's 6% on ONE day, so on a destination guide it is the better of the
  // two — but only one Travelpayouts widget renders reliably per page, so it
  // replaces the hotel widget rather than joining it. See docs/travel-widgets.md.
  tours: {
    promoId: '4040',
    campaignId: '108',
    trs: TRS,
    destinationParam: 'iata',
    toDestination: (city) => TOURS_CITIES[placeKey(city)] ?? null,
    // No colour parameters exist for this widget; it is a GetYourGuide-branded
    // editorial card, not a form. Passing THEME to it does nothing.
    themed: false,
    locale: 'en-US',
    height: 320,
    label: 'Things to do',
  },
  // Not configured — these render nothing until a promo id is filled in. The
  // catalogue has no hotel map and no hotel price calendar; its calendars are
  // tour-availability widgets. See docs/travel-widgets.md.
  map:      { promoId: '', campaignId: '', trs: TRS, destinationParam: 'default_destination', toDestination: (c) => c, themed: true, locale: 'en', height: 500, label: 'Hotels on the map' },
  calendar: { promoId: '', campaignId: '', trs: TRS, destinationParam: 'default_destination', toDestination: (c) => c, themed: true, locale: 'en', height: 420, label: 'Best prices by month' },
  flights:  { promoId: '', campaignId: '', trs: TRS, destinationParam: 'default_destination', toDestination: (c) => c, themed: true, locale: 'en', height: 350, label: 'Find flights' },
}

/**
 * Build the widget script URL, or null if it can't be built correctly.
 *
 * Null is the important case, and there are now three routes to it: no marker
 * (local dev, an unconfigured preview), an unfilled promo id, and a
 * destination this widget cannot serve. All three render nothing rather than
 * a broken box or a card pointing at the wrong place.
 */
export function buildWidgetUrl(
  type: WidgetType,
  destination?: string,
  subId?: string,
): string | null {
  const config = WIDGETS[type]
  if (!MARKER || !config?.promoId) return null

  const resolved = destination ? config.toDestination(destination) : null
  if (destination && !resolved) return null

  const params = new URLSearchParams({
    trs: config.trs,
    // shmarker carries the marker plus an optional SubID, which is how a
    // widget's earnings are attributed to a particular article in reports.
    shmarker: subId ? `${MARKER}.${subId}` : MARKER,
    promo_id: config.promoId,
    campaign_id: config.campaignId,
    locale: config.locale,
    powered_by: 'true',
    ...(config.themed ? { currency: 'aud', ...THEME } : {}),
  })
  if (resolved) params.set(config.destinationParam, resolved)

  return `https://tpemb.com/content?${params.toString()}`
}
