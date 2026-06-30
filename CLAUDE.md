# Beauticate Website — Claude Notes

## Project overview

Beauticate is a beauty/lifestyle editorial site migrated from WordPress to Next.js (app router) on Vercel. Content lives in `content/<category>/<subcategory>/<slug>/<slug>.mdx` files rendered via `next-mdx-remote`.

## WordPress source rule

**Any article with `date_published` before `2026-06-18` originated on the WordPress site and may have body images or content that was not fully migrated.**

When working on such articles:
1. Fetch the original WordPress page at `https://www.beauticate.com/<category>/<subcategory>/<slug>/` to check for body images and full content that might be missing from the MDX file.
2. Download any missing body images to the article's content directory (`content/<category>/<subcategory>/<slug>/`) and reference them with local paths (`/content/...`).
3. For articles with `/wp-content/uploads/` image paths already in the body, those images are served directly from the old WordPress CDN and do not need to be re-hosted unless broken.

The migration date was June 18, 2026. Articles dated on or after that date were written directly for the Vercel site and will not have a WordPress source.

## Ongoing article cleanup

> **Full playbook:** see [`docs/article-audit-and-fix.md`](docs/article-audit-and-fix.md)
> for the end-to-end audit & fix process, the script toolbox, and hard-won
> gotchas. ([`docs/wp-audit-process.md`](docs/wp-audit-process.md) covers the
> detector internals.)

There is a standing mandate to clean up articles as they are encountered. Two types of work:

### 1. Markdown delimiter fixes (formatting)
WordPress migration introduced broken italic/bold markers. Common patterns to fix:
- **SPACE-CLOSE-BOLD**: `**label: **text` — space/NBSP before `**` prevents bold closing. Fix: `**label:** text`
- **GLUE**: two paragraphs merged into one line when a bare `*` separator was deleted. Fix: split at the join point with a blank line.
- **MISMATCHED**: `**text...*` opener+closer mismatch. Fix to `*text...*` (italic) or `**text...**` (bold).
- **STRAY STARS**: standalone `****` or `**` lines — delete them.
- Use Python byte-level replacement for files with Unicode (NBSP `\xc2\xa0`, curly quotes `\xe2\x80\x98`/`\xe2\x80\x99`/`\xe2\x80\x9c`/`\xe2\x80\x9d`).

### 2. Body image restoration
For pre-migration articles missing body images, fetch from WordPress (see rule above) and embed with standard MDX image syntax:
```
![alt text](/content/<category>/<subcategory>/<slug>/filename.jpg)
```

### 3. Layout reshaping (images dumped at the bottom)
The migration often dumped all body images at the end. Pull the **WP REST source** (`/wp-json/wp/v2/posts?slug=<slug>`; images are `[vc_single_image image="ID"]` shortcodes — resolve IDs via `/wp-json/wp/v2/media/<id>`) to get the original order, then interleave the images back through the article and de-glue any merged paragraphs. Replace keyword-stuffed alt text with descriptive alt. Link product/affiliate shots; leave editorial photos unlinked.

### 4. Reusable article components
- **`<EditorNote>`** (`components/mdx/EditorNote.tsx`) — boxed editorial callout: eyebrow `label` (defaults to "Editor's Note"; override e.g. `label="The Beauticate Edit"`), blurb (children), and a product card (`productImage`, `productName`, `productPrice`, `productUrl`). Pull shop product images + price from `beauticate.shop/products/<handle>.json`.
- **`hero_max_width`** frontmatter (number, px) — caps the in-article hero so a low-res holding shot is not upscaled (set ~native width, e.g. `760`). Omit for high-res heroes (defaults to 1200).
- **`<ShopGrid>` / `<ShopItem>`** — image-based "Shop The Look" product grids (`image`, `name`, `url`, optional `price`).

## Git workflow

- **`main` is a protected branch** — you cannot push to it directly or cherry-pick onto it. All changes go through a pull request.
- Work on a feature branch (one per article, e.g. `maeko/<slug>`). Make tidy, per-article commits, push, and open a PR to `main`.
- **Merging requires an approving review** — the repo owner (sigourneycantelo) approves and merges in the GitHub UI. A logged-in collaborator cannot self-approve or admin-merge.
- **Vercel auto-deploys from `main`** on merge (~2–5 min; the build includes a Pagefind search-index step). Hard-refresh (Ctrl/Cmd+Shift+R) to bypass browser cache.
- Keep local churn out of commits: before staging, run `git restore .claude/settings.local.json .claude/launch.json qa/wp-audit/*`, and stage files explicitly (avoid `git add -A`).

## Home page hero curation

The home page hero (`HeroWide`) is **editorially curated** — it is not automatically the most recent article.

When publishing a new story, always ask:
1. **"Should this article be the home page hero?"** — If yes, set `is_hero: true` in the frontmatter. Only one article should have `is_hero: true` at a time; remove the flag from the previous hero.
2. **"Please provide a landscape holding shot for the hero."** — This is a wide-crop image optimised for the full-bleed `HeroWide` banner. Save it to the article's content directory and set `hero_image: /content/<category>/<subcategory>/<slug>/hero.jpg` in the frontmatter. If no dedicated shot is provided, `featured_image` is used as fallback.

The most recent articles (by `date_published`) appear directly below the hero in `DuoLeft`, `DuoStagger`, `StoriesTrio`, etc. The hero article is excluded from those sections automatically.

## Category page order

Articles appear on category pages sorted newest-first by `date_published`. The "first 12 stories" on each page are the 12 most recent articles by date.

## Session handoff (last updated 2026-06-30)

Article-by-article cleanup in progress — front-end layout reshaping + back-end SEO — following [`docs/article-audit-and-fix.md`](docs/article-audit-and-fix.md).

**Done & deployed to `main`:**
- The Best Italian Hair Products (image shop grids, two Editor's Notes, hero cap)
- Melanie Grant / "The Exact Products…" (images interleaved per WP, Editor's Note, hero swap, de-duplicated photos)

**Open PRs awaiting review + merge:**
- **#4** — editorial intros (Melanie Grant + Italian hair)
- **#5** — Qure microstamping review (interleave images, Qure affiliate links on device/product shots, intro, Editor's Note, SEO/alt)
- **#6** — Tailwind Node 24 dev-server fix (`require` → ESM `import` in `tailwind.config.ts`; stops intermittent `next dev` crashes)

**Next:** continue cleaning articles one at a time. Given a Vercel link: pull the WP REST source, interleave images, de-glue paragraphs, fix alt text + SEO, add any Editor's Note, then branch → commit → PR.

> Remove or trim this section once the backlog is cleared — it is transient status, not a durable convention.
