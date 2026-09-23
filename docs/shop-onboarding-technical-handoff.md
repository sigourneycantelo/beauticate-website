# The onboarding handoff: what the SOP owns, what Claude Code owns

The `beauticate-shop-onboarding` skill runs the commercial and merchandising
side of bringing a brand live — Sig's product trial, terms, the agreement,
tags, descriptions, the brand collection, the editorial plan. It is not
wired into this repo and doesn't touch Shopify's shipping or publication
settings. Claude Code (here) owns the last technical mile: making sure what
the SOP has merchandised is actually visible and actually buyable.

Both IMBIBE (21 September) and the NOHRD/WaterRower EDM list (22 September)
went through the SOP's gates cleanly and still weren't buyable — not because
the SOP missed anything it's meant to catch, but because the last mile has
its own failure modes that only show up once you actually try to buy the
thing. This doc is that last mile, written down so it stops being
rediscovered from scratch each time.

## Why this needs writing down at all

Every fault below produces a normally-rendered page. No build fails, nothing
logs, nothing in Shopify's product admin looks wrong. `resourcePublicationsV2`
empty, `deliveryProfile.originLocationCount: 1`, and a handle that isn't the
one you expect are three different silent failures that all look, from the
product list in Shopify admin, like a perfectly healthy ACTIVE product.

## The handoff packet

When the SOP says a brand is ready to publish, it should be able to hand
Claude Code exactly this, no more digging required:

- The exact vendor string (Shopify `vendor` field, case-sensitive)
- The list of product handles or IDs going live
- Confirmation Gate 5 is closed: the margin in Modern Dropship reads tier + 5,
  not the headline tier. **Claude Code cannot check this** — Carro signs in
  by magic link to Sig's email only.
- Confirmation Gate 7 is closed: Sig has toggled the products live on Modern
  Dropship's Products page. **Claude Code cannot check this either** — it's
  supplier-side, and the toggles don't respond reliably to browser automation
  anyway.
- The delivery profile name Sig assigned in Gate 6 (or "General profile" if
  none was made)

Anything upstream of that — has Sig tried the product, is the agreement
signed and filed, does the brand know its tier — is the SOP's job entirely.
Claude Code has no way to check any of it and shouldn't be asked to.

## What Claude Code runs, every time, before saying "live"

In order, because each check is cheap and the first two catch almost
everything:

**1. Is it published anywhere?**

```graphql
{ products(first: 50, query: "vendor:BRAND") {
    nodes { id title resourcePublicationsV2(first: 5) { nodes { publication { name } } } } } }
```

`[]` means nobody published it — not a caching problem, not a shipping
problem, the Storefront API cannot see it and the page 404s. Publish to the
same seven channels every working product uses: Point of Sale, Shop, Buy
Button, Sell on WordPress, **Beauticate Shop**, Facebook & Instagram,
Pinterest. Beauticate Shop is the one that matters — it's the custom
publication the site's Storefront token actually reads from, not Online
Store, and Online Store's publish state tells you nothing about whether the
site can see the product (see `lib/shopify.ts` — the storefront token is
scoped to Beauticate Shop). The brand's own smart collection needs the same
publish; a collection can exist, have a great description, and still be on
Online Store only.

This was the fault on both IMBIBE (18/18 products, zero channels) and every
one of the 20 NOHRD/WaterRower products the 22 September EDM depended on. It
is the more common of the two faults in this doc — check it first.

**2. Is the delivery profile's origin actually the brand's location?**

```graphql
{ deliveryProfile(id: "gid://shopify/DeliveryProfile/…") {
    name originLocationCount unassignedLocations { name } } }
```

`originLocationCount: 1` (or the brand's fulfilment location showing up in
`unassignedLocations`) means the profile can't ship from where the stock
actually is. Full detail and the fix: `docs/shop-delivery-profiles.md`. This
has now hit NOHRD/WaterRower twice on two different auto-created freight
tiers, Christophe Robin, IBIZA HAIR, and would have hit IMBIBE if it hadn't
been caught first.

**3. Does the handle Sig/the EDM/the brief expects actually exist?**

A freshly-synced product can land on a **suffixed** handle
(`triatrainer-walnut-artificial-leather-6aa8ecf2706ec16bbff96ec3`) instead of
the clean one everyone assumes
(`triatrainer-walnut-artificial-leather`), because the clean handle was
already taken — usually by an old, drafted or deleted record with the same
title. Query by SKU or product ID to find the real, current handle; never
assume the clean-looking one resolves. This is exactly the kind of thing that
breaks a hardcoded EDM or social link while the product page itself is
completely fine. Check it whenever a "brand new handle" note appears in a
brief, and before handing anyone a URL to put in front of customers.

**4. Prove it, don't infer it**

`availableForSale: true` on the product query is not proof — it's the exact
field this whole class of bug can be wrong about. The only real test is
whether a cart will actually take the line item:

```bash
node scripts/audit-cart-availability.mjs
```

One `cartCreate` probe per brand (a delivery profile covers a whole brand, so
one probe answers for all of it). Reports what it found even if Shopify's
rate limit cuts the run short (exit 2, not a crash). Run it after fixing 1–3,
and after any brand onboarding, freight-tier creation, or "why is this sold
out" report — not just once, as a rule.

## The one thing that would make step 1 fully self-running

Steps 1 and 2 above require Shopify Admin scopes (`read_publications`,
`read_shipping`) that this repo's own Products app doesn't have — today
they're run live, through the Shopify connector, not as a standalone script.
If it's worth making `scripts/audit-cart-availability.mjs` (or a companion)
check publication state on its own, those two scopes need adding to the
Products custom app in Shopify admin. That's a deliberate call for Sig, not
something to grant unasked.

## What to tell Sig before any onboarding starts

The one thing neither agent can do for her: **Gate 1, the product trial, and
Gate 7, the curated shortlist, are hers alone.** Nothing should proceed past
"send me the product" without her having tried it, and nobody should pick
which of a brand's SKUs actually go in the shop except her — a brand's full
catalogue carries US-market duplicates, sample SKUs and category overlap with
what's already stocked, and picking the edit is the curation the shop is
supposed to represent. Beyond that, before an onboarding starts she needs
only what Gate 8 already asks for: returns policy, barcodes, gift-with-
purchase capability, and founder + lifestyle imagery (or an explicit "still
waiting on it" — nobody fabricates a real person's photo). Everything else in
between is exactly what the two agents are for.
