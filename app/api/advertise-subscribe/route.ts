import { subscribeToListWithProperties, upsertProfile } from '@/lib/klaviyo'
import { addProspect } from '@/lib/woodpecker'
import { appendLead } from '@/lib/sheets'
import { NextResponse } from 'next/server'

const LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID!

export async function POST(req: Request) {
  const { email, subscribeNewsletter } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  // Guaranteed capture: every advertise-page inquiry is recorded as a Klaviyo
  // profile regardless of Woodpecker's health or the newsletter opt-in, so a
  // lead can never be silently lost even if the other integrations fail.
  try {
    await upsertProfile(email, '', {
      source: 'advertise_page',
      advertise_page_inquiry: true,
      newsletter_opt_in: subscribeNewsletter !== false,
    })
  } catch (err) {
    console.error(`advertise-subscribe: guaranteed Klaviyo capture failed for ${email}:`, err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }

  const tasks: { name: string; promise: Promise<unknown> }[] = [
    { name: 'woodpecker', promise: addProspect(email, { tags: '#advertiser_lead' }) },
    {
      name: 'contacts-sheet',
      promise: appendLead('contacts', {
        Email: email,
        'Contact Group': 'Advertiser Lead (Web)',
        'Appears In (sources)': 'Website - Advertise Page',
      }),
    },
  ]

  // Default: subscribed unless they explicitly opt out
  if (subscribeNewsletter !== false) {
    tasks.push({
      name: 'klaviyo-list-subscribe',
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

  return NextResponse.json({ success: true })
}
