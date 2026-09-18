---
name: gift-with-purchase
description: The Beauticate gifting suite end to end — the rotating fortnightly schedule and the two spreadsheets behind it, offering a slot to every newly onboarded brand and recording what they'll fund, chasing brand confirmations by email, then setting up, launching, promoting, monitoring and closing an individual gift with purchase. Use whenever a GWP, gift with purchase, free gift, gifting suite slot, gift allocation or brand takeover comes up, when a new brand joins the shop, when asked who is next in the rotation or how many gifts are left, or why the offer is or isn't showing. Complements booie-gift-sweep, the daily catch-up job for orders the cart could not reach.
---

# The gifting suite

One partner brand at a time, on a rotation. The brand funds a fixed number of
full-size units, Beauticate runs an editorial takeover in that window, and the
storefront attaches the gift automatically.

Told to partners on 8 Sept 2026, so this is the promise to hold to:

> "Rather than putting every gift with purchase live at once and letting them all
> compete for the same attention, we're spotlighting one brand at a time, roughly
> every fortnight... It means your gift gets a proper moment instead of a mention."

- **Cadence: one brand per fortnight.** (The `beauticate-shop-ops` skill still
  says "one brand a week" — outdated, the partner email and the schedule are both
  fortnightly.)
- **Minimum contribution: 20 full-size products.**
- Brands not yet on the schedule can opt in by naming the 20 they'd like to give.

## Part 1 — the programme

### The two spreadsheets

**Schedule sheet** `16FTG9YPgrlpw48_Ll7358xh46CYmLx6NH24C0RlJ3h4` — the live
rotation, and the link brands were given, so treat it as customer-facing.
Columns: Week starting · Brand · Confirm this timing works · Gift SKU / Variant
ID · Units you're funding · How should we describe the gift to customers?

**Master brand sheet** `1vHuV4a4kEBrReP7rP7Igwuct0_7uxWruz5qovaBF5c0` — the
**Sampling Contribution** column is where a brand's gift offer is recorded, in
their own words ("Gifting 10 BB Cream + 10 Bloody Delicious", "Gifting 30
lash/liner combos", "100 units (20 for launch)"). That column is the source for
filling a schedule row.

There is **no Sheets write tool**. Reads go through the Drive connector; writes
are driven through Chrome, or staged as a dated pending-updates file in
`12. Shop/Claude Outputs/` for the next Chrome pass.

### The rotation as it stands

| Week | Brand | Gift |
|---|---|---|
| 9 Sep | BOOIE Beauty | Bloody Delicious illuminator, Champagne — **ran** |
| 23 Sep | Saint Louve | 30ml Vitamin B3/B5/HA Hydrating Serum |
| 7 Oct | Rest | an eye mask — menopause month |
| 21 Oct | buj | full-size body product — Breast Cancer Awareness Month |
| 4 Nov | St. Louis Says | Resurrection Repair Treatment Mask |
| 18 Nov | BonWellness | assorted full-size pack, TBD |
| 2 Dec | Estetika | Burgundy MINEE with Gold Chain |
| 16 Dec | Subtle Energies | Aura Balancing Mist |
| 30 Dec | Lash Armour | lash and liner combo — party season |
| 13 Jan 2027 | Tulita | Discovery Kit |
| 27 Jan 2027 | Sunescape | full-size Instant Self Tan Mousse |

**Inserting a brand mid-rotation: move the unanchored ones, never the anchored
ones.** Rest was added at 7 Oct for menopause month. The instinct is to push
everything below down a slot, but that would have dragged buj out of Breast
Cancer Awareness Month, which is the only reason it sat on 21 Oct. So buj held
its date and St. Louis Says moved back instead. Check for a seasonal anchor
before shifting anyone, and remember three slots in three weeks breaks the
fortnightly rhythm partners were promised.

**Watch the year when typing dates.** Every row was entered with the current
year defaulted in, so the January slot was stored as 13/01/**2026** rather than
2027 — a year in the past, sorting and reading wrong. Type the full date.

**Check two columns before every slot.** As at Sept 2026 only BOOIE has confirmed
its timing, and **every future row has an empty Gift SKU / Variant ID**.

That column is the bottleneck, but not because the work is hard. Our side is
minutes: the `GWP_OFFERS` entry, the terms page, the BXGY discount and the
delivery profile are all quick, and steps 1 to 6 below can be done in one sitting.
**The lead time is entirely the brand.** They have to create the $0.01 gift SKU
their end and let it sync through Modern Dropship before any of it can be wired
up, and that is a favour being asked of someone else's warehouse team.

So chase the SKU a fortnight out. Not because it takes a fortnight, but because
the brand might.

### When a new brand is onboarded

Offering a gifting slot is part of onboarding, not an afterthought:

1. **Offer the slot** once they're live on the shop, and ask which **20 full-size
   products** they'd like to fund.
2. **Record the offer in the master sheet**, Sampling Contribution column, in
   their words, with the date.
3. **Add a row to the schedule sheet** at the next free fortnight, and fill Units
   and the customer-facing gift description.
4. **Ask them to confirm the timing**, and note it in the Confirm column.
5. **Start the gift SKU** (Part 2) as soon as the date is agreed.

Time a slot to the brand where there's a reason — buj to Breast Cancer Awareness
Month, Lash Armour to party season. It makes the content write itself.

### Checking the email

Brand replies arrive against the partner-wide sends, not in a tidy thread. Search
Gmail for `("gifting suite" OR "gift with purchase" OR GWP)` plus the brand
domain, and check the **"Gifting Suite and EAN Barcodes"** thread (8 Sept 2026,
BCC to 24 partners) which carries most of the responses.

What to pull out and action:
- **Timing confirmations or clashes** → Confirm column, or move the slot.
- **What they'll fund**, if it differs from the sheet → master sheet and schedule.
- **Questions that went unanswered.** Dynamic Duo asked on 8 Sept whether the
  gifting suite meant the products they'd already sent for the Collective. Still
  unanswered at the time of writing.
- Note that the same email also asked every brand for **EAN/UPC barcodes**, so
  replies often mix the two. Don't lose the gift detail in a barcode email.

Per `beauticate-shop-ops`: emails are drafted, never sent.

## Part 2 — running one slot

### Setup, roughly a week ahead

1. **Brand creates the gift SKU at $0.01**, never $0.00 — Modern Dropship can't
   process a zero-priced line. It must sync through MD so it carries a
   Convictional id. Put the SKU and variant id in the schedule sheet.
2. **Tag it `gwp-hidden`** so it stays out of listings, search and the sitemap,
   and its own PDP 404s.
3. **Shopify BXGY automatic discount** takes $0.01 off one of the *brand's*
   products, never off the gift line. BOOIE's was
   `gid://shopify/DiscountAutomaticNode/1328198615109`. Zeroing the gift line
   recreates the $0.00 case MD can't process, and MD invoices us from the line price.
4. **Gift goes in the same delivery profile as the brand's products.** BOOIE's
   sat in General ($11) while its products were free shipping, which would have
   charged $11 for accepting a free gift.
5. **Add the offer to `GWP_OFFERS` in `lib/gwp.ts`** — vendor, gift ids, copy,
   `minSpend`, optional `startsAt`/`endsAt`. One entry is the whole config.
6. **Update `app/competitions/terms/page.tsx`** — the `gwp` object carries brand,
   gift, value, min spend, allocation and `status`. These are the published terms.

### The two lanes

**Cart lane — the one that works.** `lib/gwp-cart.ts` reconciles every cart
response, so the gift is a property of the cart's contents rather than of a
button. Anyone reaching www.beauticate.com gets it, including people arriving
from an Instagram link.

**Warehouse lane — built, never switched on.** `lib/gift-campaign.ts` emails the
brand's warehouse for orders the cart can't reach (native Instagram Shopping
checkout). It needs `SHOPIFY_ADMIN_API_TOKEN`, `SHOPIFY_WEBHOOK_SECRET` and a
Resend key; check `GET /api/webhooks/orders-created`. It has never needed to
fire — every BOOIE order came through the cart. Use the `booie-gift-sweep` skill
rather than standing up three integrations for a fortnight.

### The minimum spend is the single biggest lever

BOOIE launched with no minimum. Six gifts went in two hours to a soft-launch
audience, and a $39 illuminator went out on a $21 brow gel. A **$45 minimum**
added mid-day one:

| | Orders | Average |
|---|---|---|
| Before | $31, $31, $45, $39, $21 | **$35** |
| After | $70, $74, $45, $98, $45 | **$66** |

Set it **just above the brand's hero single product**, so that item still
qualifies alone and everything cheaper nudges a second piece. `minSpend` is
measured on that brand's subtotal, never the order total, so another brand's
products can't unlock this gift. If both lanes run, set the same figure in
`lib/gift-campaign.ts`.

### Stock: three numbers, and only one gates the offer

```graphql
{ productVariant(id: "gid://shopify/ProductVariant/<gift>") {
    inventoryQuantity
    inventoryItem { inventoryLevels(first: 1) { edges { node {
      quantities(names: ["available","committed","on_hand"]) { name quantity }
    } } } } } }
```

- **`available`** — what we can still promise. Drops when an order is *placed*.
  **This gates the cart, the banner and `GiftNote`.**
- **`committed`** — ordered, not yet shipped.
- **`on_hand`** — physical units at the brand. Drops only when they pack.

`available = on_hand − committed`, so **our number reads lower than the brand's
during a busy run** and neither is wrong. Explain that before anyone "corrects"
the inventory, and never adjust stock down on a second-hand count.

The brand can move `on_hand` without telling you. Check whether a restock was
loaded **additively or as an absolute level** — 30 more on top of 9 left should
read ~39 available, not 27.

### Never hardcode the offer in content

Article copy can't know the threshold changed or that stock ran out. It just keeps
promising. Six BOOIE stories said "free with any BOOIE order" after the cart had
moved to $45.

**Use `<GiftNote />`** (`components/mdx/GiftNote.tsx`). It takes every word from
`GWP_OFFERS` and renders **nothing** when there's no live offer or the gift is out
of stock, self-correcting within about five minutes with no deploy. Same principle
for `GiftBanner` on product pages and the cart drawer.

**Keep the offer out of metadata.** Brands paste the promotion at the top of every
product description, and meta/`og:description`/Product JSON-LD took the first 160
characters of it. Google indexes that for weeks, Facebook caches `og:description`
once. `lib/product-description.ts` strips leading offer sentences. Leave the
on-page description alone.

### The editorial push

The gift is a reason to launch a takeover, not a substitute for traffic. BOOIE did
13 gift orders on day one and almost nothing on day two, because the content had
run, not because the gift had.

- **Repromote the brand's whole back catalogue**, not one article.
- **Put the `<CollectionRail>` near the top**, under the opening image or second
  paragraph. At the foot it's below where most readers stop.
- **Make every product mention shoppable** — `<InlineProduct>` or `<ShopItem handle>`.
- **Six or more `product_links` auto-generates `/shop/moments/<slug>`**, a free
  shoppable landing page per article.
- **Ed's note rule applies.** In a bylined first-person interview the offer is
  Beauticate's voice, never the subject's.
- **Ask Sig before putting shop products in anyone else's bylined article.** It is
  a case-by-case call, every time — some contributors are happy to have products
  under their name, some have not agreed to recommend anything. Name the products
  and ask whether they're happy, and whether it should read as theirs or as the
  team's. A takeover is not a licence to make every byline shoppable. If the
  answer is "ours, not theirs", set `curator_exclude: true` as well as the Ed's
  note — without it the products land on `/shop/curators/<author>` as that
  person's own picks, where no Ed's note can reach them.
- **`hero_title` and `hero_eyebrow` are temporary carousel overrides**, leaving the
  article's real headline alone. Deleting two lines ends it.
- **Don't put the brand in a headline the story doesn't support.** The Celeste
  podcast episode never mentions BOOIE, so the eyebrow carried the merchandising
  and the headline stayed true.
- Ask the brand to reshare, collaborate on socials, and link back from their own
  EDM or site. That was promised in the partner email.

### Watching it burn down

Cron a check on `sku:<gift>` — every 20 minutes while it's moving, every few hours
once it settles. Notify at 3 or fewer and again at zero.

| | |
|---|---|
| `GiftNote`, `GiftBanner`, cart line, cart reconciler | **automatic** at zero stock |
| Meta/OG descriptions | already clean |
| Hero slides, terms page, product descriptions, schedule sheet | **manual** |

The hero is the one that gets forgotten, because an old story keeps leading the
homepage for a promotion that has ended.

### Closing a slot

1. `status: 'open'` → `'closed'` in `app/competitions/terms/page.tsx`.
2. Demote the hero slides, drop the temporary `hero_title`/`hero_eyebrow`.
3. Delete the BXGY cent-offset discount in Shopify — the only piece that never
   cleans itself up.
4. Ask the brand to strip the offer line from their product descriptions.
5. Mark the slot done in the schedule sheet and log results in the master sheet.
6. Send the brand a short results note: orders, sell-through, average order value
   before and after the minimum, and what the takeover involved.

Leave `/terms` alone — "from time to time we run a gift with purchase" is evergreen.

**Don't ask a brand for more stock mid-run.** Selling through the allocation is the
stronger story and the better position for the next one. BOOIE offered another 30
unprompted after seeing the numbers.

## What actually happened — BOOIE, September 2026

- 22 units funded, 2 for testing, **20 for the promotion**. Later topped up to 52.
- **11 gift orders in the first two days**, $544, all fulfilled.
- Six of those in the first two hours, to a WhatsApp group and a close-friends
  Instagram channel only.
- $45 minimum added on day one: average order **$35 → $66**.
- Day two: no gift orders at all, with stock remaining. The content had stopped,
  not the offer.
- Contacts: `jasmin@booie.com` orders and warehouse (cc `tayla@booie.com`),
  `monika@booie.com` brand and marketing, `indiana@booie.com` social.

### Mistakes worth not repeating

- Six articles promised the gift with no minimum while the cart enforced $45.
- The product banner said "Spend $45" and "free with any BOOIE Beauty order"
  three lines apart.
- The offer was served as the meta description of ~50 products.
- `on_hand` was read as physical stock and compared against the brand's count,
  producing a discrepancy that never existed.
- A restock was announced as "another 30" but loaded as an absolute level, leaving
  the shop 12 short of what had been agreed.
