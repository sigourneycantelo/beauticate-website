import { FEED_LIMIT } from '@/lib/feed'
// Image reading lives here, and only a force-static route may import it — see
// the note at the top of lib/feed-images.ts.
import { getFeedArticles, toFeedItem } from '@/lib/feed-items'
import { buildRssFeed, rssResponse } from '@/lib/feed-rss'

/**
 * RSS 2.0 feed of the 50 most recent published items — articles, podcast
 * episodes and directory listings alike. This is the feed the Instagram
 * carousel automation reads; `<bc:contentType>` tells it which is which.
 *
 * Rendered once per build and served static. There is no revalidation and
 * there must not be: public/ is excluded from this route's function bundle
 * (see next.config.ts), so a revalidating lambda would find no images, drop
 * every item on the image guard, and serve a valid but empty feed. Content
 * lives in this repo, so publishing IS a deploy and the deploy rebuilds this.
 *
 * Deliberately NOT force-dynamic (which app/sitemap.ts is): that route serves
 * 1,846 articles plus every Shopify product and collection on every request.
 * This one is a fixed 50 items and no network I/O, so a cached copy is both
 * correct and, per the brief, free.
 *
 * See also /feed-editorial.xml, the same items without directory listings.
 */
export const dynamic = 'force-static'

export function GET() {
  const items = getFeedArticles(FEED_LIMIT).map(toFeedItem)
  return rssResponse(buildRssFeed(items, { selfPath: '/feed.xml' }))
}
