# Beauticate — Destinations & Travel Build Brief (for Claude Code)

Consolidated brief covering both the content operations and the two page builds for the Destinations pillar. Everything here is scoped for launch and deliberately low-touch. It reuses existing components, tokens and content. No new infrastructure, no map library, no third-party services.

Match the locked design system used on the homepage v15 mock and the podcast page mock. Same tokens, same fonts (EB Garamond for display, Hanken Grotesk for body), same warm palette. If a component already exists (scrim hero, staggered story grid, story card), reuse it rather than building new.

Work in five parts, in this order. Parts 1 and 2 are content operations. Parts 3 to 5 are builds. Part 1 is the priority and unblocks everything else.

---

## Context

Destinations is the seven-pillar nav item that absorbs the retired Beauty & Wellness Directory. Two reader modes live under it. Travel is the editorial, aspirational front door. The Directory is the practical, book-near-me venue list for spas, salons, skin clinics, bathhouses and retreats around Australia.

Current content, from the inventory audit:

- 58 travel editorial pieces (destination guides, hotel reviews, travel-beauty, Sigourney's travel edits)  
- 22 spas and retreats  
- 69 clinic directory listings

A significant number of travel editorial articles are misfiled. They live under `beauty-style/beauty-tips` or `sigourneys-edit` instead of `destinations/`, so they do not surface in the travel section. Fixing this is Part 1 and it is the single highest-value task.

---

## Part 1 — Re-file misplaced travel content (priority, do first)

Goal: every travel article is discoverable under `destinations/travel` regardless of where it was originally authored, without breaking existing URLs or losing SEO equity.

Do not hard-code a list. Enumerate against the repo so nothing is missed.

Identification rule. Treat an article as travel content if it meets the topic test and is not already under `destinations/`:

- Path is currently under `content/beauty-style/beauty-tips/`, `content/sigourneys-edit/`, or any path that is not `content/destinations/`, AND  
- The article is about a place, a trip, a hotel or resort stay, a destination guide, a retreat, or travel-related beauty and wellness. Use frontmatter (tags, categories, location fields) as the primary signal, with title and body as secondary confirmation.

Spot-check examples that must be caught by the rule (verify these specifically after the pass):

- "Tokyo in 24 Hours: Digital Art, Ninjas & Vintage Finds" (currently sigourneys-edit)  
- "Powder, Onsens & Snow Monkeys: A Family Ski Holiday to Japan" (currently beauty-tips)  
- "Behind the Scent: Inside a Luxury Perfume Press Trip to Cairns" (currently sigourneys-edit)

Handling. Prefer surfacing over physically moving files, to protect existing URLs:

1. Preferred: keep the article at its current URL and assign it a `destinations` and `destinations/travel` taxonomy so it appears in the travel section and feeds. Add a `travelType` frontmatter field (see Part 2 taxonomy).  
2. If the CMS cannot surface an article in a section without moving it, then move it and add a 301 redirect from the old path to the new one. Never leave a dead URL.

Output. Produce a report at `docs/destinations-refile-report.md` listing every article touched, its old path, its new taxonomy or path, and whether a redirect was created. This is the record Sigourney reviews.

Acceptance. The travel editorial count surfaced under `destinations/travel` matches the audit (in the order of 58), no 404s introduced, all three spot-check articles appear in the travel section.

---

## Part 2 — Taxonomy and "feeling" collections

Add two frontmatter fields across Destinations content. Keep values controlled, do not free-text.

`travelType` for editorial, one of: `guide`, `hotel-review`, `travel-beauty`, `sigs-edit`.

`venueType` for directory listings, one of: `spa`, `salon`, `skin-clinic`, `bathhouse`, `retreat`, `hotel`.

`state` for anything with an Australian location, one of the standard abbreviations: `NSW`, `VIC`, `QLD`, `WA`, `SA`, `TAS`, `ACT`, `NT`. Many listings already carry this, backfill where missing from the location field.

Feeling collections. Create four launch collections as a `feeling` tag with these values, and assign existing articles to them editorially. Start with four, the field allows more later:

- `switch-off` — retreats, wellness, do-nothing escapes  
- `family` — the Bali, Port Stephens, Wild Luxury, Japan-ski family stories  
- `city` — city and region guides like Tokyo and Kerala  
- `reset` — wellness, longevity, heal-focused stays

A collection is just a filtered query on the `feeling` tag. No bespoke engine. Each collection needs a landing route at `destinations/travel/feeling/[feeling]` that lists its articles using the existing story-card grid.

---

## Part 3 — Travel page build (`/destinations/travel`)

An editorial landing, not a map. Built entirely from existing articles and their existing hero imagery. Reuse homepage components.

Layout, top to bottom:

1. Hero. Full-width landscape with lower-third scrim, identical treatment to the homepage v15 hero. Source the image and standfirst from one featured travel article, controlled by an `isTravelHero` flag or a manual pick in the CMS. One hero, editorially rotated. No carousel.  
     
2. Feeling tiles. A row of four image tiles, one per Part 2 collection (Switch off, Family escapes, Wander a city, Reset and heal). Each tile is an image plus a label, linking to its collection route. On mobile, horizontal scroll or two-up. This is the low-touch version of "travel by feeling", it is just links to tag queries.  
     
3. Curated editorial rows. Three to four horizontal rows, each a manually ordered or query-driven set of existing articles rendered with the existing story card:  
     
   - Where to go now (a hand-picked seasonal set, CMS-editable order)  
   - Sig's travel edits (query `travelType: sigs-edit`)  
   - Family escapes (query `feeling: family`)  
   - City and region guides (query `travelType: guide`)

   

4. A quiet link across to the Directory. A single band, "Looking for somewhere closer to home? Explore spas, salons and clinics near you", linking to `/destinations/directory`. Not a map embed, just a styled link block.

Data. All rows pull from existing content by taxonomy. No new content required to fill the page. If a row has fewer than four items, it still renders cleanly.

Acceptance. Page is full using only existing articles, matches homepage tokens and type, hero and rows are CMS-editable, feeling tiles route correctly, fully responsive.

---

## Part 4 — Directory build (`/destinations/directory`)

A fast, filterable list. No map for launch. State is the primary axis, using the `state` field from Part 2\.

Layout:

1. Short editorial intro line, one sentence.  
2. Filter bar. A row of state chips (NSW, VIC, QLD, WA, SA, TAS, ACT, NT) plus an All. Secondary filter for `venueType` (spa, salon, skin clinic, bathhouse, retreat) if straightforward. Filters combine. Filtering is client-side over the loaded list or a simple query param, whichever is simpler, no new backend.  
3. Results. Venue cards in a two-up or three-up grid. Each card shows image, venue name, suburb and state, `venueType` label, a one-line verdict (Part 5\) and a link through to the full listing or review.  
4. Group results by state when All is selected, so the list reads as organised and national rather than one long scroll.

Reuse the shop or story card grid pattern for the card layout. Keep the card surface clean, image then name then meta, consistent with the shop page hierarchy.

Acceptance. All 22 spas and retreats and 69 clinic listings appear, state and type filters work and combine, cards carry a verdict line where one exists, responsive, no map dependency.

---

## Part 5 — Verdicts and cross-links

Verdicts. Add an optional `verdict` frontmatter field to directory listings, a single sentence pulled from the existing review or editor's note. Surface it on the venue card and at the top of the listing page. Where a listing has an associated full review, populate `verdict` from a standout line in that review. Leave blank cleanly where none exists, the card must still look complete.

Cross-links. On the top travel articles only, not all of them, add a "Beautiful places nearby" module linking to the Directory pre-filtered by the article's `state`. Drive this from a `showNearbyVenues` flag so Sigourney can switch it on for the best-performing city and hotel stories rather than everywhere. The module is a simple styled list of three to four matching venues plus a "see all in \[state\]" link.

Acceptance. Verdict renders where present and degrades cleanly where absent, nearby-venues module appears only where flagged and filters the Directory correctly by state.

---

## Out of scope for launch (note for the backlog, do not build now)

- Interactive pan-and-zoom map. The state filter is the launch stand-in. Map is a later phase.  
- Programmatic state-plus-type SEO landing pages ("best day spas in Melbourne"). High value later, driven by the same taxonomy, but not launch-critical.  
- Saved wishlist or passport.  
- Geolocation "near me".

Building the taxonomy cleanly in Part 2 is what makes all four of these cheap to add later, so do Part 2 properly even though its payoff is partly future.

---

## Build order and dependencies

1. Part 1 re-filing, unblocks the Travel page having content.  
2. Part 2 taxonomy, unblocks every query in Parts 3 to 5\.  
3. Part 3 Travel page and Part 4 Directory can be built in parallel once Part 2 lands.  
4. Part 5 verdicts and cross-links last, as polish.

Everything is content and query driven. No new services, no map library, no external dependencies. Report files go in `docs/`. Flag any article the identification rule cannot confidently classify rather than guessing, and list those for Sigourney in the re-file report.  
