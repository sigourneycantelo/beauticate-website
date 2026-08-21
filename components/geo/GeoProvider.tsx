'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  COUNTRY_COOKIE,
  DEFAULT_COUNTRY,
  laneFor,
  marketFor,
  normaliseCountry,
  type Lane,
  type TargetedMarket,
} from '@/lib/geo'

interface GeoValue {
  country: string
  lane: Lane
  market: TargetedMarket | null
  /** False until the cookie has been read, so components can hold off on swapping. */
  ready: boolean
}

const GeoContext = createContext<GeoValue>({
  country: DEFAULT_COUNTRY,
  lane: 'home',
  market: null,
  ready: false,
})

export function useGeo() {
  return useContext(GeoContext)
}

function readCountryCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COUNTRY_COOKIE}=([^;]*)`)
  )
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * Rewrite every product link on the page that carries a `data-intl` payload,
 * so a reader outside AU/NZ clicks through to a retailer that ships to them.
 *
 * Done in the DOM rather than at render time on purpose: article pages are
 * statically generated and CDN-cached, so the HTML has to be country-agnostic.
 * Middleware resolves the country at the edge into a cookie, and this swaps the
 * hrefs after hydration. Nothing visible changes, so there's no flash — only
 * where the link points.
 */
function applyIntlLinks(market: TargetedMarket | null) {
  const nodes = document.querySelectorAll<HTMLAnchorElement>('a[data-intl]')
  nodes.forEach((el) => {
    // Stash the original once, so navigating back to a home-lane state restores it.
    if (!el.dataset.homeHref) el.dataset.homeHref = el.getAttribute('href') ?? ''

    let payload: Record<string, { u?: string; r?: string }>
    try {
      payload = JSON.parse(el.dataset.intl || '{}')
    } catch {
      return
    }

    const pick = (market && payload[market]) || payload.default
    if (pick?.u) {
      el.setAttribute('href', pick.u)
      if (pick.r) el.dataset.intlRetailer = pick.r
    }
  })
}

function restoreHomeLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[data-intl]').forEach((el) => {
    if (el.dataset.homeHref) el.setAttribute('href', el.dataset.homeHref)
  })
}

export default function GeoProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState(DEFAULT_COUNTRY)
  const [ready, setReady] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setCountry(normaliseCountry(readCountryCookie()))
    setReady(true)
  }, [])

  const lane = laneFor(country)
  const market = marketFor(country)

  // Re-run after each client-side navigation, since the new page's links are
  // fresh DOM that has never been through the swap.
  useEffect(() => {
    if (!ready) return
    if (lane === 'intl') applyIntlLinks(market)
    else restoreHomeLinks()
  }, [ready, lane, market, pathname])

  return (
    <GeoContext.Provider value={{ country, lane, market, ready }}>
      {children}
    </GeoContext.Provider>
  )
}
