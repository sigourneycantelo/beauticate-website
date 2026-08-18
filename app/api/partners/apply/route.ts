import { subscribeToListWithProperties } from '@/lib/klaviyo'
import { addProspect } from '@/lib/woodpecker'
import { NextResponse } from 'next/server'

const NEWSLETTER_LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID!

export async function POST(req: Request) {
  const body = await req.json()

  const { brandName, name, email, website, instagram, category, location, shopify, canShipAu, about, firstProduct } = body

  if (!brandName || !name || !email || !website || !location || !about) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
  }

  // Guaranteed capture in Klaviyo first — this must succeed for the submission
  // to count. Woodpecker is best-effort and logged on failure, same pattern as
  // the advertise page, so a brand application can never be silently lost.
  try {
    await subscribeToListWithProperties(NEWSLETTER_LIST_ID, email, name, {
      brand_name: brandName,
      website,
      instagram: instagram || '',
      category: category || '',
      location,
      shopify: shopify || '',
      can_ship_au: canShipAu || '',
      about,
      first_product: firstProduct || '',
      source: 'partner_application',
    })
  } catch (err) {
    console.error(`partners/apply: guaranteed Klaviyo capture failed for ${email}:`, err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }

  try {
    await addProspect(email, {
      tags: '#shop_partner_lead #partner_application',
      company: brandName,
      website,
    })
  } catch (err) {
    console.error(`partners/apply: woodpecker failed for ${email}:`, err)
  }

  return NextResponse.json({ success: true })
}
