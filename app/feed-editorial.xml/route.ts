import { FEED_LIMIT } from '@/lib/feed'
import { getFeedArticles, toFeedItem } from '@/lib/feed-items'
import { buildRssFeed, rssResponse } from '@/lib/feed-rss'

/**
 * The editorial feed: articles and podcast episodes, no directory listings.
 * Built for Pinterest's RSS auto-publish.
 *
 * Why a second route rather than a filter on /feed.xml. Pinterest **backfills
 * the entire feed when you connect it**, oldest first, so every item present
 * at connection time becomes a Pin. At the time of writing that would have
 * meant 17 venue listings — a batch whose `date_modified` was refreshed in one
 * pass in August — going out alongside the editorial.
 *
 * Waiting for them to leave the feed was not an option either. Items drop out
 * only once 50 newer ones exist, and at ~6 published items a month that is
 * roughly eight months away.
 *
 * So the split is the fix. /feed.xml keeps everything, because the Instagram
 * automation wants the listings and reads `<bc:contentType>` to tell them
 * apart. This one carries what Pinterest should pin.
 *
 * If venue listings should ever get their own Pinterest board, add a third
 * route filtering to 'venue' rather than widening this one — Pinterest maps
 * one feed to one board. Give it an `outputFileTracingExcludes` entry in
 * `next.config.ts` in the same commit; this route cost 3.4GB of build output
 * for want of one.
 */
export const dynamic = 'force-static'

/** Directory listings are excluded here and nowhere else. */
const PINNABLE = new Set(['article', 'podcast'])

export function GET() {
  // Filter AFTER selection, not by asking for fewer: getFeedArticles caps at
  // the limit, so filtering its output yields fewer than FEED_LIMIT items.
  // That is the intended behaviour — this feed is a subset of what /feed.xml
  // shows, not a deeper trawl through the archive, so the two never disagree
  // about an item they both carry.
  const items = getFeedArticles(FEED_LIMIT)
    .map(toFeedItem)
    .filter(item => PINNABLE.has(item.contentType))

  return rssResponse(buildRssFeed(items, {
    selfPath: '/feed-editorial.xml',
    description:
      'Beauticate editorial — features, interviews and podcast episodes. ' +
      'Directory listings are in /feed.xml.',
  }))
}
