import { appendToSheet } from '@/lib/sheets'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { question, articleTitle, articleUrl, category } = await req.json()

    if (!question || typeof question !== 'string' || question.trim().length < 3) {
      return Response.json({ error: 'Invalid question' }, { status: 400 })
    }

    const sanitised = question.trim().slice(0, 500)
    const timestamp = new Date().toISOString()

    await appendToSheet('Reader Questions', [
      timestamp,
      sanitised,
      category || '',
      articleTitle || '',
      articleUrl || '',
      'article-strip',
    ])

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Reader question error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
