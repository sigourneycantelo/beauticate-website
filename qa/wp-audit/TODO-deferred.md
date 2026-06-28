# WP↔Vercel audit — deferred to-do list

Items parked during the per-category sweep because they need substantial /
judgment-heavy work (galleries, oversized assets, layout). Do these as a focused
batch after the category sweep finishes.

## Deferred gallery / image jobs
- [ ] **destinations/mondrian-gold-coast-review** — 16 missing images (many `Currently-Loving-EDM` flatlays — decide inline vs shoppable grid first) + 6 flattened embeds + 2 markdown bugs.
- [ ] **living/lazy-girls-guide-summer-entertaining** — 5 missing portrait images incl. two oversized animated GIFs (WEBSITE-PORTRAIT-11 = 12.7MB, -15 = 17.9MB) → optimize before embedding; use `<Portrait>` per the portrait-images rule. Placement maps by alt→section heading (Name Cards / Cake / Tablescape / Table Setting / "Sigourney and Jayde").
- [ ] **interviews/rae-morris-interview** — 8 photoshoot images to interleave into the existing gallery (MDX has every other image; insert each by WP order). NOTE: its FLATTENED `raemorris.com` hit is a FALSE POSITIVE (legit inline prose link "my own makeup brushes") — leave it.

## beauty-style FULL audit (973 articles) — remaining per-article work
Full audit done 2026-06-28: 777 clean, 4 post-migration, 192 flagged. Batch-fixed:
115 glue (fix-glue-batch.mjs), 29 bold lines/10 files (fix-bold-batch.mjs), 3 `&`-drop titles.
**Remaining (need per-article hands-on, not batchable):**
- [x] IMAGES — DONE via content-matching (scripts/restore-images.mjs). Restored 9 genuinely-absent images across 4 articles: systeme-bio (1), struggling-to-sleep (2), mini-bags (2), the-makeup-tools-for-people-with-disabilities (4). The other 5 (why-tap-water, louis-vuitton, cheek-blush, qure, chic-sunscreens) were FALSE POSITIVES — all image files present (renamed); bodies reference fewer than WP but nothing is broken. (So chic-sunscreens "16 missing" / qure "7 missing" were not real.) Optional later: surface more of the already-present files in those 5 bodies.
- [ ] TEXT — 4 articles (paragraph-diff + restore; check shop-grid noise): beauticate-team-winter-edit (15%), confessions-of-a-beauty-shopgirl (26%), how-to-buy-perfume-for-someone-else (27%), what-to-wear-for-winter-workouts (16%).
- [ ] FLATTENED — 3 (chic-sunscreens-hats, qure-micro-infusion-system-review, your-ultimate-guide-to-mini-bags): now likely ALL false positives — content-matching showed these articles' image files are present, so the flagged links are inline prose (like rae-morris). Verify & dismiss.
- [ ] MARKDOWN manual — 18 glue articles skipped by batch (unbalanced after split) + ~33 mismatched-bold articles (45 ambiguous lines: unclosed `**[link]`, glued product blocks). See fix-glue-batch.mjs skip-list & fix-bold-batch "left for manual".
- SKIP (verified non-issues): 8 META = cosmetic trailing `…`/`.`/`–→:` differences (MDX cleaner); censored swears (f***).

## Other parked cleanups
- [ ] **beauty-style markdown bugs** — never addressed (only heroes/LFS/placeholders/collective were done): red-light-therapy-hair-thinning (mismatched-bold), why-i-swapped-whoop… (space-close-bold `**[Ultrahuman Ring](url) **`), chic-sunscreens-hats (mismatched-bold×8).

## Notes / known intentional skips (NOT bugs)
- Censored swears (`f***`) trip the mismatched-bold detector — skip on sight.
- WP title typos already corrected in MDX (e.g. "Jocleyn"→"Jocelyn") — ignore META.
- Duplicate CTA banners whose WP position doesn't fit the MDX structure — skip.
- Generic podcast-logo heroes → tracked separately in `podcast-images-needed.md` (Sigourney sourcing artwork).
