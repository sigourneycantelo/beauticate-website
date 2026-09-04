# Brief: reconcile the legacy shop-domain redirects

**For:** Redfern
**Priority:** low urgency, but do it before anyone touches Shopify domains again.
**Nothing is broken for customers right now.** This is a guard that has stopped
working, not a live fault. It matters because the next person to move a Shopify
domain will check the guard, see it in place, and be wrong.

## What's wrong

The legacy shop-domain redirects exist **twice**, in two files, with different
rules — and the weaker copy wins.

`next.config.ts` (the careful version, carries a long explanatory comment):

```ts
{ source: '/:path*', has: [{ type: 'host', value: 'beauticate.shop' }],
  destination: 'https://beauticate.com/shop', permanent: true },
{ source: '/:path((?!cart|checkout|checkouts).*)', has: [{ type: 'host', value: 'shop.beauticate.com' }],
  destination: 'https://beauticate.com/shop', permanent: true },
```

`vercel.json` (added later, no exclusion):

```json
{ "source": "/:path*", "destination": "https://beauticate.com/shop",
  "permanent": true, "has": [{ "type": "host", "value": "shop.beauticate.com" }] },
{ "source": "/:path*", "destination": "https://beauticate.com/shop",
  "permanent": true, "has": [{ "type": "host", "value": "beauticate.shop" }] }
```

Vercel applies project-level `vercel.json` redirects **before** the framework's
own, so the `vercel.json` pair matches first and the `(?!cart|checkout|checkouts)`
exclusion never runs.

Verified against production, 4 Sep 2026:

| URL | Result |
| --- | --- |
| `shop.beauticate.com/cart/c/abc123` | 308 → `beauticate.com/shop` |
| `shop.beauticate.com/checkouts/cn/abc123` | 308 → `beauticate.com/shop` |
| `shop.beauticate.com/cart` | 308 → `beauticate.com/shop` |
| `beauticate.shop/cart/45051885551685:1` | 308 → `beauticate.com/shop` |

The exclusion is doing nothing on either host.

## Why the exclusion is there

PR #63 (30 Jul) added the blanket rules to `next.config.ts`. At that time
Shopify's primary domain was `shop.beauticate.com`, so `cart.checkoutUrl` from
the Storefront API pointed there — and the blanket rule caught every customer
who tapped Checkout and threw them back to `/shop`. Nobody could complete an
order. The exclusion was the repair, and the comment above it in
`next.config.ts` describes exactly this.

PR #71 (6 Aug) added the same two rules to `vercel.json`, without the exclusion,
which silently reverted the repair.

It is currently harmless only by accident: Shopify's primary domain has since
moved to `checkout.beauticate.com`, and `shop.beauticate.com` now shows
**Invalid DNS** in Shopify Admin → Domains. A live `cartCreate` call confirms
`checkoutUrl` resolves to `checkout.beauticate.com`, so no real checkout routes
through the affected host any more.

## What to change

**Delete the two redirect entries from `vercel.json`** and keep
`next.config.ts` as the single source of truth. It already has the exclusion and
the comment explaining why the exclusion exists — the reasoning and the rule
should live in the same place.

Two smaller things while you're in there:

1. The `beauticate.shop` rule has **no** cart/checkout exclusion in either file.
   Give it the same `(?!cart|checkout|checkouts)` pattern as `shop.beauticate.com`,
   for consistency — `beauticate.shop` is not currently a Shopify-connected
   domain, so this is defensive rather than a fix.
2. Add a line to the existing comment noting that a `vercel.json` redirect would
   override this file, so the next person doesn't re-add one.

## What not to do

- **Don't resolve the duplication by deleting the exclusion.** It looks like dead
  code because it currently matches nothing. It isn't — it's the fix for a real
  outage.
- **Don't move the rules into `vercel.json` instead.** The comment is the valuable
  part and JSON can't hold it.
- Leave `beauticateshop.com` / `www.beauticateshop.com` alone. Those are
  Shopify-connected and Shopify redirects them to `checkout.beauticate.com`
  itself — 301, working, nothing to do with our config.

## How to verify

After deploy, cart and checkout paths on `shop.beauticate.com` should no longer
be swallowed by the redirect:

```bash
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://shop.beauticate.com/cart/c/abc123
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://shop.beauticate.com/checkouts/cn/abc123
```

Neither should return a 308 to `beauticate.com/shop`. A 404 is the correct and
expected result while that host's DNS points at Vercel.

Non-cart paths must still redirect:

```bash
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://shop.beauticate.com/products/anything
```

Should still be 308 → `https://beauticate.com/shop`.

## Not in scope

This is unrelated to the Instagram empty-cart bug
(`docs/instagram-checkout-handoff.md`). That one is about Meta's catalogue
pointing at `checkout.beauticate.com` instead of the headless shop, and it's
waiting on a direction call before any code gets written. Please don't fold the
two together.
