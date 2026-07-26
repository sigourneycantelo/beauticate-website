# Gift-with-Purchase notification system

Automated warehouse notifications for the launch gift-with-purchase (GWP) programme.
When a customer buys a participating brand, the brand's warehouse gets an email asking
them to drop the gift in the parcel — capped per brand (default 20), idempotent, audited.

## How it works (core loop)

```
Shopify order created
      │  orders/create webhook (HMAC signed)
      ▼
/api/webhooks/orders-created
  1. Verify X-Shopify-Hmac-Sha256                → reject 401 if invalid
  2. Claim the order once (KV SET NX / in-memory) + per-brand order-tag guard
  3. Match line-item vendors → participating brands (lib/gift-campaign.ts)
  4. Per brand: countGiftsSent (Admin ordersCount on the gift-<brand> tag, cached 60s)
  5. If sent < cap AND order meets min spend →
        • email warehouse (Resend/Postmark)   ← your template
        • tag order `gift-<brand>` (+ gift-processed, + gift-<brand>-final at cap)
        • write per-brand state to Blob (claimed flag for phase two)
  6. sent == cap  → also flag final gift + gift-<brand>-final tag
  7. sent >= cap  → do nothing
```

Every step logs one JSON line prefixed `[gift-audit]` — grep Vercel logs to audit.

## Files

| File | Purpose |
| --- | --- |
| `lib/gift-campaign.ts` | **Your config.** Brands, vendors, warehouse emails, gift names, caps, min spend, launch date. |
| `lib/shopify-admin.ts` | Server-only Admin API: count gifts, tag orders. |
| `lib/gift-email.ts` | Warehouse email via Resend or Postmark (your exact template). |
| `lib/gift-idempotency.ts` | Dedup claim (KV → tag → in-memory). |
| `lib/gift-state.ts` | Per-brand state to Vercel Blob (phase-two "claimed" flag). |
| `lib/gift-log.ts` | Structured `[gift-audit]` logging. |
| `app/api/webhooks/orders-created/route.ts` | The webhook handler. |
| `scripts/test-gift-webhook.ts` | Local end-to-end test with a signed payload. |

## Adding / editing brands

Edit `CAMPAIGN.brands` in `lib/gift-campaign.ts`. Each brand:

```ts
{
  key: 'maison-balzac',          // never change once live (used in the order tag)
  label: 'Maison Balzac',
  vendors: ['Maison Balzac'],    // must match Shopify product.vendor (case-insensitive)
  warehouseEmail: 'orders@brand-warehouse.com',
  giftName: 'a mini Josephine candle',
  cap: 20,                       // optional, defaults to CAMPAIGN.defaultCap
  minSpend: 80,                  // optional AUD, 0 = none
  minSpendBasis: 'brand',        // 'brand' subtotal (default) or whole 'order' total
}
```

Also set at the top of `CAMPAIGN`: `launchDate`, `fromEmail` (verified beauticate.com sender), optional `bccEmail`.

---

## What you need to set up

### 1. Shopify custom app (Admin API)

1. Shopify admin → **Settings → Apps and sales channels → Develop apps → Create an app**.
2. **Configure Admin API scopes** → enable **`read_orders`** and **`write_orders`**.
3. **Install app**, then reveal the **Admin API access token** → set as `SHOPIFY_ADMIN_API_TOKEN`.
4. Copy the app's **API secret key** → set as `SHOPIFY_WEBHOOK_SECRET` (used to verify HMAC).

### 2. Register the `orders/create` webhook

Point it at `https://www.beauticate.com/api/webhooks/orders-created`. Two options:

- **Admin UI:** Settings → Notifications → Webhooks → *Create webhook* → Event **Order creation**, Format **JSON**, URL as above, API version **2024-10**. Shopify shows the signing secret for UI-created webhooks — if it differs from the app secret, use *that* value for `SHOPIFY_WEBHOOK_SECRET`.
- **Admin API (recommended, reproducible):**
  ```bash
  curl -X POST "https://beauticate.myshopify.com/admin/api/2024-10/webhooks.json" \
    -H "X-Shopify-Access-Token: $SHOPIFY_ADMIN_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"webhook":{"topic":"orders/create","address":"https://www.beauticate.com/api/webhooks/orders-created","format":"json"}}'
  ```
  API-registered webhooks are signed with the app's API secret key → `SHOPIFY_WEBHOOK_SECRET`.

### 3. Email provider (pick ONE — Resend recommended)

- **Resend:** create an API key → `RESEND_API_KEY`. Verify the `beauticate.com` domain (DKIM/SPF) so `gifts@beauticate.com` can send.
- **Postmark:** create a server → `POSTMARK_SERVER_TOKEN`. Verify a sender signature / domain for `beauticate.com`.

Set `fromEmail` (and optional `bccEmail`) in `lib/gift-campaign.ts` to verified addresses.

### 4. (Recommended) Vercel KV for race-free dedup

Add a **Vercel KV** (Upstash) store to the project → it injects `KV_REST_API_URL` + `KV_REST_API_TOKEN`. Without it, dedup still works via the `gift-processed` order tag for Shopify's normal spaced retries; KV only closes the rare simultaneous-duplicate race.

### 5. Vercel Blob (for the phase-two "claimed" flag)

Add a **Blob** store to the project (injects `BLOB_READ_WRITE_TOKEN`). Optional for the core loop — if absent, state writes are skipped and emails/tags still work.

### Environment variables summary

| Var | Where | Required |
| --- | --- | --- |
| `SHOPIFY_ADMIN_API_TOKEN` | Vercel (server) | ✅ |
| `SHOPIFY_WEBHOOK_SECRET` | Vercel (server) | ✅ |
| `RESEND_API_KEY` *or* `POSTMARK_SERVER_TOKEN` | Vercel (server) | ✅ (one) |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | already set | ✅ |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | Vercel | recommended |
| `BLOB_READ_WRITE_TOKEN` | Vercel | phase two |

All server-only tokens are read server-side only and never shipped to the browser.

---

## Testing the whole loop before Monday

### A. Local, signed, no real orders (fastest)

1. Put `SHOPIFY_WEBHOOK_SECRET`, `SHOPIFY_ADMIN_API_TOKEN`, and an email key in `.env.local`.
   Use a **test warehouse email you own** in `lib/gift-campaign.ts` while testing.
2. `npm run dev`
3. Readiness check: open `http://localhost:3000/api/webhooks/orders-created` (GET) →
   `{ ready: { hmacSecret: true, admin: true, email: true } }`.
4. Fire a signed test order:
   ```bash
   npm run test-gift-webhook
   # or customise:
   VENDOR="Maison Balzac" ORDER="#TEST-1" TOTAL=120 SUBURB="Bondi" STATE="NSW" npm run test-gift-webhook
   ```
   Expect `200`, an email in your test inbox reading *"This is gift 1 of 20"*, and
   `[gift-audit]` lines in the dev console (received → eligible → emailed → tagged → state_written).
5. **HMAC rejection:** `BAD_SIG=1 npm run test-gift-webhook` → expect `401`.
6. **Min-spend gate:** `TOTAL=10 npm run test-gift-webhook` for a brand with `minSpend` → expect `below_min_spend`, no email.
7. **Non-participating vendor:** `VENDOR="Some Other Brand" npm run test-gift-webhook` → `no_match`.

> Note: the test script uses random fake order IDs that don't exist in Shopify, so the
> Admin `tagOrder` call will no-op/soft-fail (logged) — email + counting logic are still
> fully exercised. To test real tagging + real counting, use step B.

### B. Against a real (draft/test) order — full fidelity

1. Deploy to a Vercel preview (or prod) with all env vars set.
2. Register the webhook at the deployed URL (step 2 above), or use
   `TARGET=https://your-preview.vercel.app npm run test-gift-webhook` with a **real order id**
   in the payload to test tagging/counting.
3. Place a genuine test order in Shopify for a participating brand (use a 100%-off code so
   no money moves). Confirm: warehouse email arrives, the order shows tags
   `gift-<brand>` + `gift-processed`, and a second identical webhook delivery does **not**
   re-email (Shopify admin → webhook → *Send test notification* twice, or re-place).
4. **Cap test:** temporarily set a brand's `cap: 1`, place two qualifying orders → first emails
   "gift 1 of 1" + final-gift note + `gift-<brand>-final` tag; second logs `over_cap`, no email.
   Reset the cap afterwards.

### C. Idempotency / duplicate delivery

Shopify's *Send test notification* button, or re-triggering the same order, must produce
exactly one email. The per-brand `gift-<brand>` tag guarantees this across retries and
restarts; KV guarantees it under simultaneous duplicates.

---

## Phase two (later — after the core loop is verified)

- `GET /api/gifts/[brand]/remaining` → reads `gift-state/<brand>.json` from Blob (or recomputes
  via `countGiftsSent`) → `{ sent, cap, remaining, claimed }`, `revalidate: 60`.
- `<GiftBanner>` on brand collection + product pages: "X of 20 gifts remaining", hidden when `claimed`.
- Optional cart message + post-purchase confirmation.

The state file and `countGiftsSent` are already in place, so phase two is additive.

## Security notes

- Admin API calls are server-only (`lib/shopify-admin.ts`, webhook route). No Admin token or
  webhook secret is ever referenced from a client component or a `NEXT_PUBLIC_` var.
- Every webhook is HMAC-verified before any work; invalid signatures get `401` and do nothing.
- Full audit trail via `[gift-audit]` structured logs (Vercel → Logs; filter by prefix).
