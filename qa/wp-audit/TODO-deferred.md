# WP↔Vercel audit — deferred to-do list

Items parked during the per-category sweep because they need substantial /
judgment-heavy work (galleries, oversized assets, layout). Do these as a focused
batch after the category sweep finishes.

## Deferred gallery / image jobs
- [ ] **destinations/mondrian-gold-coast-review** — 16 missing images (many `Currently-Loving-EDM` flatlays — decide inline vs shoppable grid first) + 6 flattened embeds + 2 markdown bugs.
- [ ] **living/lazy-girls-guide-summer-entertaining** — 5 missing portrait images incl. two oversized animated GIFs (WEBSITE-PORTRAIT-11 = 12.7MB, -15 = 17.9MB) → optimize before embedding; use `<Portrait>` per the portrait-images rule. Placement maps by alt→section heading (Name Cards / Cake / Tablescape / Table Setting / "Sigourney and Jayde").
- [ ] **interviews/rae-morris-interview** — 8 photoshoot images to interleave into the existing gallery (MDX has every other image; insert each by WP order). NOTE: its FLATTENED `raemorris.com` hit is a FALSE POSITIVE (legit inline prose link "my own makeup brushes") — leave it.

## Other parked cleanups
- [ ] **beauty-style markdown bugs** — never addressed (only heroes/LFS/placeholders/collective were done): red-light-therapy-hair-thinning (mismatched-bold), why-i-swapped-whoop… (space-close-bold `**[Ultrahuman Ring](url) **`), chic-sunscreens-hats (mismatched-bold×8).

## Notes / known intentional skips (NOT bugs)
- Censored swears (`f***`) trip the mismatched-bold detector — skip on sight.
- WP title typos already corrected in MDX (e.g. "Jocleyn"→"Jocelyn") — ignore META.
- Duplicate CTA banners whose WP position doesn't fit the MDX structure — skip.
- Generic podcast-logo heroes → tracked separately in `podcast-images-needed.md` (Sigourney sourcing artwork).
