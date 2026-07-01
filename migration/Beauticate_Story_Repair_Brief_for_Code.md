# Beauticate: Migrated Story Repair Brief

**For:** Claude Code
**From:** Sig (creative direction)
**Task:** Put migrated images back in their correct in-article positions across the ~1,734 migrated editorial stories, without undoing any of the content QA already done. The image files already exist locally. What is missing is their correct placement.

---

## Do this first

Do not batch anything yet. Start with a dry run on 8 to 10 stories across a few different categories, output a before and after preview, then stop and wait for sign-off. Only run the full batch once those look right.

---

## Objective

During migration the article bodies came across mangled. The image files were copied across and exist locally, but they were dumped at the foot of each story instead of sitting in their correct positions in the body. Fix the positioning so every image lands back where it belongs.

Note on italic lead lines. Beauticate never used offset pull-quote components. The emphasis was only an italic first line on some paragraphs. Restoring that italic formatting is a formatting fix, not a new component, and it overlaps with the existing bold and italic pass covering ~280 articles. Coordinate the two so they do not fight. Do not build a PullQuote component.

## Golden rule: patch, do not replace

This is not a reimport. The current articles keep everything they already have. The old WordPress content is used only as a positional map for the images. Nothing else in the current article gets overwritten. Specifically, do not touch the existing inline links, section headers, cleaned URLs, 301 redirects or FAQ/AEO blocks.

## Source of truth

Use the WordPress export as the source of truth. The file is `beauticate.WordPress.2026-06-23.xml` (about 214 MB), currently in Google Drive under BEAUTICATE / 7. Web Development. It is a faithful snapshot. The old WordPress site has not changed since the export, so this file is current and no fresh export is needed. Every post's original HTML lives inside `<content:encoded>`, with images in their true positions. This is cleaner than scraping the live site, works fully locally and has no rate limits.

Because the file is large, parse it once and extract only what is needed per post (the ordered list of image URLs and their positions). Work from that small derived map rather than committing the 214 MB XML into the repo.

Fallback: if a post is missing from the export, the site is still live at beauticate.com, so pull that post's original HTML via the WordPress REST API (`/wp-json/wp/v2/posts?slug=...`).

## Matching

Match each current article to its WordPress source by slug or post ID. If slugs changed during migration, use the mapping you already built during the redirect work.

## Parse and map

Walk the original `<content:encoded>` as an ordered list of blocks and map each to the current content model:

- `<img>` in position becomes an inline Image block in the same position. Carry the alt text and caption across.
- An italic run at the start of a paragraph (an `<em>` or `<i>`) keeps its italic formatting. This overlaps with the bold and italic pass, so coordinate the two.
- `<h2>` and `<h3>` become section headers.
- `<p>` stays a body paragraph.
- `<a>` stays an inline link.

Only insert or move the images that are missing or misplaced. Leave the rest of the current article as is.

## When the current body was rewritten

Some stories (for example the Rae Morris interview) had their bodies restructured into new thematic sections, so the paragraph text no longer matches the source one to one. For these, place images by relative position. If an image sat roughly 40 percent of the way through the original, drop it around 40 percent through the current body, snapped to the nearest paragraph break. Then flag the story for the AI pass below.

## AI placement pass (fallback and refinement)

For stories where the source order cannot be recovered, or the body was heavily rewritten, run an LLM pass per article:

- Input: the current article text plus the ordered list of images with their alt text and captions.
- Output: the best paragraph index to insert each image.

Use the deterministic map wherever possible. Only reach for the AI pass where the map cannot place things confidently.

## Process

1. Dry run on 8 to 10 stories across different categories. Output a before and after preview or a diff, then stop for sign-off.
2. Once approved, run the full batch across all ~1,734, unattended, ideally on an overnight run.
3. Produce a short report: how many repaired cleanly from source, how many needed the AI pass, and any that failed to match so they can be reviewed by hand.

## Guardrails

- Never overwrite existing links, section headers, FAQ/AEO blocks or redirects.
- Never delete body text.
- Commit a backup before the batch so any article can be reverted.
- Preserve image alt text. It matters for SEO and AEO.

## QA

Mako spot-checks a sample per category on the rendered pages, not every article. Start QA with the categories already cleaned: Skin Care, Makeup, Fragrance.
