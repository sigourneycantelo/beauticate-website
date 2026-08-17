import { subscribeToListWithProperties } from '@/lib/klaviyo'
import { addProspect } from '@/lib/woodpecker'
import { NextResponse } from 'next/server'

const LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID!

export async function POST(req: Request) {
  const { email, subscribeNewsletter } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const tasks: { name: string; promise: Promise<unknown> }[] = [
    { name: 'woodpecker', promise: addProspect(email) },
  ]

  // Default: subscribed unless they explicitly opt out
  if (subscribeNewsletter !== false) {
    tasks.push({
      name: 'klaviyo',
      promise: subscribeToListWithProperties(LIST_ID, email, '', {
        source: 'advertise_page',
      }),
    })
  }

  const results = await Promise.allSettled(tasks.map(t => t.promise))

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`advertise-subscribe: ${tasks[i].name} failed for ${email}:`, result.reason)
    }
  })

  const anyOk = results.some(r => r.status === 'fulfilled')

  if (!anyOk) {
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
