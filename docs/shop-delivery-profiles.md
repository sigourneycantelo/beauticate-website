# Delivery profiles, and the sold-out bug they cause

A brand whose fulfilment location is not a **shipping origin** in its delivery
profile shows SOLD OUT on every one of its product pages, whatever the stock
says. This is the single most expensive misconfiguration in the shop, it is
invisible in Shopify's product admin, and it has now happened to three brands.

## What it looks like

- Shopify admin: product ACTIVE, `totalInventory` 99, variant `availableForSale`
  true, `sellableOnlineQuantity` 99, `inventoryPolicy` DENY, location active and
  set to fulfil online orders. Everything reads healthy.
- Storefront API `product.availableForSale`: **true**.
- Storefront API `cartCreate`: line comes back **quantity 0** with
  `MERCHANDISE_OUT_OF_STOCK`.
- The site: a SOLD OUT button. Correctly — the cart genuinely will not take it.
- Nothing logs, nothing 404s, no build fails.

## Why

`lib/shopify.ts` → `getVariantAvailability()` probes a throwaway cart rather
than trusting `variant.availableForSale`, because the product query's flag is
not reliable. That is the right call: the cart is the only thing that knows
whether a line can be bought. So the page is an accurate mirror of a Shopify
problem, not a bug of its own.

Shopify only counts stock a customer can actually be shipped. A delivery
profile lists the **origin locations** it has rates for. Every Beauticate
partner brand fulfils from its own Modern Dropship location (`booie-com`,
`waterrower-com`, `quecolour-com`…) — the default "Shop location" stocks
nothing. So a profile whose only origin is "Shop location" can ship from
nowhere that holds stock, and every product in it is unbuyable.

Check with:

```graphql
{ deliveryProfile(id: "gid://shopify/DeliveryProfile/…") {
    name originLocationCount locationsWithoutRatesCount
    unassignedLocations { name } } }
```

`originLocationCount: 1` on a brand profile is the tell. A healthy profile
(`$8.50 flat`, `Free Shipping`) shows 32–33.

## The cases so far

| Brand | Location | Profile | Why it broke |
|---|---|---|---|
| NOHRD / WaterRower | `waterrower-com` | the ~20 `$N Shipping` freight tiers | each created with one origin |
| Christophe Robin | `quecolour-com` | `General profile` | location never added to the default profile |
| IBIZA HAIR | `quecolour-com` | `General profile` | same |
| IMBIBE | `imbibeliving-com` | `Imbibe $15 flat` | created 21 Sep with one origin — caught before launch |
| NOHRD / WaterRower (again) | `waterrower-com` | `$110 Shipping` | a further freight tier auto-created 21 Sep, same one-origin fault — six products (Swing Board × 3, TriaTrainer × 3) blocking a live EDM the next day |

The NOHRD case cost the entire mid-range of the WaterRower partnership for as
long as those products were published. It recurred within 24 hours, on a
different freight tier for the same brand — this is not a one-off, it is what
happens every time Modern Dropship's sync creates a new per-product shipping
rate, and it will keep happening until something upstream stops auto-creating
single-origin profiles. See
[`docs/shop-onboarding-technical-handoff.md`](docs/shop-onboarding-technical-handoff.md)
for the fuller picture — this is one of two faults that make a brand look
correctly configured and still be completely unbuyable, the other being
publication (below).

## The other half of this bug: publication, not just shipping

A product can pass every check above and still be invisible to the site, for
a completely separate reason: it was never published to a sales channel at
all. `resourcePublicationsV2` comes back `[]` — not even Point of Sale. This
is not a theory, it is what every one of IMBIBE's 18 products and all 20 of
the NOHRD/WaterRower products in the 22 September EDM list were sitting at.

An unpublished product isn't a cache problem and isn't a delivery-profile
problem — the Storefront API simply cannot see it, full stop, so
`getProductByHandle` returns null and the page 404s (or, if the page was
built and cached before the product's publication was ever removed, it can
keep serving a stale sold-out render until the next revalidation). Publish it
to the same seven channels every working product uses — Point of Sale, Shop,
Buy Button, Sell on WordPress, Beauticate Shop, Facebook & Instagram,
Pinterest — via `publishablePublish`, and it appears within one cache cycle.

This is, in practice, the more common of the two faults — it hit 38 products
across two brands in the space of 24 hours, against one delivery-profile
recurrence. Check it first.

## The fix

Shopify admin → Settings → Shipping and delivery → the profile → the rate →
add the brand's fulfilment location as an origin. The zone and rate are
unchanged, so the customer pays exactly the same; the stock simply becomes
shippable. Reversible, and it only ever enables selling.

Then re-run the detector and confirm the brand clears.

## Catching it

```bash
node scripts/audit-cart-availability.mjs
```

One cart probe per brand — the fault is per delivery profile and a profile
covers a whole brand, so one probe answers for all of it. Exits non-zero and
names the brands. `--all` does every in-stock variant, slowly; `cartCreate` is
rate limited hard per IP and a full sweep gets throttled.

**Run it whenever a brand is onboarded, moved to a new profile, or a new
freight tier is created** — all three are the moment this breaks, and all three
look fine in the admin afterwards.
