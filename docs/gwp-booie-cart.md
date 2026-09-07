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
  `Gift with purchase: Free gift — Bloody Delicious illuminator`, and the cent is
  cancelled out by an automatic discount (below) so the customer's total is round.

### The cent-offset discount

Shopify automatic discount **"Free gift"** — `gid://shopify/DiscountAutomaticNode/1328198615109`,
a Buy-X-Get-Y created 4 Sep 2026:

- **Buys:** variant `45618557026373` (the gift), quantity 1.
- **Gets:** $0.01 off one item in the **Booie Beauty** collection.
- `usesPerOrderLimit: 1`; combines with product, order and shipping discounts so it
  can never block a customer's own code.

The point of this shape is *where the cent comes off*. It discounts the **paid**
BOOIE line, not the gift line — so the gift stays at $0.01, which is the price
Modern Dropship invoices from, while the customer's total lands on a round number.
Verified live: a $39.00 BOOIE product reconciles to `$38.99 + $0.01 gift = $39.00`.

**Do NOT "simplify" this into 100% off the gift line.** That zeroes the line MD bills
from, which is the $0.00 case MD cannot process — the very problem the cent exists to
avoid. For the same reason, never raise the gift's price to full retail and discount
it back down: MD derives your cost from the line price (order #1016 billed $19.60 on a
$28.00 line, i.e. the 30% margin), so a $39 line could be invoiced at ~$27.30 per gift.

It fires only when the gift is in the cart, so it can only ever touch a GWP order, and
it stops on its own when the gift stock runs out and the reconciler stops adding it.
Delete the discount when the promotion ends.

**Known gap:** two BOOIE products — *Build Your Snazzy Face Bundle* (8095274795077) and
*Brow Bundle* (8197749702725) — are not in the Booie Beauty collection, so a cart
containing only one of those gets the gift but not the cent offset, and the total ends
in .01. Shopify refuses to mix collections and individual products in one BXGY's "gets",
so the fix is to add those two to the collection — which would also put them back on the
BOOIE brand page, where they are currently missing for the same reason.

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

## Rotating to the next brand

`lib/gwp.ts` holds a **list** of offers, so the fortnightly rotation is a config
edit and nothing else in the codebase changes. Each offer carries its own vendor,
gift ids, copy and an optional date window:

```ts
{ key: 'brand-slug', enabled: true, vendor: 'Brand Name',
  giftVariantId: 'gid://shopify/ProductVariant/…',
  giftProductId: 'gid://shopify/Product/…',
  giftHandle: '…', giftName: 'a travel-size serum',
  badge: 'Free gift', freeLabel: 'Free', pitch: '…', cartNote: '…',
  lineAttributes: [{ key: 'Gift with purchase', value: '…' }],
  startsAt: '2026-09-21T00:00:00+10:00',
  endsAt:   '2026-10-05T00:00:00+10:00' }
```

Windows do the work: outside them the gift is never added, the product-page pitch
withdraws itself, and any gift still sitting in a cart from the finished offer is
removed on that cart's next response — so a rotation can't leave last fortnight's
gift behind. Two offers may overlap; a cart qualifying for both gets both gifts,
reconciled independently.

Verified 7 Sep by back-dating `endsAt`: no gift added, pitch gone from the PDP.

### Per-brand setup, outside the code

Every one of these was a real failure during the BOOIE launch.

1. **The brand creates the gift SKU at $0.01, never $0.00** — Modern Dropship
   cannot process a zero-priced line. It must sync through MD so it carries a
   Convictional product id; a SKU invented in our Shopify has nothing for MD to
   route to the brand.
2. **Tag the gift product `gwp-hidden`** so `stripHidden()` keeps it out of
   listings, tag queries and the sitemap, and its own PDP 404s.
3. **Create a BXGY automatic discount taking $0.01 off one of the BRAND's
   products** — never off the gift line. See the warning above for why.
4. **Put the gift in the same delivery profile as the brand's products.** BOOIE's
   sat in General at $11 while its products shipped free, which would have added
   $11 to a cart whose page promised free delivery.
5. **Check stock and the cap.** The cart lane draws on Shopify inventory for the
   gift SKU; agree the number with the brand and let inventory be the counter.

Nothing needs the gift's own vendor excluded by hand — `qualifyingLinesFor`
already ignores every offer's gift line, which matters because a gift normally
carries its own brand's vendor and would otherwise qualify for its own offer and
never leave the cart.

## Ending the promotion

Set that offer's `enabled: false` (or let its `endsAt` pass) in `lib/gwp.ts`.
Carts stop gaining the gift and existing carts drop it on their next response.
Delete the BXGY discount in Shopify. Nothing else to unwind.

## Shipping

**Resolved 4 Sep 2026.** All 53 BOOIE Beauty products — the gift SKU included — are
in the **Free Shipping** delivery profile. The gift can therefore only ever add a
$0 rate group, so it never changes what the customer is quoted.

Before the fix the gift sat in the General profile ($11 domestic) while BOOIE's own
products were split 10/43 between Free Shipping and General. Shopify charges the
*sum* of the rates for every profile in a cart, so a customer buying a
free-shipping BOOIE product would have been quoted **$11 at checkout purely because
we gave them a free gift** — while the product page promised free shipping
(`FREE_SHIPPING_VENDORS` includes BOOIE Beauty).

Watch this whenever a gift SKU is added for another brand: **the gift must live in
the same delivery profile as the products that earn it**, or it silently adds that
profile's rate.

## Modern Dropship per-order fee

The gift is a line on the same vendor's order, so it is one order to BOOIE and one
per-order fee — adding a gift does not create a second order or a second fee. With
BOOIE on free shipping the fee should be nil in any case: the MD per-order fee is
how we reimburse a brand for shipping, so there is nothing to reimburse. Worth
eyeballing once on the first real BOOIE order.
