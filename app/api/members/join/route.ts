import { subscribeToListWithProperties } from '@/lib/klaviyo'
import { NextResponse } from 'next/server'

const LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID!

export async function POST(req: Request) {
  const { email, firstName } = await req.json()
  if (!email || !firstName) {
    return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
  }

  try {
    await subscribeToListWithProperties(LIST_ID, email, firstName, {
      source: 'members-club-landing',
      founding_member: true,
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
