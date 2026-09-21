'use client'

import { useEffect, useRef } from 'react'
import { buildWidgetUrl, WIDGETS, type WidgetType } from '@/lib/travelpayouts'

interface Props {
  /** Which widget: hotel_search, map, calendar or flights. */
  type?: WidgetType
  /**
   * Destination to preset, as "City, Country" — "Sydney, Australia",
   * "Ubud, Indonesia". The widget matches this against the partner's own
   * place list, so the two-part form is the one that resolves reliably.
   */
  city?: string
  /** Caption under the widget. Falls back to the widget's own label. */
  caption?: string
  /**
   * SubID for reporting, so Travelpayouts shows which article earned what.
   * Defaults to the city, which is usually the answer anyway.
   */
  subid?: string
  /** Override the reserved height. Rarely needed. */
  height?: number
  /**
   * Escape hatch: a full widget URL copied from the Travelpayouts dashboard,
   * for a widget type this component doesn't model yet. Prefer `type` — a
   * hand-pasted URL is how the Kerala widget shipped broken and stayed broken.
   */
  src?: string
}

/**
 * A Travelpayouts affiliate widget, for dropping into any article body:
 *
 *     <TravelWidget type="hotel_search" city="Sydney, Australia" />
 *
 * Renders NOTHING when it can't render correctly — no marker configured, or a
 * widget type whose promo id hasn't been filled in yet. A half-configured page
 * shows no gap where a widget would have been, rather than an empty bordered
 * box that looks like a failed image.
 */
export default function TravelWidget({ type, city, caption, subid, height, src }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const url = src ?? (type ? buildWidgetUrl(type, city, subid ?? city) : null)

  useEffect(() => {
    const container = ref.current
    if (!container || !url) return

    // Travelpayouts widgets render where their script tag sits, so the script
    // has to be created as a real element rather than set via innerHTML —
    // browsers don't execute script tags inserted as markup.
    const script = document.createElement('script')
    script.src = url
    script.charset = 'UTF-8'
    script.async = true
    container.appendChild(script)

    // Strict mode mounts twice in dev; clearing on unmount stops two widgets
    // stacking up in the same box.
    return () => { container.innerHTML = '' }
  }, [url])

  if (!url) return null

  const reserved = height ?? (type ? WIDGETS[type].height : 400)
  const text = caption ?? autoCaption(type, city)

  return (
    <figure className="not-prose my-8">
      <div ref={ref} className="overflow-hidden" style={{ minHeight: reserved }} />
      {text && (
        <figcaption className="mt-2 text-center text-xs text-charcoal-light">
          {text}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * The line under the widget, when the editor hasn't written one.
 *
 * Agoda names a hotel as "Venue, Town, Country" and a place as "Town, Country"
 * or just "Town", so the number of commas is what tells them apart. It matters
 * because "Search hotels in Saffire Freycinet, Coles Bay, Australia" reads as
 * though you could search for hotels inside a hotel — which is what the first
 * version of this said on all seventeen hotel reviews.
 *
 * The parenthetical is dropped too: Agoda writes "Los Angeles (CA)", and the
 * state code helps its matcher but does nothing for a reader.
 */
function autoCaption(type?: WidgetType, city?: string) {
  if (!type) return undefined
  if (!city) return WIDGETS[type].label

  const parts = city.split(',').map((s) => s.trim())
  const name = parts[0].replace(/\s*\([^)]*\)/g, '').trim()

  return parts.length >= 3
    ? `Check availability at ${name}`
    : `${WIDGETS[type].label} in ${name}`
}
