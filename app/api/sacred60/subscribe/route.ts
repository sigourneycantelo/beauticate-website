import { subscribeToList } from '@/lib/klaviyo'
import { NextResponse } from 'next/server'

const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY!

export async function POST(req: Request) {
  const { email, firstName } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  try {
    await subscribeToList(email, firstName)

    // Fire a "Sacred 60 Download" event so Klaviyo can trigger a flow
    await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        revision: '2024-10-15',
        'content-type': 'application/json',
        Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'event',
          attributes: {
            profile: { data: { type: 'profile', attributes: { email } } },
            metric: { data: { type: 'metric', attributes: { name: 'Sacred 60 Download' } } },
            properties: { source: 'sacred60-landing-page' },
          },
        },
      }),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
