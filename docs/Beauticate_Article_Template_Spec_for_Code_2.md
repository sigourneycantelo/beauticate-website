# Beauticate: Article Template System

**For:** Claude Code (pipeline step 2)
**From:** Sig (creative direction)
**Purpose:** Defines the templates every article is built and optimised against. This is the output of pipeline step 1, the type decision. Step 2 builds these.

---

## The headline decision

Eight article types, but three templates. The eight types are tags that drive schema and modules. They are not eight designs. Six of the eight share one editorial shell.

The three templates:

1. **The Story** — the flexible editorial shell. Serves interview, personal essay or routine, how-to or tips, single product review, product roundup, and travel, all via presets.
2. **The Directory** — venue listings and individual venue pages. A separate layout.
3. **The Episode** — podcast and vodcast pages. A separate, player-led layout.

Build order: the Story shell first (it covers the bulk of the 1,734 articles), then the Directory, then the Episode.

---

## Design source

Do not invent a new look. Inherit the locked v15 homepage design system: EB Garamond and Hanken Grotesk, the locked colour and spacing tokens, and the existing card treatments. The Story template is those tokens applied to an article.

Global rules for all templates: single column, no sidebar. Body copy ragged-right, never justified. Generous reading measure, around 640 to 720px.

---

## The Story shell (top to bottom)

- Global masthead and nav (shared component)
- Breadcrumb: category and subcategory (depends on final IA, coming from the nav workstream)
- Hero, two modes (see Hero below)
- Title, serif, large
- Standfirst, italic serif
- Byline: author photo, name, role, date, read time
- Optional slim one-line "New to Beauticate?" under the byline, quiet, with a soft link
- Body: single column, ragged-right, images restored to their correct in-body positions
- Body images contained and centred at or near the text measure, with white space around them. No text wrapping. Full-bleed reserved for the hero and occasional section breaks
- Italic lead lines preserved (formatting only)
- Pull quotes: oversized EB Garamond, roman with selective italic, generous white space. Applied to new and priority stories going forward, not retrofitted across the migrated 1,734
- Section headers (H2) for structure and AEO
- Inline product and brand links at the point each is mentioned
- Subscribe band: once, mid-article, at a natural break, benefit-led, single field
- Shop the Edit: product card block at the foot. This is the primary conversion block and the scripted default for migration. Single inline product cards can be hand-placed higher up on priority stories
- FAQ / AEO block near the foot
- Follow line near the foot ("Follow @beauticate"). No live Instagram feed on articles. The themed Curator feed lives on category pages only
- Related posts, "You might also like"
- Continuous scroll: as the reader nears the end, lazy-load the next related story. Keep key footer links reachable another way so they are not buried
- Global footer

Retire the old native comments box. The conversation lives on Instagram and in newsletter replies.

### Hero, two modes

1. **Full-bleed landscape** when a good landscape image exists.
2. **Editorial split** when it does not: a portrait or square image on one side, the headline and standfirst set on a greige panel (the established greige token) on the other.

Default to the editorial split when no landscape is available. Square and portrait holding shots are far easier to source, so the split is the workhorse, not the exception. Reference: SheerLuxe article heros.

### Product cards

Clean tile, product image, name, brand, price, and a save or shop action. Reference: SheerLuxe product cards. Used both in the Shop the Edit foot block and as occasional inline single cards.

### Parallax

One subtle use only, on the hero (for example a gently pinned image while the headline scrolls). Simplified or disabled on mobile. No page-wide parallax.

---

## Presets on the Story shell

Each type switches on its modules and schema. The shell stays the same.

- **Interview or profile** → guest bio block, interview rhythm. Schema: BlogPosting + Person + FAQPage. (Rae Morris, Alyce Tran, Abbey Gelmi)
- **Product roundup or listicle** → product cards per entry, big serif numerals (01, 02, 03) for each entry, Shop the Edit dialled up. Schema: ItemList + FAQPage, plus Product per item. Conversion-heavy. (Wisteria scents, Italian pharmacy buys)
- **Single product review** → verdict and rating module, single hero product card. Schema: Review + Product + FAQPage. (Olaplex, Qure, Dyson)
- **First-person routine or personal essay** → commerce light or off. Schema: BlogPosting. (Fine or frizzy hair routine, nightly rituals)
- **Expert how-to or tips** → optional big serif numbered steps. Schema: Article + FAQPage. (Brow mistakes)
- **Travel or stay** → map and location module. Schema: BlogPosting or Review, plus Place. (Hotels, city guides)

Tribute pieces (eg Farrah Fawcett) use the interview preset with a rights-sensitive flag. They route to a human, never through the batch. Sponsored is a disclosure layer switched on over any preset, not a type of its own.

---

## The Directory template (separate build, park detail)

An index or listing page plus individual venue pages. Schema: LocalBusiness with NAP (name, address, phone). Map on the venue page. Design to follow once the Story shell is live.

## The Episode template (separate build, park detail)

Player-led. Audio and video hero, episode notes, guest, chapters or timestamps, links to subscribe on podcast platforms. Schema: PodcastEpisode + VideoObject. Design to follow.

---

## Two schema flags, do not skip

- **HowTo markup is dead for rich results.** Google removed HowTo rich results in 2023. For the how-to type use Article + FAQPage and do not spend build time on HowTo markup.
- **FAQPage no longer shows as Google dropdowns** for a site like ours (restricted to government and health sites in 2023). Keep the FAQ blocks anyway. Their job now is feeding the AI answer engines (ChatGPT, Perplexity, Gemini), which is the core of the AEO strategy, plus on-page clarity. Expect the win there, not in a Google snippet.

---

## How this feeds the pipeline

First, Code generates the article inventory from the repo or sitemap (cheap and mechanical). Then each article is tagged by type and category. Tagging is straightforward classification, so it can be done by any capable LLM (including ChatGPT) to preserve Claude credits, as long as it is given the fixed eight-type list and the category taxonomy. The output is a simple type-and-category list that Code reads. Code loads the matching preset and applies the schema and modules. Editorial exceptions (discontinuations, rights flags, sensitive edits) route to a human and never live in the template. Sig and Claude do final QA and publish.
