import { subscribeToList } from '@/lib/klaviyo'
import { subscribeToListWithProperties } from '@/lib/klaviyo'
import { addProspect } from '@/lib/woodpecker'
import { NextResponse } from 'next/server'

const ADVERTISER_LIST_ID = process.env.KLAVIYO_ADVERTISER_LIST_ID!

export async function POST(req: Request) {
  const { email, subscribeNewsletter } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const tasks: Promise<unknown>[] = [
    subscribeToListWithProperties(ADVERTISER_LIST_ID, email, '', {
      source: 'advertise_page',
    }),
    addProspect(email),
  ]

  if (subscribeNewsletter) {
    tasks.push(subscribeToList(email))
  }

  const results = await Promise.allSettled(tasks)

  const advertiserOk =
    results[0].status === 'fulfilled' || results[1].status === 'fulfilled'

  if (!advertiserOk) {
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
