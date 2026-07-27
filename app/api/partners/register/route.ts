import { subscribeToListWithProperties } from '@/lib/klaviyo'
import { addProspect } from '@/lib/woodpecker'
import { appendToSheet } from '@/lib/sheets'
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

  const submittedAt = new Date().toISOString()

  // Fan out: Klaviyo (tag on dedicated list), Google Sheet (Woodpecker handoff),
  // and a direct Woodpecker push. Independent — one failing must not lose the lead.
  const tasks: Promise<unknown>[] = [
    appendToSheet('Partner Interest', [submittedAt, email, 'partners_page']),
    addProspect(email),
  ]

  if (PARTNER_LIST_ID) {
    tasks.push(
      subscribeToListWithProperties(PARTNER_LIST_ID, email, '', {
        source: 'partner_interest',
      })
    )
  }

  const results = await Promise.allSettled(tasks)
  // appendToSheet resolves `false` when unconfigured/failed — don't count that as success.
  const anyOk = results.some(r => r.status === 'fulfilled' && r.value !== false)

  if (!anyOk) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
