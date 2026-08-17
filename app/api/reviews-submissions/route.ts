import { appendToSheet } from '@/lib/sheets'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { brandName, name, email, website, category, productName, about } = body

  if (!brandName || !name || !email || !website || !productName || !about) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
  }

  const submittedAt = new Date().toISOString()

  const ok = await appendToSheet('Review Submissions', [
    submittedAt,
    brandName,
    name,
    email,
    website,
    category || '',
    productName,
    about,
  ])

  if (!ok) {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
