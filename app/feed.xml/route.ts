import {
  SITE, FEED_LIMIT,
  getFeedArticles, toFeedItem,
  escapeXml, cdata, toRfc822,
  type FeedItem, type FeedProduct, type FeedCollection,
} from '@/lib/feed'

/**
 * RSS 2.0 feed of the 50 most recently published articles.
 *
 * Rendered once per build and then served from Vercel's edge cache, with an
 * hourly revalidation as a backstop. The feed's data source is the content/
 * tree in this repo, so publishing an article IS a deploy: the article lands in
 * the feed the moment that deploy goes live, without waiting for the hour. The
 * revalidation only matters for the one case a deploy can't cover — an article
 * whose `date_published` is in the future going live on its own date — and it
 * costs one filesystem walk an hour rather than one per reader.
 *
 * Deliberately NOT force-dynamic (which app/sitemap.ts is): that route serves
 * 1,846 articles plus every Shopify product and collection on every single
 * request. This one is a fixed 50 items and no network I/O, so a cached copy is
 * both correct and, per the brief, free.
 */
export const dynamic = 'force-static'
export const revalidate = 3600

const BC_NS = 'https://www.beauticate.com/ns/rss'

const CHANNEL = {
  title: 'Beauticate',
  description:
    'Elevating beauty, wellness, and lifestyle with trusted tips, expert voices, and stories that inspire.',
  language: 'en-AU',
  copyright: `Copyright ${new Date().getFullYear()} Beauticate`,
}

function tag(name: string, value: string | number | undefined, indent = '    '): string {
  if (value === undefined || value === '') return ''
  return `${indent}<${name}>${escapeXml(String(value))}</${name}>\n`
}

/** A <bc:shopProduct> / <bc:affiliateProduct> child. */
function productTag(name: string, product: FeedProduct, indent = '      '): string {
  const inner = [
    product.handle ? `${indent}  <bc:handle>${escapeXml(product.handle)}</bc:handle>` : '',
    product.title ? `${indent}  <bc:title>${cdata(product.title)}</bc:title>` : '',
    `${indent}  <bc:url>${escapeXml(product.url)}</bc:url>`,
    product.brand ? `${indent}  <bc:brand>${cdata(product.brand)}</bc:brand>` : '',
    product.retailer ? `${indent}  <bc:retailer>${cdata(product.retailer)}</bc:retailer>` : '',
  ].filter(Boolean).join('\n')
  return `${indent}<${name}>\n${inner}\n${indent}</${name}>\n`
}

/** A <bc:shopCollection> child: a whole shop collection embedded in the body. */
function collectionTag(collection: FeedCollection, indent = '      '): string {
  const inner = [
    `${indent}  <bc:handle>${escapeXml(collection.handle)}</bc:handle>`,
    collection.title ? `${indent}  <bc:title>${cdata(collection.title)}</bc:title>` : '',
    `${indent}  <bc:url>${escapeXml(collection.url)}</bc:url>`,
  ].filter(Boolean).join('\n')
  return `${indent}<bc:shopCollection>\n${inner}\n${indent}</bc:shopCollection>\n`
}

function imageTag(name: string, image: { url: string; width?: number; height?: number } | undefined): string {
  if (!image) return ''
  const dims = image.width && image.height
    ? ` width="${image.width}" height="${image.height}"`
    : ''
  return `    <${name} url="${escapeXml(image.url)}"${dims} />\n`
}

function renderItem(item: FeedItem): string {
  const parts: string[] = []
  parts.push('  <item>\n')
  parts.push(tag('title', item.title))
  parts.push(`    <link>${escapeXml(item.url)}</link>\n`)
  parts.push(`    <guid isPermaLink="false">${escapeXml(item.guid)}</guid>\n`)
  parts.push(`    <pubDate>${toRfc822(item.publishedAt)}</pubDate>\n`)
  if (item.description) parts.push(`    <description>${cdata(item.description)}</description>\n`)
  for (const category of item.categories) {
    parts.push(`    <category>${escapeXml(category)}</category>\n`)
  }
  parts.push(`    <dc:creator>${cdata(item.author)}</dc:creator>\n`)

  // The landscape holding shot, published under both the widely-understood
  // media:content name and our own, so a generic reader and the automation can
  // each take the one they know.
  if (item.hero) {
    const dims = item.hero.width && item.hero.height
      ? ` width="${item.hero.width}" height="${item.hero.height}"`
      : ''
    parts.push(`    <media:content url="${escapeXml(item.hero.url)}" medium="image"${dims} />\n`)
  }
  parts.push(imageTag('bc:heroImage', item.hero))
  parts.push(imageTag('bc:thumbnail', item.thumbnail))

  parts.push(tag('bc:imageCount', item.imageCount))
  parts.push(tag('bc:wordCount', item.wordCount))
  parts.push(tag('bc:isGuestPost', String(item.isGuestPost)))
  // True for an embedded shop collection too: it renders shop product cards, so
  // an article whose only commercial content is one is still a shop placement.
  const hasShop = item.shopProducts.length > 0 || item.shopCollections.length > 0
  parts.push(tag('bc:hasShopProducts', String(hasShop)))

  if (item.shopProducts.length) {
    parts.push('    <bc:shopProducts>\n')
    for (const p of item.shopProducts) parts.push(productTag('bc:shopProduct', p))
    parts.push('    </bc:shopProducts>\n')
  }
  if (item.shopCollections.length) {
    parts.push('    <bc:shopCollections>\n')
    for (const c of item.shopCollections) parts.push(collectionTag(c))
    parts.push('    </bc:shopCollections>\n')
  }
  if (item.affiliateProducts.length) {
    parts.push('    <bc:affiliateProducts>\n')
    for (const p of item.affiliateProducts) parts.push(productTag('bc:affiliateProduct', p))
    parts.push('    </bc:affiliateProducts>\n')
  }

  parts.push('  </item>\n')
  return parts.join('')
}

export function GET() {
  const items = getFeedArticles(FEED_LIMIT).map(toFeedItem)

  // lastBuildDate is when this copy was generated; the channel's pubDate is the
  // newest article in it. Keeping them distinct means a rebuild that adds
  // nothing doesn't look to a reader like fresh content.
  const now = new Date()
  const newest = items[0]?.publishedAt

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:bc="${BC_NS}">
  <channel>
    <title>${escapeXml(CHANNEL.title)}</title>
    <link>${escapeXml(SITE)}</link>
    <description>${cdata(CHANNEL.description)}</description>
    <language>${CHANNEL.language}</language>
    <copyright>${escapeXml(CHANNEL.copyright)}</copyright>
    <lastBuildDate>${toRfc822(now)}</lastBuildDate>
${newest ? `    <pubDate>${toRfc822(newest)}</pubDate>\n` : ''}    <atom:link href="${escapeXml(`${SITE}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <image>
      <url>${escapeXml(`${SITE}/og-default.jpg`)}</url>
      <title>${escapeXml(CHANNEL.title)}</title>
      <link>${escapeXml(SITE)}</link>
    </image>
${items.map(renderItem).join('')}  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // Feed readers and the carousel automation are not browsers; let the CDN
      // hold it for the revalidation window and serve stale while refreshing.
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      // Feeds are meant to be fetched by other machines from other origins.
      'Access-Control-Allow-Origin': '*',
      // The feed lists content; it is not itself a page we want indexed.
      'X-Robots-Tag': 'noindex',
    },
  })
}
