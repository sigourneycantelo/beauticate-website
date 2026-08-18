import { subscribeToListWithProperties } from '@/lib/klaviyo'
import { addProspect } from '@/lib/woodpecker'
import { appendLead } from '@/lib/sheets'
import { NextResponse } from 'next/server'

// Dedicated "Shop Partner Interest" list — kept separate from the consumer
// newsletter so registering brands never receive reader emails. Defaults to the
// live list id (not secret) so the flow works without extra env config; the env
// var can still override it.
const PARTNER_LIST_ID = process.env.KLAVIYO_PARTNER_LIST_ID || 'XXNYny'

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

  // Fan out to the Contacts sheet (source of truth for contacts — a quick
  // interest ping doesn't have enough brand detail for the Shop pipeline
  // sheet), Klaviyo (tagged on the dedicated list) and Woodpecker
  // (cold-outreach prospect). Independent — one failing must not lose the lead.
  const tasks: Promise<unknown>[] = [
    appendLead('contacts', {
      Email: email,
      'Type: Brand': 'Yes',
      'Contact Group': 'Shop Partner Interest (Web)',
      'Appears In (sources)': 'Website - Shop Partners',
    }),
    addProspect(email, { tags: '#shop_partner_lead' }),
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
