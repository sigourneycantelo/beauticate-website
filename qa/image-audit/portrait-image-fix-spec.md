# Beauticate — In-body Image Classification & Portrait Fix Spec

**Mode:** read-only classification pass. Nothing in the repo was edited.
**Scanned:** 1,846 `content/**/*.mdx` articles, images resolved from `public/content`
(17,892 files; sampled refs resolved 100%), true orientation read with PIL.
**Companion data:** `article-image-classification.csv` / `.json` (one row per article).

---

## 1. Summary counts

| Bucket | Count | Meaning |
|---|---:|---|
| **Correct** | 722 | No image/caption defect detected: no images, only landscape plain-md images (fill the body measure = fine), consecutive-image galleries, or images already routed through a portrait-aware component. |
| **Broken** | 1,123 | Splits into two very different causes — see below. |
| **Uncertain** | 1 | Can't confidently call it. |

**The "broken" 1,123 is dominated by ONE systemic issue, not 1,123 hand-fixes:**

| Cause | Articles | Nature |
|---|---:|---|
| `portrait-render` (systemic) | **1,120** | Portrait photos placed as plain markdown `![]()`. Fixable in **one global change**, no per-file editing. |
| `content-defect` (genuine) | **3** | Real per-article breakage: a TIFF that won't render, and product-page URLs used as image `src`. |

Per-category (broken is almost all systemic-portrait):
`beauty-style` 594 broken / 277 ok · `interviews` 255 / 120 · `destinations` 103 / 168 ·
`wellness` 87 / 52 · `living` 48 / 29 · `sigourneys-edit` 30 / 33 · `vodcast` 6 / 37.

---

## 2. The core finding (portrait images)

Across all resolved in-body images: **8,882 portrait vs 3,187 landscape vs 897 square.**
Portrait intrinsic widths cluster hard at the low end — **median 300px, p25 300, p75 600, max 4480.**
Most portraits are ~300px WordPress "medium" thumbnails.

**Why they look inconsistent (confirmed from code, not a live screenshot):**
- `ArticlePage.tsx` has **no `img:` override** in its MDX component map, so a plain
  `![]()` renders as a bare `<img>` via `@tailwindcss/typography`.
- `tailwind.config.ts` typography block sets **no `img` width, display, or centering**.
- Body is a CSS grid `1fr min(720px,100%) 1fr`; a plain image lands in the 720px column.

Result: a **300px** portrait renders at **300px, inline, left-flush** ("tiny, left-aligned").
A **>720px** portrait is capped to 720px and **dominates the column**. Same markup, wildly
different sizes → the inconsistency you described.

> Verification note: this is **inferred from CSS/code**, verified against the tailwind
> config and the MDX component map — not from a live render (the browser tool was
> unavailable during this pass). The URLs in §5 let you confirm by eye on the live site.

**What the hand-fixed articles show:** portraits were fixed **four different ways** —
`<Portrait side>` (float ~360px, alternating, wraps text — 11 files), `<InlineImage width>`
(fixed px, left — the tattoo progression shots), `<StickyScroll>` (parallax, flight-attendants),
`<PortraitQuote>` (winter edit). No single rule yet — which is what this spec proposes.

---

## 3. Proposed standard portrait rule (needs your sign-off)

> **Landscape (w > h):** full width of the 720px body measure — current plain-markdown
> behaviour is correct. Reserve a 1200px `.article-wide` breakout for hero-grade shots only.
>
> **Portrait (h > w) and square:** route through **one** standard container —
> **centred (`mx-auto`), fixed `max-width: 460px`** (never upscaled past the file's own width),
> white space above/below, caption beneath. **No text wrapping, no left-flush, no alternating float.**
> Identical treatment every time, so a portrait always looks intentional.

`460px` chosen so a 300px thumbnail is centred with breathing room without being upscaled past
its native resolution, and a large portrait is reined in to a consistent, calm column width.

**Recommended implementation (fixes ~1,120 articles at once):**
Add an `img` component to the `mdxComponents` map in `ArticlePage.tsx` that reads intrinsic
dimensions and, for portrait/square, wraps the image in the centred fixed-width `<figure>`;
landscape passes through at full measure. No MDX files need touching.
*(Alternative: bulk-rewrite lone portrait `![]()` → `<InlineImage align="center" width={460} …>`.)*

**Open decision — three docs disagree, you arbitrate:**
- `Component Library` (definitive): Inline Image = *centred, no text wrap* ← this spec follows it.
- `article-layout-tiers.md`: portrait → *sticky-parallax split, alternating sides*.
- `Portrait.tsx` (as built): *float + text wrap*.

Recommendation: standardise the **default** on centred-fixed-width; keep `StickyScroll` and
`PortraitQuote` as deliberate **one-per-story** editorial devices; retire the left-default on
`InlineImage`/`Portrait`-float.

---

## 4. What "broken" does and doesn't include

- **Included:** portrait photos as plain markdown (systemic); TIFF/BMP/HEIC srcs browsers
  can't render; `src` pointing at a non-image path (e.g. `/shop/...`) or with whitespace in it.
- **Deliberately NOT flagged broken:** landscape plain-md images (they fill the measure — fine);
  `.avif`/`.jpe` (render fine — an earlier draft wrongly flagged these, now corrected);
  consecutive-image galleries (handled by `rehype-image-grid`).
- **A caption `**label: **` delimiter detector was tried and REMOVED** — it false-positived on
  legitimate `label: **bold**` openers. Caption-delimiter cleanup needs its own dedicated pass;
  it is *not* covered by these counts.
- **Image position ("is this image in the right place?") is NOT verifiable** in this pass. The
  original WordPress source (the only ground truth) is offline — `beauticate.com` WP REST and
  `/wp-content` now 403/gone — so `compare_article.py`'s position stage can't be re-run. Any
  position judgement would be a guess; it is excluded rather than guessed.

---

## 5. Sanity-check URLs (open on the live site)

**Genuine content defects (3) — need hand fixes:**
- TIFF won't render → https://www.beauticate.com/beauty-style/beauty-tips/our-edit-of-the-12-best-2019-beauty-advent-calendars/  (`clinique.tiff`)
- Product-page URLs used as image src → https://www.beauticate.com/beauty-style/skin-care/these-are-the-exact-products-we-swear-by-to-travel-in-style/  (4×)
- Same, one image → https://www.beauticate.com/beauty-style/beauty-tips/the-beauticate-teams-mothers-day-wishlist/

**Systemic portrait-render (worst offenders — one global fix covers all 1,120):**
- https://www.beauticate.com/beauty-style/hair/oscars-beauty-and-hair-trends/  (53 small portraits)
- https://www.beauticate.com/beauty-style/beauty-tips/christmas-2022/  (38)
- https://www.beauticate.com/beauty-style/makeup/the-makeup-every-woman-should-own-sigourneys-edit/  (33)

**Uncertain (1):**
- https://www.beauticate.com/vodcast/episodes/bianca-dye-on-pressure-performance-and-panic-attacks/  (one large lone portrait — may read fine, may not)

**Reference "already correct" (hand-fixed, for comparison):**
- https://www.beauticate.com/destinations/travel/mondrian-gold-coast-review/  (`<Portrait>`)
- https://www.beauticate.com/beauty-style/makeup/8-flight-attendants-share-their-rigorous-pre-flight-beauty-routines/  (`<StickyScroll>`)
