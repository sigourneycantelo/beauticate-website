# GA4 ecommerce and purchase tracking

GA4 (`properties/378911319`) recorded ~909 `view_item`, 46 `add_to_cart`, 24
`begin_checkout` and **zero `purchase`** over a year, while Shopify had real
orders. This is a measurement fault, not zero sales.

## Update, 9 Nov 2026 (read this first)

After looking inside GA4, the "zero purchases" premise was wrong, and parts of
this runbook below are superseded.

- The property has **three** web streams: `Beauticate - GA4`
  (`G-D452CZN2J7`, the storefront tag in this repo), `MonsterInsights`
  (`G-QDCB8GTV2Z`) and `Beauticate Shop` (`G-M7PRGLDX9B`, checkout.beauticate.com).
- **`purchase` already arrives, on the Beauticate Shop stream**, from Shopify's
  native Google integration (server-side, "Checkout complete" sent as `purchase`).
  Last 28 days: GA4 shows 2 purchases (US$99.55); Shopify has 3 real orders
  (#1043 to #1045, A$226). So it captures most, not all. Earlier "zero" readings
  were almost certainly from the storefront stream.
- **Do NOT add the custom Customer Events pixel, and do NOT set
  `GA_MEASUREMENT_PROTOCOL_API_SECRET` on Vercel.** Either would send a second
  `purchase` for the same order from a different source, and the
  `transaction_id` is not guaranteed to match the native integration's. With the
  secret unset, `sendPurchase` is a no-op, which is what we want. (The webhook
  still needs `SHOPIFY_WEBHOOK_SECRET` for gift-with-purchase and Meta CAPI.)
- Still open in GA4 admin: no domains configured on any stream (add
  `beauticate.com` and `checkout.beauticate.com`; ignore the
  `*.vercel.app` suggestions); the main stream has MonsterInsights' tag
  connected (possible double-counted page views); the stream URL is `http://`.

## What was actually wrong

1. **The repo already has a `purchase` path, and it is dead.** The Shopify
   `orders/create` webhook (`app/api/webhooks/orders-created/route.ts`) sends
   GA4 `purchase` through Measurement Protocol (`lib/ga/measurement-protocol.ts`).
   Live readiness check on 9 Nov 2026:

   ```
   GET https://www.beauticate.com/api/webhooks/orders-created
   {"ok":true,"endpoint":"orders-created","ready":{"hmacSecret":false,"admin":false,"email":false}}
   ```

   `hmacSecret:false` means `SHOPIFY_WEBHOOK_SECRET` is not set on Vercel, so
   every delivery fails HMAC and returns 401 before any analytics runs. Separately,
   `GA_MEASUREMENT_PROTOCOL_API_SECRET` was never documented in `.env.example`
   and is probably unset too. The same gap means the gift-with-purchase
   emails are not firing from this webhook either.
2. **No cross-domain linker.** The session did not carry to
   `checkout.beauticate.com`. Fixed in code (Part A).
3. **Nothing in the checkout sends `purchase` to GA4** except (1).

## Part A: repo (done in this branch)

- `components/analytics/GoogleAnalyticsTag.tsx` replaces
  `@next/third-parties`' `<GoogleAnalytics>`, which cannot take a `linker`
  config. One `config` call with
  `linker.domains = ['beauticate.com', 'checkout.beauticate.com']`.
  The cart's checkout button is a plain `<a href={cart.checkoutUrl}>`
  (`CartDrawer.tsx`), so gtag decorates it with `_gl` on click. Nothing strips
  query params.
- `.env.example` now lists `GA_MEASUREMENT_PROTOCOL_API_SECRET`.
- Existing storefront events (`lib/ga/events.ts`): `view_item`, `add_to_cart`,
  `view_cart`, `begin_checkout`, `select_content`. All use `currency: "AUD"`,
  `value`, and `items[]` with the bare numeric product id (`gidToId`).
  **`view_item_list` is not implemented anywhere** (known gap).

Item schema to keep identical in the storefront, webhook and pixel:
`item_id` = Shopify numeric **product** id, `item_name` = product title,
`item_brand` = vendor, `price`, `quantity`.

## Part B: Shopify admin (Sig or dev)

**Superseded: see the 9 Nov update at the top. Do not install this pixel while
the native Shopify integration is sending `purchase`.** Pick **one** source of
truth for `purchase`; the pixel below is kept only as a fallback. Both it and the webhook send `transaction_id` = numeric Shopify
order id, and GA4 drops a repeat `purchase` with the same `transaction_id`, so
leaving both on will not double-count. Still, do not install the Google &
YouTube channel's GA4 purchase on top of these.

1. Shopify admin → **Settings → Customer events → Add custom pixel**.
2. Name it `GA4 Purchase`. Paste the code below, replacing `G-XXXXXXXXXX`
   with the real Measurement ID (the same one in `NEXT_PUBLIC_GA_MEASUREMENT_ID`).
3. **Save**, then **Connect**.
4. Permissions: set Customer privacy to "Marketing" and "Analytics" required so
   it respects consent.

```js
const GA_ID = 'G-XXXXXXXXXX'

const s = document.createElement('script')
s.async = true
s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID
document.head.appendChild(s)
window.dataLayer = window.dataLayer || []
function gtag() { dataLayer.push(arguments) }
gtag('js', new Date())
gtag('config', GA_ID, { send_page_view: false })

function items(lines) {
  return (lines || []).map((l) => ({
    item_id: String(l.variant?.product?.id ?? l.variant?.id ?? 'unknown'),
    item_name: l.variant?.product?.title ?? l.title,
    item_brand: l.variant?.product?.vendor,
    price: Number(l.variant?.price?.amount ?? 0),
    quantity: l.quantity ?? 1,
  }))
}

analytics.subscribe('payment_info_submitted', (e) => {
  const c = e.data.checkout
  gtag('event', 'add_payment_info', {
    currency: c.currencyCode,
    value: Number(c.totalPrice?.amount ?? 0),
    items: items(c.lineItems),
  })
})

analytics.subscribe('checkout_completed', (e) => {
  const c = e.data.checkout
  gtag('event', 'purchase', {
    // Same id the webhook uses (order.id), so GA4 dedupes the two.
    transaction_id: String(c.order?.id ?? c.token),
    currency: c.currencyCode,
    value: Number(c.totalPrice?.amount ?? 0),
    tax: Number(c.totalTax?.amount ?? 0),
    shipping: Number(c.shippingLine?.price?.amount ?? 0),
    items: items(c.lineItems),
  })
})
```

Caveat: a custom pixel runs in a sandboxed iframe, so it cannot read the
storefront's `_ga` cookie and `_gl` will not stitch the session. The pixel's
`purchase` therefore arrives as its own user/session, and the funnel in
Explore can look broken at the checkout step even when the purchase count is
right. Session stitching is what the webhook's `ga_client_id` bridge does, which
is the reason to fix the webhook too (step 5).

5. **Fix the webhook** (also unblocks gift-with-purchase). On Vercel →
   Project → Settings → Environment Variables (Production) set:
   - `SHOPIFY_WEBHOOK_SECRET` (see `docs/gift-with-purchase.md` §1–2)
   - `GA_MEASUREMENT_PROTOCOL_API_SECRET` (GA4 Admin → Data streams → web stream →
     Measurement Protocol API secrets → Create)
   Redeploy, then confirm `GET /api/webhooks/orders-created` reports
   `hmacSecret:true`. Confirm the webhook is registered in Shopify
   (Settings → Notifications → Webhooks → Order creation → the URL above).

## Part C: GA4 admin

1. Admin → Data streams → the web stream → **Configure tag settings →
   Configure your domains**: add `beauticate.com` and `checkout.beauticate.com`
   (match condition "contains" or "equals"). This also stops checkout showing
   as a self-referral.
2. Admin → **Data display → Events**: once `purchase` appears, toggle **Mark as
   key event**.
3. Confirm there is one Measurement ID: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, the pixel,
   and any Shopify sales channel must all match. Two web streams exist on the
   property; check both point at the same ID in use.

Open items for Sig: the real `G-` ID (not in the repo; env var only), whether a
Google & YouTube channel already exists in Shopify, and who holds admin on GA4 and
Shopify.

## Acceptance test

GA4 DebugView (add `?debug_mode=1` or use the GA Debugger extension), then one
real low-value order on mobile.

- `view_item → add_to_cart → begin_checkout → add_payment_info → purchase` all
  appear; `purchase` has AUD `value`, `transaction_id` = the Shopify order id, and
  `items`.
- No `checkout.beauticate.com` in Traffic acquisition → Referral.
- `purchase` count over a test window matches Shopify orders (allow lag).
- Regression: Meta Purchase (CAPI) and Klaviyo Placed Order still arrive.
- Check the order's `note_attributes` carries `ga_client_id`.
