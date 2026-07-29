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

## The bigger find: unresolved merge conflicts rendering live
Scanning for render-breaking artefacts turned up **23 articles with unresolved
git merge-conflict markers committed into their bodies** (`<<<<<<< HEAD` /
`=======` / `>>>>>>>`) — readers saw the markers and BOTH text versions. Fallout
from the delimiter-fix batch merges (`bc7ab92e`, `3c96efce`, `76844969`).
Resolved each by keeping the side with proper paragraph/heading structure and
closed bold; also stripped ~80 lines of MS-Word CSS junk from skin-temple and
de-glued the clinic/about Contact blocks. Tool: `scripts/resolve-conflicts.py`
(well-formed) + hand-fixes for 5 files with orphaned/partial markers.

## Batch log
| Batch | Articles | Status | Commit |
|-------|----------|--------|--------|
| 1 | 8 files — case-only stray refs (Bucket A) | ✅ pushed | 357b6a529 |
| 2 | 23 files — merge-conflict resolution + junk/bold cleanup | ✅ pushed | 99745b2bd |
| 3 | 118 files — MS-Word paste-junk removal (mso-* CSS blocks + residue tokens) | ✅ applied | (pending) |

| 4 | 2 files — genuine unclosed-bold fixes | ✅ pushed | abfaf0eab |
| 5 | 11 files — MDX parse errors causing HTTP 500 (blank pages) | ✅ applied | (pending) |

## Full-site 500 sweep + MDX compile audit (batch 5)
Swept all 1,750 published article URLs on Vercel → **10 live 500s** (plus 9 404s
that were just my URL-derivation artifacts for refiled articles). Root causes,
found by compiling each body with `@mdx-js/mdx` (the same parser MDXRemote uses):
- **Curly/smart quotes in JSX attributes** (`<YouTubeEmbed url=”…”/>`) — invalid
  JSX. 8 files. Fixed only `=”…”` delimiters (prose curly quotes untouched).
- **Malformed ShopItem tags**: `\"ARTHUR\"` escaped quotes (lipstick), `//>`
  double-slash self-close (how-to-choose ×2), stray ` / url=` mid-tag (anna
  ×3).
Then compiled **all 1,846 MDX files → 0 parse failures**. Every article now
parses; all blank/500 pages resolved.

## Unbalanced-bold scan (batch 4)
Scanned every body line for an odd count of `**` (unbalanced → stray asterisks
render). Only 6 files flagged; 4 were censored swears (`B**tch`, `f***`, `f**k`)
— correct to leave. 2 genuine unclosed-bold labels fixed: mini-bags "Miu Miu"
heading, how-to-choose "Rich Moisturizer". (Noted: storm-keating body paragraph
appears duplicated — separate issue, not addressed here.)

## Word-junk find (batch 3)
Another live-render blight: MS-Word paste junk (`mso-*` CSS dumps,
`table.MsoNormalTable`, and residue tokens `nic`/`JA`/`X-NONE`/`14.0`/empty `###`)
sitting in article bodies. 10 files had full CSS blocks (up to 1000+ junk lines
each), 108 more had residue tokens. Real prose glued after `;}` was salvaged.
Tools: `scripts/strip-word-junk.py` (mso blocks, dry-run flags any prose-looking
drop) + `scripts/strip-word-residue.py` (token residue). 921 residue tokens +
~1800 mso lines removed; frontmatter intact on all 118; no real prices/ratings/
headings lost (verified).

**Bonus: batch 3 REPAIRS ~9 previously-500ing articles.** The `{mso-style-name…}`
junk contained `{` which MDX parses as a JS expression → those 9 pages were
throwing 500s (blank pages) before, not just showing ugly text. Verified via
`git show ed3713ce3` that they carried 1–67 body braces each; the cleaned files
have zero. A full-body brace scan confirms only 2 other files use braces, both
valid JSX (`style={{…}}`, Tailwind `text-[10px]`). **Verified live:** all 5
spot-checked pages flipped 500 → 200 after the 4d032589a build deployed.
