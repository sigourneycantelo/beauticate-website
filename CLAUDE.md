# Beauticate Website — Claude Notes

## Project overview

Beauticate is a beauty/lifestyle editorial site migrated from WordPress to Next.js (app router) on Vercel. Content lives in `content/<category>/<subcategory>/<slug>/<slug>.mdx` files rendered via `next-mdx-remote`.

## Local development — do NOT run from a cloud-synced folder

**`next dev` breaks when the repo lives in a cloud-synced directory** (iCloud "Desktop & Documents", or Google Drive):

- **iCloud (e.g. `~/Desktop/...`):** the file watcher throws `Watchpack Error: EINTR: interrupted system call` and the first page compile hangs — the server looks "down" even though it started.
- **Google Drive (`~/Library/CloudStorage/GoogleDrive-.../`):** native `node_modules` binaries get SIGKILL'd, and local git refs/objects get torn.

**Fix:** keep the working copy in a plain, non-synced local folder such as `~/dev/` or `~/code/` (anything under Home that is *not* Desktop, Documents, or Drive):

```bash
git clone https://github.com/sigourneycantelo/beauticate-website.git ~/dev/beauticate-website
cd ~/dev/beauticate-website && npm install
cp /path/to/existing/.env.local .env.local   # bring your env over
npm run dev                                    # localhost:3000, fast + stable
```

If port 3000 shows "in use" from a hung server: `lsof -tiTCP:3000 | xargs kill -9`.

**Previewing the latest without local dev:** the Vercel deploy of `main` is always a full, current preview — use that URL rather than fighting a synced-folder dev server. (Because local git is unreliable on Drive, changes are pushed to `main` via the GitHub API and verified against the live deploy.)


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

## Git workflow

- Feature branch: `claude/vercel-article-cleanup-duw0tz`
- **Always push fixes to BOTH the feature branch AND `main`** — Vercel deploys from `main`.
- Use cherry-pick via temp branch to push to main (branches have diverged):
  ```
  git fetch origin main
  git checkout -b tmp-main-push origin/main
  git cherry-pick <commit>
  git push origin tmp-main-push:main
  git checkout claude/vercel-article-cleanup-duw0tz
  git branch -D tmp-main-push
  ```

## Home page hero curation

The home page hero (`HeroWide`) is **editorially curated** — it is not automatically the most recent article.

When publishing a new story, always ask:
1. **"Should this article be the home page hero?"** — If yes, set `is_hero: true` in the frontmatter. Only one article should have `is_hero: true` at a time; remove the flag from the previous hero.
2. **"Please provide a landscape holding shot for the hero."** — This is a wide-crop image optimised for the full-bleed `HeroWide` banner. Save it to the article's content directory and set `hero_image: /content/<category>/<subcategory>/<slug>/hero.jpg` in the frontmatter. If no dedicated shot is provided, `featured_image` is used as fallback.

The most recent articles (by `date_published`) appear directly below the hero in `DuoLeft`, `DuoStagger`, `StoriesTrio`, etc. The hero article is excluded from those sections automatically.

## Product card design rules

All product cards use the single `ProductTile` component (`components/shared/ProductTile.tsx`). Never create alternative product card components.

**Structure — two halves:**
1. **Image area (top)** — portrait 3:4 aspect ratio. Two modes:
   - *De-etched* (default): pack shot on greige (`bg-tile`) background. Used for beauty products with clean cut-out images.
   - *Lifestyle/editorial* (`cover={true}`): model shot, flat-lay, or contextual image. These keep their own background — no greige overlay.
2. **Text area (bottom)** — **always white background**. Brand name (uppercase sans), product name (serif), price (smaller, muted). This must blend into the white page, never sit on greige.

The white text strip is the constant across both modes. The image area is the variable. This consistency is what makes a grid of mixed product shots look curated. Reference: SheerLuxe product cards.

**Image rule:** Product images in ShopItem cards must always be de-etched product shots — the product on a neutral or transparent background, outside its retail packaging. Never use retail box or packaging shots. This applies to all product cards site-wide.

## Category page order

Articles appear on category pages sorted newest-first by `date_published`. The "first 12 stories" on each page are the 12 most recent articles by date.
