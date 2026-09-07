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

---

# Update 2 — 4 Sep 2026, with Shopify Admin access

## Is it fixed? No. Nothing has ever sold through Instagram.

Pulled the last 16 orders (#1001–#1016) from the Admin API with
`customerJourneySummary`. **Every order since #1002 came through the `Headless`
channel with a `beauticate.com` referrer.** Not one order in the store's history is
attributed to the Facebook & Instagram channel, and not one landed on a
`checkout.beauticate.com/products/...` page first. Order #1001 (29 May) came via the
Online Store on `beauticate.shop`.

Against Meta's own numbers — 4 checkouts initiated on Instagram in 28 days, 6 adds to
cart on the mascara alone — the conversion rate of the Instagram path is zero. Nicole
Ford is not an isolated report; she is the only one who wrote in.

## What Redfern actually changed — and why it isn't this

Two commits, both about the legacy shop domains, neither about Instagram:

- **30 Jul, [`c1f419f2b`](../../commit/c1f419f2b) (#63)** — added blanket redirects in
  `next.config.ts` sending **all paths** on `beauticate.shop` and `shop.beauticate.com`
  to `/shop`.
- **6 Aug, [`3070d7c6f`](../../commit/3070d7c6f) (#71)** — added *the same two blanket
  rules again*, this time in `vercel.json`.

The 30 Jul change is what broke checkout: at that time Shopify's primary domain was
`shop.beauticate.com`, so `cart.checkoutUrl` pointed there, and the blanket rule caught
every customer who tapped Checkout and threw them back to `/shop`. That is the incident
the long comment in `next.config.ts` describes, and the exclusion regex
`/:path((?!cart|checkout|checkouts).*)` was the repair.

**The 6 Aug `vercel.json` commit silently undid that repair.** Project-level redirects
run before `next.config.ts`, and the `vercel.json` copy has no exclusion. Verified live:
`shop.beauticate.com/cart/c/abc123` and `/checkouts/cn/abc123` both 308 to the shop home
today. The guard everyone would go and check is the one that no longer runs.

What actually saved checkout was a domain move, not the exclusion: Shopify's primary
domain is now `checkout.beauticate.com` (confirmed in Admin → Domains), and
`shop.beauticate.com` is listed there as **Invalid DNS** — it no longer resolves to
Shopify at all. So the dead exclusion is currently harmless. It is a landmine, not a
live fault: anyone who moves a Shopify domain back onto `shop.beauticate.com` re-breaks
checkout for every customer, and the code that looks like it prevents that has been
inert since 6 Aug.

**Redfern doesn't need to be asked anything to diagnose this bug.** He should be told
that #71 overrode #63's fix, so the duplicated rules get reconciled into one place.

## Confirmed store configuration

From Shopify Admin (4 Sep):

- Primary domain **`checkout.beauticate.com`**; also connected: `1ptawz-uy.myshopify.com`,
  `beauticateshop.com`, `www.beauticateshop.com`. `shop.beauticate.com` = **Invalid DNS**.
- Online Store channel is **active** — this is the duplicate storefront Meta links to.
- Facebook & Instagram channel installed 27 Jul, **Active**, 1 market.
  Facebook shop → page *Sigourney Cantelo*. Instagram shop → *Sigourney: Beauty from the
  Inside Out* (`@sigourneycantelo`). Product status: 354 approved, **12 rejected**.
- The channel's Settings panel renders in a cross-origin iframe that could not be
  scrolled through automation, so the **checkout method field was not read**. It is the
  one field still unconfirmed.

## The actual decision

This was never a missing `/cart` route. It is that **Instagram points at a different
storefront than the one we build**. Two ways out:

1. **Keep Meta on `checkout.beauticate.com`** and make that storefront good enough to
   convert — it already renders products and takes carts. Cheapest, but it permanently
   splits the shop in two and leaves the duplicate-content problem in place.
2. **Repoint Meta at `www.beauticate.com/shop`.** Correct destination, but Shopify's
   channel derives catalogue links from the online-store domain, so this likely means a
   standalone feed rather than the Shopify channel — more work, and it takes the
   Instagram bag handoff with it.

Settle this before writing any code. Building `/cart` on `www` only makes sense under (2).

---

# Update 3 — 5 Sep 2026: the customer was on `www`, not the Shopify store

**This corrects Update 1.** The catalogue link finding stands; the conclusion drawn
from it does not.

## What was tested

Sig pasted the catalogue's exact Product Link into mobile Chrome:

```
https://checkout.beauticate.com/products/the-everything-bundle?utm_source=facebook&variant=44656591274053
```

It resolved correctly — the right product page (The Everything Bundle, vendor
*Lash Armour*, which is why the brand line reads LASH ARMOUR), branded as
BEAUTICATE.shop with the beta banner. Opening the cart there: **empty**.

That is expected, and it confirms the mechanism from the destination side: a plain
product link carries no basket. Whatever sits in Instagram's bag, this URL brings
none of it.

## The part that changes the diagnosis

The cart drawer on `checkout.beauticate.com` reads **"CART" / "YOUR CART IS EMPTY"** —
uppercase, no item count.

The headless drawer reads something different. From
`components/shop/CartDrawer.tsx`:

```tsx
<h2 className="text-base">Your Cart ({lines.length})</h2>
<p className="text-charcoal-light text-sm">Your cart is empty.</p>
```

The original report records Nicole's screenshot as **"Your Cart (0) — Your cart is
empty."** That is the headless string, character for character. It is not what the
Shopify storefront renders.

Two independent signals now point the same way:

1. The address bar in her screenshot read **`beauticate.com`**, not
   `checkout.beauticate.com`. Instagram's in-app browser shows the full host — the
   two are visibly different, as the 4 Sep test screenshots demonstrate.
2. The cart wording is the headless component's exact copy.

**She landed on `www.beauticate.com`.**

## What that means

There are two destinations, not one:

| Journey | Destination | Evidence |
| --- | --- | --- |
| Tapping a **product** in the Instagram shop | `checkout.beauticate.com/products/<handle>` | catalogue Product Link field |
| Tapping **Go to checkout** from Meta's bag | `www.beauticate.com/…` | address bar + cart drawer copy |

So the handoff we care about does not use the catalogue link. It goes to the headless
site — where `/cart` and `/cart/<variant>:<qty>` both **404**.

**Option (A) from the original diagnosis is back on the table.** If Meta sends a cart
permalink to `www.beauticate.com`, it 404s, and building
`app/cart/[[...items]]/page.tsx` is the fix after all. Update 1 said not to build it;
that instruction was based on the catalogue link being the handoff URL, which now
looks wrong for this journey.

Her seeing the shop home rather than a 404 is still consistent with this: a 404 on a
site with a working header is one tap from home.

## The one fact that settles it, and it is now cheap

**Nicole's original DM screenshots.** Two things to read off them:

1. The full host in the in-app browser's address bar.
2. Whether the URL bar shows a path containing `/cart/`.

If her screenshots don't show the path, ask her directly — she reported it once and
will likely answer. Failing that, the phone test in
[`redfern-handoff.md`](./redfern-handoff.md) does the same job, on a personal
Instagram account.

Do not build until one of those comes back. The route is small, but building it
against the wrong journey is exactly the mistake this update is correcting.

---

# SOLVED — 5 Sep 2026: Meta hands off a bag reference, and we drop it

Nicole ran the test and sent the URL. This closes the diagnosis.

## The URL Instagram sends people to

```
https://www.beauticate.com/shop
  ?attributes[Channel]=Instagram
  &attributes[cart-id]=2702664226545360
  &attributes[seller-id]=17841400420810061
  &country=AU
  &access_token=<redacted>
  &cart_origin=instagram
  &fbclid=<redacted>
```

Confirmed: the destination is **`www.beauticate.com/shop`** — the headless site, as
Update 3 predicted. Not `checkout.beauticate.com`.

## Why the cart is empty

**Meta does not send the line items.** There are no variant IDs and no quantities
anywhere in that URL. What it sends is a *reference* to its own basket:

| Parameter | What it is |
| --- | --- |
| `attributes[cart-id]` | Meta's bag id — the basket lives on Meta's side |
| `attributes[seller-id]` | the Instagram business account (`@beauticate`) |
| `access_token` | the credential for resolving that bag |
| `cart_origin=instagram` | marks the journey |
| `attributes[…]` naming | Shopify's cart-attribute query syntax |

The `attributes[…]` form is the tell: Meta is speaking Shopify. On a normal Shopify
storefront the Facebook & Instagram channel app receives these, resolves the bag and
rebuilds the cart. **We are headless. `www.beauticate.com` is not that storefront,
and nothing on our side reads any of it.**

Verified in the code, 5 Sep — occurrences across `app/`, `components/`, `lib/`,
`middleware.ts`:

| Parameter | Files reading it |
| --- | --- |
| `cart_origin` | 0 |
| `cart-id` | 0 |
| `seller-id` | 0 |
| `attributes[` | 0 |

`app/shop/page.tsx` does not accept `searchParams` at all. Every parameter is
dropped on the floor, and the customer gets a correctly-rendered, empty shop.

## This kills the cart-permalink idea for good

Option (A) from the original diagnosis — build `app/cart/[[...items]]/page.tsx`
parsing `variantId:qty` pairs — **would not have fixed this**, and the route would
never even have been reached. Meta doesn't send a `/cart/` path and doesn't send
variant ids. Nothing to parse.

That instruction was reversed once (Update 3, on the evidence that the landing was on
`www`) and is now settled: don't build it. The `www`-landing signal was right; the
inference that Meta was therefore sending a Shopify permalink was wrong.

## Two viable fixes

1. **Point the Instagram shop's checkout website at `checkout.beauticate.com`.**
   That *is* the Shopify storefront, and Shopify's channel app already knows how to
   receive this handoff — it is what the protocol is built for. Almost certainly works
   without writing any code. Cost: Instagram customers land on the second storefront,
   away from the editorial site, and the duplicate-storefront problem stays.

2. **Handle the handoff on `www`.** Read `cart_origin=instagram`, resolve
   `attributes[cart-id]` with the `access_token` into line items, create a cart via
   `POST /api/cart` and write `beauticate_cart_id`. Keeps Instagram customers on the
   editorial site.

   **Feasibility is unconfirmed.** This depends on Meta exposing an API to resolve a
   bag id + token into line items, and on what that token permits. Nobody should
   estimate this until that's checked against Meta's commerce documentation. If the
   bag can't be resolved server-side, option 2 is dead and the choice is option 1 or
   turning the Instagram bag off.

3. *(Fallback)* **Turn off the Instagram bag** so product taps go straight to product
   pages. No basket exists, so none is lost. Worse UX, but honest — and better than
   the current state, which loses every basket silently.

## Where the setting lives

Unconfirmed. `www.beauticate.com` is coming from somewhere in the Meta shop or
Instagram profile configuration — note it differs from the catalogue's Product Link
host (`checkout.beauticate.com`), so the bag handoff and the product tap use different
websites. Finding which field holds it is the first step for option 1.

## Credit

Nicole Ford reported the bug, then ran the reproduction that identified it. Four
customers started an Instagram checkout in 28 days; she is the only one who said
anything.

---

# Update 4 — 7 Sep 2026: the fix works, but it drops the gift

Redfern's proposal is option 1: point Meta's checkout at `checkout.beauticate.com`,
where Shopify's Facebook & Instagram channel resolves `attributes[cart-id]` into
line items using Shopify's own partner-level access to Meta's API. His reading of the
failure matches this document exactly — "the component declares no searchParams, every
one of those query params is simply never read". That answers the open question from
Update 3: the resolution is Shopify's to do, not ours to call, so option 2 is off the
table. Option 1 is the right call.

**But it has a cost nobody has priced, and it lands the day the GWP promotion goes live.**

## The gift is added by the headless storefront only

`reconcileGift()` runs in `app/api/cart/route.ts` — our API, on `www`. Per
[`gwp-booie-cart.md`](./gwp-booie-cart.md), the alternatives were considered and ruled
out: a theme app embed "only runs on a Shopify-rendered theme … enabling it in the
Theme Editor affects only the invisible `checkout.beauticate.com` theme", and a Shopify
Function "can only *discount* a line, never *add* one". The doc's conclusion: "Adding a
line is always the storefront's job, and the storefront is ours."

`checkout.beauticate.com` is a Shopify-rendered theme. `reconcileGift()` never runs
there. The active `DiscountAutomaticBxgy` "Free gift" only discounts the gift line if
it is already in the cart — Shopify's Buy-X-Get-Y does not add it.

## This is observed, not predicted

Two real orders, four days apart:

| Order | Route | Line items | Gift |
| --- | --- | --- | --- |
| **#1016** (4 Sep) | Headless (`www`) | Dot to Dot $28.00 + **Bloody Delicious – Beauticate Gift $0.01** | ✅ |
| **#1017** (5 Sep) | Online Store (`checkout.beauticate.com`) | You're Welcome Mascara $31.00 + Almighty Volume Thickening Duo $50.00 | ❌ **none** |

#1017 is Nicole's — placed through the cart permalink she was sent after reporting the
bug. She bought a BOOIE Beauty product and received no gift, because she checked out on
the Shopify storefront.

**Routing all Instagram traffic to that storefront means every Instagram customer buying
a BOOIE product gets no gift — on the day a BOOIE gift-with-purchase is promoted on
Instagram.**

## Options

1. **Add the gift by hand on affected orders.** Volume is 4 Instagram checkouts in 28
   days. Watch Online Store orders containing a BOOIE product with no gift line and add
   it at fulfilment. Unblocks the launch today, costs nothing, doesn't scale — and
   doesn't need to at this volume.
2. **Get the gift line added on the Shopify theme.** The theme app embed ruled out in
   `gwp-booie-cart.md` was ruled out *because that theme was invisible*. It isn't any
   more. Check whether an app providing it is installed and can be enabled on that theme.
3. **Ship the fix, accept no gift for Instagram, say nothing.** Not recommended — the
   promotion is the reason those customers are arriving.

## How to verify the fix actually works

No order has ever been attributed to the Facebook & Instagram channel, and after this
change one still may not be — checkout happens on the Online Store, so an Instagram
order will look like #1017 did.

The reliable signal is the cart attributes. Meta sends `attributes[Channel]=Instagram`,
`attributes[cart-id]` and `attributes[seller-id]`; if Shopify's channel receives the
handoff properly those land on the order as custom attributes. #1017 has
`customAttributes: []`, so it is not one. **A genuine Instagram handoff order will carry
`Channel: Instagram`.** That is the test — not the channel attribution.
