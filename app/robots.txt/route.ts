/**
 * robots.txt.
 *
 * Hand-written rather than Next's MetadataRoute.Robots helper for one reason:
 * robots.txt has no directive for a feed, and the helper emits only the
 * directives it knows about. The RSS feed should be discoverable from here, and
 * the only honest way to say so is a comment — listing /feed.xml under
 * `Sitemap:` would hand Google a URL that is not a sitemap and fails validation
 * in Search Console.
 *
 * The machine-readable discovery path is the
 * <link rel="alternate" type="application/rss+xml"> that app/layout.tsx puts in
 * <head> on every page. This line is for anyone, human or crawler, who looks
 * here first.
 *
 * SITE is computed here rather than imported from lib/feed, deliberately. An
 * earlier version of this file did `import { SITE } from '@/lib/feed'`, which
 * at the time pulled in the image-reading code and, with it, a conservative
 * @vercel/nft trace of the entire 3.3GB public/ tree into this route's bundle.
 * That was one of the bundles behind `ENOSPC: no space left on device` on
 * PR #84. Two lines of duplicated env parsing is the cheaper trade — see the
 * note at the top of lib/feed-images.ts.
 */
export const dynamic = 'force-static'

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com').replace(/\/$/, '')

export function GET() {
  // /admin, /api/, /account are this site's own routes.
  // /wp-admin, /wp-login.php, /xmlrpc.php are retired WordPress paths Google
  // is still probing from before the migration — they 404 harmlessly, but
  // disallowing them stops wasted crawl budget and Search Console noise.
  const body = `User-Agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /account
Disallow: /wp-admin
Disallow: /wp-login.php
Disallow: /xmlrpc.php

Host: ${SITE}
Sitemap: ${SITE}/sitemap.xml
Sitemap: ${SITE}/sitemap-news.xml

# RSS feed: ${SITE}/feed.xml
# RSS feed (editorial only, no directory listings): ${SITE}/feed-editorial.xml
`
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
