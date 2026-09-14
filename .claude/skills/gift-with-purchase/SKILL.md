---
name: gift-with-purchase
description: How Beauticate runs a gift with purchase end to end — setting one up for a partner brand, the minimum spend, reading Shopify stock correctly, the editorial push that sells it, watching it burn down, and closing it cleanly. Use whenever a GWP, gift with purchase, free gift, gifting suite slot or brand takeover is being planned, launched, promoted, monitored or wound up, and whenever someone asks how many gifts are left or why the offer is or isn't showing. Complements booie-gift-sweep, which is the daily catch-up job for orders the cart could not reach.
---

# Running a gift with purchase

One partner brand at a time, on a rotation. The brand funds a fixed number of
gift units, Beauticate runs the editorial push, and the storefront attaches the
gift automatically. BOOIE Beauty was the first, September 2026, and everything
below is what that one taught us.

The mechanics live in `docs/gwp-booie-cart.md` (cart lane) and
`docs/gift-with-purchase.md` (warehouse lane). This skill is the strategy and
the traps, not a repeat of those.

## The two lanes

**Cart lane — the one that works.** `lib/gwp-cart.ts` reconciles every cart
response, so the gift is a property of the cart's contents rather than of a
button. Anyone who reaches www.beauticate.com gets it, including people arriving
from an Instagram link.

**Warehouse lane — built, never switched on.** `lib/gift-campaign.ts` emails the
brand's warehouse for orders the cart can't reach (native Instagram Shopping
checkout). As of Sept 2026 it needs three things nobody has set up:
`SHOPIFY_ADMIN_API_TOKEN`, `SHOPIFY_WEBHOOK_SECRET` and a Resend key. Check with
`GET /api/webhooks/orders-created` — it returns `{ready:{hmacSecret, admin, email}}`.

**It has never needed to fire.** Every BOOIE order came through the cart. Don't
stand up three integrations for a promotion measured in days — use the
`booie-gift-sweep` skill instead, which finds owed orders and drafts the email.

## Before launch

1. **Brand creates the gift SKU at $0.01**, never $0.00 — Modern Dropship can't
   process a zero-priced line. It must sync through MD so it carries a
   Convictional id.
2. **Tag it `gwp-hidden`** so it stays out of listings, search and the sitemap,
   and its own PDP 404s.
3. **Shopify BXGY automatic discount** takes $0.01 off one of the *brand's*
   products, never off the gift line. BOOIE's is
   `gid://shopify/DiscountAutomaticNode/1328198615109`. Zeroing the gift line
   recreates the $0.00 case MD can't process, and MD invoices us from the line price.
4. **Gift goes in the same delivery profile as the brand's products.** BOOIE's
   sat in General ($11) while its products were free shipping, which would have
   charged $11 for accepting a free gift.
5. **Add the offer to `GWP_OFFERS` in `lib/gwp.ts`** — vendor, gift ids, copy,
   `minSpend`, optional `startsAt`/`endsAt`. One entry is the whole config.
6. **Set `minSpend` before launch, not after.** See below.
7. **Update `app/competitions/terms/page.tsx`** — the `gwp` object carries brand,
   gift, value, min spend, allocation and `status`. These are the published terms.

## The minimum spend is the single biggest lever

BOOIE launched with no minimum. Six gifts went in two hours to a soft-launch
audience, and a $39 illuminator was going out on a $21 brow gel.

A **$45 minimum** was added mid-day one. The effect:

| | Orders | Average |
|---|---|---|
| Before | $31, $31, $45, $39, $21 | **$35** |
| After | $70, $74, $45, $98, $45 | **$66** |

It nearly doubled order value and made the stock last. Set the threshold just
above the brand's hero single product, so that one item still qualifies alone
and everything cheaper nudges people to a second piece. For BOOIE that was $45,
which the $45 BB Cream clears on its own.

`minSpend` is measured on **that brand's subtotal**, never the order total
(`brandSubtotalFor` in `lib/gwp.ts`), so another brand's products can't unlock
this brand's gift. If both lanes run, set the same figure in
`lib/gift-campaign.ts` — they were out of step at 45 and 0 for a day.

## Stock: three numbers, and only one of them gates the offer

This caused more confusion than anything else. Query them:

```graphql
{ productVariant(id: "gid://shopify/ProductVariant/<gift>") {
    inventoryQuantity
    inventoryItem { inventoryLevels(first: 1) { edges { node {
      quantities(names: ["available","committed","on_hand"]) { name quantity }
    } } } } } }
```

- **`available`** — what we can still promise. Drops the moment an order is
  placed. **This is what gates the cart, the banner and `GiftNote`.**
- **`committed`** — ordered, not yet shipped.
- **`on_hand`** — physical units at the brand. Only drops when they pack.

`available = on_hand − committed`. So **our number is always lower than the
brand's during a busy run**, and neither is wrong. Jasmin said 14 while Shopify
said 16; there was no discrepancy, just two different measures. Explain this
before anyone "corrects" the inventory.

**Never adjust inventory down on a second-hand count.** Set it too low and you
stop giving gifts you actually have.

**The brand can move `on_hand` without telling you.** BOOIE's went up by one
overnight, and a restock arrived with no `incoming` transfer recorded. Also check
whether a restock was loaded *additively* or as an absolute level — 30 more on
top of 9 left should read ~39 available, not 27.

## Never hardcode the offer in content

Article copy can't know the threshold changed and can't know stock ran out. It
just keeps promising. During the BOOIE run six stories said "free with any BOOIE
order" while `lib/gwp.ts` had already moved to $45.

**Use `<GiftNote />`** (`components/mdx/GiftNote.tsx`). It takes every word from
`GWP_OFFERS`, so the minimum is stated in exactly one place, and renders
**nothing** when there's no live offer or the gift is out of stock. The stock
probe rides the 5-minute Shopify fetch cache, so it self-corrects within about
five minutes with no deploy. It fails open, matching the product page.

Same principle on the product page (`GiftBanner`, gated on stock by
`app/shop/products/[handle]/page.tsx`) and the cart drawer.

**Keep the offer out of metadata.** Brands paste the promotion at the top of
every product description, and `meta`/`og:description`/Product JSON-LD used to
take the first 160 characters of it. Google indexes that for weeks and Facebook
caches `og:description` once, so shared links keep advertising a finished offer.
`lib/product-description.ts` strips leading offer sentences. Leave the on-page
description alone.

## The editorial push

The gift is a reason to launch a takeover, not a substitute for traffic. BOOIE
did 13 gift orders on day one and almost nothing on day two, because the content
had run, not because the gift had.

- **Repromote the brand's whole back catalogue**, not one article. Six Celeste
  stories were given BOOIE rails and product cards.
- **Put the `<CollectionRail>` near the top**, under the opening image or second
  paragraph. At the foot it's below where most readers stop.
- **Make every product mention shoppable.** A named product in plain text is a
  dead end; `<InlineProduct>` or `<ShopItem handle>` turns it into a sale.
- **Six or more `product_links` auto-generates `/shop/moments/<slug>`** — a free
  shoppable landing page per article.
- **Ed's note rule applies.** In a bylined first-person interview the offer is
  Beauticate's voice, never the subject's.
- **`hero_title` and `hero_eyebrow` are temporary overrides** for the carousel
  only, leaving the article's real headline alone. Deleting two lines ends it.
- **Don't put the brand in a headline the story doesn't support.** The Celeste
  podcast episode never mentions BOOIE, so the eyebrow carried the merchandising
  and the headline stayed true. The launch interview, which is genuinely about
  BOOIE, took the brand headline.

## Watching it burn down

Run a cron check on `sku:<gift>` — every 20 minutes while it's moving, every few
hours once it settles. Notify at 3 or fewer and again at zero.

Know what self-retires and what doesn't:

| | |
|---|---|
| `GiftNote`, `GiftBanner`, cart line, cart reconciler | **automatic** at zero stock |
| Meta/OG descriptions | already clean |
| Hero slides, terms page, product descriptions | **manual** |

The hero is the one that gets forgotten, because an old story keeps leading the
homepage for a promotion that has ended.

## Closing it

1. `status: 'open'` → `'closed'` in `app/competitions/terms/page.tsx` — flips the
   page to "(ended)".
2. Demote the hero slides, drop the temporary `hero_title`/`hero_eyebrow`.
3. Delete the BXGY cent-offset discount in Shopify. It's the only piece that
   never cleans itself up.
4. Ask the brand to strip the offer line from their product descriptions.
5. Optionally `enabled: false` on the offer, to make the intent explicit rather
   than relying on an empty bin.

Leave `/terms` alone — "from time to time we run a gift with purchase" is
evergreen and still true.

## Talking to the brand

- **Don't ask for more stock mid-run.** Selling through the whole allocation is
  the stronger story and a better negotiating position for the next one. BOOIE
  offered another 30 unprompted after seeing the numbers.
- **Report results, not requests.** Order count, sell-through time, average
  order value before and after the minimum, and what the takeover involved.
- **BOOIE contacts:** `jasmin@booie.com` for orders and warehouse (cc
  `tayla@booie.com`), `monika@booie.com` for brand and marketing,
  `indiana@booie.com` for social. Monika and Indiana get the campaign
  conversation; Jasmin gets the packing detail.
- Emails are **drafted, never sent**.

## What actually happened — BOOIE, September 2026

- 22 units funded, 2 for testing, **20 for the promotion**. Later topped up to 52.
- **11 gift orders in the first two days**, $544, all fulfilled.
- Six of those in the first two hours, to a WhatsApp group and a close-friends
  Instagram channel only.
- $45 minimum added on day one: average order **$35 → $66**.
- Warehouse lane never fired. One order (#1017) predated the fix and was handled
  by a direct email to Jasmin.
- Day two: no gift orders at all, with stock remaining. The content had stopped,
  not the offer.

### Mistakes worth not repeating

- Six articles promised the gift with no minimum while the cart enforced $45.
- The product banner said "Spend $45" and "free with any BOOIE Beauty order"
  three lines apart.
- The offer was served as the meta description of ~50 products.
- `on_hand` was read as physical stock and compared against the brand's count,
  producing a discrepancy that never existed.
- A restock was announced as "another 30" but loaded as an absolute level, so the
  shop was 12 short of what had been agreed.
