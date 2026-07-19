import { appendToSheet } from '@/lib/sheets'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { query, source } = await req.json()

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return Response.json({ error: 'Invalid query' }, { status: 400 })
    }

    const sanitised = query.trim().slice(0, 500)
    const timestamp = new Date().toISOString()

    await appendToSheet('Ask Sig Queries', [
      timestamp,
      sanitised,
      source || 'ask-sig',
    ])

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Query log error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
