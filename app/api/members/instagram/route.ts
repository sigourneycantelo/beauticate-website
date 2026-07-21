import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

const ASANA_PROJECT_ID = '1216468486442578'
const ASANA_SECTION_ID = '1216468471485268'

export async function POST(req: Request) {
  const token = process.env.ASANA_PAT
  if (!token) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  try {
    const formData = await req.formData()
    const firstName = formData.get('firstName') as string
    const email = formData.get('email') as string
    const handle = formData.get('handle') as string
    const actionType = formData.get('actionType') as string
    const screenshot = formData.get('screenshot') as File | null

    if (!firstName || !email || !handle || !actionType || !screenshot) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!['tag', 'follow'].includes(actionType)) {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 })
    }

    const blob = await put(
      `instagram-submissions/${Date.now()}-${screenshot.name}`,
      screenshot,
      { access: 'public' }
    )

    const taskName = `Instagram ${actionType}: @${handle.replace('@', '')} (${email})`
    const notes = [
      "Instagram points submission from the Members’ Club",
      '',
      `Name: ${firstName}`,
      `Email: ${email}`,
      `Instagram: @${handle.replace('@', '')}`,
      `Action: ${actionType}`,
      `Screenshot: ${blob.url}`,
      '',
      'Verify and award points in Smile.io when live.',
    ].join('\n')

    const res = await fetch('https://app.asana.com/api/1.0/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: taskName,
          notes,
          projects: [ASANA_PROJECT_ID],
          memberships: [{ project: ASANA_PROJECT_ID, section: ASANA_SECTION_ID }],
        },
      }),
    })

    if (!res.ok) {
      console.error('Asana API error:', await res.text())
      return NextResponse.json({ error: 'Failed to submit' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Instagram submission error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
