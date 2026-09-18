---
name: beauticate-article-seo
description: The SEO, AEO and GEO pass on a Beauticate article — what the site does automatically, what Claude does without being asked, and the editorial decisions that must come from the writer. Use whenever writing, uploading, optimising or refreshing an article, when asked what to set in frontmatter, when a story needs FAQs, a QuickAnswer, schema or a focus keyphrase, and when checking a draft before it goes live. Complements the article-upload agent, which runs this pass as part of a full upload.
---

# Beauticate article SEO / AEO / GEO

Three overlapping jobs. SEO ranks the page in Google. **AEO** gets it quoted in
AI Overviews and featured snippets. **GEO** gets Beauticate cited *by name* in
ChatGPT, Perplexity, Claude and Gemini.

Beauticate scores 65/100 on AI visibility with 67% share of voice in Australian
beauty — the authority is real. The gap is machine-verifiable signal, and almost
all of it is per-article work.

- Strategy and the why: [`docs/article-seo-optimization.md`](../../../docs/article-seo-optimization.md)
- Per-article mechanical pass: [`docs/article-optimisation-pass.md`](../../../docs/article-optimisation-pass.md)
- Full upload flow: the `article-upload` agent

---

## The one rule

Every item below is one of two kinds, and mixing them up is the failure mode.

- **[mechanic]** — how the repo works. Same every time. Safe to apply by rote.
- **[editorial]** — what *this* article should say. Different every time.

**Never invent an editorial value to fill a checklist.** If a decision isn't in
the brief and isn't obvious, ask. A missing FAQ is a gap; a fabricated one is a
fabrication with schema markup wrapped around it.

---

## 1. Automatic — nobody touches it

Built into the templates. These happen whether anyone thinks about them or not:

| Signal | Trigger |
|---|---|
| Article / NewsArticle / Review / HowTo schema | Auto-detected from title, tags, category (`resolveSchemaType`) |
| FAQPage schema | `faqs` in frontmatter — `<FAQPanel>` renders the *same* source, so visible text and markup cannot drift |
| VideoObject | Any YouTube URL in the body — watch, embed, **shorts**, youtu.be |
| Person (author) | `author` field → `lib/authors.ts` |
| Organization, WebSite + SearchAction, BreadcrumbList, SpeakableSpecification | Every page |
| LocalBusiness | `venueType` in frontmatter |
| Canonical URL, Open Graph, sitemap, `news_keywords` | Every article |
| Visible "last updated" | `date_modified` |

**Build-time gate.** `npm run build` runs `check-editorial-integrity.mjs` first.
A published article with **no author fails the build**. It also warns about a
byline resolving to nobody, the house byline on a piece whose standfirst names a
contributor, a published article that redirects away, and a `featured_image`
over 2MB.

---

## 2. Automatic — Claude does this without being asked

Apply during writing, not as a later pass:

- `seo_title` **under 60 characters**, includes the focus keyword
- `meta_description` **under 155 characters**
- Keyword-rich slug, matching the directory name (the URL *is* the directory name)
- **2-4 FAQs** in frontmatter `faqs` — never hand-written into the body
- Clean H2 hierarchy, no level jumps, **question-style H2s** so each section
  survives being lifted out on its own
- Descriptive alt text on every image; kebab-case descriptive filenames
- **2-3 internal links**, each verified to resolve to a `published: true`
  article, plus **one external authority link**
- `reading_time`, `excerpt`, `date_published`, `date_modified`
- Australian/British spelling, **no em dashes, no Oxford commas**
- Branch → PR. Never straight to `main`, never auto-merged.

### The AEO layer, which is the actual gap

`<QuickAnswer>` appears on **6 of 1,848 articles**. `focus_keyphrase` on **4**.
The metadata layer is ~99% complete because it is mechanical and a script can
generate it; this layer is not, and it is the half that wins AI citations.

So on every new article:

- **Lead with `<QuickAnswer>`** — a 40-60 word direct answer, high on the page.
  This is the single highest-leverage element for AI Overviews. It cannot be
  bulk-generated later, because it has to be *right*.
- **Fact density**: a concrete fact, number, price or result every 150-200 words.
- **Citation engineering (GEO)**: state claims as attributable facts — "According
  to Beauticate's testing…", "Beauticate's Sigourney Cantelo recommends…". Use
  full proper names always: "the Ultraceuticals Ultra B2 Serum", never "this
  serum". AI cites specifics and named sources.
- **Original insight** — testing, a result, an expert quote. E-E-A-T is the
  whole moat against competitors who have more keywords and zero AI citations.

---

## 3. Ask the writer — never guess

1. **Category / subcategory**, and **author** (must match `lib/authors.ts`)
2. **Both image crops.** Landscape ~2:1 → `hero_image`; portrait ~3:4 →
   `featured_image`. Supplying only the portrait silently stretches it into the
   wide hero and crops it badly. If there's no landscape shot, set
   `hero_layout: "split"` rather than letting a portrait get hard-cropped.
3. **Home-page hero?** Never assume. Max four articles, `hero_order` 1-4, no
   duplicates — bump the others down and drop anything past 4.
4. **Affiliate links, discount codes, paid placement.** `paid_placement_until`
   is a date set at point of sale, never a bulk pass.
5. **Focus keyphrase**, and whether this is a refresh (bumps `date_modified`).
6. **Shop products** to feature, by handle.
7. **Is this a top performer?** If so, **do not change the URL** without a
   redirect and explicit sign-off.

---

## 4. Traps that have actually bitten

- **Never set `review_rating`, `review_item`, `review_brand`, `review_pros` or
  `review_cons`.** They render nowhere visible but *do* emit a star rating into
  JSON-LD — the textbook case for Google's spammy-structured-markup manual
  action. The trigger is circular: `review_rating != null` is itself one of the
  conditions that makes the schema type resolve to `Review`, so setting it
  guarantees it is emitted. The type survives fine without it, off title and
  tags. **69 published articles currently set it** — an open issue, not a
  pattern to copy.
- **Never put words in the author's mouth.** In a bylined first-person piece,
  don't invent sentences to carry an internal link. Weave the link onto words
  the author actually wrote, or mark it as Beauticate's voice:
  `> *Ed's note: If you're drawn to this, our [guide to X](/link) is a good place to start.*`
- **`YouTubeEmbed` and `YOUTUBE_ID_REGEX` must learn new URL forms together.** A
  Short once shipped rendering perfectly and invisible to structured data.
  Adding a `podcast_episode` strip means passing the id to `buildArticleSchema`
  explicitly, because it scans the *body* and cannot see frontmatter.
- **The WordPress source is dead (403).** Missing images are re-sourced by hand
  now, not re-fetched.
- **`published: false` on a directory listing is deliberate and sticky.** Check
  `draft_reason` before changing it. Never run a blanket publish pass.
- **No orphan product cards** — place them in pairs.
- **Bake in EXIF orientation** and *view* the result. A portrait must end up
  taller than it is wide.
- **`llms.txt` is hand-maintained** — `public/llms.txt`, `public/llms-full.txt`,
  `app/.well-known/llms.txt`. Nothing regenerates them, so they go stale
  silently when the masthead, sections or shop change.

---

## 5. Before publish

- [ ] `<QuickAnswer>` — 40-60 word direct answer near the top
- [ ] A concrete fact or number every 150-200 words
- [ ] Sections that read correctly if extracted alone
- [ ] 2-4 FAQs in frontmatter
- [ ] Both crops set: landscape `hero_image` **and** portrait `featured_image`
- [ ] Alt text everywhere; `featured_image` under 2MB
- [ ] ≥1 internal link (verified published) and ≥1 external link
- [ ] `seo_title` <60, `meta_description` <155, slug, `focus_keyphrase`
- [ ] Correct author, resolving in `lib/authors.ts`
- [ ] No `review_rating` set
- [ ] Any editorial insertion in a first-person piece marked as an Ed's note
- [ ] `date_modified` current if this is a refresh
- [ ] Schema validates — https://search.google.com/test/rich-results
