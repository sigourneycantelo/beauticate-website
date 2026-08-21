# SEO recovery worklist — 12 pages

Built 21 August 2026 from live Search Console data (`sc-domain:beauticate.com`),
comparing a pre-migration baseline (5 May to 15 Jun) against 8 Jul to 18 Aug,
with a post-sitemap-fix check on 13 to 18 Aug.

## Before you start: what is already done

- **Rankings were never lost.** Average position held through the migration
  (e.g. 6.6 to 6.8, 7.2 to 7.6). The loss was clicks, not standing.
- **The cause was URL duplication.** Each article sat at two or three indexed
  URLs at once and split its own clicks. The broken sitemap stopped Google
  resolving it.
- **The 13 August fix worked.** In the six days after it, only 1 of 176 clicks
  across the priority list still landed on a duplicate. All twelve pages below
  now serve on a single URL.
- **Metadata is complete.** `seo_title`, `meta_description`, `faqs` and
  `date_modified` are at 98 to 100% across the priority list.

So this is **not** a duplicate-cleanup list any more. It is a click-through list.

## Rules that apply to every page here

1. **Direct-answer opening.** The first 40 to 60 words must answer the target
   query in plain sentences, before any scene-setting. This is the single
   highest-leverage edit and it is what gets pulled into AI Overviews. See
   `docs/article-seo-optimization.md` Part 6.1.
2. **One H2 phrased as the query.** Use the searcher's words, not ours.
3. **Do not re-date the article** unless the content genuinely changed.
   Freshness is not a ranking factor and a false `date_modified` just spends
   trust.
4. **Video only where noted.** Embedding a YouTube URL in the body is enough —
   `lib/seo.ts` auto-emits `VideoObject` schema, no frontmatter field needed.
   Use each video on one article only; reusing it across pages means Google
   picks one and ignores the rest.
5. **`focus_keyphrase` is planning-only.** It is not read anywhere in the site
   code and never reaches Google. Fill it in for editorial discipline, not for
   ranking.

---

## Part A — the five recovery laggards

These carry most of the remaining gap to the pre-migration baseline. All are
consolidated onto one URL now and holding position. They need CTR work, not
restructuring.

### A1. Fine but frizzy hair
`/beauty-style/hair/ive-got-fine-but-frizzy-hair-and-this-is-exactly-what-i-use-to-look-after-it`
- Now: 14 clicks / 1,331 impressions / pos 10.0 (6 days)
- Targets: `fine frizzy hair` (pos 4.9), `thin frizzy hair` (pos 6.6)
- Job: direct-answer opening naming both fine **and** frizzy in the first
  sentence. Add an H2 "What to use on fine, frizzy hair". Good video candidate.
- Skip `frizzy hair` (pos 31) — too far out to chase.

### A2. Under-eye concealer tattoo
`/beauty-style/makeup/i-got-an-under-eye-concealer-tattoo`
- Now: 22 clicks / 934 impressions / pos 6.8
- Job: direct-answer opening on what the treatment is, what it cost, whether it
  worked. Strong video candidate — first-person treatment pieces earn the
  thumbnail.

### A3. Fake tan over an existing tan
`/beauty-style/beauty-tips/should-you-apply-fake-tan-on-top-of-an-existing-tan`
- Now: 9 clicks / 1,619 impressions / pos 7.0
- Job: the title is a question, so answer it in the first line, yes or no, then
  explain. Highest impressions-to-clicks ratio in Part A, so the opening is
  doing the least work here of anywhere on the list.

### A4. Italian hair products
`/beauty-style/hair/the-best-italian-hair-products-and-secrets-you-need-to-know`
- Now: 20 clicks / 1,033 impressions / pos 6.0
- Job: direct-answer opening. Best position on the list, so CTR work pays
  fastest here. Also the top affiliate earner on the priority list (384
  clicks/yr) — prioritise dual links on this one.

### A5. Stella Kim — **deprioritise**
`/interviews/tastemakers/stella-kim`
- Now: 5 clicks / 920 impressions / pos 9.8
- The impressions are largely for a **different Stella Kim** (`stella kim snsd`
  is the K-pop singer). That traffic was never ours and is not recoverable.
- Job: nothing. Do not spend a refresh on this. Its apparent "loss" is a
  measurement artefact.

---

## Part B — the seven buying-intent pages

Eleven striking-distance query/page pairs roll up to these seven pages. These are
the only genuine striking-distance opportunities on the site: the other 89 are
celebrity name lookups converting at 0.21%, which no refresh will fix.

### B1. Olaplex review
`/beauty-style/hair/olaplex-review-is-it-worth-the-hype`
- Now: 9 clicks / 3,397 impressions / pos 8.3
- Targets: `olaplex reviews` (6.4), `is olaplex worth it` (8.8),
  `is olaplex good for your hair` (10.2), `is olaplex good` (8.5)
- Job: four separate questions, all answerable. Give each its own H2 in the
  searcher's phrasing with a two-sentence answer directly beneath. Verdict up
  front. Best single opportunity on this list.

### B2. Best hair tools for fine hair
`/beauty-style/hair/best-hair-tools-for-fine-hair`
- Now: 28 clicks / 1,091 impressions / pos 9.1
- Targets: `hair stylers for thin hair` (8.3, **0 clicks on 777 impressions**),
  `hair styler for fine hair` (6.2), `hair stylers for fine hair` (5.7)
- Job: note it says **styler**, singular and plural, and **thin** as well as
  fine. Our copy says "tools". Add H2s using their words. Already has a video.

### B3. Dyson V16 review
`/living/lifestyle/dyson-v16-review`
- Now: 44 clicks / 2,247 impressions / pos 6.7 — best performer here
- Targets: `dyson v16 review` (5.7), `dyson v16 piston animal review` (7.2),
  `dyson v16 piston animal submarine reviews` (6.4)
- Job: the model-name variants are all zero-click. Name the exact model
  ("Piston Animal", "Submarine") in a subheading. Strong video candidate.

### B4. MooGoo sensitive scalp shampoo
`/sigourneys-edit/edit/sensitive-scalp-moogoo-shampoo-review`
- Now: 9 clicks / 740 impressions / pos 8.7
- Targets: `moogoo shampoo` (10.4, 3,750 impressions), `moogoo shampoo review`
  (5.7), `moo goo shampoo reviews` (5.6)
- Job: include the spaced spelling "Moo Goo" somewhere in the body — it is a
  real query variant we currently miss.

### B5. Byredo hand cream
`/beauty-style/skin-care/byredo-hand-cream-review-is-it-worth-it`
- Now: 6 clicks / 1,282 impressions / pos 7.9
- Targets: `byredo hand cream` (7.4, 2,574 impressions), `byredo hand lotion`
  (8.4, 0 clicks)
- Job: verdict and price in the first two sentences. Add "hand lotion" as a
  variant phrase.

### B6. 8 at Trinity
`/living/lifestyle/8-at-trinity`
- Now: 0 clicks / 362 impressions / pos 9.9
- Target: `8 at trinity reviews` (10.9, 387 impressions, **zero clicks**)
- Job: they want a review and the page is not reading as one. Add a clear
  verdict section and rating near the top.

### B7. Glam AI — **watch, do not edit yet**
`/living/lifestyle/best-ai-image-generator-app-review-glam-ai`
- Targets: `glam ai` (7.8, 3,630 impressions), `glam app` (9.0), `glam ai app` (9.2)
- This page is **mid-transition**. Impressions ran at ~86/day on the old URL
  across the six-week window but only ~9/day on the new one in the six days
  after the fix. Google has not finished re-attributing it.
- Job: leave it alone for two to three weeks, then re-check. Editing now means
  you cannot tell whether any change came from the edit or the transition. It
  holds the largest impression pool in Part B, so it is worth the patience.

---

## Part C — standing notes

- **Do not delete the two legacy WordPress sitemaps yet.**
  `https://www.beauticate.com/sitemap_index.xml` and the `http://` variant are
  currently feeding Google the 5,539 old URLs so it can process our 301s and
  move authority across. Removing them mid-consolidation would slow that down.
  Revisit in six to eight weeks. Tell Dougie they are staying deliberately.
- **Dual US/UK affiliate links are a revenue fix, not an SEO fix.** US, UK and
  Canada are 33% of clicks (US alone: 1,430 clicks on 256,515 impressions).
  Worth real money, will not move a ranking. Prioritise A4, B1, B2 and B3.
- **Ten articles still exist twice on disk** (same slug, two paths), so both
  copies serve 200 and neither can redirect. Six are salon/clinic listings,
  four are vodcast cross-posts. None are on this list, but they should be
  `git mv`-ed rather than left duplicated.
