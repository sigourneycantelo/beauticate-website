---
name: beauticate-pinterest
description: Runs Beauticate's Pinterest presence — the RSS auto-publish feed, auditing existing Pins for broken or wrong destination links, duplicate handling, board hygiene, and the monthly Pinterest health check. Use whenever Sig mentions Pinterest, Pins, boards, pinning an article, claiming a domain on Pinterest, the Pinterest feed, or asks why Pinterest traffic has moved. Also use when a Pinterest audit runs on a schedule. Audits and proposes; never bulk-deletes.
---

# Beauticate on Pinterest

Pinterest is a search engine that happens to look like a mood board. A Pin that
links to a live Beauticate article keeps sending readers for years. A Pin whose
link is broken sends them nowhere, forever, and nothing tells you.

That asymmetry sets the whole posture of this skill: **fixing links is where the
value is, deleting things is where the damage is.**

## Hard rules

- **Never delete a Pin to tidy up.** A Pin carries its accumulated impressions,
  saves and inbound traffic. Deleting it destroys all of that permanently, and
  every repin of it made by someone else dies too. A duplicate that is quietly
  sending traffic is worth more than a clean grid. Only delete a Pin that is
  genuinely dead — a link that 404s with no article to repoint it at, or content
  that shouldn't be public.
- **Never merge boards.** It is irreversible, followers do not transfer, and the
  merged board's URL dies. To undo it you would move Pins back one at a time.
  Renaming is the safe alternative and does what people usually want.
- **Renaming a board IS safe** — Pinterest redirects the old board URL. If a
  board's name is wrong or vague, rename it rather than rebuilding it.
- **Never bulk-create Pins.** The API allows 1,000 writes a day, but the spam
  threshold is far lower: 5–10 fresh Pins a day for an established account, and
  at least 72 hours between Pins pointing at the same URL. Five Pins to one URL
  in one day is the documented pattern that gets accounts flagged. The API limit
  is not the real limit.
- **Only Pins we created can have their destination link edited.** A Pin saved
  or repinned from another account cannot be relinked, by anyone. Don't put those
  on a fix list — record them and move on.
- **Check the redirect before calling a link broken** (see below). This is the
  single biggest time-waster on a Pin audit.
- **Never point a Pin at an unpublished article.** Confirm `published: true` in
  the article's frontmatter first. A Pin aimed at a draft is a Pin aimed at a 404.
- **Report and propose. Don't action destructive changes unattended.** Link
  fixes on our own Pins are fine to apply. Deletions, merges and board
  restructures go to Sig as a list.

## Check the redirect before calling a link broken

Beauticate migrated from WordPress in June 2026, so old Pins point at old URLs.
**Most of them still work.** `middleware.ts` reads
`data/redirect-slug-map.json` — 1,742 published slugs — and 301s any request
whose first path segment is a current *or historical* category prefix:

```
beauty-style  destinations  interviews  living  news  sigourneys-edit
vodcast  wellness  destination  reviews  how-to  uncategorized
vodcast-by-beauticate  ask  who  the-go-tos
```

So `/news/<slug>`, `/reviews/products/<slug>`, `/who/<slug>` and friends land on
the right article today without anyone touching the Pin.

**A 301 to the correct article is not a broken Pin.** It costs the reader
nothing. Leave it alone — editing the Pin risks the link and gains nothing.

The Pins worth fixing are the ones that end at a **404**, or that 301 to the
*wrong* article (slug collision), or that point at a page that has since been
unpublished. Everything else is noise.

To check a slug against the map without leaving the repo:

```bash
python3 -c "
import json; m=json.load(open('data/redirect-slug-map.json'))
print(m.get('<slug>', 'NOT IN MAP — will 404'))
"
```

## Constants

| Thing | Value |
| --- | --- |
| Account | Beauticate, `au.pinterest.com` |
| Editorial RSS feed (Pinterest) | `https://www.beauticate.com/feed-editorial.xml` |
| Full RSS feed (Instagram, **not** Pinterest) | `https://www.beauticate.com/feed.xml` |
| Claimed domains | `beauticate.com`, `beauticate.shop`, `beauticateshop.com`, `shop.beauticate.com`, `checkout.beauticate.com`, `1ptawz-uy.myshopify.com` |
| Redirect map | `data/redirect-slug-map.json` (1,742 slugs) |
| Spam-safe pinning rate | 5–10 fresh Pins/day; 72h between Pins to one URL |

**Use the editorial feed, never `/feed.xml`.** The full feed carries the 17
directory venue listings, which Instagram wants and Pinterest shouldn't have.
Pinterest backfills the *entire* feed when you connect it, oldest first, so
pointing it at the wrong feed pins every venue listing in one batch.

## Step 1 — the link audit (the job that actually pays)

Read-only first, always. Produce the list before changing anything.

1. Export or page through the account's own Pins (Pins we created, not repins).
2. For each, take the destination URL. Skip any that isn't a `beauticate.com`
   URL — those are outbound Pins to brands and are not ours to fix.
3. Resolve it. Record the final status and URL after redirects.
4. Sort into four buckets:

| Bucket | What it means | Action |
| --- | --- | --- |
| **200, right article** | Working, possibly via 301 | **Leave it.** Not a finding. |
| **404** | Slug not in the redirect map | Fix: find the article, edit the Pin's link |
| **301 → wrong article** | Slug collision or bad re-file | Fix, and flag the redirect map — this is a site bug, not just a Pin bug |
| **200 but article now unpublished** | Pin aimed at a draft | Repoint or report |

A 404 bucket entry that has *no* matching article at all is the one case for
deleting a Pin, and even then say so in the report rather than doing it silently.

**If the audit surfaces a wrong-article 301, raise it here.** That means
`redirect-slug-map.json` has an ambiguous slug, which affects every reader
arriving from anywhere — Google included — not just Pinterest.

## Step 2 — duplicates

Pinterest defines a duplicate as the same image + URL combination already
pinned. They dilute reach because the algorithm favours fresh Pins.

The fix is **stop making new ones**, not delete the old ones:

- Don't re-pin the same image to a second board.
- When an article deserves another Pin, use a *different* image from it, at
  least 72 hours later.
- Leave historic duplicates alone unless one is genuinely dead. They are already
  earning; removing them removes the earnings.

Report duplicates as a count and a pattern ("14 articles have 3+ identical Pins,
mostly from the 2023 bulk-scheduling period"), not as a delete list.

## Step 3 — board hygiene

Safe, in order of value:

1. **Rename** vague boards to what someone would actually search. Pinterest
   redirects the old URL, so this is free.
2. **Write board descriptions.** They are indexed.
3. **Reorder** so the boards that match current editorial sit first.
4. **Archive** a board you've finished with. Archiving keeps the Pins and the
   URL; deleting destroys both.

Do not merge. Do not delete. If a board genuinely must go, put it in the report
with the follower count and Pin count so Sig can decide with the numbers in view.

## Step 4 — new articles pin themselves

`/feed-editorial.xml` is connected to Pinterest's RSS auto-publish, so a newly
published article becomes a Pin without anyone doing anything. The portrait
`featured_image` is what gets pinned — `lib/feed-rss.ts` puts it in `<enclosure>`
and `<media:content>` — so the Pin quality is decided by the thumbnail chosen at
publish time, not by anything on Pinterest.

Two consequences worth remembering:

- **A bad portrait thumbnail is a bad Pin.** If an article matters for Pinterest,
  the 3:4 crop is the thing to get right.
- **Nothing needs pinning by hand for new articles.** If someone is manually
  pinning a new piece, they are creating a duplicate of the automatic Pin.

## Step 5 — the monthly health check

Run in this order, and stop at the first thing that needs a human:

1. **Is the feed still connected and publishing?** Compare the newest Pin's date
   against the newest published article. A silent disconnection looks exactly
   like "we haven't published much lately".
2. **Are the claimed domains still claimed?** Unclaiming happens on its own after
   DNS or platform changes and it silently removes brand attribution from every
   Pin.
3. **Run a sample of Step 1** — 50 Pins, not all of them — and report the bucket
   counts. A rising 404 count means articles are being re-filed or unpublished
   without the redirect map catching up.
4. **Report traffic direction**, not just Pin counts. Pinterest referrals in GA
   are the number that matters; impressions are not.

Report format: what changed, what's broken, what you'd do about it. No action on
anything destructive without a reply.

## Known state (September 2026)

- `beauticate.com` and the five shop domains **are claimed**.
- **The Instagram connection is broken** — Pinterest reports "We no longer have
  access to @beauticate." Until it's reconnected, Pins created from Instagram
  content lose their Beauticate attribution. Reconnect at
  `au.pinterest.com/settings/claim/`.
- The editorial feed exists and is Pinterest-shaped; connecting it backfills
  roughly 34 items, oldest first.
- The archive is 1,736 published articles carrying 12,627 body images, 69% of
  them portrait. Pinning all of them is not a goal — see the rate rules above.
