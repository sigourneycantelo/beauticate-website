// ─── Gift-with-purchase audit log ──────────────────────────────────────────────
//
// Every meaningful action is logged as a single structured JSON line prefixed with
// `[gift-audit]`, so you can filter and read the full trail in Vercel's log drain
// (or ship it onward). One line per decision keeps the audit greppable:
//
//   [gift-audit] {"ts":"…","event":"emailed","order":"#1042","brand":"maison-balzac", …}
//
// Events: received, invalid_hmac, duplicate, no_match, below_min_spend, over_cap,
// emailed, email_failed, tagged, tag_failed, final_gift, state_written, error,
// analytics_sent (Meta CAPI + GA4 Measurement Protocol Purchase — not gift-specific,
// but logged here since it shares this webhook and log drain).

export type GiftEvent =
  | 'received'
  | 'invalid_hmac'
  | 'duplicate'
  | 'no_match'
  | 'below_min_spend'
  | 'over_cap'
  | 'eligible'
  | 'emailed'
  | 'email_failed'
  | 'tagged'
  | 'tag_failed'
  | 'final_gift'
  | 'state_written'
  | 'error'
  | 'analytics_sent'

export function giftLog(event: GiftEvent, fields: Record<string, unknown> = {}): void {
  const line = JSON.stringify({ ts: new Date().toISOString(), event, ...fields })
  if (event === 'error' || event === 'email_failed' || event === 'tag_failed' || event === 'invalid_hmac') {
    console.error(`[gift-audit] ${line}`)
  } else {
    console.log(`[gift-audit] ${line}`)
  }
}
