# WP↔Vercel audit — deferred to-do list

Items parked during the per-category sweep because they need substantial /
judgment-heavy work (galleries, oversized assets, layout). Do these as a focused
batch after the category sweep finishes.

## Deferred gallery / image jobs
- [ ] **destinations/mondrian-gold-coast-review** — 16 missing images (many `Currently-Loving-EDM` flatlays — decide inline vs shoppable grid first) + 6 flattened embeds + 2 markdown bugs.
- [x] **living/lazy-girls-guide-summer-entertaining** — RESOLVED as FALSE POSITIVE: content-match (restore-images.mjs) shows all 23 image files present locally (incl the big GIFs). Not missing; body just references fewer than WP. Optional later: surface more of the existing files.
- [ ] **interviews/rae-morris-interview** — 8 photoshoot images to interleave into the existing gallery (MDX has every other image; insert each by WP order). NOTE: its FLATTENED `raemorris.com` hit is a FALSE POSITIVE (legit inline prose link "my own makeup brushes") — leave it.

## beauty-style FULL audit (973 articles) — remaining per-article work
Full audit done 2026-06-28: 777 clean, 4 post-migration, 192 flagged. Batch-fixed:
115 glue (fix-glue-batch.mjs), 29 bold lines/10 files (fix-bold-batch.mjs), 3 `&`-drop titles.
**Remaining (need per-article hands-on, not batchable):**
- [x] IMAGES — DONE via content-matching (scripts/restore-images.mjs). Restored 9 genuinely-absent images across 4 articles: systeme-bio (1), struggling-to-sleep (2), mini-bags (2), the-makeup-tools-for-people-with-disabilities (4). The other 5 (why-tap-water, louis-vuitton, cheek-blush, qure, chic-sunscreens) were FALSE POSITIVES — all image files present (renamed); bodies reference fewer than WP but nothing is broken. (So chic-sunscreens "16 missing" / qure "7 missing" were not real.) Optional later: surface more of the already-present files in those 5 bodies.
- [x] TEXT — DONE: all 4 are non-defects (no real dropped prose). confessions-of-a-beauty-shopgirl = Microsoft-Word CSS junk counted as words; what-to-wear-for-winter-workouts = 0 missing; beauticate-team-winter-edit = quote present, structural diff; how-to-buy-perfume-for-someone-else = MDX is a deliberately edited version (reworded quotes, dropped one expert) — coherent, leave as-is.
- [x] FLATTENED — DONE: all 3 confirmed FALSE POSITIVES (verified the links are inline prose text links — "pool accessories…", "Lorna Murray", "Qure Micro-Infusion System", product names — not dropped image embeds; image files present).
- [ ] MARKDOWN manual — 18 glue articles skipped by batch (unbalanced after split) + ~33 mismatched-bold articles (45 ambiguous lines: unclosed `**[link]`, glued product blocks). See fix-glue-batch.mjs skip-list & fix-bold-batch "left for manual".
- SKIP (verified non-issues): 8 META = cosmetic trailing `…`/`.`/`–→:` differences (MDX cleaner); censored swears (f***).

## Other parked cleanups
- [ ] **beauty-style markdown bugs** — never addressed (only heroes/LFS/placeholders/collective were done): red-light-therapy-hair-thinning (mismatched-bold), why-i-swapped-whoop… (space-close-bold `**[Ultrahuman Ring](url) **`), chic-sunscreens-hats (mismatched-bold×8).

## Notes / known intentional skips (NOT bugs)
- Censored swears (`f***`) trip the mismatched-bold detector — skip on sight.
- WP title typos already corrected in MDX (e.g. "Jocleyn"→"Jocelyn") — ignore META.
- Duplicate CTA banners whose WP position doesn't fit the MDX structure — skip.
- Generic podcast-logo heroes → tracked separately in `podcast-images-needed.md` (Sigourney sourcing artwork).

## beauty-style manual-markdown queue (enumerated 2026-06-28)
Ambiguous markdown the batch safely declined — each needs per-article inspection.

### Complex glued paragraphs (split would unbalance markers) — 18
- these-are-your-favourite-skincare-products
- the-mother-daughter-duo-approaching-aging-practically
- the-sisters-using-science-and-astrology-to-care-for-your-skin
- how-a-beauty-writer-manages-her-rosacea
- the-beauticate-guide-to-hair-repair
- a-22-year-old-brand-founder-on-how-to-get-dumpling-skin
- camille-friend-marvels-master-hairstylist-on-creating-movie-magic-and-how-to-get-your-own-superhuman-curls
- sigs-hair-hit-list
- how-to-do-lash-extensions-right
- the-secret-on-everyones-lips-the-range-promising-to-shake-up-the-skincare-scene
- how-to-nail-summer-beauty-with-coral-makeup
- how-ksenija-lukich-cured-her-eczema-and-why-ceramides-are-the-ingredient-to-watch
- zero-waste-beauty-hacks-on-trial-solid-shampoo-body-moisturising-bars-and-no-poo
- abigail-oneill-hydrotherapy
- this-new-perfume-trend-will-have-you-smelling-like-you-only-better
- nine-new-season-trends-youll-actually-want-to-try
- how-to-bastille-beauty-11-cult-french-icons
- sigourney-1

### Mismatched/unclosed bold (unclosed `**[link]`, glued product blocks) — 30
- chic-sunscreens-hats
- the-makeup-tools-for-people-with-disabilities
- your-ultimate-guide-to-mini-bags-10-mini-bags-to-elevate-your-style
- red-light-therapy-hair-thinning
- ingredient-smart-beauty-swaps
- dyson-supersonic-r-hair-dryer-review
- hypochlorous-acid-why-this-dermal-mist-has-gone-viral
- how-to-bring-life-back-to-your-locks-expert-haircare-tips
- glass-hair
- these-are-your-favourite-skincare-products
- beauty-secrets-from-the-happiest-kingdom-on-earth
- best-hair-tools-for-fine-hair
- the-sisters-using-science-and-astrology-to-care-for-your-skin
- how-a-beauty-writer-manages-her-rosacea
- diy-a-salon-worthy-blowdry-with-these-volume-hair-products
- video-mornings-with-sigourney-and-family
- zero-waste-beauty-hacks-on-trial-solid-shampoo-body-moisturising-bars-and-no-poo
- shop-sigs-look-from-her-parlour-x-shoot
- how-to-insomnia-cure-tips
- beauty-advent-calendars
- this-new-perfume-trend-will-have-you-smelling-like-you-only-better
- the-definitive-meghan-markle-beauty-guide
- need-it-now-looks-from-the-sag-awards
- emily-skyes-killer-workout
- roji-canberra-3
- mesoeclat-treatment-review
- why-youre-probably-not-washing-your-hair-correctly
- video-how-to-do-a-natural-mineral-makeup-base-for-summer
- 6-spring-beauty-buys-were-coveting
- sigourney-1

## wellness FULL audit (100) — done 2026-06-28
83 clean, 2 post-migration, 15 flagged → fixed 10 glue + 2 bold. Word-CSS guard cleared TEXT FPs. Remaining manual:
- does-bullet-proof-coffee-live-up-to-the-hype (mangled **Day 3**/italic markers)
- how-to-make-sauerkraut-for-gut-health (mangled credits italic/bold)
- miranda-kerr…fell-asleep — META trailing ellipsis (cosmetic, skip)

## destinations FULL audit (145) — done 2026-06-28
122 clean, 2 post-migration, 21 flagged → fixed 12 glue + 8 bold/meta. IMAGES (mondrian, skin-temple) + FLATTENED = false positives (files present). Remaining manual:
- franck-provost-barangaroo-nsw (glue split unbalances — manual)
- loccitane-petit-spa-subiaco-wa (Word-junk + mangled bold/italic byline)

## living FULL audit (49) — done 2026-06-28
30 clean, 1 post-migration, 18 flagged → fixed 13 glue + 1 META. lazy-girls IMAGES = false positive. Remaining manual (glue split unbalances / mangled credits):
- the-dermatologist-approved-beauty-brand-thats-doing-right-by-the-planet
- these-are-the-beauty-brands-working-towards-better-packaging
- decorate-your-home-with-scent
