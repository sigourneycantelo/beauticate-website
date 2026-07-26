// ─── Warehouse gift-note email (server-only) ───────────────────────────────────
//
// Sends the "please include the gift" note to a brand's warehouse. Provider-agnostic
// via plain fetch (matching how the rest of the app calls external services):
//   • Resend   if RESEND_API_KEY is set   (recommended — simplest)
//   • Postmark if POSTMARK_SERVER_TOKEN is set
// Klaviyo is intentionally NOT used for these transactional notes.
//
// The From address must be a verified sender on a beauticate.com domain in whichever
// provider you use.

import { CAMPAIGN } from './gift-campaign'

const RESEND_KEY = process.env.RESEND_API_KEY
const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN

export function emailConfigured(): boolean {
  return Boolean(RESEND_KEY || POSTMARK_TOKEN)
}

export type GiftEmailInput = {
  to: string
  orderNumber: string | number // the customer-facing order name, e.g. "#1042"
  shipTo: string // "Bondi, NSW"
  giftName: string
  giftIndex: number // this gift's ordinal (x)
  cap: number // of [20]
  isFinal: boolean // true when this gift reaches the cap
}

/** The exact template supplied by Beauticate. */
function renderEmail(input: GiftEmailInput): { subject: string; text: string } {
  const orderLabel = String(input.orderNumber).startsWith('#')
    ? String(input.orderNumber)
    : `#${input.orderNumber}`

  const subject = `Beauticate gift with purchase, Order ${orderLabel}, please include`

  const lines = [
    'Hi team,',
    '',
    'This Beauticate order qualifies for your launch gift. Please pop ' +
      `${input.giftName} into this parcel before it ships.`,
    '',
    `Order: ${orderLabel}`,
    `Ship to: ${input.shipTo}`,
    `Gift to include: ${input.giftName}`,
    `This is gift ${input.giftIndex} of ${input.cap}`,
  ]

  if (input.isFinal) {
    lines.push(
      '',
      `Heads up: this is the final gift in your allocation of ${input.cap}. ` +
        'No more gift notes will follow for this campaign — thank you for taking part.',
    )
  }

  lines.push(
    '',
    'Nothing to change in your system, just add it to the box you’re already packing. ' +
      'Any questions, reply to this email.',
    '',
    'Thank you,',
    'Beauticate',
  )

  return { subject, text: lines.join('\n') }
}

type SendResult = { ok: boolean; provider: 'resend' | 'postmark' | 'none'; id?: string; error?: string }

/** Send the gift note. Returns a structured result; never throws. */
export async function sendGiftEmail(input: GiftEmailInput): Promise<SendResult> {
  const { subject, text } = renderEmail(input)
  const from = CAMPAIGN.fromEmail
  const bcc = CAMPAIGN.bccEmail

  if (RESEND_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [input.to],
          ...(bcc ? { bcc: [bcc] } : {}),
          subject,
          text,
        }),
        cache: 'no-store',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) return { ok: false, provider: 'resend', error: `HTTP ${res.status}: ${JSON.stringify(json)}` }
      return { ok: true, provider: 'resend', id: json?.id }
    } catch (err) {
      return { ok: false, provider: 'resend', error: String(err) }
    }
  }

  if (POSTMARK_TOKEN) {
    try {
      const res = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': POSTMARK_TOKEN,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          From: from,
          To: input.to,
          ...(bcc ? { Bcc: bcc } : {}),
          Subject: subject,
          TextBody: text,
          MessageStream: 'outbound',
        }),
        cache: 'no-store',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) return { ok: false, provider: 'postmark', error: `HTTP ${res.status}: ${JSON.stringify(json)}` }
      return { ok: true, provider: 'postmark', id: json?.MessageID }
    } catch (err) {
      return { ok: false, provider: 'postmark', error: String(err) }
    }
  }

  return { ok: false, provider: 'none', error: 'No email provider configured (set RESEND_API_KEY or POSTMARK_SERVER_TOKEN)' }
}
