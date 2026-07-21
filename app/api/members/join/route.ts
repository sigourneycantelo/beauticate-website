import { subscribeToListWithProperties } from '@/lib/klaviyo'
import { NextResponse } from 'next/server'

const INTEREST_LIST_ID = process.env.KLAVIYO_INTEREST_LIST_ID!

export async function POST(req: Request) {
  const { email, firstName } = await req.json()
  if (!email || !firstName) {
    return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
  }

  try {
    await subscribeToListWithProperties(INTEREST_LIST_ID, email, firstName, {
      source: 'members-club-landing',
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
