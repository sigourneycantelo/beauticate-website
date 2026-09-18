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
export const THEME: Record<string, string> = {
  primary_override: '#2a2621', // ink — the button and active states
  color_button: '#2a2621',
  color_icons: '#2a2621',
  color_focused: '#8E9A82', // eucalypt — the focus ring, as links use on hover
  color_border: '#d8d3ca',
  dark: '#2a2621', // body text
  border_radius: '0', // square corners, like everything else on the site
  plain: 'false',
}

export type WidgetType = 'hotel_search' | 'map' | 'calendar' | 'flights'

interface WidgetConfig {
  /** Travelpayouts promo id — the widget itself. No id, no widget. */
  promoId: string
  /** Campaign id — the brand programme the widget books through. */
  campaignId: string
  /** Partner/programme id, the `trs` parameter. */
  trs: string
  /**
   * Query parameter this widget uses to preset the destination. Differs per
   * widget: the hotel forms take a place name, the flight form takes IATA
   * codes. Read it off a real embed code built for a known city — do not
   * assume, a wrong name is silently ignored and the widget opens unfiltered.
   */
  destinationParam: string
  /** Reserved height, so the article doesn't reflow when the widget paints. */
  height: number
  /** Fallback caption when the editor doesn't write one. */
  label: string
}

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
    height: 220,
    label: 'Search hotels',
  },
  // Not configured yet — these render nothing until a promo id is filled in.
  // The catalogue has no hotel map or hotel price calendar; the nearest
  // equivalents are tour widgets from Viator and GetYourGuide. See
  // docs/travel-widgets.md.
  map:      { promoId: '', campaignId: '', trs: TRS, destinationParam: 'default_destination', height: 500, label: 'Hotels on the map' },
  calendar: { promoId: '', campaignId: '', trs: TRS, destinationParam: 'default_destination', height: 420, label: 'Best prices by month' },
  flights:  { promoId: '', campaignId: '', trs: TRS, destinationParam: 'default_destination', height: 350, label: 'Find flights' },
}

/**
 * Build the widget script URL, or null if it can't be built correctly.
 *
 * Null is the important case: no marker (local dev, an unconfigured preview)
 * or an unfilled promo id must render nothing, never a broken empty box.
 */
export function buildWidgetUrl(
  type: WidgetType,
  destination?: string,
  subId?: string,
): string | null {
  const config = WIDGETS[type]
  if (!MARKER || !config?.promoId) return null

  const params = new URLSearchParams({
    trs: config.trs,
    // shmarker carries the marker plus an optional SubID, which is how a
    // widget's earnings are attributed to a particular article in reports.
    shmarker: subId ? `${MARKER}.${subId}` : MARKER,
    promo_id: config.promoId,
    campaign_id: config.campaignId,
    locale: 'en',
    currency: 'aud',
    powered_by: 'true',
    ...THEME,
  })
  if (destination) params.set(config.destinationParam, destination)

  return `https://tpemb.com/content?${params.toString()}`
}
