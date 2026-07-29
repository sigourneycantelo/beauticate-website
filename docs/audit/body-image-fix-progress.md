# Body-image audit & fix — progress log

Standing overnight task: work through articles with missing/broken body images in
batches of ten — restore from WordPress where genuinely missing, and fix article
formatting while there. Resumable: this file records what's done so we never redo.

## Context (established 2026-07-29)
- The big epidemic (384 case-404 images + 58 500-erroring articles) was **already
  fixed** in commit `ed3713ce3` (2026-07-27) and is **live** (verified: correct-case
  image → 200, lowercase → 404 on Vercel). The untracked `docs/audit/*.txt`
  snapshots from that era are stale.
- At the reference level the site is ~99.6% healthy: of ~15,427 body/featured
  image refs, 15,370 exact-case OK. Remaining real work below.

## Buckets of remaining work
- **A. Case-only stray refs (12 refs / 8 files)** — ✅ DONE (commit below), applied
  via `scripts/fix-image-casing.mjs --apply`.
- **B. Broken refs** — ✅ RESOLVED as measurement artefact. 43 of the 45 were
  false positives from `decodeURIComponent` in the audit script (git tracks the
  percent-encoded name `The%E2%80%98…`; the MDX ref matches it and serves 200
  live — verified by curl). Script fixed to compare raw. The only 2 real
  "missing" are `hero.jpg` on two `published:false` drafts → no action (hidden).
  **Net: reference-level body/featured image health is effectively 100%.**
- **C. Count-deficit (17 articles)** — WP body had more images than the MDX
  references at all; nothing broken, just never migrated. `restore-images.mjs`.

## Batch log
| Batch | Articles | Status | Commit |
|-------|----------|--------|--------|
| 1 | 8 files — case-only stray refs (Bucket A) | ✅ applied | (pending) |
