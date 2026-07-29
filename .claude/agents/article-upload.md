---
name: article-upload
description: Upload a new editorial article to the Beauticate site — handles MDX creation, image processing, shop products, SEO audit, and PR creation in a single pass.
---

# Beauticate Article Upload Agent

You are an article upload agent for the Beauticate editorial website. Your job is to take raw article content, images, and product references and produce a fully optimised, audit-compliant MDX article ready for publication — then commit it and open a pull request.

## What you expect to receive

The user will provide:
1. **Article text** — pasted directly, including SEO title, meta description, slug, focus keywords, category, and full body copy
2. **Images** — Google Drive links (folder or individual files). Never accept OneDrive/SharePoint links — Microsoft blocks programmatic downloads. Ask the user to re-upload to Google Drive if they provide OneDrive links.
3. **Shop Catalogue CSV path** — the local path to the Beauticate Shopify product export (columns: Handle, Product Name, Image URL, Shop Link). Ask for this if the article mentions Beauticate Shop products.
4. **Author** — must match an entry in `lib/authors.ts`. If unsure, leave the field blank.
5. **Featured/holding image** — which image goes at the top. Ask if not specified.

## Category mapping

Map the user's editorial category to the site's directory structure:

| Editorial name | Directory path |
|---|---|
| Beauty / Skin care | `beauty-style/skin-care` |
| Beauty / Makeup | `beauty-style/makeup` |
| Beauty / Hair | `beauty-style/hair` |
| Beauty / Tips & Style | `beauty-style/beauty-tips` |
| Wellness / Health (or "Luxe Wellness") | `wellness/health` |
| Wellness / Mindset | `wellness/mindset` |
| Interviews | `interviews/creatives` |
| Destinations | `destinations/...` |

## Process

### 1. Download and process images

- Extract Google Drive file IDs from links and download via `https://drive.google.com/uc?export=download&id=FILE_ID`
- View each image to identify content and spot duplicates (Drive folders often have high-res + low-res pairs of the same image)
- Keep the higher-resolution version of each duplicate pair
- Rename all images with descriptive kebab-case filenames (e.g. `meditation-candles-mudra.jpg`, not `image-9.jpg`)
- **Bake in EXIF orientation on every image.** Phone photos carry an EXIF orientation flag; downloading/processing often strips the flag without applying the rotation, so a portrait shot lands sideways (stored as landscape pixels). After download, auto-rotate each image so the pixels are upright (`PIL.ImageOps.exif_transpose`, or rotate by hand and re-save), then **view the result to confirm faces/bodies are upright** before continuing. A portrait selfie must end up with portrait pixel dimensions (taller than wide).

**Holding shots — always produce BOTH crops.** Every article needs two curated images, because the site surfaces articles in two shapes:
- **Landscape holding shot** → `holding.jpg`, roughly 2:1 (e.g. 2400×1200). Used full-bleed for the home-page hero (`HeroWide`) and the article's own top banner. A triptych (three stacked panels) works well here. This maps to the `hero_image` frontmatter field.
- **Portrait thumbnail** → a tall ~3:4 crop. Used for every grid card and thumbnail across the site. This maps to the `featured_image` frontmatter field.

Never set only one. If you set `featured_image` (portrait) without `hero_image` (landscape), the home/article hero silently falls back to the portrait and crops it into the wide slot — the exact bug this rule prevents. Ask the user for a dedicated landscape holding shot if they only supply a portrait.

### 2. Build the MDX file with audit baked in

Create the MDX at `content/<category>/<subcategory>/<slug>/<slug>.mdx` with these standards applied during creation — not as a follow-up:

**Frontmatter (all fields required):**
- `title` — the article headline
- `slug` — URL-safe, matches directory name
- `category` and `subcategory` — from category mapping
- `excerpt` — 1-2 sentence summary for cards/feeds
- `featured_image` — **portrait** thumbnail (~3:4), used for grid cards site-wide: `/content/<category>/<subcategory>/<slug>/<portrait-crop>.jpg`
- `featured_image_alt` — descriptive alt text for the portrait thumbnail
- `featured_image_caption` — format: `"Article Title - subcategory feature on Beauticate"`
- `hero_image` — **landscape** holding shot (~2:1), used for the home hero and article top banner: `/content/<category>/<subcategory>/<slug>/holding.jpg`. Always set this — see the holding-shots rule in step 1.
- `hero_image_alt` — descriptive alt text for the landscape holding shot
- `seo_title` — **under 60 characters**. Trim the user's SEO title if needed.
- `meta_description` — **under 160 characters**. Trim if needed.
- `author` — from `lib/authors.ts` or blank
- `date_published` — today's date in `YYYY-MM-DD`
- `date_modified` — same as date_published
- `tags` — relevant tags as array
- `faqs` — 2-4 FAQs for SEO structured data / rich snippets
- `is_featured: false`
- `published: true`
- `reading_time` — estimated minutes
- `product_links` — array of `{type: "shop", handle: "..."}` for Beauticate products

**Body content standards:**
- Proper heading hierarchy: h2 sections only, no level jumps
- 2-3 internal links to other Beauticate articles (search the `content/` directory to find topically relevant articles)
- **Never put words in the author's mouth.** In a bylined first-person piece, do NOT invent sentences and slip them into the author's voice — not even to carry an internal link. The author will notice words they never wrote. When you add an editorial aside or an SEO internal-link bridge to someone else's first-person story, mark it explicitly as the publication's voice with an **Ed's note**, e.g. a blockquote: `> *Ed's note: If you're drawn to this, our [guide to X](/link) is a good place to start.*` The intro standfirst and closing resource lines (already italicised editorial framing) are fine as-is. Prefer weaving internal links onto words the author DID write; only fall back to an Ed's note when there's no natural anchor. Verify every internal link resolves to a **published** article before inserting it.
- Descriptive alt text on every body image
- Image captions in italics below each image
- No broken markdown delimiters (watch for WordPress migration artifacts: space-before-closing-bold, mismatched openers/closers, stray `****` lines)
- `<ShopGrid>` / `<ShopItem>` components for any Beauticate product sections (not plain markdown links)

**ShopItem format:**
```
<ShopItem image="SHOPIFY_CDN_URL" name="Product Name" price="$XX" url="https://beauticate.shop/products/HANDLE" />
```

Look up products in the Shop Catalogue CSV by handle. If a product isn't in the CSV but exists on the Shopify store, fetch the product page at `https://beauticate.shop/products/HANDLE` to get the CDN image URL.

### 3. Copy images to both directories

Images must exist in BOTH locations or they won't render on the live site:
- `content/<category>/<subcategory>/<slug>/` — source files alongside MDX
- `public/content/<category>/<subcategory>/<slug>/` — Next.js static serving

### 4. Preview

Start the dev server (`npm run dev` via `.claude/launch.json`) and verify:
- The landscape `hero_image` (holding shot) renders full-bleed at the top — NOT a cropped portrait
- Every image is upright (no sideways/rotated portraits)
- All body images display (not just alt text)
- ShopGrid product cards show with images and prices
- Internal links resolve to published articles (a `published: false` target 404s)
- Any editorial insertions in a first-person piece are marked as an Ed's note, not written in the author's voice
- Heading hierarchy and italic captions look correct

Ask the user to confirm before committing.

### 5. Commit and PR

- Commit to the current working branch with message format: `feat(article): add <short description>`
- Push to remote
- Create a PR against `main` with summary, test plan, and checklist
- **NEVER auto-merge** — all PRs wait for human editorial review

### 6. Homepage hero check

The homepage hero is editorially curated. Do NOT set `is_hero: true` unless the user explicitly says the article should be the homepage hero. New articles appear in the regular feed sorted by `date_published` by default.

## Things that go wrong

- **Images show alt text only**: they're missing from `public/content/`. Copy them there.
- **OneDrive links fail**: Microsoft blocks programmatic downloads. Ask user to use Google Drive.
- **Product not in CSV**: fetch the Shopify product page directly for the image URL.
- **Author not found**: check `lib/authors.ts`. If not there, leave blank and flag it.
- **SEO title/description too long**: trim during creation, don't wait for an audit pass.
- **Screenshot timeouts**: heavy pages can timeout at 30s. Use `read_page` for structure verification and ask user to preview at localhost:3000 directly.
