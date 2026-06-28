# Placeholder hero images (blank/beige squares)

## STATUS (2026-06-28): 11 fixed, 3 still need a supplied image

✅ **Fixed** (commit 717dbaa81) — promoted a hand-picked in-article photo to the hero:
beauticate-collective, best-ai-image-generator, dyson-supersonic-r, last-minute-christmas-gifts,
magnesium-pools, what-to-watch-and-listen-to-over-the-break, kate-waterhouse-style-beauty,
susan-yara-reinvention-podcast (interview), pool-accessories, winter-beauty-rituals, qure-shower-filter-review.

⚠️ **Still need a supplied image** (no usable in-article photo):
- `beauty-style/skin-care/the-new-approach-to-layering-skincare` — only product/texture shots
- `vodcast/episodes/guy-sebastian-on-fame-family-fragrance` — no body image → podcast artwork
- `vodcast/episodes/susan-yara-on-reinvention-resilience-and-rebuilding-trust` — only an ad → podcast artwork

Re-run detector anytime: `node scripts/audit-placeholder-heroes.mjs`

---

## Original list — 14 live

Detected with `node scripts/audit-placeholder-heroes.mjs` (flags heroes whose
colour variance / stdev is near-zero, i.e. solid-colour placeholders). All are
`published: true` and visible on category pages. `body-imgs` = real photos
already present in the article that could be promoted to the hero.

| Article | Path | body-imgs |
|---------|------|-----------|
| Meet The Beauticate Collective | beauty-style/beauty-tips/beauticate-collective-editors-experts | 11 |
| This Isn't Really Me (AI image generator) | beauty-style/beauty-tips/best-ai-image-generator-app-review-glam-ai | 9 |
| The Supermodel Blowout (Dyson) | beauty-style/beauty-tips/dyson-supersonic-r-hair-dryer-review | 12 |
| The Calm, Last-Minute Christmas Guide | beauty-style/beauty-tips/last-minute-christmas-gifts | 24 |
| Wellness Water (Magnesium Pools) | beauty-style/beauty-tips/magnesium-pools-wellness-design-australia | 9 |
| Thin Is In (Layering Skincare) | beauty-style/skin-care/the-new-approach-to-layering-skincare | 8 |
| What To Watch & Listen To Over The Break | interviews/actors-presenters/what-to-watch-and-listen-to-over-the-break | 11 |
| Kate Waterhouse On The Joy Of Dressing Up | interviews/creatives/kate-waterhouse-style-beauty | 15 |
| Susan Yara on Reinvention (interview) | interviews/founders/susan-yara-reinvention-podcast | 8 |
| The Pool Accessories That Changed Our Lives | living/outdoors/pool-accessories-that-changed-our-lives | 9 |
| Winter Beauty Rituals | sigourneys-edit/edit/winter-beauty-rituals | 6 |
| Is Your Shower Water Ruining Your Hair? | sigourneys-edit/qure-shower-filter-review | 7 |
| Guy Sebastian on Fame, Family & Fragrance | vodcast/episodes/guy-sebastian-on-fame-family-fragrance | **0 — needs supplied image** |
| Susan Yara on Reinvention (vodcast) | vodcast/episodes/susan-yara-on-reinvention-resilience-and-rebuilding-trust | 3 |

Note: the two **Susan Yara** entries (interviews + vodcast) may be duplicates — worth checking which to keep.
