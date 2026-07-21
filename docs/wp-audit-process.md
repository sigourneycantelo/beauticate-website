# WordPress ↔ Vercel article reconciliation

> **Start with the master playbook:** [`article-audit-and-fix.md`](./article-audit-and-fix.md)
> covers the whole process, the script toolbox, and the gotchas. This document is
> the deep dive on the **detector** internals.

A repeatable, review-gated process to find and fix inconsistencies between the
original WordPress articles (`beauticate.com`) and the migrated Next.js/MDX
articles.

## Why the WP REST API (not screenshots / WebFetch)

The original migration pulled from the **WordPress REST API**
(`/wp-json/wp/v2/posts?slug=<slug>`), which returns the full, untruncated
`content.rendered` HTML plus authoritative `title`, `date`, `excerpt`, and
`author`. That is the source of truth. `WebFetch` truncates long pages and runs
a weak model, and full-page screenshot diffing does not scale to ~1,760
articles. The audit therefore re-fetches each article from the same REST API and
diffs it against the local MDX.

## Workflow (per category, newest 12 at a time)

1. **Audit** — run the detector over the latest 12 articles in a category.
   It changes nothing; it writes a ranked report.
2. **Review** — Sigourney reviews `qa/wp-audit/<category>.md` and approves.
3. **Fix** — apply the approved changes (see fix phase below), commit.
4. **Next** — move to the next category.

Category order follows the top nav (`components/layout/Header.tsx`):
**beauty-style → wellness → destinations → living → vodcast → interviews**, then
the remaining sections (`news`, `sigourneys-edit`, `pages`).

## Phase 1 — Audit (detector)

```bash
node scripts/audit-wp-vs-vercel.mjs --category beauty-style --limit 12
# single article:
node scripts/audit-wp-vs-vercel.mjs --category beauty-style --slug some-slug
# force a fresh WP fetch (ignore cache):
node scripts/audit-wp-vs-vercel.mjs --category beauty-style --no-cache
```

Outputs:
- `qa/wp-audit/<category>.md` — human-readable, ranked by severity
- `qa/wp-audit/<category>.json` — machine-readable findings (drives the fix phase)
- `.cache/wp/<slug>.json` — cached WP responses (gitignored, resumable)

Finding types:
| Type | Severity | Meaning |
|------|----------|---------|
| `IMAGES` | high | WP has more **body images** (deduped) than the MDX references |
| `TEXT` | high | MDX body is shorter than WP by ≥80 words **and** ≥15% |
| `MARKDOWN` | medium | Broken delimiters: space-close-bold, glue, stray-stars, mismatched-bold |
| `META` | medium | `title` / `author` / `date_published` differ (typography-normalised) |

Image matching is by **count, not filename**. The migration renamed images to
clean local names (e.g. `Kerrie-Simone.jpg` → `simone-aspinall.jpg`,
`Professional-brow-shaping-treatment.jpg` → `professional-brow-shaping.jpg`), so
filename matching produced false positives. The audit therefore compares the
count of WP body images against MDX body-image references (markdown + JSX
components like `<ShopItem>`; frontmatter hero/featured excluded, since WP keeps
the featured image out of `content.rendered` too) and only flags a genuine
deficit. When it does flag, the listed WP URLs are the *candidates* (those whose
filename has no MDX match) — confirm which are truly missing before restoring.

Known limitation (why review is required):
- Count matching can miss a case where an image was *swapped* (same count, wrong
  picture). Rare; the review step covers it.
- `TEXT` deltas on shoppable/roundup articles can be inflated because product
  blurbs may live in `<ShopItem>`/product structures the word-count skips.

## Phase 2 — Fix (per approved finding)

Run one article at a time. For each, follow the CLAUDE.md rules
(local image paths under `/content/...`, `<Portrait>` for portrait images on
alternating sides, delimiter-fix patterns). Suggested fix-agent prompt:

> You are fixing one migrated MDX article to match its WordPress original.
> Inputs: the MDX file at `<path>`, the audit findings for `<slug>` from
> `qa/wp-audit/<category>.json`, and the cached WP HTML at `.cache/wp/<slug>.json`.
>
> For each finding:
> - **IMAGES**: Confirm the image is genuinely absent from the rendered article
>   (not just renamed). If missing, download it from the WP URL into the
>   article's content dir, give it a descriptive filename, and embed it at the
>   correct position with descriptive alt text — markdown `![]()` for landscape,
>   `<Portrait>` for portrait orientation (alternating sides), `<ShopItem>` if it
>   is a product in a shop grid.
> - **TEXT**: Diff the WP body against the MDX, restore any dropped paragraphs in
>   their original position and order. Do not invent content.
> - **MARKDOWN**: Fix the broken delimiter per the CLAUDE.md patterns. Use
>   byte-level replacement for files containing NBSP / curly quotes.
> - **META**: Only change a field if the WP value is clearly correct and the MDX
>   value is wrong (ignore pure typography differences).
>
> Preserve frontmatter unless a META finding requires a change. Do not touch
> articles dated on/after 2026-06-18 (no WP source). Report what you changed.

Commit per category (or per batch) so diffs are reviewable and revertible.
