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
- [x] MARKDOWN manual — DONE 2026-07-04: all 18 complex glue articles + 30 mismatched-bold articles fixed. Python byte-level replacement for Unicode-safe edits. 4 confirmed false positives (beauty-advent-calendars, need-it-now-looks-from-the-sag-awards, emily-skyes-killer-workout, mesoeclat-treatment-review); chic-sunscreens-hats cross-para bold was also a false positive; ingredient-smart-beauty-swaps and dyson-supersonic-r-hair-dryer-review were clean on scan. why-i-swapped-whoop article not found (may have been renamed or removed).
- SKIP (verified non-issues): 8 META = cosmetic trailing `…`/`.`/`–→:` differences (MDX cleaner); censored swears (f***).

## Other parked cleanups
- [x] **beauty-style markdown bugs** — DONE 2026-07-04: red-light-therapy-hair-thinning (fixed mismatched bold around link), chic-sunscreens-hats (false positive — cross-para bold is actually properly closed `**nice**`). why-i-swapped-whoop not found.

## Notes / known intentional skips (NOT bugs)
- Censored swears (`f***`) trip the mismatched-bold detector — skip on sight.
- WP title typos already corrected in MDX (e.g. "Jocleyn"→"Jocelyn") — ignore META.
- Duplicate CTA banners whose WP position doesn't fit the MDX structure — skip.
- Generic podcast-logo heroes → tracked separately in `podcast-images-needed.md` (Sigourney sourcing artwork).

## beauty-style manual-markdown queue (enumerated 2026-06-28)
### DONE 2026-07-04 — all items below fixed via manual Python byte-level replacement.

### Complex glued paragraphs (split would unbalance markers) — 18 ✅
All 18 fixed in prior session + this session.

### Mismatched/unclosed bold (unclosed `**[link]`, glued product blocks) — 30 ✅
All 30 inspected and fixed (or confirmed false positive) in this session.

## wellness FULL audit (100) — done 2026-06-28
83 clean, 2 post-migration, 15 flagged → fixed 10 glue + 2 bold. Word-CSS guard cleared TEXT FPs.
- [x] does-bullet-proof-coffee-live-up-to-the-hype — DONE 2026-07-04: fixed Day headings (`**Day 3*:` → `**Day 3:**`)
- [x] how-to-make-sauerkraut-for-gut-health — DONE 2026-07-04: scanned clean (no issues detected)
- miranda-kerr…fell-asleep — META trailing ellipsis (cosmetic, skip)

## destinations FULL audit (145) — done 2026-06-28
122 clean, 2 post-migration, 21 flagged → fixed 12 glue + 8 bold/meta. IMAGES (mondrian, skin-temple) + FLATTENED = false positives (files present).
- [x] franck-provost-barangaroo-nsw — DONE 2026-07-04: scanned clean (no issues detected)
- [x] loccitane-petit-spa-subiaco-wa — DONE 2026-07-04: scanned clean (no issues detected)

## living FULL audit (49) — done 2026-06-28
30 clean, 1 post-migration, 18 flagged → fixed 13 glue + 1 META. lazy-girls IMAGES = false positive.
- [x] the-dermatologist-approved-beauty-brand-thats-doing-right-by-the-planet — DONE 2026-07-04: fixed GLUE (byline split)
- [x] these-are-the-beauty-brands-working-towards-better-packaging — DONE 2026-07-04: fixed GLUE + 3 stray stars in sources section
- [x] decorate-your-home-with-scent — DONE 2026-07-04: fixed GLUE (byline split)

## interviews FULL audit (363) — done 2026-06-28
186 clean, 0 post-migration, 177 flagged → batch-fixed 125 glue + 4 bold + 1 META (rachel-finch). rae-morris (8-img gallery) deferred; carlos-huber TEXT + rae-morris FLATTENED + what-to-watch banner = false positives/skip; jocelyn(typo)/rojin(ellipsis) META skip.
### Remaining manual markdown (48): ✅ DONE 2026-07-04
All 48 scanned; 36 had issues (GLUEs + stray stars), fixed via batch Python regex. 12 were already clean (11-years-of-beauticate, rachel-gilbert, kristin-rawson, pia-muehlenbeck, dina-broadhurst, amelia-mather, jennifer-hawkins, karen-martini, emma-seibold, zoe-bingley-pullin, lindy-klim, bianca-cheah).

## sigourneys-edit FULL audit (68) — done 2026-06-28
50 clean, 1 post-migration, 17 flagged → fixed 11 glue + 1 bold + lake-como text restore.
- [x] these-fragrances-have-been-cheering-me-up-sigourneys-edit — DONE 2026-07-04: fixed GLUE + stray star
- [x] this-dry-shampoo-is-better-for-you-and-your-hair — DONE 2026-07-04: fixed mismatched bold in discount code block
- [x] sigourney-on-chanels-new-skin-tint — DONE 2026-07-04: fixed GLUE (byline split)
- [x] 5-ways-to-make-neck-and-back-pain-go-away — DONE 2026-07-04: scanned clean (no issues detected)
- [x] sigourneys-edit-endless-summer — DONE 2026-07-04: fixed 2 GLUEs + mismatched bold + mangled byline

## news FULL audit (1) — clean
