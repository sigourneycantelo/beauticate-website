import { subscribeToListWithProperties } from '@/lib/klaviyo'
import { NextResponse } from 'next/server'

const NEWSLETTER_LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID!

export async function POST(req: Request) {
  const body = await req.json()

  const { brandName, name, email, website, instagram, category, location, shopify, canShipAu, about, firstProduct } = body

  if (!brandName || !name || !email || !website || !location || !about) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
  }

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
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
