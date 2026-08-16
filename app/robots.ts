import type { MetadataRoute } from 'next'

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: '*',
      allow: '/',
      // /admin, /api/, /account are this site's own routes.
      // /wp-admin, /wp-login.php, /xmlrpc.php are retired WordPress paths Google
      // is still probing from before the migration — they 404 harmlessly, but
      // disallowing them stops wasted crawl budget and Search Console noise.
      disallow: ['/admin', '/api/', '/account', '/wp-admin', '/wp-login.php', '/xmlrpc.php'],
    }],
    sitemap: [`${SITE}/sitemap.xml`, `${SITE}/sitemap-news.xml`],
    host: SITE,
  }
}
