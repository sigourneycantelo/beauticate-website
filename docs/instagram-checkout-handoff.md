# Handoff — Instagram checkout drops the customer into an empty cart

**Status:** diagnosed to the boundary, one decisive fact still missing.
**Reported:** 4 Sep 2026, by a customer (Nicole Ford) via Instagram DM.
**Not related to** the BOOIE gift-with-purchase work ([`gwp-booie-cart.md`](./gwp-booie-cart.md)) —
this predates it. Don't let the two get tangled.

## Symptom

A customer fills Instagram's shopping basket (2 items, AU$81), taps **Go to checkout**,
lands on beauticate.com in Instagram's in-app browser — and the cart is empty. She
cannot buy. She DM'd rather than retried, so assume silent loss behind every report.

Her screenshots showed, in order:
1. Instagram's own **Basket** screen — "You're Welcome Mascara AU$31", "Almighty Volume
   Thickening Duo AU$50", Delivery Free, Subtotal AU$81.00, "Go to checkout".
2. beauticate.com open in the Instagram in-app browser, on what appears to be the shop
   home ("essentials for a beautiful life").
3. Our cart drawer: **"Your Cart (0) — Your cart is empty."**

## What is actually happening

That basket is **Meta's**, not ours. Items added from Instagram Shopping live in
Instagram's own basket, built from the Meta product catalogue. Our storefront never
saw them. The cart isn't losing her items — it never received them. So this is a
**handoff** problem, not a cart-state bug, and no amount of debugging `CartProvider`
will find it.

## Confirmed (tested against production, 4 Sep 2026)

**We have no `/cart` route at all.** The standard way anything in the Shopify
ecosystem hands a basket to a store is the cart permalink:

```
/cart/<variantId>:<qty>,<variantId>:<qty>
```

On a normal Shopify theme this works out of the box. Headless, it exists only if we
build it, and we didn't:

| URL | Live result |
| --- | --- |
| `https://www.beauticate.com/cart` | **404** |
| `https://www.beauticate.com/cart/45051885551685:1` | **404** |
| `https://www.beauticate.com/cart/45051885551685:1,45051889647685:1` | **404** |

Also confirmed: `middleware.ts` doesn't touch `/cart` (its `ARTICLE_PREFIXES` guard
excludes it), and there is no `app/cart/` directory. So the 404 is a plain gap, not a
redirect swallowing the path.

## The missing fact — do this first

We do **not** know which URL Instagram actually sends the customer to. Two candidates,
and they need different fixes:

- **(A) Meta sends a cart permalink** → it 404s → she navigates home → empty cart.
  Fix: build the permalink route.
- **(B) Meta sends a plain catalogue link** (product URL or shop home) carrying no
  basket at all. Fix: catalogue/checkout configuration in Commerce Manager. Building
  the route wouldn't help.

Her screenshot shows the shop home rather than a 404 page, which leans (B) — but she
may have hit a 404 and tapped the logo. **Don't build anything until this is settled.**

How to settle it, cheapest first:
1. **Commerce Manager** (business.facebook.com → Commerce → the Beauticate shop):
   check the **checkout method** ("checkout on website" vs Meta-native) and what the
   catalogue's product **link** field points to. Also check how the catalogue is fed —
   Shopify's Facebook & Instagram sales channel, or a standalone feed.
2. **Reproduce on a real phone.** Add an item in the Instagram app, tap Go to checkout,
   then tap the address bar in the in-app browser and read the full URL — including
   any path and query string. That single string answers the question outright.
   The in-app webview cannot be emulated in a desktop browser; don't try.

## If it turns out to be (A) — implementation notes

Build `app/cart/[[...items]]/page.tsx` parsing `variantId:qty` pairs.

**The non-obvious part:** the cart id lives in **localStorage**, not a cookie, so a
server component cannot hand the cart to the client. See `components/shop/CartProvider.tsx`:

```
STORAGE_KEY = 'beauticate_cart_id'
value       = JSON.stringify({ id, ts })   // ts drives a 30-day TTL
```

So the route needs a client component that:
1. reads the variant/qty pairs from the path,
2. calls `POST /api/cart` — `{action:'create'}` then `{action:'add', ...}` per line
   (see `app/api/cart/route.ts`; the actions are `create | get | add | remove | attributes`),
3. writes `beauticate_cart_id` in the same `{id, ts}` shape — mismatch here means the
   cart silently vanishes on the next page load,
4. redirects to `/shop` with the drawer open, or straight to `cart.checkoutUrl`.

Reuse `createCart` / `addToCart` from `lib/shopify.ts` via the existing API route rather
than adding a second path to Shopify. Note `POST /api/cart` now runs `reconcileGift()`
on every response, so a permalink cart containing a BOOIE product will correctly gain
the gift — no extra work, but worth knowing.

Numeric variant ids in a permalink need converting to the GID form
(`gid://shopify/ProductVariant/<id>`) that `addToCart` expects.

**Watch out for:** Instagram's in-app browser has its own storage behaviour. Verify on a
real device that `localStorage` survives the redirect inside the webview — if it doesn't,
the fix is to skip our cart entirely and redirect straight to `cart.checkoutUrl` on
checkout.beauticate.com.

## Why this matters more than it looks

Instagram is a primary traffic source for Beauticate. Every customer who fills the
Instagram basket and taps through hits an empty cart. One person DM'd; the rest left.

## Reference

- Store: `1ptawz-uy.myshopify.com`, storefront `www.beauticate.com`, checkout `checkout.beauticate.com`
- Cart logic: `components/shop/CartProvider.tsx`, `app/api/cart/route.ts`, `lib/shopify.ts`
- Instagram sales channel is connected in Shopify (the app list shows the Meta channel)
