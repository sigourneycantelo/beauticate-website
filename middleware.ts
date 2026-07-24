import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only the production domain should be indexable. Every other host
// (Vercel preview URLs, *.vercel.app, local) gets X-Robots-Tag: noindex
// so staging never competes with beauticate.com in search.
const PROD_HOSTS = new Set(['www.beauticate.com', 'beauticate.com'])

// Early-access gate — set to true to require a password before viewing the site.
// Remove or set to false for full public launch.
const EARLY_ACCESS_GATE = true

const GATE_ALLOW = new Set([
  '/early-access',
  '/api/early-access',
])

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').split(':')[0]
  const { pathname } = req.nextUrl

  if (EARLY_ACCESS_GATE) {
    const isAllowed =
      GATE_ALLOW.has(pathname) ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon')

    if (!isAllowed && !req.cookies.has('early_access')) {
      return NextResponse.redirect(new URL('/early-access', req.url))
    }
  }

  const res = NextResponse.next()
  if (!PROD_HOSTS.has(host)) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
