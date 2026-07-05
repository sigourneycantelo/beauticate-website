# Article Audit & Fix Playbook

A practical, end-to-end guide for finding and fixing inconsistencies between the
original WordPress articles (`beauticate.com`) and the migrated Next.js/MDX
articles. Written so any collaborator — human or AI agent — can pick up the work.

> This is the master playbook. For a deeper dive on the detector internals see
> [`wp-audit-process.md`](./wp-audit-process.md). For project-wide rules (hero
> curation, the WordPress source rule, portrait images) see the root
> [`CLAUDE.md`](../CLAUDE.md).

---

## 1. The core idea

Beauticate was migrated from WordPress to Next.js. The migration was imperfect:
some articles lost body images, dropped paragraphs, got broken markdown
delimiters, or had their product "shop grids" flattened into plain images. This
process re-fetches each article from its **authoritative source** and diffs it
against the local MDX, then fixes the genuine gaps.

**The source of truth is the WordPress REST API**, not the live page or a
screenshot:

```
https://www.beauticate.com/wp-json/wp/v2/posts?slug=<slug>
```

It returns the full, untruncated `content.rendered` HTML plus authoritative
`title`, `date`, `excerpt`, and `author` — the same data the migration used.
`WebFetch` truncates long pages; screenshot-diffing doesn't scale to ~1,760
articles. Responses are cached in `.cache/wp/<slug>.json` (gitignored, resumable).

### The WordPress source rule

Only articles with `date_published` **before 2026-06-18** came from WordPress and
may have migration gaps. Articles dated on/after the migration date were written
directly for the Vercel site — **never** "restore" content into them. Always check
the date before touching an article.

---

## 2. The toolbox

All scripts live in `scripts/` and are run with `node scripts/<name>.mjs`. Every
fixer is **dry-run by default** and only writes with `--apply` (or `--save`).

| Script | What it does | Usage |
|--------|--------------|-------|
| `audit-wp-vs-vercel.mjs` | The detector. Diffs MDX vs WP REST API, writes ranked reports. Changes nothing. | `--category <cat> [--limit N] [--slug s] [--no-cache]` |
| `fix-glue-batch.mjs` | Fixes "glue" (italic intro merged into prior paragraph at a `.*Capital` boundary). Balance-guarded. | `[--cat <cat>] [--apply]` |
| `fix-bold-batch.mjs` | Fixes mismatched-bold / space-close-bold / stray star runs. Only rewrites lines that become balanced. Skips censored swears. | `[--cat <cat>] [--apply]` |
| `restore-images.mjs` | For one article, finds WP body images **genuinely** absent locally (perceptual content-match, not filename), downloads the truly-missing, prints a placement worklist. | `<slug> [--save]` |
| `find-shop-grids.mjs` | Scans all cached WP for articles that had an affiliate shop grid (≥3 anchor>img tiles) but whose MDX has no `<ShopGrid>`/`<ShopItem>`/`<CollectionEmbed>`. | (no args) |
| `map-shop-images.mjs` | For one article, maps each WP shop tile to its local image (content-match), destination URL, and a guessed name — drives a `<ShopGrid>` rebuild. | `<slug>` |
| `link-shop-images.mjs` | For an article whose product images show but are **plain** (buy links dropped), re-wraps `![](img)` → `[![](img)](buyUrl)` by content-match. | `<slug> [--apply]` |

Outputs of the detector:
- `qa/wp-audit/<category>.md` — human-readable, ranked by severity
- `qa/wp-audit/<category>.json` — machine-readable findings (drives fixes)
- `qa/wp-audit/TODO-deferred.md` — the running queue of deferred manual jobs

---

## 3. The workflow

Work **per category**, review-gated. Category order follows the top nav:
**beauty-style → wellness → destinations → living → vodcast → interviews**, then
`news`, `sigourneys-edit`, `pages`.

```
1. AUDIT   node scripts/audit-wp-vs-vercel.mjs --category <cat> --limit 12
2. REVIEW  read qa/wp-audit/<cat>.md — confirm which findings are real
3. FIX     apply the approved changes (batch scripts + manual; see §4)
4. COMMIT  per category/batch, push to main (Vercel deploys from main)
5. NEXT    move to the next category
```

`--limit 12` audits the newest 12 articles; drop or raise it for a full-category
pass. A full category pipeline that has proven reliable:

```bash
node scripts/audit-wp-vs-vercel.mjs --category <cat>           # full audit
node scripts/fix-glue-batch.mjs --cat <cat> --apply           # bulk: glue
node scripts/fix-bold-batch.mjs --cat <cat> --apply           # bulk: bold
# then per-article: restore-images, shop grids, manual markdown
```

### Finding types

| Type | Severity | Meaning |
|------|----------|---------|
| `IMAGES` | high | WP has more deduped **body images** than the MDX references |
| `TEXT` | high | MDX body is ≥80 words **and** ≥15% shorter than WP |
| `MARKDOWN` | medium | Broken delimiters: glue, space-close-bold, mismatched-bold, stray-stars |
| `META` | medium | `title` / `author` / `date_published` differ (typography-normalised) |
| `FLATTENED` | medium | WP had `<a href><img></a>` but migration kept only a plain `[text](url)`, dropping the image |

---

## 4. Fix recipes by finding

Always follow the CLAUDE.md rules: local image paths under `/content/...`,
`<Portrait>` for portrait-orientation images (alternating sides), byte-level
replacement for files with NBSP / curly quotes.

- **IMAGES** — Run `restore-images.mjs <slug>` first; it tells you which images
  are *genuinely* missing vs merely renamed. `--save` downloads the missing ones
  into the article's content dir. Embed at the correct position with descriptive
  alt text: markdown `![]()` for landscape, `<Portrait>` for portrait,
  `<ShopItem>` for products. Confirm placement against the WP image order.

- **TEXT** — Diff the WP body against the MDX and restore dropped paragraphs **in
  their original position and order**. Never invent content. Note many `TEXT`
  flags on shoppable/roundup articles are false positives (blurbs live in
  `<ShopItem>` structures the word count skips).

- **MARKDOWN** — Let the batch fixers handle the bulk (`fix-glue-batch`,
  `fix-bold-batch`); they only touch lines they can balance safely and leave the
  rest for manual review. The remainder (unclosed `**[link]`, glued product
  blocks, complex glue) is logged in `TODO-deferred.md`.

- **META** — Only change a field when the WP value is clearly correct and the MDX
  is wrong. Ignore pure typography differences (curly vs straight quotes, `&`
  entities). Watch for WP-side typos (e.g. a misspelled title) — don't propagate.

- **Dropped shop grids** — Run `find-shop-grids.mjs` to find them site-wide. For
  each: if products aren't shown at all, rebuild with `map-shop-images.mjs` →
  hand-author `<ShopGrid>`/`<ShopItem>`. If products show but aren't clickable,
  run `link-shop-images.mjs <slug> --apply` to re-wrap them in their buy URLs.
  Note: a product linked via its **bold name** (`[**Name**](url)`) is a valid
  pattern — not a defect.

---

## 5. Rendering & layout learnings

Some fixes are component-level, not content-level:

- **Holding shots (hero images) — capped at 1200px.** WordPress served featured
  images at `sizes="(max-width:1200px) 100vw, 1200px"` with a 1200w max source.
  Rendering them full-bleed (`100vw`, up to 3840px) upscales the modest sources
  → fuzzy. The article hero (`components/article/ArticlePage.tsx`) and home hero
  (`components/home/HeroWide.tsx`) are capped at `max-w-[1200px]` with the
  matching `sizes` so images display at native size, never stretched. Category
  cards and `HeroSplit` are fine — they downscale (source bigger than display).

- **`<ShopGrid>` product shots use `object-contain`, not `object-cover`**
  (`components/mdx/ShopGrid.tsx`), so product packshots show in full on the cream
  tile instead of being cropped at the edges.

- **Single-product listicles → `<SplitRow>`.**  When an article has one product
  per section (heading + copy + single `<ShopGrid><ShopItem/></ShopGrid>`),
  convert to `<SplitRow>` for a two-column copy+product layout:
  ```mdx
  <SplitRow image="/content/..." alt="Product Name" side="right" imageWidth="260" href="https://...">

  ## 1. Section heading

  Body copy...

  </SplitRow>
  ```
  Alternate `side="right"` / `side="left"` for visual rhythm. SplitRow uses
  flexbox (self-contained, no bleed); do NOT use `<ProductInset>` (float-based,
  bleeds into subsequent sections). On mobile, SplitRow stacks copy-first,
  image below.

- **Multi-image character/look articles → 3-image rows + ShopGrid.**  Articles
  where each section has 3 editorial images followed by copy and a "Shop the
  Look" product set (e.g. TV Mums, celebrity looks) should use:
  - **3 consecutive `![](url)` on separate lines** (with blank lines between) for
    the editorial images — `rehype-image-grid` auto-wraps exactly 3 into a
    `grid-cols-3` row (2-col on mobile).
  - **`<ShopGrid>` with 3 `<ShopItem>` children** for the products.
  - Remove any first body image that duplicates the hero/featured image.
  - Remove orphan single-item `<ShopGrid>` blocks at the bottom (migration
    artefacts).
  - Convert inline `![alt](url) Product Name` blobs into proper
    `<ShopItem image="url" name="Product Name" />` inside a `<ShopGrid>`.

- **Vertically-stacked image sequences → `<InlineImage>`.**  Recovery/progress
  photo series (e.g. cheek blush tattoo) should use `<InlineImage>` components
  with consistent `width` values, NOT markdown `![]()` (which gets auto-gridded)
  or `<Portrait>` (which floats and bleeds). Pattern:
  ```mdx
  Text block...

  <InlineImage src="/content/..." alt="..." width="181" height="300" />

  Next text block...
  ```

- **Inline `![](img)` + `## [NAME](url)` product blobs → `<ShopGrid>`.**
  Many older articles (especially listicles and "Shop the Look" roundups) have
  products rendered as a plain image followed by a heading-level link:
  ```mdx
  ![](https://…/product.jpg)

  ## [PRODUCT NAME](https://buy-link.com)
  ```
  These should be converted to proper `<ShopGrid>` with `<ShopItem>` children,
  grouping 3 products per grid where the original article had 3 per section:
  ```mdx
  <ShopGrid>
    <ShopItem image="https://…/product1.jpg" name="Product One" url="https://…" />
    <ShopItem image="https://…/product2.jpg" name="Product Two" url="https://…" />
    <ShopItem image="https://…/product3.jpg" name="Product Three" url="https://…" />
  </ShopGrid>
  ```

- **Single/double product `<ShopGrid>` renders at 1/3 width.**  The ShopGrid
  component enforces a minimum 3-column grid (`const cols = Math.max(count, 3)`)
  so single or double product grids render at 1/3 page width — the same size as
  in a 3-item row. No wrapper or class overrides needed.

- **YouTube Shorts left-aligned at 1/3 width.**  Shorts videos default to
  centred in the `YouTubeEmbed` component. To left-align and constrain width,
  wrap in a div with Tailwind classes (NOT `style={{}}` — MDX strips inline
  styles):
  ```mdx
  <div className="not-prose max-w-[364px]">

  <YouTubeEmbed url="https://youtube.com/shorts/…" />

  </div>
  ```

- **ALL CAPS headings → title case.**  WordPress migration preserved shouted
  headings (`## NUTRITIONIST, FORMER MODEL & BLOGGER`). Convert to title case
  during cleanup (`**Nutritionist, former model and blogger**` or
  `### 2. Bannie Williams, The Healthy Ingredient`).

---

## 6. Hard-won gotchas

- **Never `git checkout` a Git LFS pointer file.** "Missing" images were often
  unresolved 131-byte LFS pointers, not absent files. A `checkout` with a failing
  smudge filter can destroy the real working-tree file. The repo has been
  de-LFS'd; if you hit LFS, use
  `git -c filter.lfs.process= -c filter.lfs.clean=cat -c filter.lfs.required=false ...`.
- **Image matching is perceptual, not by name.** The migration renamed images, so
  filename matching produces false positives. The scripts compare a 16×16
  grayscale perceptual signature (distance threshold ~1200–1500).
- **Count matching can miss a *swapped* image** (same count, wrong picture). This
  is why the review step exists.
- **Word-count false positives:** old WP posts kept WPBakery `[vc_*]` shortcodes
  and MS-Word CSS junk in `content.rendered`, inflating the WP word count. The
  detector strips both before counting.
- **Censored swears** (`f***`) trip the mismatched-bold heuristic — recognise and
  skip them.
- **Rogue "Save" text.** WordPress's Pinterest "Save" button migrated as a bare
  `Save` line, usually after the byline. Batch-strip with:
  `python3 -c "..."` (regex `\n\nSave\n` → `\n`). 461 articles had this.
- **Orphan trailing ShopGrid/image blocks.** Some articles have duplicate
  single-item `<ShopGrid>` blocks or repeated body images at the end of the file
  (after the byline). These are migration artefacts — the images already appear
  in the body. Remove them, but verify they're truly duplicates first.
- **First body image duplicating the hero.** Some articles have a `![](url)` as
  the first body element that is the same image as `featured_image`. Remove it —
  the hero component already displays this image above the body.
- **Shell escaping:** prefer script files or Python over inline `node -e` for
  anything with quotes/`$`. On macOS, `xargs` lacks `-d` (use `tr '\n' '\0' | xargs -0`).
- **NBSP / curly quote files need byte-level edits.** Many WordPress-era MDX
  files contain NBSP (`\xc2\xa0`) and curly quotes (`\xe2\x80\x98`/`\xe2\x80\x99`
  /`\xe2\x80\x9c`/`\xe2\x80\x9d`). The `Edit` tool's string matching silently
  fails on these. Use Python `open(path, 'rb')` / `open(path, 'wb')` for
  byte-level replacement, or rewrite the full body after splitting on `b'---\n'`.
- **MDX strips inline `style={{}}` on raw HTML divs.** `next-mdx-remote` silently
  removes JSX-style `style={{maxWidth: '260px'}}` props on raw `<div>` elements.
  Use Tailwind arbitrary value classes instead (e.g. `max-w-[364px]`).
- **Low-res source images — never upscale.** Many WordPress product and portrait
  images are only 200×300px. Check dimensions before sizing up; cap at native
  pixel width. A blurry 200px image stretched to 280px looks worse than a sharp
  200px image.

---

## 7. Git & deploy

**Vercel deploys from `main`.** Commit per category or per logical batch so diffs
stay reviewable and revertible, then `git push origin main`. End commit messages
with the standard co-author trailer. (CLAUDE.md documents a feature-branch +
cherry-pick flow for when branches have diverged.)

---

## 8. Status & deferred work

- Per-category progress and the running list of deferred manual jobs live in
  `qa/wp-audit/TODO-deferred.md`.
- Typical remaining work after a category sweep: the manual-markdown queue
  (unclosed `**[link]`, complex glue) and heavy image-gallery interleaves.
