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

## Directory listings (`content/destinations/{clinics,salons,spas-retreats,bathhouses,wellness}`)

**`published: false` is a deliberate, sticky editorial decision — never touch it in bulk.** A listing gets drafted for real reasons (bad/missing holding shot, venue closed, details stale) and must stay draft until someone actually fixes that reason. Never run a blanket "publish everything" pass — a past cleanup session did exactly that and silently republished every listing that had been deliberately hidden, including ones with no photo at all.

- **Always check `draft_reason`** before changing a listing's `published` status. It's required whenever `published: false` — record *why*, not just that it's hidden, so the next person (human or Claude) doesn't have to guess or re-discover it.
- **Re-filing a listing to a new subcategory means `git mv`, not copy-and-leave-the-original.** Several listings exist twice — once at a stale `clinics/` (or similar) path and once at the corrected path — because a re-file copied the file instead of moving it. When you copy content to a new path, delete or draft the old one in the same change; don't leave an orphaned duplicate.
- **Before publishing or unpublishing any listing, check for near-duplicates first** — same venue name filed under a different subcategory/slug is the recurring failure mode here. `scripts/audit-directory-duplicates.py` does this check; run it before any bulk directory work.

## Git workflow

**Open a pull request. Do not push straight to `main`.** The repo has branch
protection requiring a PR, and bypassing it caused real problems: every push to
`main` had to be a cherry-pick, which made the feature branch and `main` diverge,
and a later merge of that branch would have silently reverted the
shop.beauticate.com redirects in `vercel.json` along with several other files
that had moved on `main` in the meantime.

```
git checkout -b claude/<short-description> origin/main   # always branch from main
# ... work, commit ...
git push -u origin claude/<short-description>
gh pr create --fill                                       # then merge in GitHub
```

Rules that follow from this:

- **Branch from `origin/main`, never from another feature branch.** A branch cut
  from a stale base is how work gets reverted on merge.
- **Never cherry-pick to `main` to get something live.** Merge the PR instead.
  Vercel deploys `main` on merge, so the PR is the deploy.
- **Check `git diff origin/main <branch> --name-only` before merging.** If files
  you never touched appear, your base is stale: rebase onto `origin/main` first.
- If something genuinely must ship before review (a live compliance breach, for
  example), say so explicitly and get a human to confirm, rather than bypassing
  the protection rule quietly.

### Generated files

`docs/audit/testimonial-audit.{csv,md}` and `lines-to-fix.json` are rebuilt by
the audit scripts and are gitignored. `docs/audit/tga-review.xlsx` stays tracked
because it records which fixes were approved. `data/chat-index.json` stays
tracked deliberately: Ask Sig reads it at runtime and it has not been verified
to survive as a build-only artefact.

## Home page hero curation

The home page hero (`HeroWide`) is **editorially curated** — it is not automatically the most recent article.

When publishing a new story, always ask:
1. **"Should this article be the home page hero?"** — If yes, set `is_hero: true` in the frontmatter. Only one article should have `is_hero: true` at a time; remove the flag from the previous hero.
2. **"Please provide a landscape holding shot for the hero."** — This is a wide-crop image optimised for the full-bleed `HeroWide` banner. Save it to the article's content directory and set `hero_image: /content/<category>/<subcategory>/<slug>/hero.jpg` in the frontmatter. If no dedicated shot is provided, `featured_image` is used as fallback.

The most recent articles (by `date_published`) appear directly below the hero in `DuoLeft`, `DuoStagger`, `StoriesTrio`, etc. The hero article is excluded from those sections automatically.

### Every article needs BOTH a landscape holding shot and a portrait thumbnail

The site surfaces each article in two shapes, and there are two frontmatter fields to match:

- **`hero_image`** = the **landscape** holding shot (~2:1). Used full-bleed for the home hero (`HeroWide`) and the article's own top banner (`ArticleHero`). A triptych works well.
- **`featured_image`** = the **portrait** thumbnail (~3:4). Used for every grid card / thumbnail site-wide (`StoriesTrio`, `DuoLeft`, `DuoStagger`, `HeroSplit`, `ArticleCard`, …).

**Always set both.** The code falls back to `featured_image` when `hero_image` is missing (`HeroWide.tsx`, `ArticleHero.tsx`) — which silently stretches the portrait thumbnail into the wide hero slot and crops it badly. That fallback is a safety net, **not** the intended state: if a landscape holding shot exists in the article directory (e.g. `holding.jpg`), wire it to `hero_image`. Never leave a real holding shot orphaned while the hero renders a cropped portrait.

### Image orientation — bake it in

Phone photos carry an EXIF orientation flag. Downloading/processing frequently strips the flag without applying the rotation, leaving portrait shots stored as sideways landscape pixels. **Always auto-rotate images so the pixels themselves are upright** (`PIL.ImageOps.exif_transpose`), then view the result to confirm. A portrait must end up taller than it is wide. (Fix applied to the Colette cancer article: 11 selfies were sideways and had to be rotated 90°.)

## Editorial voice & attribution — the Ed's note rule

In a bylined first-person piece, **never put words in the author's mouth.** Do not invent sentences and slip them into the author's voice — not even to carry an SEO internal link. Authors notice words they never wrote (this happened on Colette Harvey's cancer piece, where inserted first-person link-bridge sentences read as hers).

When the publication needs to add its own words to someone else's first-person story — an editorial aside, a "related reading" internal link — mark it explicitly as an **Ed's note** so it's clearly Beauticate's voice, not theirs. Convention (see existing usage, e.g. `sigourneys-edit-wolgan-valley`): a blockquote italic aside —

```
> *Ed's note: If you're drawn to this, our [guide to X](/link) is a good place to start.*
```

Prefer weaving internal links onto words the author actually wrote; fall back to an Ed's note only when there's no natural anchor. The italicised intro standfirst and closing resource lines are already understood as editorial framing and don't need the label.

## Links — open in a new tab

Readers should never be navigated away from what they're reading.

### Article body links (MDX content)
**All links** in article/vodcast body content open in a new tab — both internal and external. This is handled by the custom `a` component in `ArticlePage.tsx` and the vodcast episode page. No action needed for inline markdown links.

### Component / page links outside article bodies
- **External `<a>` tags**: add `target="_blank" rel="noopener noreferrer"`.
- **Next.js `<Link>`** pointing to an external URL: add `target="_blank" rel="noopener noreferrer"`.
- **Affiliate / sponsored links**: use `target="_blank" rel="sponsored noopener"` (the existing convention).
- **Site navigation** (header, footer, nav menus, article cards): stays in the same tab — these are how readers browse, not mid-read departures.

## Product card design rules

All product cards use the single `ProductTile` component (`components/shared/ProductTile.tsx`). Never create alternative product card components.

**Structure — two halves:**
1. **Image area (top)** — portrait 3:4 aspect ratio. Two modes:
   - *De-etched* (default): pack shot on greige (`bg-tile`) background. Used for beauty products with clean cut-out images.
   - *Lifestyle/editorial* (`cover={true}`): model shot, flat-lay, or contextual image. These keep their own background — no greige overlay.
2. **Text area (bottom)** — **always white background**. Brand name (uppercase sans), product name (serif), price (smaller, muted). This must blend into the white page, never sit on greige.

The white text strip is the constant across both modes. The image area is the variable. This consistency is what makes a grid of mixed product shots look curated. Reference: SheerLuxe product cards.

**Image rule:** Product images in ShopItem cards must always be de-etched product shots — the product on a neutral or transparent background, outside its retail packaging. Never use retail box or packaging shots. This applies to all product cards site-wide.

## Editorial category layout

All category and subcategory archive pages use the same **editorial magazine layout** — a repeating pattern of layout components fed by articles sorted newest-first. The shared component is `components/shared/EditorialSections.tsx`.

**The pattern (repeating cycle):**

1. **HeroSplit** — latest article, image left + headline right
2. **StoriesTrio** — strip of 3 article cards
3. **ShopStrip** — horizontal product rail (once only, first cycle only, only when the category/subcategory has a matching Shopify tag: `beauty-style→beauty`, `wellness→wellness`, `skincare`, `makeup`, `fragrance`, `hair`)
4. **DuoStagger** — asymmetric duo with staggered right card (scrim overlay text)
5. **StoriesTrio** — strip of 3
6. **HeroSplit** — single highlighted article
7. **DuoLeft** — asymmetric duo, larger left card (scrim overlay text)
8. **StoriesTrio** — strip of 3
9. Repeats from step 2 (without ShopStrip on subsequent cycles)

**Which pages get it:**
- `beauty-style`, `wellness`, `living` — full editorial layout (category + subcategory pages)
- `interviews` — editorial layout below the intro header + A–Z link
- `destinations/travel` — editorial layout below the full-bleed hero + "Where do you want to go?" feeling tiles
- `vodcast` (podcast) — editorial layout below the ThemeArchive ("Find your next listen") section
- `destinations/directory` — keeps its own directory-specific layout (no editorial)

**RSC payload rule:** Only pass `{ frontmatter }` to `EditorialSections` — strip `content` and `products` fields. Serialising full MDX bodies for 34 articles blows Vercel's RSC payload limit. Cap at `MAX_EDITORIAL = 34` articles.

**Image crop:** All editorial components use `object-[50%_20%]` (not `object-top`) so portrait crops keep headroom and don't chop off the top of heads.

## Category page order

Articles appear on category pages sorted newest-first by `date_published`. The "first 12 stories" on each page are the 12 most recent articles by date.
