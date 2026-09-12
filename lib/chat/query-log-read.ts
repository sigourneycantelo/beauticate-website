import { list } from '@vercel/blob'
import type { QueryLogEntry } from './query-log'

/**
 * Reads the Ask Sig query log back out of Vercel Blob.
 *
 * Shared by the admin page and the CSV export so both see exactly the same
 * rows. Entries are one small JSON doc each, newest first after sorting.
 */
export async function readQueryLog(limit = 2000): Promise<QueryLogEntry[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return []
  const entries: QueryLogEntry[] = []
  let cursor: string | undefined

  try {
    do {
      const page = await list({ prefix: 'ask-sig-queries/', cursor, limit: 1000 })
      cursor = page.cursor
      const batch = await Promise.all(
        page.blobs.map(async b => {
          try {
            return (await (await fetch(b.url)).json()) as QueryLogEntry
          } catch {
            return null
          }
        })
      )
      for (const e of batch) if (e) entries.push(e)
      if (entries.length >= limit) break
    } while (cursor)
  } catch {
    return entries
  }

  return entries.sort((a, b) => (a.ts < b.ts ? 1 : -1)).slice(0, limit)
}

/**
 * Reader questions can contain health details, so the page and export sit
 * behind a shared secret rather than being open on an obscure URL. `/admin` is
 * only disallowed in robots.txt today, which stops well-behaved crawlers and
 * nothing else.
 */
export function checkKey(provided: string | null): boolean {
  const expected = process.env.ASK_SIG_ADMIN_KEY
  if (!expected) return false
  return provided === expected
}

export function toCsv(entries: QueryLogEntry[]): string {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const head = [
    'date', 'time', 'question', 'restricted_good', 'articles_matched',
    'products_matched', 'top_article', 'answer_length', 'invented_links', 'asked_from',
  ]
  const rows = entries.map(e => [
    e.ts.slice(0, 10),
    e.ts.slice(11, 16),
    e.question,
    e.restricted ? 'yes' : 'no',
    e.articleCount,
    e.productCount,
    e.topArticle ?? '',
    e.responseChars,
    e.strippedLinks,
    e.pageContext ?? '',
  ].map(esc).join(','))
  return [head.join(','), ...rows].join('\n')
}
