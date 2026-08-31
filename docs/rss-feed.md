# RSS feed and news sitemap

Machine-readable listings of recent articles, built for the Instagram carousel
automation. They all read the same selection logic in
[`lib/feed.ts`](../lib/feed.ts), so they can never disagree about what counts as
a published article.

| URL | Route | Rendering |
| --- | --- | --- |
| `/feed.xml` | `app/feed.xml/route.ts` | static, build-time only |
| `/feed-editorial.xml` | `app/feed-editorial.xml/route.ts` | static, build-time only |
| `/sitemap-news.xml` | `app/sitemap-news.xml/route.ts` | `force-dynamic` |
| `/robots.txt` | `app/robots.txt/route.ts` | static |

Discovery is the `<link rel="alternate" type="application/rss+xml">` in `<head>`
on every page (`app/layout.tsx` → `metadata.alternates.types`) — the standard
autodiscovery mechanism, and the one feed readers and Pinterest actually use —
plus an `# RSS feed:` comment line in `robots.txt`.

robots.txt has no directive for a feed, so a comment is the only honest way to
put it there: listing `/feed.xml` under `Sitemap:` would hand Google a URL that
is not a sitemap and fails Search Console validation. That is why `/robots.txt` is
`app/robots.txt/route.ts` rather than Next's `MetadataRoute.Robots` helper, which
emits only the directives it knows about.

> **That route computes `SITE` inline, and must keep doing so.** Importing it
> from `lib/feed` once pulled the image-reading code into this route's bundle,
> and with it a 3.3GB `@vercel/nft` trace of the whole `public/` tree — one of
> the bundles behind the `ENOSPC` build failure on #84. See the note at the top
> of `lib/feed-images.ts`.

## What the feed contains

The 50 most recent items, newest first. Three kinds of thing, mixed together and
distinguished by `<bc:contentType>`:

| `bc:contentType` | What | Dated by |
| --- | --- | --- |
| `article` | editorial | `date_published` |
| `podcast` | a vodcast episode | `date_published` |
| `venue` | a directory listing | later of `date_published` / `date_modified` |

**Excluded, deliberately:**

- `published: false` — drafts and hidden directory listings.
- `date_published` in the future — scheduled, not published.
- A **venue listing not added or updated since the directory was bulk-imported**
  — see below.
- Anything with **no usable image**. Every consumer turns the image into a post,
  so an item whose artwork 404s cannot be acted on. These are `console.warn`ed
  at build time, never dropped silently: a listing in this state is broken on
  the live site too.

Index pages, static pages, the shop and the homepage cannot reach the feed at
all: they are app routes, and `getArticleSlugs()` only yields a `content/`
directory that contains its own `<name>.mdx`.

### What counts as a venue listing

A listing carries `venueType` **and** sits in one of the five directory
subcategories (`clinics`, `salons`, `spas-retreats`, `bathhouses`, `wellness`).
Both halves are needed, because each alone gets real content wrong:

- `venueType` alone misfiles four editorial travel features. A hotel or spa
  review carries `venueType` so `lib/seo.ts` can give it `Hotel` schema and it
  can show in the directory index — not because it is a listing. The
  InterContinental Coogee review was the home page hero and was being withheld
  from Pinterest on this basis.
- The path alone misfiles two editorial roundups filed under `salons/` that
  have no `venueType` because they are not about one venue.

This is deliberately **not** the same test as `getDirectoryListings()` in
`lib/content.ts`, which keys on `venueType` alone. "Appears in the directory"
and "is a listing rather than an article" are different questions; only the
second is the feed's.

Getting it wrong is not just a mislabel. A listing is dated by `date_modified`,
is held to the import epoch below, and is dropped from `/feed-editorial.xml`
entirely — so a misfiled article can vanish from the feed silently.

### Venue listings: new or updated only

146 of the 148 published venue listings carry `date_published: 2026-01-15`. That
is not 146 venues published on a Thursday, it is one bulk import — and treating
it as a publication event would put the whole directory into the feed at once.

So a listing reaches the feed only when something actually happened to it after
`DIRECTORY_IMPORT_EPOCH` (`lib/feed.ts`): it was added, or it was updated. A
re-visited listing is dated by its `date_modified`, because refreshing a venue
*is* the editorial event worth posting; `<bc:datePublished>` then carries the
original date so nothing is ambiguous.

**Delete that constant the day the directory carries real per-listing dates.**
Until then it is the only thing separating a genuine listing update from a
migration artefact.

Articles and podcasts are never dated by `date_modified` — the site does not
treat an edit as a republish, and neither does the feed.

### The two feeds

`/feed.xml` is the complete one and the automation's input. `/feed-editorial.xml`
is the same rendering (`lib/feed-rss.ts` builds both, so they cannot drift) over
the same 50 candidates with `bc:contentType` of `venue` filtered out — features,
interviews and podcast episodes only. It is a strict subset of `/feed.xml`, item
for item and guid for guid.

It exists for Pinterest. One connected feed publishes to **one board**, and on
connect Pinterest **backfills the whole feed, oldest item first** — so pointing
it at `/feed.xml` today would open the account with a run of directory listings.
Nor can that be waited out: at the current publishing rate the listings sitting
in `/feed.xml` take roughly eight months to fall off the end of a 50-item
window, and the backfill would reach them anyway.

If venue listings ever want a Pinterest board of their own, add a third route
filtering the other way, rather than reaching for `/feed.xml`. Whatever it is,
**give it an `outputFileTracingExcludes` entry in the same commit** — see
[`build-output.md`](build-output.md).

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
`HeroWide` / `ArticleHero` do. That means the two are often the same URL — read
the dimensions, not the element name.

A local path with no file behind it resolves to *nothing*, not to a URL, so a
broken holding shot falls through to the next candidate and, failing that, drops
the item with a build warning. A remote (legacy WordPress CDN) URL is passed
through unverified — checking it would mean a network call per item.

### Images, and Pinterest

Each item carries the same artwork four ways, because different consumers look
in different places:

| Element | Image | For |
| --- | --- | --- |
| `<enclosure>` | portrait | Pinterest — one per item, with `type` and byte `length` |
| `<media:content>` (first) | portrait | generic MRSS readers |
| `<media:content>` (second) | landscape | generic MRSS readers (omitted when identical) |
| `<media:thumbnail>` | portrait | generic MRSS readers |
| `<bc:heroImage>` / `<bc:thumbnail>` | landscape / portrait | **the automation — use these** |

The portrait leads everywhere a third party takes a single image. That is for
Pinterest, which wants 2:3 and would otherwise centre-crop a wide banner into a
tall pin. RSS 2.0 allows exactly one `<enclosure>`, so the portrait gets it, and
the portrait is also the first `<media:content>` — [Pinterest's docs][pin] say it
reads both, and either way it lands on the portrait.

Pinterest also needs each `<link>` to point at a **claimed** domain, publishes
within 24 hours of a feed change, and caps at 200 Pins/day. Connect it to
`/feed-editorial.xml`, not `/feed.xml` — see "The two feeds" above for why.

[pin]: https://help.pinterest.com/en/business/article/auto-publish-pins-from-your-rss-feed

Every image carries real `width` and `height` read off the file, so a consumer
can check the shape rather than trusting the element name — which matters
because most items have only one image and the "portrait" is then the same file
as the landscape.

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

`/feed.xml` renders once per build and is then served static. There is no
revalidation, and **there must not be** — see the DO NOT in `next.config.ts`.

Content lives in this repo, so **publishing an article is a deploy**: the
article is in the feed the moment that deploy goes live. The only case a deploy
cannot cover is an article whose `date_published` is in the future crossing its
own date with nobody deploying, and any later deploy fixes that.

Adding `revalidate` back would be worse than useless. `public/` is excluded from
this route's function bundle (the ENOSPC fix on #84), so a revalidating lambda
would wake an hour after each deploy, find no images, drop every item on the
image guard, and serve a valid, parseable, **empty** feed — which to the
carousel automation is indistinguishable from "nothing published".

`/sitemap-news.xml` is the opposite and must stay `force-dynamic`: its 48-hour
window slides continuously, so a copy generated at build time starts advertising
articles that have aged out and can never list one published after the build.
See the note in `app/sitemap.ts` about the same class of failure being served in
production for weeks.

**It is normal for `/sitemap-news.xml` to be empty.** Beauticate publishes
weekly, not daily, so nothing falls inside Google's 48-hour window most of the
time. The route emits an XML comment saying so.
