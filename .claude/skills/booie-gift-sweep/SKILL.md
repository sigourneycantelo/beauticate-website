---
name: booie-gift-sweep
description: Daily sweep for BOOIE gift-with-purchase orders that the storefront cart could not reach (Instagram Shopping and any other lane). Finds orders containing a BOOIE Beauty product but no gift line, drafts the warehouse email to BOOIE in Gmail for Sigourney to send, and tags the order so it is never drafted twice. Use when asked to run the BOOIE gift check, the daily gift sweep, or to catch up gifts owed.
---

# BOOIE gift sweep

Beauticate runs a gift with purchase: buy any BOOIE Beauty product, get a Bloody
Delicious illuminator free.

On **www.beauticate.com** the storefront adds the gift to the cart itself
(`lib/gwp-cart.ts`), so the customer sees it and it ships as a line on the order.
Other lanes — chiefly **Instagram Shopping** — never run that code, so those
customers buy a BOOIE product and get nothing.

This sweep catches those orders and asks BOOIE's warehouse to drop the gift in
the parcel instead. It replaces the `orders/create` webhook in
`lib/gift-campaign.ts`, which is built but was never switched on (no Shopify
custom app, no webhook registered, no email provider). At ~20 gifts total, this
is the cheaper path and every email is approved by a human before it sends.

## Hard rules

- **Draft emails only. Never send.** Sigourney reads and sends each one.
- **Never gift an order twice.** An order already carrying the gift SKU, or
  already tagged, is done.
- **Stop at the cap.** BOOIE funded 22 units: 20 for customers, 2 for testing
  (one spent on order #1016). If Shopify stock on the gift variant is 0, or 20
  customer gifts have gone, stop and say so rather than promising more.
- **Never invent the warehouse address.** BOOIE's is `jasmin@booie.com`, cc
  `tayla@booie.com` (Monika, `monika@booie.com`, is the relationship contact — not
  for per-order notes). For any other brand, if the address isn't known, draft to
  Sigourney with a note instead of guessing.

## Constants

| Thing | Value |
| --- | --- |
| Qualifying vendor | `BOOIE Beauty` |
| Gift SKU (cart lane) | `9361189000023-GWP` |
| Gift variant | `gid://shopify/ProductVariant/45618557026373` |
| Tag applied when drafted | `gift-booie-drafted` |
| Campaign start | 2026-09-04 |
| BOOIE warehouse | `jasmin@booie.com`, cc `tayla@booie.com` |

## Step 1 — find orders owed a gift

```graphql
query GiftSweep {
  orders(first: 30, sortKey: CREATED_AT, reverse: true,
         query: "created_at:>=2026-09-04 AND -tag:gift-booie-drafted") {
    nodes {
      name createdAt tags displayFulfillmentStatus
      customer { firstName lastName }
      shippingAddress { name address1 address2 city province zip country }
      lineItems(first: 20) { nodes { title sku quantity vendor } }
    }
  }
  giftStock: productVariant(id: "gid://shopify/ProductVariant/45618557026373") {
    inventoryQuantity
  }
}
```

An order is **owed a gift** when all of these hold:

1. at least one line item has `vendor == "BOOIE Beauty"`, **and**
2. no line item has sku `9361189000023-GWP` (that means the cart lane already
   gave them one), **and**
3. tags do not include `gift-booie-drafted`.

Everything else is skipped. Report skips briefly — silence looks like a bug.

## Step 2 — draft the email

One email per order, drafted in Gmail to BOOIE's warehouse (Jasmin). Subject
names the Shopify order. Keep it short and warm; this is a note to a partner, not
a system alert. State the order number, the customer name and suburb, the gift,
and that it should go in that parcel.

Check `displayFulfillmentStatus` first. If the order is already **FULFILLED** the
parcel has gone, so ask for the gift to be sent **separately** and give the full
shipping address — don't ask them to add it to a box that has already shipped.

Do not send. Do not fabricate a shipping address — take it from the query.

## Step 3 — tag the order

Only after the draft exists:

```graphql
mutation TagDrafted($id: ID!) {
  tagsAdd(id: $id, tags: ["gift-booie-drafted"]) {
    userErrors { field message }
  }
}
```

This is what stops tomorrow's sweep drafting the same order again, so never skip
it, and never tag an order you did not draft for.

## Step 4 — report

Tell Sigourney: how many drafts are waiting, which orders, remaining gift stock,
and anything skipped and why. If nothing is owed, say so in one line.

## Stock counting (manual, deliberate)

The cart lane consumes Shopify stock on the gift variant automatically. This lane
does **not** — the gift never touches the order. So Shopify inventory is the only
shared counter, and it drifts low by one for every warehouse gift sent.

Do **not** decrement it automatically. Once Sigourney confirms she has sent a
batch, offer this and run it only on her say-so:

```graphql
mutation Decrement($input: InventoryAdjustQuantitiesInput!) {
  inventoryAdjustQuantities(input: $input) { userErrors { field message } }
}
```

Adjusting inventory changes what the storefront believes is available, which
switches the offer off when it hits zero — so it is a real decision, not
bookkeeping.
