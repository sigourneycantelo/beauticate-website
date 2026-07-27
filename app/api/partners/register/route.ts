import { subscribeToListWithProperties } from '@/lib/klaviyo'
import { addProspect } from '@/lib/woodpecker'
import { NextResponse } from 'next/server'

// Dedicated "Shop Partner Interest" list — kept separate from the consumer
// newsletter so registering brands never receive reader emails.
const PARTNER_LIST_ID = process.env.KLAVIYO_PARTNER_LIST_ID

export async function POST(req: Request) {
  let email: string | undefined
  try {
    const body = await req.json()
    email = body?.email
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  // Fan out to Klaviyo (tagged on the dedicated list) and Woodpecker (cold-outreach
  // prospect). Independent — one failing must not lose the lead.
  const tasks: Promise<unknown>[] = [addProspect(email)]

  if (PARTNER_LIST_ID) {
    tasks.push(
      subscribeToListWithProperties(PARTNER_LIST_ID, email, '', {
        source: 'partner_interest',
      })
    )
  }

  const results = await Promise.allSettled(tasks)
  const anyOk = results.some(r => r.status === 'fulfilled')

  if (!anyOk) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
