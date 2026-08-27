# RSS feed and news sitemap

Machine-readable listings of recent articles, built for the Instagram carousel
automation. Both read the same selection logic in [`lib/feed.ts`](../lib/feed.ts),
so they can never disagree about what counts as a published article.

| URL | Route | Rendering |
| --- | --- | --- |
| `/feed.xml` | `app/feed.xml/route.ts` | static, `revalidate = 3600` |
| `/sitemap-news.xml` | `app/sitemap-news.xml/route.ts` | `force-dynamic` |
| `/robots.txt` | `app/robots.txt/route.ts` | static |

Discovery: `<link rel="alternate" type="application/rss+xml">` in `<head>` on
every page (`app/layout.tsx` → `metadata.alternates.types`), plus an
`# RSS feed:` line in `robots.txt`.

## What the feed contains

The 50 most recently published articles, newest first by `date_published`.

**Excluded, deliberately:**

- `published: false` — drafts and hidden directory listings.
- Anything with a `venueType` — a directory venue listing, not an article. Well
  over a hundred of them share one bulk `date_published` (`2026-01-15`), so
  including them would swamp the feed with a single day's import.
- `date_published` in the future — scheduled, not published.

**Included, deliberately:** vodcast episodes. They are published editorial with a
title, date, excerpt, byline and image at their own article-shaped URL, and the
automation would otherwise never see a new episode. Their `<category>` elements
come from the path (`vodcast` / `episodes`) since their frontmatter has no
`category` field.

Index pages, static pages, the shop and the homepage cannot reach the feed at
all: they are app routes, and `getArticleSlugs()` only yields a `content/`
directory that contains its own `<name>.mdx`.

## Fields that need explaining

### `<guid isPermaLink="false">`

`tag:beauticate.com,2026:article/<slug>` — an RFC 4151 tag URI built on the
**slug**, not the URL.

The URL is the part that moves. This site re-files articles between
subcategories, which rewrites the path and leaves the slug untouched;
`middleware.ts` and `data/redirect-slug-map.json` both exist to catch exactly
that, and both key off the slug. A URL-based guid would make every re-filed
article look brand new and get it posted to Instagram a second time.

There is no immutable id in the content model. The slug is the most stable
identifier that exists today. If a slug is ever changed, its guid changes with
it and the automation will treat it as a new article.

### `<pubDate>`

Original publish date, always — `date_published`, never `date_modified`. The
site does not treat an update as a republish (`app/sitemap.ts` and the article
pages both read `date_published`), so neither does the feed.

Every `date_published` in `content/` is a bare `YYYY-MM-DD` with no time and no
offset. A bare date is read as **midnight in Australia/Sydney**, DST-aware, not
as UTC — read as UTC it lands on the previous calendar day for much of the world,
so a story published on the 20th would syndicate as the 19th.

### `<bc:heroImage>` / `<bc:thumbnail>`

`heroImage` is the landscape holding shot (`hero_image`), `thumbnail` the
portrait (`thumbnailPortrait`). Only 11 articles carry a dedicated `hero_image`
and one a `thumbnailPortrait`, so both fall back to `featured_image` exactly as
`HeroWide` / `ArticleHero` do. That means the two can be the same URL.

Both carry `width` and `height` read off the file in `public/`, so the consumer
can tell which shape it actually got rather than trusting the element name. A
remote (legacy WordPress CDN) image yields a URL with no dimensions.

### `<bc:isGuestPost>`

True when the byline is a contributor rather than Beauticate's own masthead,
resolved against the author registry in `lib/authors.ts`: any role starting
"Contributing" is a contributor, any other role containing "Editor" is masthead,
as are `Sigourney Cantelo` and `Beauticate Editorial`. An unknown byline counts
as a guest — assuming a stranger is staff is the worse error.

### Products

Beauticate places products through four surfaces, and the feed reads all of
them. Frontmatter alone would have been useless: 38 articles carry
`product_links`, against 714 in-body product cards.

| Surface | Read from |
| --- | --- |
| `product_links` frontmatter | `type: shop` / `affiliate` / `external` |
| `<InlineProduct handle>` | body |
| `<ShopItem handle \| url>` | body |
| `<ProductInset url>` | body |
| `<CollectionEmbed handle>` | body → `<bc:shopCollections>` |
| `shop_collection` frontmatter | → `<bc:shopCollections>` |

**shop** = resolves to a Beauticate Shop listing: a Shopify `handle` or a
`/shop/products/<handle>` link.
**affiliate** = any outbound product link. `ProductTile` renders every one of
these `rel="sponsored"`, so "outbound product link" and "affiliate placement"
are the same set as far as the rendered page is concerned; `product_links` type
`external` lands here for that reason.

Excluded from both: `type: 'dead'` links (they render nothing) and product cards
with no link at all (WordPress-migration leftovers, not placements).

The `related_products` and `related_collections` frontmatter fields are
deliberately not read: they are declared in `ArticleFrontmatter` but set on no
article and consumed by no component, so their contents are unverified.

`<bc:shopCollections>` lists an embedded collection by handle rather than
enumerating its products — the repo holds only the handle, the membership lives
in Shopify. `<bc:hasShopProducts>` is true when there is at least one shop
product **or** one shop collection.

Product titles come from the editorial `name` in the repo, not from Shopify: the
feed does no network I/O, which is what keeps it free to render. A handful of
`<InlineProduct handle>` placements carry no `name`, so `<bc:title>` is omitted
for those rather than fabricated — the `handle` and `url` are always present.

## Caching

`/feed.xml` renders once per build and is then served from the edge with an
hourly revalidation.

Content lives in this repo, so **publishing an article is a deploy** — the
article is in the feed the moment that deploy goes live, without waiting for the
hour. The hourly revalidation only covers the one case a deploy cannot: an
article whose `date_published` is in the future crossing its own date. Cost is
one filesystem walk an hour instead of one per reader.

`/sitemap-news.xml` is the opposite and must stay `force-dynamic`: its 48-hour
window slides continuously, so a copy generated at build time starts advertising
articles that have aged out and can never list one published after the build.
See the note in `app/sitemap.ts` about the same class of failure being served in
production for weeks.

**It is normal for `/sitemap-news.xml` to be empty.** Beauticate publishes
weekly, not daily, so nothing falls inside Google's 48-hour window most of the
time. The route emits an XML comment saying so.
