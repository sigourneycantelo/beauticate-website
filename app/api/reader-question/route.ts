export const runtime = 'nodejs'

const ASANA_PROJECT_ID = '1216468486442578'
const ASANA_SECTION_ID = '1216468471485268' // "New" section

export async function POST(req: Request) {
  const token = process.env.ASANA_PAT
  if (!token) {
    return Response.json({ error: 'Not configured' }, { status: 500 })
  }

  try {
    const { question, articleTitle, articleUrl, category } = await req.json()

    if (!question || typeof question !== 'string' || question.trim().length < 3) {
      return Response.json({ error: 'Invalid question' }, { status: 400 })
    }

    const sanitised = question.trim().slice(0, 500)

    const res = await fetch('https://app.asana.com/api/1.0/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: sanitised,
          notes: `Reader question from Beauticate\n\nArticle: ${articleTitle}\nURL: ${articleUrl}\nCategory: ${category}\n\nQuestion: ${sanitised}`,
          projects: [ASANA_PROJECT_ID],
          memberships: [{ project: ASANA_PROJECT_ID, section: ASANA_SECTION_ID }],
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Asana API error:', err)
      return Response.json({ error: 'Failed to submit' }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Reader question error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
