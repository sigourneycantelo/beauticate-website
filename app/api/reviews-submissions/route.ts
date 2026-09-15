import { appendToSheet } from '@/lib/sheets'
import { notifySubmission, storeSubmission, type ReviewSubmission } from '@/lib/review-submissions'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { brandName, name, email, website, category, productName, about } = body

  if (!brandName || !name || !email || !website || !productName || !about) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
  }

  const entry: ReviewSubmission = {
    submittedAt: new Date().toISOString(),
    brandName,
    name,
    email,
    website,
    category: category || '',
    productName,
    about,
  }

  // Blob is the durable record; the sheet is a best-effort extra that only does
  // anything if GOOGLE_SHEET_ID is ever configured. Independent — one failing
  // must not lose the submission.
  const [stored, sheeted] = await Promise.all([
    storeSubmission(entry),
    appendToSheet('Review Submissions', [
      entry.submittedAt,
      entry.brandName,
      entry.name,
      entry.email,
      entry.website,
      entry.category,
      entry.productName,
      entry.about,
    ]).catch(() => false),
  ])

  // Only a submission we failed to record anywhere is an error worth showing the
  // brand, because only then is resubmitting the right thing for them to do.
  if (!stored && !sheeted) {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }

  // Best-effort inbox alert. Recorded either way, so don't fail the request.
  await notifySubmission(entry)

  return NextResponse.json({ success: true })
}
