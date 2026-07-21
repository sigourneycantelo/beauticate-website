# WordPress Migration Fix Rules

Rules and patterns established during the batch cleanup of articles migrated from
WordPress to Next.js/MDX. Use this as a checklist when fixing individual articles
or writing batch-fix scripts.

> See also: [`article-audit-and-fix.md`](./article-audit-and-fix.md) for the
> end-to-end audit process, and [`CLAUDE.md`](../CLAUDE.md) for project-wide
> rules (hero curation, WordPress source rule, portrait images).

---

## 1. Bold/italic delimiter fixes

WordPress migration introduced broken italic/bold markers. Four common patterns:

| Pattern | Example | Fix |
|---------|---------|-----|
| **Colon-glue** | `:**screens` | `: **screens` |
| **Paren-glue** | `)**word` | `) **word` |
| **Bold-bracket-glue** | `word**[link` | `word **[link` |
| **Preposition-glue** | `on**[Spotify` | `on **[Spotify` |
| **Space-close-bold** | `**label: **text` | `**label:** text` |
| **Glue (merged paragraphs)** | Two paragraphs on one line after bare `*` deleted | Split at join point with blank line |
| **Mismatched** | `**text...*` | `*text...*` or `**text...**` |
| **Stray stars** | Standalone `****` or `**` lines | Delete them |

### Technical notes

- Use Python byte-level replacement for files with Unicode: NBSP `\xc2\xa0`,
  curly quotes `\xe2\x80\x98` / `\xe2\x80\x99` / `\xe2\x80\x9c` / `\xe2\x80\x9d`.
- Regex for colon-glue: `(:\s*)\*\*(\w)` with lookahead to avoid false positives
  inside URLs or code.
- Always verify fixes don't break existing valid bold/italic (e.g. `**bold:**` is
  correct and should not be altered).

---

## 2. YouTube video embeds

Many video articles (`video-*` slugs and others) were migrated without their
YouTube player. The video was typically embedded via an Elementor widget or
iframe on WordPress.

### Rules

- Use the `<YouTubeEmbed>` component with a `url` prop (NOT `videoId`):
  ```mdx
  <YouTubeEmbed url="https://www.youtube.com/watch?v=VIDEO_ID" />
  ```
- The component lives at `components/mdx/YouTubeEmbed.tsx` and extracts the
  11-char ID internally via regex.
- Place the embed after the intro paragraph, before any `### Shop the Look` or
  credits section.
- To find the YouTube ID from WordPress: scrape the WP page HTML and search for
  `youtube.com/embed/`, `youtu.be/`, or Elementor widget data
  (`youtube_url` in JSON-encoded `data-settings` attributes).
- Some videos are not on YouTube (or the WP page had no embed). Skip those.

### Batch approach

1. Fetch each WP page and extract YouTube IDs via regex.
2. Save results to a JSON manifest for review before applying.
3. Insert `<YouTubeEmbed>` into each MDX file after the first paragraph break.

---

## 3. WordPress comment text removal

Some articles had WordPress visitor comments migrated as article body content.
This happens when the migration script picked up `<div class="comment-body">`
content instead of (or in addition to) the actual article.

### Detection patterns

Lines starting with: `Great `, `Love `, `Loved `, `Amazing `, `Beautiful `,
`Wonderful `, `Fantastic `, `Just watching`, `I love `, `Do you `, `Hi `,
`Thanks `, `OMG `, `Wow `, `Can you`, `I LOVE`, `Great video`, `What a great`,
and similar conversational openers.

### Rules

- Strip comment text entirely.
- Fetch the real intro/body from WordPress and replace.
- If the WP article is video-only (no editorial body text), keep just the intro
  line + YouTube embed + credits/shop grid.

---

## 4. Body image restoration

### Serving path

Images in `public/content/...` serve at `/content/...` paths. Images placed in
the source `content/` directory do NOT serve unless also copied to `public/content/`.

### Filename rules

- **No spaces in filenames.** Spaces break markdown image URLs. Rename with
  hyphens: `Dr. Shefali and Oprah.jpg` becomes `dr-shefali-and-oprah.jpg`.
- Use lowercase, hyphenated filenames for consistency.

### Broken image detection

- Look for `![alt](/content/...path...)` references where the file does not exist
  in `public/content/`.
- For podcast/vodcast articles, many broken image refs point to GIFs/PNGs that
  were WordPress decoration (social icons, dividers). Remove these entirely.
- Use fuzzy filename matching (`difflib.SequenceMatcher`) to pair broken refs to
  available files when filenames have changed.

### Downloading from WordPress

- Fetch body images from `https://www.beauticate.com/wp-content/uploads/...`
- Save to the article's `public/content/<category>/<subcategory>/<slug>/` directory.
- Reference with local path: `![alt text](/content/<category>/<subcategory>/<slug>/filename.jpg)`

---

## 5. Subscribe box placement

The `<SubscribeBand />` is injected at ~50% of article content by the
`withSubscribeBand()` function in `components/article/ArticlePage.tsx`.

### Rules

- **Never place between a heading and its related content.** Skip positions where
  the next line starts with `#` (heading) or `<` followed by uppercase (MDX component).
- **Remove from short articles.** Measure text-only content length (strip HTML tags
  and image markdown) and skip if under 1500 characters.
- The text-only measurement is important: long `<ShopItem>` image paths inflate
  raw character count, so `reading_time: 1` articles with shop grids can appear
  longer than they are.

---

## 6. Hero image rules

### Width

- Desktop hero is capped at `max-w-[1200px]` and centered (`mx-auto`).
- Mobile hero is full-width at 3:4 aspect ratio.
- Desktop uses 16:9 aspect ratio.

### Source

- For pre-migration articles, the correct hero is the WordPress `og:image` or
  featured image. Fetch from the WP page if the current hero looks wrong.
- Hero images that were not part of the original WP article should be removed
  (e.g. stock photos or unrelated images added during migration).

---

## 7. Image and file conventions

| Rule | Detail |
|------|--------|
| No spaces in filenames | Breaks markdown image URLs |
| No image upscaling | Never stretch beyond original pixel dimensions |
| Portrait images | Use `<Portrait>` component, not `![]()`, alternating sides |
| Content images path | Must exist in `public/content/...` to serve at `/content/...` |
| `wp-content/uploads/` paths | Images at these CDN paths don't need re-hosting unless broken |

---

## 8. Git workflow

### Clean state (current)

Local `main` and `origin/main` are in sync. Direct push works:

```bash
git push origin main
```

### If divergence recurs

If a direct push fails with non-fast-forward, do NOT use the cherry-pick
workaround repeatedly. Instead, verify all local commits exist on remote (compare
by commit message), then reset:

```bash
git fetch origin main
git reset --hard origin/main
```

This avoids the accumulating SHA divergence that the cherry-pick workflow causes.

### Untracked author images

Several author headshot PNGs in `public/images/authors/` are untracked. These can
conflict during branch operations. Back them up to `/tmp/` before any checkout
that might clobber them, and restore after.

---

## 9. Batch fix script patterns

### Rate limiting for WP fetches

Use 0.3s delays between requests when batch-fetching from WordPress to avoid
rate limiting.

### Safe regex replacements

- Always test on a dry-run pass first (print changes without writing).
- Use Python byte-level replacement for files with Unicode characters.
- Verify fixes don't break valid markdown (e.g. bold inside URLs).

### Fuzzy image matching

When broken image refs don't exactly match available files, use
`difflib.SequenceMatcher` with a threshold of ~0.4 to find the closest match.
Log all matches for review.
