// ─── Brand product submissions from /how-we-review (server-only) ──────────────
//
// The form used to write to a Google Sheet and nothing else. `appendToSheet`
// returns false unless GOOGLE_SHEET_ID is set, which it never has been, so the
// route returned a 500 and every brand saw "Something went wrong. Please try
// again." Nothing was recorded and nothing reached the inbox.
//
// So submissions are now stored the way Ask Sig queries are: one small JSON doc
// per submission in Vercel Blob, which is already wired up in production for
// gift state and the Instagram feed and needs no new account or key. The sheet
// append is kept as a best-effort extra for if it's ever configured.
//
// `addRandomSuffix: true` because these carry a contact's name and email, and
// Vercel Blob only offers public access — an unguessable URL is the protection.

import { put } from '@vercel/blob'

const DIR = 'review-submissions'

export type ReviewSubmission = {
  submittedAt: string
  brandName: string
  name: string
  email: string
  website: string
  category: string
  productName: string
  about: string
}

/** Stores the submission. Returns false if there's nowhere to store it. */
export async function storeSubmission(entry: ReviewSubmission): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false
  try {
    const day = entry.submittedAt.slice(0, 10)
    await put(`${DIR}/${day}/submission.json`, JSON.stringify(entry, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: true,
    })
    return true
  } catch {
    return false
  }
}

const RESEND_KEY = process.env.RESEND_API_KEY
const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN

/** Where the "new submission" alert lands. */
const NOTIFY_TO = process.env.REVIEW_SUBMISSIONS_TO || 'hello@beauticate.com'
const NOTIFY_FROM = process.env.REVIEW_SUBMISSIONS_FROM || 'gifts@beauticate.com'

function render(entry: ReviewSubmission): { subject: string; text: string } {
  return {
    subject: `Product submission: ${entry.brandName} — ${entry.productName}`,
    text: [
      `${entry.brandName} has submitted a product for review.`,
      '',
      `Product:  ${entry.productName}`,
      `Category: ${entry.category || '(not given)'}`,
      `Contact:  ${entry.name}`,
      `Email:    ${entry.email}`,
      `Website:  ${entry.website}`,
      '',
      'What they said about it:',
      entry.about,
      '',
      '—',
      'If you want to see this one in person, reply to them with a postal address.',
      'The page promises a reply only if we want the product, so no reply is a',
      'complete answer on its own.',
    ].join('\n'),
  }
}

/**
 * Emails the alert, when a provider is configured. Never throws: a failed
 * notification must not lose a submission that's already been stored.
 */
export async function notifySubmission(entry: ReviewSubmission): Promise<boolean> {
  const { subject, text } = render(entry)

  try {
    if (RESEND_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: NOTIFY_FROM,
          to: [NOTIFY_TO],
          reply_to: entry.email,
          subject,
          text,
        }),
        cache: 'no-store',
      })
      return res.ok
    }

    if (POSTMARK_TOKEN) {
      const res = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': POSTMARK_TOKEN,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          From: NOTIFY_FROM,
          To: NOTIFY_TO,
          ReplyTo: entry.email,
          Subject: subject,
          TextBody: text,
          MessageStream: 'outbound',
        }),
        cache: 'no-store',
      })
      return res.ok
    }
  } catch {
    // swallow — the submission is already stored
  }

  return false
}
