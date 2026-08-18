import { subscribeToListWithProperties } from '@/lib/klaviyo'
import { addProspect } from '@/lib/woodpecker'
import { appendToSheet } from '@/lib/sheets'
import { NextResponse } from 'next/server'

// Same dedicated "Shop Partner Interest" list the quick-interest form
// (/shop/partners) uses — applicants must never be silently dropped onto the
// general reader newsletter list, they're evaluating a business relationship.
const PARTNER_LIST_ID = process.env.KLAVIYO_PARTNER_LIST_ID || 'XXNYny'

export async function POST(req: Request) {
  const body = await req.json()

  const { brandName, name, email, website, instagram, category, location, shopify, canShipAu, about, firstProduct } = body

  if (!brandName || !name || !email || !website || !location || !about) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
  }

  // Guaranteed capture in Klaviyo first — this must succeed for the submission
  // to count. Sheet + Woodpecker are best-effort and logged on failure, same
  // pattern as the advertise page, so a brand application can never be lost.
  try {
    await subscribeToListWithProperties(PARTNER_LIST_ID, email, name, {
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

  const submittedAt = new Date().toISOString()
  const results = await Promise.allSettled([
    appendToSheet('Partner Interest', [
      submittedAt, email, 'partner_application', brandName, name, website,
      instagram || '', category || '', location, shopify || '', canShipAu || '', firstProduct || '', about,
    ]),
    addProspect(email, {
      tags: '#shop_partner_lead #partner_application',
      company: brandName,
      website,
    }),
  ])

  const [sheetResult, woodpeckerResult] = results
  if (sheetResult.status === 'rejected') {
    console.error(`partners/apply: sheet append failed for ${email}:`, sheetResult.reason)
  }
  if (woodpeckerResult.status === 'rejected') {
    console.error(`partners/apply: woodpecker failed for ${email}:`, woodpeckerResult.reason)
  }

  return NextResponse.json({ success: true })
}
