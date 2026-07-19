import { subscribeToListWithProperties } from '@/lib/klaviyo'
import { NextResponse } from 'next/server'

const NEWSLETTER_LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID!

export async function POST(req: Request) {
  const body = await req.json()

  const { name, email, suggestion, why, anythingElse } = body

  if (!name || !email || !suggestion) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
  }

  try {
    await subscribeToListWithProperties(NEWSLETTER_LIST_ID, email, name, {
      suggestion,
      why: why || '',
      anything_else: anythingElse || '',
      source: 'reader_suggestion',
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
