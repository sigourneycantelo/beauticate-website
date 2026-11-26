import { FEED_LIMIT } from '@/lib/feed'
import { getFeedArticles, toFeedItem } from '@/lib/feed-items'
import { buildJsonFeed, jsonFeedResponse } from '@/lib/feed-json'

/**
 * JSON Feed 1.1 of the 50 most recent published items — the same selection as
 * /feed.xml. Claude's weekly EDM check-in reads this one.
 *
 * force-static with no revalidate, for the same reason as /feed.xml: public/ is
 * excluded from this route's bundle (next.config.ts), so a revalidating lambda
 * would find no images and serve an empty feed. Publishing is a deploy, and the
 * deploy rebuilds this. See the note on app/feed.xml/route.ts.
 */
export const dynamic = 'force-static'

export function GET() {
  const articles = getFeedArticles(FEED_LIMIT)
  return jsonFeedResponse(buildJsonFeed(articles.map(toFeedItem), articles))
}
