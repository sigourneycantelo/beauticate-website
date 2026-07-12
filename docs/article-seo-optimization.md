# Beauticate SEO / AEO / GEO Master Playbook

> Supersedes: AEO SOP NEW, Beauticate-AEO-GEO-SEO-Master-Brief, and the
> previous version of this file. This is the single source of truth for search
> optimisation across beauticate.com — editorial, shop, vodcast, and all future
> content.

**Last updated:** July 2026 · **Compiled from:** Doug Lord / Digital Dominator
audit (April 2026), Sigourney Cantelo editorial brief, codebase audit, and
current AI-search landscape.

---

## How to read this document

Three layers:

| Layer | Who | When |
|-------|-----|------|
| **Build once** | Developer (Redfern / Claude Code) | Template-level, applies site-wide automatically |
| **Per article** | Writer / editor | Every new article and every refresh |
| **Per product** | Shop curator | Every product page and collection |

Items marked **[DONE]** are already implemented on the Vercel site. Items marked
**[TODO]** are outstanding. Everything else is editorial process.

---

## Part 1 — Why this matters

Search is no longer just keywords and Google. Content is discovered inside AI
tools, voice assistants and answer engines — often without a click. The goal is
not just to rank in a list of blue links but to **be the source the AI quotes
when it writes the answer itself**.

Three overlapping disciplines:

- **SEO** (Search Engine Optimisation) — rank in Google, Bing, Yahoo, Google
  Discover, Google News
- **AEO** (Answer Engine Optimisation) — get cited in Google AI Overviews,
  featured snippets, voice assistants, zero-click results
- **GEO** (Generative Engine Optimisation) — get cited by name in ChatGPT,
  Perplexity, Claude, Gemini, Copilot and other AI-generated answers

Beauticate scores 65/100 on Doug's AI visibility audit with 67% share of voice
in Australian beauty content across AI engines — genuinely strong. The gap is
converting that real authority into machine-verifiable signal. The fixes are
well-defined.

---

## Part 2 — Unified domain: beauticate.com

**Important context.** Doug's April 2026 audit assessed beauticate.com (65/100)
and beauticate.shop (35/100) as separate domains. Since then, the Vercel site
unifies editorial and shop under **beauticate.com**. This changes the strategy:

- The .com's 2,082 referring domains, 67% AI share of voice and 11-year link
  history carry straight through to shop pages — no cross-domain bridge needed
- sameAs schema in Organisation markup no longer needs to reference
  beauticate.shop as a separate entity (update Wikidata when the domain switch
  happens)
- Internal linking between editorial and shop is standard internal linking, not
  cross-domain — simpler and stronger for authority
- Product pages inherit the site's full domain authority from day one

The beauticate.shop Shopify storefront remains for checkout only until checkout
migrates to a beauticate.com subdomain. Do not blanket-redirect beauticate.shop
yet.

---

## Part 3 — Entity and brand authority

These are the foundational signals that AI engines use to verify Beauticate as a
real, citable entity. Most are one-time setup.

### 3.1 Wikidata entries

Two entries exist:

| Entry | Q-number | Status |
|-------|----------|--------|
| Beauticate (organisation) | Q139643093 | **Done** — needs references added and shop URL updated when domain unifies |
| Sigourney Cantelo (person) | Q139644159 | **Done** — needs "position held: founder" linked to Q139643093 |

**Social profile rules for Wikidata:**

- TikTok (`@sigourneycantelo`): add to **both** entries — it represents both the
  person and the brand
- YouTube (`@sigourneycantelo`): add to **both** entries — same logic
- Facebook Beauticate page: add to the **Beauticate** org entry
- Facebook Sigourney Cantelo public page: add to the **Sigourney** person entry
  (not the private personal one)

The follower count does not matter. Entity verification cares about existence and
consistency, not popularity.

**Add references.** Most Wikidata statements currently have zero references. Add
at least one per claim (press mention, Beauty Directory article, LinkedIn page,
ABN lookup). Referenced claims propagate faster and carry more weight.

### 3.2 Organisation schema — [DONE]

Implemented in `app/layout.tsx` on every page. The `@graph` contains:
- `Organization` with name, legalName, foundingDate, description, sameAs, logo
- `Person` (Sigourney Cantelo) with jobTitle, worksFor, sameAs, knowsAbout,
  alumniOf
- `WebSite` with SearchAction

The Organisation sameAs includes Wikidata Q139643093. The Person sameAs includes
Wikidata Q139644159 (corrected from the previous wrong ID).

### 3.3 NAP consistency — [TODO: Sig + Jade]

Name, Address, Phone must be formatted identically across:
- Google Business Profile
- Apple Business Connect
- Bing Places
- Website footer and Contact page
- All directory listings

Even "Pty Ltd" vs "Pty. Ltd." counts as a different entity to a knowledge graph.
Create a single reference document with the canonical format and audit every
listing against it.

### 3.4 Google Business Profile — [TODO: Sig]

- Add primary and secondary categories (Online Publication, Magazine Publisher)
- Upload 10+ photos (editorial team, behind-the-scenes, podcast studio, events)
- Write a 750-character business description
- Respond to any unanswered reviews

### 3.5 Author pages — [TODO: Redfern]

Build `/author/[slug]` pages. Each page should have:
- Photo, name, role, short bio
- sameAs links (social profiles, Wikidata for Sig)
- Person JSON-LD with all entity signals
- A list of all their articles, newest first
- The URL becomes the `url` in every article's Person schema (replacing the
  current hard-coded `/about-beauticate`)

Data already exists in `lib/authors.ts`. The route and template need building.
Update `buildPersonSchema` in `lib/authors.ts` to use
`${siteUrl}/author/${author.slug}` instead of `${siteUrl}/about-beauticate`.

Only build pages for authors with photos and bios (the core editorial team plus
active contributors). Minor one-off contributors can remain name-only.

---

## Part 4 — E-E-A-T signals

E-E-A-T stands for Expertise, Experience, Authoritativeness and Trustworthiness.
It is how Google and AI tools decide if content is credible and worth surfacing.

Beauticate's strongest assets here: Sig's 25 years, ex-Vogue credential,
hands-on testing, named expert contributors. These are the things AI engines
cite. They are also the things competitors cannot copy.

### Visual trust triggers

- Original imagery, not stock
- Photos showing real use (Sig or team members applying, testing, visiting)
- Side-by-side before/afters or timelines
- YouTube embeds, branded charts, diagrams, collages
- Personal quotes, test results, hands-on reviews

### What to weave into every article

- Name the author's relevant credential or experience
- Include first-hand testing or observation
- Quote or reference an external expert where claims need backing
- Link to the author's bio page (once built)

---

## Part 5 — Before writing: the six-step prep

Follow this before writing any article.

### 5.1 Start with a question, then map its cluster

Each story should answer a specific question a reader would search and an AI
would try to answer. Use it in the intro, an H2 and the meta title.

AI engines break a query into smaller sub-questions, then answer each one. Map
the cluster of related questions around the main one and cover them in the piece.
A single article that answers the main question plus five natural follow-ups gets
cited far more than one that answers only the headline.

Tools: AlsoAsked, Google Autocomplete, ChatGPT.

### 5.2 Identify the search intent

| Intent | What it means | Example keyword |
|--------|--------------|-----------------|
| Informational | They want to learn something | What is hypochlorous acid? |
| Commercial | They are comparing options | Best natural toothpaste Australia |
| Transactional | They want to buy or book | Buy red light face mask |
| Navigational | They want a specific page | Beauticate podcast |

Let intent shape format. Informational becomes an explainer or how-to.
Commercial becomes a listicle, review or comparison. Transactional needs clear
links and a call to action. Navigational stays fast and branded. If intent is
mixed, lead with the dominant one and support the secondary.

### 5.3 Run a content gap check

See what is already ranking and how we beat it. Look for: missing Aussie examples
or brands, no expert quotes or testing, dated formatting, poor readability, no
personality.

### 5.4 Choose focus keyphrase plus semantic entities

Find a specific, low-competition Australian keyword. Then map: primary keyword,
semantic entities, related questions. You do not need to list entities anywhere —
weave them naturally into the copy.

Example: Primary: fluoride-free toothpaste Australia. Entities: Grants of
Australia, xylitol, vegan formula, sensitive teeth.

### 5.5 Plan the structure for extraction

Decide where the direct answer sits, what the H2 questions are, and which
sections an AI could lift cleanly. More on this in Part 6.

### 5.6 Choose the schema type

Match the content type to the schema type. On Vercel the core schema is
auto-detected from the title, tags and category — confirm the type is right and
add any special frontmatter.

| Content type | Schema type | Auto-detected? |
|-------------|-------------|----------------|
| Standard article | Article | Yes (default) |
| Interview, destination, trend piece | NewsArticle | Yes (category/tags) |
| Review / "we tried" | Review | Yes (title/tags) — add `review_rating`, `review_item`, `review_brand` |
| How-to guide | HowTo | Yes (title/tags) — steps auto-extracted from H2s |
| Listicle | Article + ItemList | Partially — Article auto, ItemList manual |
| Clinic/venue review | Review + LocalBusiness | Yes — add `venueType`, `address`, `telephone` |
| Podcast episode | PodcastEpisode + Article | Yes (vodcast template) |
| FAQ-heavy piece | FAQPage (appended) | Yes — add `faqs` array to frontmatter |

---

## Part 6 — Writing for AI answers and humans

### 6.1 The direct-answer opening

Answer the core question within the first 40 to 60 words, before the
scene-setting and storytelling. This is the single most extracted, most cited
part of a page. On Vercel this lives in the **QuickAnswer** component.

You do not sacrifice voice. Front-load one tight, quotable answer, then let the
piece breathe.

### 6.2 Fact density

Weave a concrete fact, number or result roughly every 150 to 200 words. Name
actives, percentages, clinical findings, sourcing, prices. It signals substance
over fluff and gives the AI specific things to quote.

### 6.3 Self-contained sections

AI lifts chunks, not whole pages. Write each section so it still makes sense if
pulled out on its own. Repeat the key noun rather than leaning on "it" or "this",
so an extracted paragraph reads clearly without the ones above it.

### 6.4 Citation engineering (GEO)

This is the single biggest difference between being *read* by AI engines and
being *cited by name*:

- **State claims as attributable facts.** "According to Beauticate's testing..."
  or "Beauticate editor Sigourney Cantelo found that..." — give the AI a named
  source to attribute
- **Include unique data.** Original test results, star ratings, price
  comparisons, percentage improvements. AI engines cite specifics, not generics
- **Reference other credible sources.** Cite experts, studies, brand data through
  the piece — not just one external link at the end. Multiple credible references
  lift AI trust in the whole page
- **Use entity-rich language.** Name products, brands, ingredients, locations and
  people by their full proper names. "The Ultraceuticals Ultra B2 Serum" not
  "this serum"

### 6.5 Original insight

Include testing, results, expert quotes and original opinion. This is the E-E-A-T
core and the citation bait. AI engines specifically favour first-hand testing,
original data and named expertise. These are the things they cite. They are also
the things competitors cannot copy.

### 6.6 FAQs

Add two or three FAQ-style questions and short, punchy answers near the end. They
map to real searches and feed answer boxes.

In frontmatter:
```yaml
faqs:
  - q: "Is the Qure micro-infusion worth the price?"
    a: "At $349 for a device you can use weekly at home, it pays for itself in three to four professional treatments."
  - q: "Does micro-infusion hurt?"
    a: "The needles are 0.25mm. Most people feel a light prickle, nothing more."
```

The FAQPanel component renders these visibly. The FAQPage schema is generated
automatically from the same frontmatter source — they always match.

### 6.7 Prose versus structure

Beauticate articles stay in prose. That is the voice. The structured,
easy-to-extract elements are the QuickAnswer box, the FAQs, any comparison table
and clear question-style H2s. Use those as the scaffolding. Do not bullet-point
the body of an editorial piece.

---

## Part 7 — Voice, formatting and house style

- Write in Beauticate's tone: chatty, stylish, elevated, a touch self-deprecating
- Australian/British spelling, always
- No em dashes, no Oxford commas. En dashes are fine
- Clear subheadings and structure
- Bold the main answer or key takeaway near the top
- Short sentences. Full stops over trailing clauses
- Italicise foreign language words and phrases
- Preserve first-person voice, human details, booking info and social links
- Internal links to related articles, author pages and Shop
- Quotes, personal experience, testing or original insight for E-E-A-T

---

## Part 8 — Links and entities

### 8.1 Internal links

Always link to at least one other Beauticate story, ideally two or more.

**Topic clusters.** Link related stories into a cluster around a central pillar
page on the topic. This signals depth and authority on that subject to both
Google and AI, and keeps readers moving through our content rather than out of
it.

**Editorial-to-shop cross-linking.** Every product mention in an editorial article
should link to the beauticate.com/shop product page. Every product page should
link back to the relevant editorial. Same domain, standard internal links — no
special rel attributes needed.

### 8.2 External links

Cite one or more trusted, authoritative sources where claims need support.
Expert, clinic, study or brand site. Use `rel="noopener"` on external links.

### 8.3 Affiliate / sponsored links

Use `rel="sponsored noopener" target="_blank"` — raw `<a>` inline, or via the
`AffiliateCTA` / `SplitRow href=` components which enforce this automatically.

### 8.4 Entity mapping

Mention recognised people, places, products and concepts by their full proper
names. For example: Qure Skincare, Melanie Grant Skin Health Double Bay, red
light therapy. It helps engines connect our content to known entities.

---

## Part 9 — Schema and structured data

### 9.1 What is auto-generated — [DONE]

All of the following are built into the Vercel templates and require no
per-article work:

| Schema | Where | Trigger |
|--------|-------|---------|
| Article / NewsArticle / Review / HowTo | `lib/seo.ts` | Auto-detected from title, tags, category |
| FAQPage | `lib/seo.ts` | `faqs` array in frontmatter |
| Person (author) | `lib/authors.ts` | `author` field in frontmatter |
| Organization (publisher) | `lib/seo.ts` + `app/layout.tsx` | Every page |
| BreadcrumbList | `lib/seo.ts` | Every article, product, collection |
| LocalBusiness | `lib/seo.ts` | `venueType` in frontmatter |
| Product + Offer | `components/shop/ProductPage.tsx` | Every product detail page |
| PodcastSeries + PodcastEpisode | `lib/seo.ts` | Vodcast template |
| VideoObject | `lib/seo.ts` | Vodcast with `youtube_video_id` |
| SpeakableSpecification | `lib/seo.ts` | Every article |
| WebSite + SearchAction | `app/layout.tsx` | Every page |

### 9.2 What needs per-article input

For Review articles, add to frontmatter:
```yaml
review_rating: 4.5
review_item: "Qure Micro-Infusion Device"
review_brand: "Qure Skincare"
```

For venue/clinic reviews, add:
```yaml
venueType: spa          # spa | skin-clinic | salon | nail-salon
address: "123 Oxford St, Paddington NSW 2021"
telephone: "+61 2 9999 0000"
```

### 9.3 What is still to build — [TODO: Redfern]

| Schema | Impact | Detail |
|--------|--------|--------|
| VideoObject on regular articles | Medium | Any article embedding a YouTube video should output VideoObject JSON-LD, not just vodcasts |
| AggregateRating on products | Medium | Requires Judge.me/Stamped integration first — add `aggregateRating` to Product schema when reviews are live |
| ItemList on listicles | Low | For "best of" roundups — manual per article for now |

### 9.4 Validation

Always validate schema before publish:
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org

---

## Part 10 — Images and multimedia

### 10.1 Think multimedia first

Before writing, plan how to visually bring the story to life. Include where
possible:
- At least one original photo (taken, styled or edited by us)
- One YouTube embed (can be third-party if relevant and polished)
- One custom Canva collage, chart or graphic
- Optional GIF if it adds personality

These lift AI visibility, time on page and answer-engine pick-up.

### 10.2 File naming

Google and AI engines read filenames. Use descriptive, keyword-rich names, all
lowercase, hyphens not spaces. Never upload `IMG_123.jpg`.

Format: `topic-brand-detail.jpg`

Examples:
- `ultraceuticals-vitamin-c-serum.jpg`
- `me-skin-south-yarra-treatment-room.jpg`
- `dyson-airwrap-hair-volume-how-to.jpg`

### 10.3 Alt text

- Descriptive and concise, under 125 characters
- Use focus keywords naturally
- Sentence case, no "image of", no hashtags or emojis
- Reflect what the image shows and how it supports the story

Bad: "image of serum"
Good: "Ultraceuticals Vitamin C serum on a marble vanity"

### 10.4 Format, size and compression

- Compress before upload — aim for under 200KB per image
- Export JPG for full photos, PNG where you need transparency, WebP where the
  pipeline supports it
- Next.js Image component handles responsive sizing and lazy loading
  automatically — [DONE]

### 10.5 Image types and specs

| Image type | Layout | Dimensions | Notes |
|-----------|--------|------------|-------|
| Holding shot / hero | Landscape | 1500 x 1000 | Two portraits side by side if needed |
| Story photos | Portrait | 750 x 1125 | Use Canva templates, crop thoughtfully |
| Product pics | Portrait | 300 x 450 | Remove background, use AU/NZ packaging |
| Banner (carousel) | Landscape | 2000 x 675 | Avoid faces or text under the centre box |

### 10.6 Placement

- Place images close to the text they relate to
- Add internal links near captions where natural
- Link product shots to the affiliate or shop URL; leave editorial photos
  unlinked
- Check the mobile preview so images do not break the flow

---

## Part 11 — On-page metadata (frontmatter fields)

These replace the old Yoast fields. The rules are the same.

| Field | Rule |
|-------|------|
| `seo_title` | Max 60 characters, includes the focus keyword |
| `slug` | Short and keyword-rich (e.g. `best-red-light-masks`) — the slug is the directory name |
| `meta_description` | Max 155 characters, punchy summary plus keyword |
| `focus_keyphrase` | Appears in title, a subheading and image alt text |
| `tags` | Relevant topic tags — drive schema detection and categorisation |
| `date_modified` | Update whenever the article is refreshed |
| `author` | Must match a name in `lib/authors.ts` |
| Internal link | Always link to at least one other Beauticate story |
| External link | At least one trusted external source |

Slug and focus keyphrase do not need to match exactly. A tighter slug can sit
alongside a broader keyphrase.

**Current coverage (1,745 articles):**
- seo_title: 1,709 (98%) ✓
- meta_description: 1,715 (98%) ✓
- date_modified: 1,716 (98%) ✓
- featured_image_alt: 1,745 (100%) ✓
- faqs: 1,574 (90%) ✓
- focus_keyphrase: 2 (0.1%) — gap, but not blocking for launch
- QuickAnswer: 2 (0.1%) — add to high-traffic articles as a priority
- review_rating: 1 — add to all review articles over time

---

## Part 12 — Freshness and the refresh cycle

AI citations and rankings favour fresh content. Around half of the content cited
in AI answers is less than thirteen weeks old. Our twelve-year archive is a
goldmine, but only if it reads current.

### System — [DONE]

- Visible "last updated" date on every article, drawn from `date_modified`
- `dateModified` is included in all Article JSON-LD

### Process — ongoing

- Refresh the highest-traffic evergreen pieces on a rolling cycle
- Update a stat, add a line, refresh the QuickAnswer, then update `date_modified`
- A 2016 piece with a current update date and a refreshed paragraph beats the
  same piece left untouched
- Prioritise pieces that rank for commercial or informational keywords

---

## Part 13 — Google News

Beauticate is registered for Google News. Requirements:

### Technical — [DONE / TODO]

| Requirement | Status |
|------------|--------|
| NewsArticle schema for news/trend/interview content | **Done** — auto-detected |
| `news_keywords` meta tag | **Done** — added for NewsArticle types |
| `datePublished` accuracy (must match real publication time) | **Done** |
| Transparent named authorship with bio page | **Partial** — author pages TODO |
| No paywalls or interstitials on news content | **Done** |
| News sitemap (`sitemap-news.xml`) | **TODO: Redfern** |

### News sitemap — [TODO: Redfern]

A dedicated news sitemap with only articles from the last 48 hours, separate from
the main sitemap. Required fields: `publication name`, `language`, `title`,
`publication_date`. Only include articles tagged or auto-detected as
NewsArticle.

### Editorial

- Headlines must be factual and specific — Google News penalises clickbait
- Publish date must be accurate (not backdated)
- Original reporting and timely content is favoured
- Include a clear dateline where relevant (e.g. "Sydney, Australia")

---

## Part 14 — Technical SEO for Vercel

### 14.1 Sitemap — [DONE]

Dynamic via `app/sitemap.ts`. Covers: 16 static pages, all published articles,
category/subcategory section pages, Shopify product pages, and collection pages.
Priorities: homepage 1.0, articles 0.7, products 0.6, sections 0.5.

### 14.2 Robots.txt — [DONE]

Dynamic via `app/robots.ts`. Single wildcard rule allowing all crawlers.
Disallows `/admin`, `/api/`, `/account` only. All AI bots (GPTBot, ClaudeBot,
PerplexityBot, Google-Extended) are implicitly allowed — this is correct for a
citation-first strategy.

### 14.3 llms.txt — [TODO: Redfern]

A file at the site root that summarises the site structure and key content for AI
engines. Spec:

```
# Beauticate

> Australian beauty, wellness and lifestyle publisher. Founded 2014 by Sigourney
> Cantelo, former Vogue Australia Beauty & Health Director. 3.1M monthly readers.

## Content

- Beauty & Style: skincare, makeup, hair, fragrance, beauty tips
- Interviews: founders, models, actors, creatives, tastemakers
- Destinations: spas, retreats, clinics, salons, travel
- Living: entertaining, interiors, wellness
- Sigourney's Edit: personal recommendations
- Shop: curated beauty products
- Beautiful Inside: vodcast / podcast

## Key pages

- /about: about Beauticate and the editorial team
- /shop: curated beauty store
- /vodcast: Beautiful Inside podcast
- /archive: full article archive
- /press: press and media enquiries

## Authors

- Sigourney Cantelo: Founder & Editor-in-Chief
- Kate Waterhouse: Style Editor
- Rae Morris: Makeup Editor
- Jocelyn Petroni: Skin Editor
- Monique McMahon: Hair Editor
```

### 14.4 Open Graph and social cards — [DONE]

Full OG + Twitter cards at layout, article, product and vodcast levels. Article
OG includes publishedTime, modifiedTime, authors, tags and
summary_large_image.

### 14.5 Canonical URLs — [DONE]

`lib/seo.ts` builds canonical from the URL automatically. No frontmatter change
needed.

### 14.6 Core Web Vitals

Next.js on Vercel handles most of this automatically (code splitting, image
optimisation, SSR). Monitor via Google Search Console > Core Web Vitals report.
Key metrics: LCP < 2.5s, FID < 100ms, CLS < 0.1.

### 14.7 Breadcrumbs — [DONE]

BreadcrumbList JSON-LD on articles, products, shop categories, collections and
vodcasts.

---

## Part 15 — Shop SEO

### 15.1 Product pages — [DONE]

Product JSON-LD with: name, image array, description, Brand, category
(productType), Offer (price, currency, availability), URL. BreadcrumbList also
generated.

### 15.2 Editor's notes on product pages

Every product detail page should carry a short editor's note. Doug flagged this
as both an AI signal and a conversion signal. This is an editorial voice element
that competitors lack.

### 15.3 Collection/category pages — [DONE]

Shop category pages have FAQPage schema and structured intros. Each category page
should have:
- A clear H1 answering "what is this category about"
- A 2-3 sentence intro paragraph (this is what AI extracts)
- FAQs relevant to the category

### 15.4 On-site reviews — [TODO]

Install Judge.me, Yotpo or Stamped and seed the first 50 reviews. Reviews are the
single strongest trust signal AI engines use for retail recommendations. Once
live, add AggregateRating to Product schema.

### 15.5 Editorial-to-shop cross-linking

Every product mention in an editorial article should link to the shop product
page. Every product page should link back to the relevant editorial. Both
directions, consistently. This is now standard internal linking on the same
domain.

---

## Part 16 — GEO: Generative Engine Optimisation (2026)

This section covers the newer moves specific to being cited by AI-generated
answers — ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews.

### 16.1 AI crawler access — [DONE]

All major AI bots are allowed in robots.txt. This is correct. Being crawlable is
a prerequisite for being cited.

### 16.2 llms.txt — [TODO: Redfern]

See Part 14.3 above.

### 16.3 Citation engineering

The difference between being *read* by AI and being *cited by name*:

- **State claims as attributable facts.** "According to Beauticate's testing..."
  or "Beauticate's Sigourney Cantelo recommends..." — give the AI a named source
- **Include unique data.** Test results, star ratings, specific prices, percentage
  improvements. AI cites specifics
- **Entity-rich language.** Full proper names always. "The Ultraceuticals Ultra B2
  Serum" not "this serum"
- **Self-contained sections.** Each section reads clearly on its own, without
  needing the sections above it. AI lifts chunks, not whole pages
- **Fact density.** A concrete fact or number roughly every 150-200 words

### 16.4 Source triangulation

AI engines cross-reference multiple sources. Being cited on external sites feeds
back into AI trust. Strategy:

- Earn 2-3 branded mentions in tier-1 publications (Vogue AU, Marie Claire AU,
  Russh, Gritty Pretty, Primer)
- Pitch a specific angle: a data point, a category trend, a founder POV
- Unlinked mentions ("according to Beauticate...") still improve authority
- Three quality mentions will measurably move the Brand Intelligence score

### 16.5 Conversational query patterns

People ask AI differently than Google. "What would Beauticate recommend for dry
skin?" vs "best moisturiser dry skin Australia". Write content that answers both
patterns:

- Include the brand name near key recommendations
- Frame advice as coming from a named expert
- Use natural question-and-answer phrasing in H2s and QuickAnswer

### 16.6 Brand mentions without links

AI engines weight unlinked brand mentions almost as heavily as backlinks. Entity
recognition matters more than link graphs for AI citation. With 2,082 referring
domains already, the next layer of authority is quality mentions, not volume of
links.

### 16.7 Multi-modal search

Google Lens and visual search are growing. The image strategy in Part 10 already
supports this, but be explicit:

- Descriptive, keyword-rich filenames
- Meaningful alt text on every image
- Original photography over stock (visual search favours unique images)
- Product images with clean backgrounds for visual matching

### 16.8 AI Overviews and featured snippets

Google AI Overviews are expanding. Content most likely to be selected:

- Has a clear, direct answer in the first 40-60 words
- Uses question-style H2 headings
- Includes structured data (FAQ, HowTo, Review)
- Has strong E-E-A-T signals
- Is fresh (dateModified within the last 13 weeks for trending topics)
- Comes from a known, verified entity (Wikidata, Knowledge Graph)

How AI Overviews select sources (2026 behaviour):

- Google pulls from multiple pages and synthesises — it favours pages that confirm
  each other across different domains
- Named, credentialled authors are cited more often than anonymous content
- Pages with FAQ schema that directly match the query are disproportionately
  selected
- Review articles with star ratings appear in AI Overviews for commercial queries
- Content older than ~13 weeks drops out of consideration for trending topics but
  evergreen content with a recent `dateModified` remains eligible

### 16.9 Perplexity publisher programme

Perplexity offers a publisher revenue-sharing programme. When Perplexity cites
your content in an AI-generated answer, you earn a share of the ad revenue on
that answer page. Worth registering — Beauticate's 67% AI share of voice in
Australian beauty means significant citation potential.

To apply: visit perplexity.ai/hub/publishers. Requirements: original content,
clear authorship, no paywall. Beauticate qualifies on all counts.

### 16.10 Google Site Reputation Abuse policy

Google's March 2024 Site Reputation Abuse policy penalises sites that host
third-party content primarily for ranking purposes — "parasite SEO". This is
relevant if Beauticate ever:

- Publishes sponsored or guest articles
- Hosts brand-supplied content under the Beauticate byline
- Creates content pages primarily to rank for another brand's keywords

**Rules for Beauticate:**
- Sponsored content must be clearly labelled and use `rel="sponsored"` on links
- Guest contributors must have genuine editorial involvement — not just a
  brand supplying a finished article
- Every published piece must pass the editorial bar regardless of who wrote it
- Never publish content whose primary purpose is ranking for a partner's keywords
- If in doubt, add `<meta name="robots" content="noindex">` to pure-sponsored
  pages that exist for the partnership, not for readers

### 16.11 Schema trigger guide for editors

The Vercel template auto-detects schema type from the title, tags and category.
Here is what triggers each type — editors should be aware so they can confirm
the right type is applied.

| Your content | Auto-detected schema | What triggers it |
|-------------|---------------------|-----------------|
| Standard article | Article | Default — no special trigger needed |
| Interview, destination, trend piece | NewsArticle | Category is `interviews` or `destinations`, OR subcategory is `travel`, OR tags include `news`, `trending`, or `interview`, OR `is_news: true` in frontmatter |
| Product review, "we tried" | Review | Title contains "review" or "we tried", OR tags include `review` — also add `review_rating`, `review_item`, `review_brand` to frontmatter |
| Tutorial or guide | HowTo | Title contains "how to" or "guide", OR tags include `how-to` — steps auto-extracted from H2 headings |
| Any article with FAQs | FAQPage (appended) | `faqs` array present in frontmatter |
| Spa, salon, clinic write-up | LocalBusiness | `venueType` set in frontmatter (`spa`, `skin-clinic`, `salon`, `nail-salon`) |
| Vodcast episode | PodcastEpisode + Article | Vodcast template — automatic |

If the auto-detection gets it wrong (e.g. an article titled "How to style your
hair" that is actually a product roundup, not a step-by-step guide), override
by adjusting the title or tags. The schema type is derived, not manually set.

---

## Part 17 — Freshness: what to refresh, how often

### 17.1 The business case

Around half of content cited in AI answers is less than 13 weeks old. A refreshed
article with a current `dateModified` outperforms the same article left
untouched — in Google rankings, AI Overviews, and Perplexity citations.

### 17.2 Which articles to refresh

Use Google Search Console to identify candidates. Prioritise in this order:

1. **Declining traffic** — articles that ranked well 6-12 months ago but are
   dropping. A refresh can recover them
2. **High impressions, low clicks** — articles appearing in search results but
   not getting clicked. Rewrite the seo_title and meta_description
3. **Top 20 traffic pages** — keep these fresh as a matter of course. They are
   the most likely to appear in AI Overviews
4. **Evergreen how-tos and reviews** — these have long shelf lives but need
   updated products, prices and recommendations
5. **Seasonal content** — refresh 4-6 weeks before the season (e.g. update
   "best sunscreens" in September for the Australian summer)

### 17.3 What counts as a refresh

A genuine refresh — not just changing the date. Each refresh should include at
least two of:

- Update the QuickAnswer with current information
- Add or replace a product recommendation
- Update a statistic or price
- Add a new FAQ
- Add a new image or replace an outdated one
- Add an internal link to a newer related article
- Update the meta_description

Then set `date_modified` to today's date.

### 17.4 Cadence

- **Top 20 traffic pages:** refresh every 8-12 weeks
- **Evergreen how-tos and reviews:** refresh every 6 months
- **Seasonal content:** refresh once per year, 4-6 weeks before season
- **Interviews and news:** generally do not refresh (they are time-stamped)
- **Venue/clinic reviews:** refresh annually or when significant changes occur

---

## Part 18 — Editorial-to-shop cross-linking process

### 18.1 When writing or editing an editorial article

- Every time you mention a product by name, check if it exists in the Beauticate
  shop at `/shop/products/[handle]`
- If it does, link the product name to the shop page on first mention
- If the product has a dedicated editorial review or feature, add an
  `<EditorNote>` component with the shop link
- For roundup/listicle articles, link every featured product to its shop page

### 18.2 When adding a product to the shop

- Search the content archive for editorial articles that mention this product or
  brand
- Add the shop link to those articles (or flag them for the next refresh cycle)
- In the product description, link back to the editorial review or feature if one
  exists
- Add an editor's note to the product page referencing the editorial context

### 18.3 Why this matters

On a unified domain, every internal link between editorial and shop passes full
authority. An editorial review linking to a product page tells Google and AI
engines that this product page is editorially endorsed. A product page linking
back to the review tells them the review is commercially relevant. Both signals
lift both pages.

---

## Part 19 — Competitor landscape

From Doug's audit (April 2026):

| Domain | Search | Brand | AI | Notes |
|--------|--------|-------|-----|-------|
| **beauticate.com** | 60 | 58 | **65** | 67% AI share of voice, 2,082 referring domains |
| cocoandeve.com | 79 | 72 | 48 | Zero AI citations despite high search visibility |
| livingproof.com | 52 | 81 | 35 | Enterprise backlinks but no AI presence |
| bondiboost.com.au | 87 | 48 | 52 | 12,001 keywords but highest AI risk (28) |

**Key insight:** All three competitors show zero AI citation presence. Beauticate
has a first-mover advantage in AI-driven authority. The entire Australian beauty
category is underexploited in AI search. Investing in structured markup and
prompt-optimised content creates a defensible 15+ point separation.

---

## Part 20 — Per-article checklist

Run this before publishing each article.

- [ ] Direct answer of 40-60 words near the top (QuickAnswer component)
- [ ] Main question plus its natural follow-ups covered in the piece
- [ ] A concrete fact, number or result roughly every 150-200 words
- [ ] Original testing, insight or expert quotes for E-E-A-T
- [ ] Sections that read clearly if extracted on their own
- [ ] 2-3 FAQs near the end (in frontmatter `faqs` array)
- [ ] At least one original or styled image, with keyword-rich filename and alt
- [ ] At least one multimedia element (YouTube embed, collage, chart)
- [ ] Correct author attributed, content type and schema right
- [ ] VideoObject present if a video is embedded
- [ ] At least one internal link (into the topic cluster), one external link
- [ ] Metadata complete: `seo_title`, slug, `meta_description`,
  `focus_keyphrase`
- [ ] Current `date_modified` if this is a refresh

---

## Part 21 — Build-once summary (template level)

For Redfern / Claude Code. Items pulled into one list.

| Item | Status | Detail |
|------|--------|--------|
| QuickAnswer component | **Done** | Optional per article, degrades when empty |
| Top byline linked to author page | **Partial** | Byline exists; author pages not built yet |
| Article JSON-LD (Article, NewsArticle, Review, HowTo) | **Done** | Auto-detected |
| FAQPage schema from frontmatter | **Done** | |
| Person schema with sameAs | **Done** | Wikidata ID corrected to Q139644159 |
| Organisation schema on every page | **Done** | With Wikidata Q139643093 |
| VideoObject on vodcasts | **Done** | |
| VideoObject on regular articles | **TODO** | Detect YouTube embeds in MDX body |
| Visible "last updated" date | **Done** | From dateModified |
| Responsive images + lazy loading | **Done** | Next.js Image component |
| BreadcrumbList | **Done** | Articles, products, collections, vodcasts |
| Product + Offer schema | **Done** | On product detail pages |
| SpeakableSpecification | **Done** | On articles |
| LocalBusiness schema | **Done** | On venue articles |
| Author pages (`/author/[slug]`) | **TODO** | Route + template + Person schema |
| News sitemap (`sitemap-news.xml`) | **TODO** | Last 48 hours, NewsArticle only |
| llms.txt | **TODO** | Site-root summary for AI crawlers |
| AggregateRating on products | **TODO** | After reviews integration |
| Homepage OG image | **TODO** | Branded landscape share image |

---

## Part 22 — Redirects and slug changes

- The URL is the directory name, not frontmatter `slug`. To rename: `git mv` the
  folder and the `.mdx` file, and update frontmatter `slug` to match
- Add a permanent redirect in `next.config.ts` `redirects()` from the old path
  (`permanent: true` → HTTP 308, which Google treats as 301)
- Re-point any existing redirects whose destination was the old path
- Canonical needs no frontmatter change — `lib/seo.ts` builds it from the URL
- **For top-performing pages, do not change the URL without a redirect and
  explicit sign-off**

---

## Part 23 — MDX component quick-reference

| Component | Use | Notes |
|-----------|-----|-------|
| `<QuickAnswer>` | Featured answer box high on the page | Eyebrow + copy, AEO surface |
| `<AffiliateCTA href label>` | Boxed CTA with tracked button | Forces `rel="sponsored noopener"` |
| `<SplitRow image alt side imageWidth>` | Text beside a smaller image (2-col) | `side` left/right; `imageWidth` is a string |
| `<EditorNote>` | Boxed Beauticate Shop cross-sell | Pair beside an image via SplitRow |
| `<Portrait src alt side>` | Floated portrait that wraps text | Watch float bleed across `##` headings |
| `<FAQPanel>` | Accordion FAQ display | Rendered from frontmatter `faqs` |
