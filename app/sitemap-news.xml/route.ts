import { getArticleSlugs, getArticleBySlug } from '@/lib/content'
import { resolveSchemaType } from '@/lib/seo'

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com').replace(/\/$/, '')

export function GET() {
  const now = Date.now()
  const twoDaysAgo = now - 48 * 60 * 60 * 1000

  const articles = getArticleSlugs()
    .map(parts => ({ parts, article: getArticleBySlug(parts) }))
    .filter(({ article }) => {
      if (!article || article.frontmatter.published === false) return false
      const pubDate = new Date(article.frontmatter.date_published ?? '2000-01-01').getTime()
      if (pubDate < twoDaysAgo) return false
      const schemaType = resolveSchemaType(article.frontmatter)
      return schemaType === 'NewsArticle'
    })

  const urls = articles.map(({ parts, article }) => {
    const f = article!.frontmatter
    const loc = `${SITE}/${parts.join('/')}`
    const pubDate = new Date(f.date_published!).toISOString()
    const title = escapeXml(f.title)
    return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>Beauticate</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=900, s-maxage=900',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
