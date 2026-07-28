# Spec — Redirect `beauticate.shop` → internal `/shop`

| | |
|---|---|
| **Owner** | Sigourney Cantelo (Beauticate) |
| **For** | Redfern (implementation) |
| **Date** | 28 July 2026 |
| **Status** | Ready for implementation |
| **Related** | Site-side link fixes already shipped (commit `ccfcf6a64`) — all article/app links now point at `beauticate.com/shop`. This spec covers the domain layer only. |

---

## 1. Objective

Anyone who lands on the standalone Shopify storefront **`beauticate.shop`** should be **301-redirected to the equivalent page on `https://www.beauticate.com/shop`**, our internal, editorial shop experience.

The one hard rule: **this must not break the ability to buy.** Checkout and the Storefront API are served from the Shopify domain, and the live beauticate.com shop depends on them. See §3.

## 2. Background / problem

`beauticate.shop` is our live Shopify store. It was linked directly from years of articles, so brands (and customers) were landing on the **raw Shopify storefront** and assuming *that* was "the new Beauticate shop", bypassing the curated experience on beauticate.com entirely.

The site codebase has been cleaned up — every internal link now points at `beauticate.com/shop/...`. What remains is inbound traffic: old external links, brand bookmarks, and search-engine results still pointing at `beauticate.shop`. Those need to be caught and redirected at the domain level, which is outside the website repo.

## 3. ⚠️ Hard constraint — do NOT redirect the API or checkout

The beauticate.com shop is **headless**: it fetches products and creates carts through Shopify's **Storefront API**, then sends customers to Shopify's **hosted checkout** to pay. Both of those live on the Shopify domain.

- Storefront API calls go to `https://<STORE_DOMAIN>/api/2024-10/graphql.json`
  (`STORE_DOMAIN` = the `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` env var in Vercel).
- Checkout happens at the `checkoutUrl` returned by that API (Shopify-hosted, `/checkouts/...`).

**➡️ PREREQUISITE — confirm the value of `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` in Vercel before doing anything.** It is one of two things, and the answer decides the whole approach:

| If `STORE_DOMAIN` is… | Then… |
|---|---|
| **`*.myshopify.com`** (e.g. `beauticate.myshopify.com`) | ✅ Clean. The public `beauticate.shop` domain carries **no** live API/checkout traffic, so it can be redirected wholesale (still exclude the carve-outs in §5 as belt-and-braces). **Preferred state.** |
| **`beauticate.shop`** | ⚠️ The public domain is also the API/checkout host. A blanket redirect would **take the live shop down**. Either (a) **switch the env var to the `*.myshopify.com` domain first** (recommended — then treat as the row above), or (b) keep the strict carve-out list in §5 so `/api/*`, `/checkouts/*`, `/cart`, etc. are never redirected. |

Recommendation: **move `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` to the `*.myshopify.com` domain** (if it isn't already) so the customer-facing `beauticate.shop` domain is purely a redirect surface with nothing live behind it. Simplest and safest.

## 4. Redirect map

301 (permanent). `*` = trailing wildcard; the matched tail is appended to the target.

| From (`beauticate.shop`) | To (`https://www.beauticate.com`) |
|---|---|
| `/products/*` | `/shop/products/*` |
| `/collections/*` | `/shop/collections/*` |
| `/` (home) | `/shop` |
| *(optional, if the Shopify store has these pages)* | |
| `/pages/shipping` | `/shop/shipping` |
| `/pages/returns` or `/policies/refund-policy` | `/shop/refund-policy` |
| `/pages/how-it-works` | `/shop/how-it-works` |
| `/pages/free-shipping` | `/shop/free-shipping` |
| **anything else not carved out in §5** | `/shop` (catch-all fallback) |

Handles are identical between Shopify and beauticate.com (the internal shop reads the same Shopify handles), so `/products/christophe-robin-...` maps 1:1.

## 5. Carve-outs — never redirect these paths

These must continue to resolve on the Shopify domain, or the live shop and checkout break. Applies **only** if `STORE_DOMAIN` = `beauticate.shop` (§3, option b); if the API/checkout host is the `myshopify.com` domain, these paths carry no traffic but excluding them is still good hygiene.

| Path pattern | Why |
|---|---|
| `/api/*` | **Storefront API** — the entire beauticate.com shop reads product/cart data from here |
| `/checkouts/*`, `/checkout`, `/checkout/*` | Hosted checkout (where customers pay) |
| `/cart`, `/cart/*` | Cart / cart permalinks |
| `/account`, `/account/*` | Customer accounts, order status, returns portal |
| `/cdn/*` | Shopify asset/image CDN |
| `/apps/*`, `/tools/*`, `/services/*` | App proxies and Shopify service routes |
| `/wpm/*`, `/.well-known/*` | Web-pixel manager, domain verification |
| `/password` | Storefront password page (if enabled) |
| `/admin`, `/admin/*` | Shopify admin |

## 6. Implementation options

### Option A — Shopify native URL Redirects *(recommended if store stays on Shopify DNS)*

Online Store → Navigation → **URL Redirects** (or bulk CSV import). Shopify supports a single trailing wildcard.

**Important gotcha:** a Shopify URL redirect only fires when the path would otherwise **404**. If a product page still renders on the Online Store, the redirect is skipped. So for this to work, **unpublish products/collections from the _Online Store_ sales channel** while keeping them on the **Headless / Storefront API** channel (which is what beauticate.com uses). Result: storefront pages 404 → redirects fire; API + checkout keep working via the headless channel.

- Real 301s, native to Shopify, no extra infra.
- Verify after unpublishing: beauticate.com shop still lists products and can complete a checkout (it should — the headless channel is independent).

### Option B — Edge redirect (Cloudflare / reverse proxy) *(if `beauticate.shop` DNS is on Cloudflare or similar)*

Do the 301s at the edge with a rule list: apply §4, skip §5. Cleanest true-301 behaviour, doesn't depend on Shopify product publication state. Requires the domain to sit behind the edge provider. Sample rule in Appendix B.

### Option C — Theme-level redirect *(not recommended)*

Redirect from `theme.liquid`/JS. Liquid renders HTTP 200, so this ends up a client-side or meta-refresh redirect — bad for SEO and slower for users. Only a last resort.

**Recommendation:** Option A if the store remains on Shopify-managed DNS; Option B if `beauticate.shop` is already fronted by Cloudflare. Either way, complete the §3 prerequisite first.

## 7. SEO requirements

- Use **301 (permanent)**, not 302 — passes link equity to beauticate.com.
- Once redirects are live and stable, submit the change / re-crawl in Google Search Console for `beauticate.shop` so the index updates to the beauticate.com URLs.
- Site-side, the beauticate.com shop product pages already emit `canonical` tags pointing at themselves — good.
- Minor: `beauticate.shop` is still listed in the Organization `sameAs` schema on beauticate.com (`app/layout.tsx`). Optional — decide whether to keep it as an associated domain or remove it once it's purely a redirect. Not blocking.

## 8. Test / acceptance checklist

- [ ] `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` confirmed; if it was `beauticate.shop`, moved to `*.myshopify.com` (or §5 carve-outs verified in place).
- [ ] `beauticate.shop/products/<any-handle>` → 301 → `www.beauticate.com/shop/products/<handle>`.
- [ ] `beauticate.shop/collections/<any-handle>` → 301 → `www.beauticate.com/shop/collections/<handle>`.
- [ ] `beauticate.shop/` → 301 → `www.beauticate.com/shop`.
- [ ] A random unknown path (e.g. `beauticate.shop/foo`) → 301 → `www.beauticate.com/shop`.
- [ ] **Full purchase on beauticate.com succeeds end-to-end** (add to cart → checkout → payment) — the single most important check.
- [ ] beauticate.com shop still lists products and prices (Storefront API unaffected).
- [ ] Redirects return **301**, not 302 (check response headers).
- [ ] Carve-out paths (`/api/*`, `/checkouts/*`, `/cart`, `/account`) still resolve on Shopify (not redirected).

## 9. Open questions for Redfern

1. **What is `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` set to in Vercel?** (Decides Option A vs B and whether the env var should move first — §3.)
2. **Where does `beauticate.shop` DNS live** — Shopify-managed, or fronted by Cloudflare/another proxy? (Decides Option A vs B.)
3. **Is `shop.beauticate.com` a live subdomain?** It appears **nowhere** in the website code, so nothing we control points at it. If it's a Shopify domain alias, apply the same redirect treatment; if it was never set up, brands may just be guessing the URL — worth confirming so we can point it (or a DNS record) at beauticate.com too.

---

### Appendix A — Shopify URL Redirects (CSV for bulk import)

Online Store → Navigation → URL Redirects → Import. (Only fires on 404s — see Option A.)

```csv
Redirect from,Redirect to
/products/*,https://www.beauticate.com/shop/products/*
/collections/*,https://www.beauticate.com/shop/collections/*
/,https://www.beauticate.com/shop
```

### Appendix B — Cloudflare (Bulk Redirect / Ruleset) illustration

Pseudo-rule for an edge redirect with carve-outs:

```
# Skip anything that must stay on Shopify
if http.request.uri.path matches "^/(api|checkouts?|cart|account|cdn|apps|tools|services|wpm|\.well-known|password|admin)(/|$)"
    → no action (pass through to Shopify)

# Product & collection pages → internal shop (301, preserve tail)
if path matches "^/products/(.*)$"     → 301 https://www.beauticate.com/shop/products/$1
if path matches "^/collections/(.*)$"  → 301 https://www.beauticate.com/shop/collections/$1

# Everything else → shop home (301)
default                                → 301 https://www.beauticate.com/shop
```

*(Cloudflare Bulk Redirects don't support regex capture on the Free plan; a Redirect Rule / Transform Rule or a small Worker is needed for the wildcard tail. Redfern to pick the mechanism that fits the plan.)*
