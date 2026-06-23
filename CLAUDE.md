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

## Category page order

Articles appear on category pages sorted newest-first by `date_published`. The "first 12 stories" on each page are the 12 most recent articles by date.
