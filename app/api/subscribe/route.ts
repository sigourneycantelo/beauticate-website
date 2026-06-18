import { subscribeToList } from '@/lib/klaviyo'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, firstName } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
  try {
    await subscribeToList(email, firstName)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
