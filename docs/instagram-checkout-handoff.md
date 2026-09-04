# Handoff — Instagram checkout drops the customer into an empty cart

**Status:** destination domain now confirmed. The original (A)/(B) framing was wrong —
see "Update, 4 Sep evening" below before acting on anything above it.
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


---

# Update — 4 Sep 2026, evening

Commerce Manager was read directly (business ID `1006853379362198`, commerce account
`Beauticate` `1696430804962273`). **The decisive question above is answered, and the
answer is neither (A) nor (B).**

## Confirmed: where Meta actually sends people

The catalogue is **`Shopify Product Catalog (1ptawz-uy.myshopify.com) — 2026-07-26
System User`**, catalog ID `1047332494553193`, 366 products, fed by Shopify's Facebook
& Instagram sales channel and resyncing daily (last updated 4 Sep, 2:10am).

Read straight off a catalogue item's detail panel, the **Product Link** field is:

```
https://checkout.beauticate.com/products/the-everything-bundle
    ?utm_content=Facebook_UA&utm_source=facebook&variant=44656591274053
```

So Instagram sends shoppers to **`checkout.beauticate.com`** — not `www.beauticate.com`
and not `shop.beauticate.com`. Catalogue Content IDs are Shopify **variant** IDs
(`44656591274053`), which is exactly what a cart permalink needs.

## Why that changes the fix

`checkout.beauticate.com` is not a checkout host. It is a **second, fully live Shopify
storefront** — the online store the headless site was supposed to replace. Verified on
4 Sep:

| URL | Result |
| --- | --- |
| `checkout.beauticate.com/products/<handle>` | **200**, real themed product page, working add-to-cart, `<title>Almighty Volume Thickening Duo</title>` |
| `checkout.beauticate.com/` | **200**, `<title>Beauticate Shop</title>` |
| `checkout.beauticate.com/cart` | **200**, `<title>Your Shopping Cart</title>`, "your cart is empty" |
| `checkout.beauticate.com/cart/45051885551685:1` | **302 → a real Shopify checkout, items loaded** |
| `1ptawz-uy.myshopify.com/*` | 301 → `checkout.beauticate.com/*` (it is the primary domain) |

**Cart permalinks already work — on the domain Meta actually uses.** So option (A) in
the original diagnosis, building `app/cart/[[...items]]` on `www`, would not have fixed
this. It would have built a working route on a domain Instagram never sends anyone to.
Don't build it on the strength of the section above.

Also ruled out, for completeness:

| URL | Result |
| --- | --- |
| `www.beauticate.com/cart`, `/cart/<v>:1`, `/checkout`, `/cart.js` | 404 (unchanged) |
| `www.beauticate.com/products/<handle>` | 308 → `/shop/products/<handle>`, **200** |
| `www.beauticate.com/collections/<slug>` | 308 → `/shop/collections/<slug>` |
| `shop.beauticate.com/<anything, incl. /cart/*>` | 308 → `beauticate.com/shop` (shop home) |

## What is still unknown — one question, much narrower

Meta's catalogue tells us where a **product tap** goes. It does not tell us what
**"Go to checkout"** does from the Instagram bag. Commerce Manager does not expose a
checkout-method row for a Shopify-managed shop ("Commerce Manager supplements Shopify"),
so that setting lives in Shopify's Facebook & Instagram sales channel, not in Meta.

Two remaining possibilities:

- **She was sent to a cart permalink on `checkout.beauticate.com`** → that works today,
  so something else broke, and we need the exact URL to see what.
- **She was sent to a plain product or store-home link on `checkout.beauticate.com`**
  carrying no basket → the bag is lost by design at the handoff. This is the more likely
  reading: she reported an empty cart rather than a loaded checkout.

**The phone reproduction still settles it**, and now there is one specific thing to read:
after tapping "Go to checkout", is the domain `checkout.beauticate.com` or
`www.beauticate.com`, and does the path contain `/cart/`? That single string closes it.
The in-app webview cannot be emulated on desktop.

Supporting data — Meta shop insights, last 28 days: 4 "checkouts initiated" on Instagram,
0 on Facebook. `You're Welcome Mascara`: 19 product page views, 4 adds to cart, 1 checkout
initiated. Low volume, but every one of those four is a customer who tapped through.

## Two things found on the way, both separate from this bug

**1. `checkout.beauticate.com` is an indexable duplicate storefront.** `robots.txt`
allows crawling, `sitemap.xml` lists every product, pages carry no `noindex`, and each
one self-canonicals to `checkout.beauticate.com`. It competes with `www.beauticate.com/shop`
for the same products, and it is where 100% of Instagram shop traffic currently lands —
bypassing the editorial site entirely. That is a strategy question (should Instagram
point at the headless site at all?), not a bug, but it is the same decision as this fix.

**2. `vercel.json` silently overrides the cart/checkout exclusion in `next.config.ts`.**
`next.config.ts` carefully excludes cart paths from the `shop.beauticate.com` redirect,
with a comment explaining that a blanket rule once sent every checkout back to `/shop`.
But `vercel.json` also has a blanket `"/:path*"` → `beauticate.com/shop` rule for that
host **with no exclusion**, and project-level redirects run first. Verified live:
`shop.beauticate.com/cart/c/abc123` and `/checkouts/cn/abc123` both 308 to the shop home.

This is **currently harmless** — the Storefront API returns `checkoutUrl` on
`checkout.beauticate.com`, confirmed by a live `cartCreate` call, so no real checkout
routes through `shop.beauticate.com` any more. It is a live trap, not a live breakage:
if the primary domain ever moves back, the old bug returns and the guard everyone would
check is the one that has already been overridden.
