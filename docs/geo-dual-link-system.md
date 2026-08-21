# Geo dual-link system

Beauticate's audience is Australia-led with a real US slice and some UK. Almost
every product link, and the whole shop, points at Australian retailers. So an
international reader lands on a shop they cannot buy from, and we earn nothing.

The model is **two lanes, not one per country**:

| Lane | Who | Where they go |
| --- | --- | --- |
| **Home** | AU, NZ | The Beauticate Shop, Adore, direct margin. Untouched. |
| **Intl** | everyone else | A retailer that ships to them, monetised by affiliate. |

Dedicated markets get added only once they earn one. Today US and GB have
hand-picked slots; everyone else falls through to a generic `default` entry.

## How it works

```
middleware.ts          reads x-vercel-ip-country -> writes the bc-country cookie
  |
lib/geo.ts             country -> lane ('home' | 'intl') + targeted market
  |
data/link-database.json    the vault export: AU link -> intl link, per product
  |
lib/product-links.ts   build time: resolve each product's intl destination and
                       bake it into the card as a data-intl attribute
  |
components/geo/GeoProvider.tsx
                       client: read the cookie, swap the hrefs
```

### Why the swap happens on the client

Article pages are CDN-cached. Reading `headers()` inside a page to get the
country would make every response vary by visitor and throw away that cache, on
a site with thousands of articles. Instead the HTML stays country-agnostic and
identical for everyone, and only the `href` changes after hydration. Nothing
visible moves, so there is no flash.

The one place a visible change happens is the shop buy box, where an
international visitor sees "Shop via {retailer}" instead of "Add to cart". That
renders the AU view first and swaps on hydration, which is the deliberate
trade for keeping product pages cacheable.

## The link database

`data/link-database.json` is the machine-readable mirror of the Affiliate Vault
Google Sheet. Humans edit the sheet, code reads the JSON, both from one source.

Resolution order, first hit wins:

1. `products` — a hand-picked intl link for that exact product (hero tier).
2. `brands` — the brand's own intl store, keyed by the AU link's host.
3. `retailerMap` — AU retailer to intl retailer search, keyed by AU host.
4. nothing — the AU link is left bare and Skimlinks monetises it.

```jsonc
"products": {
  "augustinus-bader-the-rich-cream": {
    "name": "Augustinus Bader The Rich Cream",
    "auUrl": "https://www.mecca.com/en-au/augustinus-bader/the-rich-cream-V-060052/",
    "intlUrl": {                       // or a plain string for all intl markets
      "US": "https://www.sephora.com/product/the-rich-cream-P454312",
      "default": "https://augustinusbader.com/products/the-rich-cream"
    },
    "intlRetailer": "Sephora",
    "tier": "hero",
    "deepLinkSupported": true
  }
}
```

Matching is by **destination URL**, not by slug, so the same product resolves
whether the article links to it bare or through a Skimlinks, Commission Factory,
Impact, Awin or Partnerize wrapper. Use `auUrls: []` when one product is linked
several different ways.

### `verified` is a safety gate

Entries in `retailerMap`, `brands` and `shop` are **inert until
`"verified": true`**. An unverified entry falls through to the next layer, so an
unchecked URL can never reach a reader. Deep-linking has to be enabled per
merchant, and a link that silently bounces to a retailer's homepage is worse
than no link at all.

```bash
node scripts/verify-intl-links.mjs          # check unverified entries
node scripts/verify-intl-links.mjs --all    # re-check everything
node scripts/verify-intl-links.mjs --write  # flip passing entries to verified
```

Run it from a normal network. Sandboxes and CI commonly block retailer domains
outright, which reads as a failure when the link is fine.

The retailer search patterns shipped in `retailerMap` are seeded from the AU to
US/UK mapping (Mecca and Adore to Sephora US or Dermstore, Chemist Warehouse and
Priceline to Ulta, David Jones and Myer to Nordstrom, The Iconic to Revolve) but
**none of them are verified yet**. Until someone runs the script on an
unrestricted network, every one of them is inert and the long tail simply stays
on its AU link for Skimlinks.

## The shop for international visitors

The shop ships within Australia only: a single General shipping profile, with
fulfilment routed to partner brands through Modern Dropship. Carro routes, the
brand ships, so international selling is a per-brand decision rather than a
switch anyone can flip.

Rather than show international visitors a checkout that cannot fulfil, the buy
action is substituted (`lib/shop-intl.ts`, wired through `ProductPage` into
`ProductBuyBox`):

- a verified stockist for their market, so they see "Shop via {retailer}";
- otherwise an honest note that we ship within Australia and New Zealand.

The shop is never hidden. `shop.byHandle` wins over `shop.byVendor`.

## Skimlinks

The Skimlinks/Sovrn script (publisher `265664X1750758`) is loaded site-wide in
`app/layout.tsx`. It auto-monetises bare retailer links, which is the long tail
we have not hand-mapped. It deliberately does **not** replace the money links:
Partnerize on Adore Beauty and Sephora AU, and the direct brand programmes, pay
better and stay exactly as they are.

## Testing a country locally

Vercel only sets `x-vercel-ip-country` in production. To preview a lane, set the
cookie by hand in the browser console and reload:

```js
document.cookie = 'bc-country=US; path=/'   // then reload
document.cookie = 'bc-country=AU; path=/'   // back to the home lane
```

## Still to do

- Populate `products` from the vault export, hero products first.
- Verify the `retailerMap` search patterns and flip them on.
- Populate `shop.byVendor` so international shop visitors get a real stockist
  rather than the AU-only note.
- The 6,807 inline body links in MDX are not yet covered. Only the 891
  structured product components are. Inline links can reuse the same
  `data-intl` attribute once there is data behind them.
