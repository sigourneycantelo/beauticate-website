import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import redirectSlugMap from './data/redirect-slug-map.json'
import { COUNTRY_COOKIE, normaliseCountry } from './lib/geo'

// Only the production domain should be indexable. Every other host
// (Vercel preview URLs, *.vercel.app, local) gets X-Robots-Tag: noindex
// so staging never competes with beauticate.com in search.
const PROD_HOSTS = new Set(['www.beauticate.com', 'beauticate.com'])

// Old-URL fallback for articles: catches WordPress-era paths (/news/<slug>,
// /reviews/products/<slug>, /interviews/creatives/<slug>, etc.) and articles
// that were moved to a different subcategory during editorial re-filing —
// neither of which is a clean 1:1 prefix rename, so next.config.ts redirects
// can't express it as a pattern. redirect-slug-map.json (built by
// scripts/generate-redirect-map.mjs on every `npm run build`) maps every
// unambiguous published-article slug to where it lives today; this only
// looks a request up in that map when the first path segment is a category
// name — current or historical — that actually holds articles, so it can
// never catch /shop, /api, /author, static pages, etc.
const ARTICLE_PREFIXES = new Set([
  // current top-level content categories
  'beauty-style', 'destinations', 'interviews', 'living', 'news', 'sigourneys-edit', 'vodcast', 'wellness',
  // retired WordPress-era category prefixes (confirmed via docs/wordpress-sitemap-audit.md
  // and the existing next.config.ts redirects for these same prefixes)
  'destination', 'reviews', 'how-to', 'uncategorized', 'vodcast-by-beauticate', 'ask',
  // 'who' — Beauticate's old celebrity-profile format/taxonomy, not a category in
  // the WP audit's tree but confirmed by Doug's 404 export (66 of 959 dead URLs)
  'who',
  // 'the-go-tos' — old venue-directory prefix. Its next.config.ts wildcard
  // redirects to the generic /destinations/directory got removed (see
  // next.config.ts) because they were shadowing real per-venue matches here.
  'the-go-tos',
])

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').split(':')[0]
  const { pathname } = req.nextUrl

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length >= 2 && ARTICLE_PREFIXES.has(segments[0])) {
    const slug = segments[segments.length - 1]
    const canonicalPath = (redirectSlugMap as Record<string, string>)[slug]
    if (canonicalPath && canonicalPath !== segments.join('/')) {
      return NextResponse.redirect(new URL(`/${canonicalPath}`, req.url), 308)
    }
  }

  // Instagram checkout handoff (docs/instagram-checkout-handoff.md). Meta hands the
  // customer to /shop carrying a reference to its own bag (attributes[cart-id] +
  // access_token) instead of line items — nothing on this site reads it, so the
  // customer lands on a correctly-rendered, empty cart. There's no fix live yet
  // (pending a direction call), so this only counts how often it happens. Never log
  // access_token itself — it's a credential, not a diagnostic.
  if (pathname === '/shop' && (req.nextUrl.searchParams.get('cart_origin') === 'instagram' || req.nextUrl.searchParams.has('attributes[cart-id]'))) {
    console.log('[instagram-cart-handoff]', {
      cartId: req.nextUrl.searchParams.get('attributes[cart-id]'),
      sellerId: req.nextUrl.searchParams.get('attributes[seller-id]'),
      hasAccessToken: req.nextUrl.searchParams.has('access_token'),
      host,
      ts: new Date().toISOString(),
    })
  }

  const res = NextResponse.next()
  if (!PROD_HOSTS.has(host)) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  // Geo lane. Vercel resolves the visitor's country at the edge; we hand it to
  // the client as a cookie rather than reading it inside pages, because
  // `headers()` in a page would opt every article out of static generation.
  // The HTML stays country-agnostic and cacheable; GeoProvider does the swap.
  const country = normaliseCountry(req.headers.get('x-vercel-ip-country'))
  res.cookies.set(COUNTRY_COOKIE, country, {
    path: '/',
    maxAge: 60 * 60 * 12,
    sameSite: 'lax',
    httpOnly: false, // read by GeoProvider on the client
  })

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
