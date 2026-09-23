# Start here — Instagram checkout + the redirect landmine

**Written for Redfern, 5 Sep 2026.** Sig is unavailable today. This page says what
is actually broken, what your test last night did and didn't prove, and which of
these you can finish without waiting on her.

Two separate pieces of work. Only the first is unblocked.

---

## 1. Reconcile the shop-domain redirects — yours, do it now

Self-contained, no decisions needed, nothing depends on Sig.

Full brief: [`brief-redirect-landmine.md`](./brief-redirect-landmine.md)

Short version: the legacy shop-domain redirects exist twice — in `next.config.ts`
with a `(?!cart|checkout|checkouts)` exclusion, and again in `vercel.json` with
none. Vercel applies project-level redirects first, so the `vercel.json` pair wins
and the exclusion never runs. Confirmed live: `shop.beauticate.com/checkouts/cn/abc123`
still 308s to `/shop`.

That exclusion is the repair for the outage #63 caused on 30 July, when Shopify's
primary domain was `shop.beauticate.com` and the blanket rule was throwing every
customer who tapped Checkout back to the shop page. #71 re-added the rules in
`vercel.json` on 6 Aug and reverted the repair.

Harmless today only because Shopify's primary domain has since moved to
`checkout.beauticate.com` and `shop.beauticate.com` now reads **Invalid DNS**.
The hazard is that the guard *looks* like it's in place.

**Please delete the two redirect entries from `vercel.json`.** Keep `next.config.ts`
as the single source of truth — the rule and the comment explaining it belong
together. **Don't resolve it by deleting the exclusion**: it matches nothing today,
so it reads as dead code, but it's the fix for a real outage. Verification commands
are in the brief.

---

## 2. Instagram checkout — blocked on a decision from Sig

Full diagnosis, with evidence: [`instagram-checkout-handoff.md`](./instagram-checkout-handoff.md)

### What your test last night proved — and it's genuinely useful

Your screenshots show beauticate.com/shop working end to end inside Instagram's
in-app browser: product page → add to cart → drawer holds 4 items → CHECKOUT →
`checkout.beauticate.com` with $121.00 intact.

That closes a real open risk. The original handoff flagged that we didn't know
whether `localStorage` survives inside the Instagram webview — the cart id lives
there, not in a cookie, so if it didn't survive, no fix on our side would work and
we'd have to bypass our cart entirely. **It survives. Confirmed on a real device.**

### What it didn't test

None of the screenshots show **Instagram's own Basket screen**. The reported bug
starts there: the customer fills Meta's bag (2 items, AU$81, "Delivery Free"), taps
**Go to checkout**, and lands on our site with an empty cart. Your screenshots start
with beauticate.com already open and the cart badge already at 3 — that's a customer
arriving from a link in bio and shopping normally, not the Instagram Shopping handoff.

It's an easy misread: "empty cart in the Instagram browser" sounds like our cart
breaks in that browser. You proved it doesn't. The failure is one step upstream.

### What's actually wrong

That basket is **Meta's**, not ours. Items added from Instagram Shopping live in
Instagram's own bag, built from the Meta product catalogue. Our storefront never
sees them.

Read straight off the catalogue in Commerce Manager, the Product Link field is:

```
https://checkout.beauticate.com/products/<handle>?utm_source=facebook&variant=<variantId>
```

So Instagram points at **`checkout.beauticate.com`** — a second, fully live Shopify
storefront — not the headless site we build. Verified 4–5 Sep and unchanged since:

- `shop.primaryDomain` = `checkout.beauticate.com`; every product's `onlineStoreUrl`
  is on that host.
- **No order in the store's history has ever come through the Facebook & Instagram
  channel.** Orders #1002–#1016 are all the `Headless` channel with a
  `beauticate.com` referrer.
- Meta shop insights: 4 checkouts initiated on Instagram in 28 days, 0 purchases.

### CORRECTION, 5 Sep — the customer was on `www`, not the Shopify store

Since this page was written, two signals show Nicole landed on **`www.beauticate.com`**,
not `checkout.beauticate.com`: the address bar in her screenshot reads `beauticate.com`,
and her cart drawer read "Your Cart (0) — Your cart is empty", which is the headless
`CartDrawer.tsx` copy character for character. The Shopify storefront renders
"CART / YOUR CART IS EMPTY" instead.

So there are two destinations. Tapping a **product** in the Instagram shop goes to
`checkout.beauticate.com` (the catalogue Product Link). Tapping **Go to checkout**
from Meta's bag goes to **`www.beauticate.com`** — where `/cart` and
`/cart/<variant>:<qty>` both 404.

That puts building the cart permalink route back in scope, contrary to the section
below. Read Update 3 in [`instagram-checkout-handoff.md`](./instagram-checkout-handoff.md)
before acting on anything here.

### Still don't build `app/cart/[[...items]]` on `www` until the URL is confirmed

`www.beauticate.com/cart/<variant>:<qty>` 404s, and an earlier draft of the handoff
proposed building it. **That would be a working route on a domain Instagram never
links to.** Note also that cart permalinks *already work* on the domain Meta does
use: `checkout.beauticate.com/cart/45051885551685:1` 302s into a real Shopify
checkout with the items loaded.

### The decision Sig has to make

1. **Keep Meta on `checkout.beauticate.com`** and make that storefront convert.
   Nearly free, but the shop stays split in two and the duplicate storefront keeps
   competing with `/shop` in search (it's crawlable, sitemapped, self-canonicalling).
2. **Repoint Meta at `www.beauticate.com/shop`.** Correct destination, but Shopify's
   channel derives catalogue links from the online-store domain, so this likely means
   a standalone feed instead of the Shopify channel — and the bag handoff has to be
   rebuilt with it. Only under this option does a cart permalink route make sense.

### What you can do while she's out

**The phone test** — and you can't do it from an account attached to the business,
same reason Sig can't: Instagram hides the shopping surface from the shop's owner.
On a personal Instagram account, on any phone: tap a Beauticate product tag → View
shop → add two items to the bag → **Go to checkout** → tap the address bar and copy
the whole URL.

What the answer means:

- `checkout.beauticate.com/cart/…` → the basket handoff is live and something else
  broke. Send the URL.
- `checkout.beauticate.com/products/…` or the store home → the basket is dropped at
  handoff. Most likely, and it confirms the decision above.
- `www.beauticate.com/…` → catalogue links are stale; different fix entirely.

Confirmatory rather than decisive — "zero orders ever" already argues the bag is
being dropped — but it's cheap and it removes the last doubt.

**Still unread:** Shopify Admin → Sales channels → Facebook & Instagram → Settings →
the checkout method field. Its Settings panel is a cross-origin iframe that wouldn't
scroll under automation. Ten seconds by hand if you have admin.

---

## 3. Two smaller things spotted in your screenshots

Not urgent, and unverified beyond the images — worth a look when you're in the cart code.

- **The same product appears twice at two prices.** "Where the Hell Is My...?" shows
  as two separate cart lines, $28.00 and $27.99, rather than one line at qty 2. The
  product page says $28.00 and the cart line says $27.99. There is a deliberate
  cent-offset automatic discount (see `docs/gwp-booie-cart.md` and the shop docs), so
  the 1c isn't the surprise — identical items refusing to merge into one line is.
- **Cart badge showed 3 while the drawer showed 4.** Possibly just timing between two
  screenshots; worth confirming the badge doesn't lag the drawer.

---

## Don't conflate this with the BOOIE gift-with-purchase work

`docs/gwp-booie-cart.md` shipped on 4 Sep and is unrelated. The gift logic is working
correctly in your screenshots — "Bloody Delicious – Beauticate Gift" was added free,
as designed.
