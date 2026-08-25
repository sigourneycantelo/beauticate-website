import { readQueryLog, checkKey, toCsv } from '@/lib/chat/query-log-read'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Downloads the Ask Sig question log as CSV, for opening in Sheets or Excel.
 *
 *   /api/admin/ask-sig-export?key=...
 *
 * Gated on ASK_SIG_ADMIN_KEY because the rows contain readers' own words, which
 * routinely means health details.
 */
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get('key')
  if (!checkKey(key)) {
    return new Response('Not found', { status: 404 })
  }

  const entries = await readQueryLog()
  const today = new Date().toISOString().slice(0, 10)

  return new Response(toCsv(entries), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ask-sig-questions-${today}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
