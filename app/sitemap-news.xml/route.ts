import { SITE, NEWS_WINDOW_MS, getFeedCandidates, escapeXml, toPlainText } from '@/lib/feed'

/**
 * Google News sitemap: every article published in the last 48 hours.
 *
 * MUST be rendered per request. The 48-hour window slides continuously, so a
 * copy generated at build time is a snapshot of whichever two days happened to
 * surround the last deploy and goes wrong the moment it is served — it starts
 * advertising articles that have aged out and, worse, cannot ever list one
 * published after the build. app/sitemap.ts carries the same `force-dynamic`
 * for a related reason (see the note there about a stale cached snapshot being
 * served in production for weeks). The work is a walk over content/ and nothing
 * else; Googlebot is the only real caller, and the response is cached for 15
 * minutes at the edge regardless.
 */
export const dynamic = 'force-dynamic'

/**
 * IT IS NORMAL FOR THIS SITEMAP TO BE EMPTY.
 *
 * Beauticate publishes a few times a month, not a few times a day, so for most
 * of any given week nothing falls inside Google's 48-hour window and a
 * zero-entry <urlset> is the correct answer rather than a bug. The comment
 * emitted into the XML below says so, because an empty response reads as a
 * failure to anyone opening the URL cold.
 *
 * It previously carried a second, real defect: entries were additionally
 * filtered to resolveSchemaType(f) === 'NewsArticle', which silently dropped
 * every review, how-to and plain feature. That is not what a news sitemap is
 * for — Google's only content requirement is recency — so a beauty review
 * published this morning would have been withheld from Google News for no
 * reason. That filter is gone.
 */
export function GET() {
  const now = new Date()
  const cutoff = now.getTime() - NEWS_WINDOW_MS

  // getFeedCandidates already drops drafts, un-updated directory listings and
  // future-dated (scheduled) articles, and orders newest-first. Candidates
  // rather than getFeedArticles: a news sitemap carries no image, so there is
  // no reason to pay for the image check on every article in the archive.
  const recent = getFeedCandidates(now).filter(a => a.publishedAt.getTime() >= cutoff)

  const urls = recent.map(({ parts, frontmatter, publishedAt }) => `  <url>
    <loc>${escapeXml(`${SITE}/${parts.join('/')}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>Beauticate</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publishedAt.toISOString()}</news:publication_date>
      <news:title>${escapeXml(toPlainText(frontmatter.title ?? ''))}</news:title>
    </news:news>
  </url>`)

  const note = urls.length === 0
    ? `  <!-- No articles published in the last 48 hours. An empty urlset is the
       correct response here, not a fault: Beauticate publishes weekly, not
       daily, so this sitemap is empty most of the time. -->\n`
    : ''

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${note}${urls.join('\n')}${urls.length ? '\n' : ''}</urlset>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900, s-maxage=900',
    },
  })
}
