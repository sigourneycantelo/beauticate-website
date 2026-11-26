import { SITE } from '@/lib/feed'
import type { FeedArticle } from '@/lib/feed'
import type { FeedItem } from '@/lib/feed-items'

/**
 * JSON Feed 1.1 rendering (https://www.jsonfeed.org/version/1.1/).
 *
 * The same items as /feed.xml, in a shape that is easy for scripts and AI tools
 * to read. Selection lives in lib/feed.ts and the route, exactly as for RSS, so
 * the two feeds cannot disagree about what is published.
 */

const DESCRIPTION =
  'Elevating beauty, wellness, and lifestyle with trusted tips, expert voices, and stories that inspire.'

/** Clean canonical URL: no query string, no tracking parameters. */
function clean(url: string): string {
  return url.split('?')[0].split('#')[0]
}

/** RFC 3339 in Sydney time, so a story published on the 2nd reads as the 2nd. */
function toSydneyIso(date: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Australia/Sydney', hour12: false, timeZoneName: 'longOffset',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(date).map((p) => [p.type, p.value]),
  )
  const off = (parts.timeZoneName || 'GMT+10:00').replace('GMT', '') || '+00:00'
  return `${parts.year}-${parts.month}-${parts.day}T${String(parts.hour).replace('24', '00')}:${parts.minute}:${parts.second}${off}`
}

export function buildJsonFeed(items: FeedItem[], articles: FeedArticle[]) {
  const modifiedByUrl = new Map<string, Date | undefined>()
  for (const a of articles) modifiedByUrl.set(`${SITE}/${a.parts.join('/')}`, a.modifiedAt)

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Beauticate',
    home_page_url: SITE,
    feed_url: `${SITE}/feed.json`,
    description: DESCRIPTION,
    language: 'en-AU',
    items: items.map((item) => {
      const modified = modifiedByUrl.get(item.url)
      const image = item.hero ?? item.thumbnail
      return {
        id: item.guid,
        url: clean(item.url),
        title: item.title,
        summary: item.description,
        date_published: toSydneyIso(item.publishedAt),
        // Never earlier than the publish date, and equal to it when unedited.
        date_modified: toSydneyIso(modified && modified.getTime() > item.publishedAt.getTime()
          ? modified
          : item.publishedAt
        ),
        authors: [{ name: item.author }],
        tags: item.categories,
        ...(image ? { image: image.url } : {}),
        _beauticate: {
          content_type: item.contentType,
          ...(item.thumbnail ? { portrait_image: item.thumbnail.url } : {}),
          ...(item.hero ? { landscape_image: item.hero.url } : {}),
        },
      }
    }),
  }
}

export function jsonFeedResponse(feed: unknown): Response {
  return new Response(JSON.stringify(feed, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
      'X-Robots-Tag': 'noindex',
    },
  })
}
