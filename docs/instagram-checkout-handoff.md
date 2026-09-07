# Handoff — Instagram checkout drops the customer into an empty cart

**Status:** RESOLVED to a buildable fix — Meta's handoff URL is confirmed (see below).
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

## SETTLED — 7 Sep 2026: Meta sends a cart permalink

The customer-captured handoff URL, from tapping "Add product" on a BOOIE reel in
the Instagram app:

```
https://shop.beauticate.com/cart/45051889647685:1
  ?attributes[Channel]=Instagram
  &attributes[cart-id]=531101109903641
  &attributes[seller-id]=17841400420810061
  &country=AU
  &access_token=...
  &cart_origin=instagram
```

That path is a **standard Shopify cart permalink** — `variantId:quantity`.
Variant `45051889647685` is You're Welcome Mascara (BOOIE Beauty), the product in
the reel. One item because one was added; expect comma-separated pairs for a
multi-item bag.

So this is case (A) below: **Meta hands us a permalink and our app 404s on it.**
No basket is lost in translation and no Meta bag reference needs resolving — the
variant and quantity are right there in the path. Everything needed to rebuild the
cart is in the URL.

Note the domain: **`shop.beauticate.com`**, a Vercel alias of the same Next.js app
(`/` and `/shop` 308-redirect, `/cart/...` 404s). The route has to answer on that
host as well as `www` — verify the redirect preserves the path, or the fix works
on www and still dies coming from Instagram.

Two things worth keeping while you're in there:

- `attributes[Channel]=Instagram` is free attribution. Write it onto the cart with
  `updateCartAttributes` and Instagram-sourced orders become countable.
- Ignore `access_token` and the `cart-id`/`seller-id` bag reference. They're
  Meta's own handles and resolving them needs Shopify's Facebook & Instagram
  channel. The permalink already carries the goods.

### What this changes

The gift problem for this lane disappears. Land the customer on our storefront
with the item in the cart and `reconcileGift()` runs exactly as it does for every
other visitor — the illuminator is added automatically, no app, and no manual
packing note for BOOIE's warehouse.

Before this was confirmed, the plan was to cover Instagram with the warehouse
campaign (`lib/gift-campaign.ts`) and ask BOOIE to hand-pack those gifts. That may
now be unnecessary. Keep the campaign as the safety net for lanes we can't reach,
but don't commit a partner's warehouse to manual work to solve a problem a route
fixes.

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
