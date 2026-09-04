# Gift with purchase — BOOIE Beauty (cart mechanic)

Buy any BOOIE Beauty product → the Bloody Delicious illuminator is added to the
cart, free. Built into our own cart, no app.

> Not to be confused with [`gift-with-purchase.md`](./gift-with-purchase.md), which
> is a different mechanic: warehouse email notifications asking a brand to drop a
> gift in the parcel. This one is a real line item in the customer's cart.

## Why not BOGOS.io

BOGOS has two layers and neither can do the job here:

| Layer | What it does | Why it can't help |
| --- | --- | --- |
| Theme app embed (Liquid + JS) | Watches the cart, adds the gift line | Only runs on a Shopify-rendered theme. beauticate.com is Next.js on Vercel and never renders the theme, so enabling it in the Theme Editor affects only the invisible `checkout.beauticate.com` theme. |
| Shopify Functions | Discounts lines in Shopify's checkout | Runs server-side and would work — but a function can only *discount* a line, never *add* one. |

Adding a line is always the storefront's job, and the storefront is ours. So the
mechanic lives in `lib/gwp-cart.ts` and BOGOS is not part of it.

## The $0.01

The gift SKU (`9361189000023-GWP`) is priced at one cent, not zero, because Modern
Dropship cannot process a $0.00 line item for a gift with purchase. **Do not set it
to $0.00.** The cent is handled presentationally instead:

- **Cart drawer** — the line renders with a "Free gift" badge and the word *Free*.
  No price, no Remove button.
- **Checkout** — the line carries a customer-visible line-item property,
  `Gift with purchase: Free gift — Bloody Delicious illuminator`. The price still
  reads $0.01 there. Removing that last cent from the customer's view needs a
  Shopify **automatic discount** (100% off the gift variant when the cart contains
  a BOOIE product) — that is exactly the job BOGOS's Functions layer would do, and
  native Shopify does it for free. Not built: nobody has asked for the cent to be
  discounted, only for it to stop looking like a pricing bug.

## Where the logic lives

| File | Role |
| --- | --- |
| `lib/gwp.ts` | **The config.** Vendor, gift ids, all customer-facing copy, and the `enabled` master switch. |
| `lib/gwp-cart.ts` | `reconcileGift(cart)` — the whole mechanic, ~60 lines. |
| `app/api/cart/route.ts` | Runs the reconciler after every cart read and mutation; blocks direct adds of the gift variant. |
| `components/shop/CartDrawer.tsx` | Free-gift treatment on the line. |
| `components/shop/GiftBanner.tsx` | Product-page pitch, gated on real stock. |

Reconciliation is **server-side, on every cart response** rather than bolted to the
add-to-cart button. That placement is what makes the edge cases fall out for free:
there is no client path to the cart that skips it, a stale tab or bfcache restore
self-corrects, and the customer cannot delete the gift while they still qualify.

## Behaviour, as tested against the live Shopify cart

| Scenario | Result |
| --- | --- |
| Non-BOOIE product only | No gift |
| BOOIE product added | Gift appears, quantity 1 |
| Two BOOIE products (qty 2) | Still exactly one gift |
| `POST /api/cart {action:add, variantId:<gift>, quantity:5}` | Ignored — cart returned unchanged |
| Customer deletes the gift line, BOOIE still in cart | Gift restored on the next response |
| Last BOOIE product removed | Gift removed; other brands' lines untouched |
| Gift out of stock (verified against a real 0-stock DENY variant) | No gift, no error, cart intact |
| `GET /shop/products/<gift handle>` | 404 |

The gift SKU is also filtered out of every product listing, related rail, tag query
and the sitemap — driven by its `gwp-hidden` tag, so a future gift SKU only needs
that tag in Shopify.

## Ending the promotion

Set `GWP.enabled = false` in `lib/gwp.ts`. Carts stop gaining the gift and existing
carts drop it on their next response. Nothing else to unwind.

## Known issue — shipping (needs a Shopify fix, not a code fix)

The gift product sits in the **General profile**, whose domestic rate is **$11.00**.
BOOIE's own products are split: 10 of them are in the **Free Shipping** profile, the
rest in General. Shopify charges the *sum* of the rates for every delivery profile
represented in a cart, so a customer buying only a free-shipping BOOIE product is
quoted **$11 at checkout purely because we gave them a free gift** — while the
product page promises free shipping (`FREE_SHIPPING_VENDORS` includes BOOIE Beauty).

**Fix in Shopify admin:** move `Bloody Delicious - Beauticate Gift` into the
*Free Shipping* delivery profile. Then the gift can only ever add a $0 rate group.
