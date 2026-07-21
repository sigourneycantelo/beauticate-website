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
- Ask the user which image is the featured/holding image if not specified

### 2. Build the MDX file with audit baked in

Create the MDX at `content/<category>/<subcategory>/<slug>/<slug>.mdx` with these standards applied during creation — not as a follow-up:

**Frontmatter (all fields required):**
- `title` — the article headline
- `slug` — URL-safe, matches directory name
- `category` and `subcategory` — from category mapping
- `excerpt` — 1-2 sentence summary for cards/feeds
- `featured_image` — path to holding image: `/content/<category>/<subcategory>/<slug>/holding.jpg`
- `featured_image_alt` — descriptive alt text for the featured image
- `featured_image_caption` — format: `"Article Title - subcategory feature on Beauticate"`
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
- Featured image renders at the top in 16:9 aspect ratio
- All body images display (not just alt text)
- ShopGrid product cards show with images and prices
- Internal links resolve
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
