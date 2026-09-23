/**
 * Review submission → Judge.me.
 *
 * This route exists because Judge.me's widgets are Shopify theme app blocks and
 * Beauticate has no published theme, so there is no Judge.me form to send anyone
 * to. We render our own and post it here.
 *
 * ─── Why this route is defensive ─────────────────────────────────────────────
 *
 * Judge.me's write API will create a review from an EMAIL ADDRESS ALONE. No
 * rating, no body, no product, no verification — it answers 201 and queues it.
 * (Verified 23 Sep 2026, by accident.) So every guard below is ours; none of it
 * is enforced upstream:
 *
 *   • the private token stays server-side — the browser never sees it, and
 *     cannot post to Judge.me directly
 *   • a honeypot field catches the naive bots
 *   • a per-IP rate limit caps how fast one source can submit
 *   • rating, body length and email shape are validated here, not in the browser
 *
 * The last line of defence is not in this file: reviews are only rendered when
 * `published === true` (see lib/judgeme.ts), so with moderation enabled in the
 * Judge.me dashboard an injected review never reaches a page or the JSON-LD.
 * That setting is what makes a public form safe. It is a dashboard setting, not
 * a code one — if it gets turned off, this route becomes the only thing standing
 * between a script and the star rating Google sees.
 */

import { NextResponse } from 'next/server'

const SHOP_DOMAIN = process.env.JUDGEME_SHOP_DOMAIN
const PRIVATE_TOKEN = process.env.JUDGEME_PRIVATE_TOKEN

const MAX_BODY = 2000
const MIN_BODY = 10
const MAX_NAME = 80
const MAX_TITLE = 120

/** Per-IP submissions allowed inside the window. */
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 60 * 1000

/**
 * In-memory, per-instance rate limiting. This is deliberately modest: serverless
 * instances don't share it, so a determined attacker spread across cold starts
 * gets more than RATE_LIMIT. It stops casual scripted flooding, which is the
 * realistic threat for a shop this size. If review spam ever becomes a real
 * problem, this is the thing to move to Redis/Upstash — not a reason to distrust
 * the rest of the route.
 */
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every(t => now - t > RATE_WINDOW_MS)) hits.delete(k)
  return false
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
}

export async function POST(request: Request) {
  if (!SHOP_DOMAIN || !PRIVATE_TOKEN) {
    console.warn('Judge.me submission attempted with no credentials configured')
    return NextResponse.json({ error: 'Reviews are not available right now.' }, { status: 503 })
  }

  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: a real person never fills a field they cannot see.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    // Answer as if it worked, so a bot gets no signal to retry differently.
    return NextResponse.json({ ok: true })
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'You have submitted a few reviews already. Please try again later.' },
      { status: 429 },
    )
  }

  const name = String(payload.name ?? '').trim()
  const email = String(payload.email ?? '').trim()
  const title = String(payload.title ?? '').trim()
  const body = String(payload.body ?? '').trim()
  const rating = Number(payload.rating)
  const productId = String(payload.productId ?? '').trim()

  if (!name || name.length > MAX_NAME) {
    return NextResponse.json({ error: 'Please add your name.' }, { status: 400 })
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Please choose a rating from 1 to 5 stars.' }, { status: 400 })
  }
  if (body.length < MIN_BODY) {
    return NextResponse.json({ error: 'Please tell us a little more — at least a sentence.' }, { status: 400 })
  }
  if (body.length > MAX_BODY || title.length > MAX_TITLE) {
    return NextResponse.json({ error: 'That review is a little too long.' }, { status: 400 })
  }
  // A review with no product becomes a shop review in Judge.me (external id 0),
  // which would never appear on the product page the reader just came from.
  if (!/^\d+$/.test(productId)) {
    return NextResponse.json({ error: 'We could not tell which product this is for.' }, { status: 400 })
  }

  try {
    const res = await fetch('https://api.judge.me/api/v1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_domain: SHOP_DOMAIN,
        api_token: PRIVATE_TOKEN,
        platform: 'shopify',
        id: productId,
        email,
        name,
        rating,
        title,
        body,
        ip_addr: ip,
      }),
    })

    if (!res.ok) {
      console.warn(`Judge.me submission failed: ${res.status} ${res.statusText}`)
      return NextResponse.json({ error: 'We could not save your review. Please try again.' }, { status: 502 })
    }
    // Judge.me answers 201 and processes asynchronously — the review is not
    // readable back immediately, and with moderation on it stays unpublished
    // until approved. Both are why the UI says "thank you", not "it's live".
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.warn('Judge.me submission threw:', err)
    return NextResponse.json({ error: 'We could not save your review. Please try again.' }, { status: 502 })
  }
}
