import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only the production domain should be indexable. Every other host
// (Vercel preview URLs, *.vercel.app, local) gets X-Robots-Tag: noindex
// so staging never competes with beauticate.com in search.
const PROD_HOSTS = new Set(['www.beauticate.com', 'beauticate.com'])

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').split(':')[0]
  const res = NextResponse.next()
  if (!PROD_HOSTS.has(host)) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
