import { subscribeToList, subscribeToListWithProperties } from '@/lib/klaviyo'
import { NextResponse } from 'next/server'

const LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID!

export async function POST(req: Request) {
  let email: string | undefined
  let firstName: string | undefined
  let source: string | undefined

  const ct = req.headers.get('content-type') ?? ''
  if (ct.includes('application/json')) {
    const body = await req.json()
    email = body.email
    firstName = body.firstName
    source = body.source
  } else {
    const form = await req.formData()
    email = form.get('email') as string | undefined
    firstName = form.get('firstName') as string | undefined
    source = (form.get('source') as string | undefined) ?? 'vodcast-page'
  }

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
  try {
    if (source) {
      await subscribeToListWithProperties(LIST_ID, email, firstName ?? '', { source })
    } else {
      await subscribeToList(email, firstName)
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[subscribe] Klaviyo subscription failed:', e)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
