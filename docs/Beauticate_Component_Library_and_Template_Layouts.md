# Beauticate: Article Component Library and Template Layouts

**For:** Claude Code, Sig, Maeko
**From:** Sig and Claude (creative direction)
**Purpose:** The definitive reference for every component available in Beauticate articles and how they map to each template and preset. Use this when building new stories and when briefing Code on layout work.

---

## Part 1: Component Library

Every element available for use in Beauticate articles. Components are grouped by function. Each entry defines what it is, when to use it and any rules.

---

### Structural Components

These form the skeleton of every page. They are not placed by the writer. They are automatic.

**Masthead and Nav**
The global site header. Shared across all pages. Includes the wordmark, primary navigation, utility bar (search, sign in, bag) and social icons. Collapses to a hamburger on mobile. A slim sticky version appears on scroll so nav, search and shop stay reachable.

**Breadcrumb**
Category and subcategory links above the hero. Driven by the article's taxonomy tags. Helps orientation for cold landers and feeds structured data.

**Hero: Full-Bleed Landscape**
A wide, edge-to-edge image filling the viewport width. Used when a good landscape image exists. The default hero mode. A subtle parallax pin (image stays while headline scrolls over it) can be applied. Simplified or disabled on mobile.

**Hero: Editorial Split**
The fallback hero. A portrait or square image on one side, the headline and standfirst centre-aligned on a greige panel on the other. Used when no landscape image is available. The greige uses the established parchment/greige token. Mobile stacks the image above the text panel.

**Title Block**
Title in large serif (EB Garamond). Standfirst in italic serif beneath it. Byline row below: author photo, author name, role, date, read time. Optional affiliate disclosure flag. Optional slim "New to Beauticate?" line with a soft link. The title block sits below the hero, or beside the image in the editorial split.

**Body Container**
The single-column reading area. Max-width aligned to the outer edges of the global nav above (one shared container width, one vertical spine). Ragged-right, never justified. All inline components sit within or break out of this container as specified below.

**Footer**
The global site footer. Shared across all pages. Wordmark, navigation links, social links, legal lines.

---

### Editorial Components (inline, placed in the body)

These are the building blocks the writer and editor use to compose a story. They sit inside the body container unless noted otherwise.

**Body Text**
Standard paragraphs. Hanken Grotesk (or the locked v15 body face), sized for comfortable reading. Ragged-right. Links are underlined in the body text colour, not a bright accent.

**Section Header (H2)**
Marks a new section of the story. EB Garamond, bold or semi-bold, sized clearly above body text. Critical for structure, scannability and AEO. Every story should use H2s to break the body into named sections.

**Section Subheader (H3)**
A secondary break within a section. Hanken Grotesk, bold, sized between H2 and body. Use sparingly.

**Pull Quote**
An oversized statement lifted from the text. EB Garamond, roman with selective italic on one or two key words. Generous white space above and below. Centre-aligned. The signature editorial moment. Use two or three per feature-length story, fewer on short pieces. Applied to new and priority stories going forward, not retrofitted across legacy content.

**Inline Image**
A single photograph placed in the reading flow. Contained and centred at or near the body text measure. White space above and below. No text wrapping. Carries alt text (mandatory for accessibility and SEO) and an optional caption/credit line.

**Image Caption and Credit**
Small, uppercase, letter-spaced, muted grey. Never black, never bold, never underlined even when containing a link. Reads as a footnote, not a sentence. Sits directly beneath its image.

**Full-Bleed Image**
A photograph that breaks out of the body container to fill the full viewport width. Used as an occasional section break or atmosphere moment, never as the default for every image. One or two per story at most.

**Image Pair**
Two images placed side by side at the body width. Each image takes roughly half the measure. Useful for before/after, two angles of the same subject, or creating visual rhythm. Stacks vertically on mobile.

**Image Grid**
Three or four images in a grid at the body width. Used for product flat-lays, location mood boards or shoot outtakes. Stacks to two columns on mobile.

**Sticky Scroll Portrait**
The editorial parallax device. A portrait image pins in place on one side while the adjacent text scrolls alongside it. Creates a magazine-style reading moment. Used on interviews and profiles where a strong portrait anchors a long passage of text. One per story at most, placed at a natural editorial high point. On mobile the image unpins and sits above the text block.

**Portrait with Quote (PortraitQuote)**
A portrait image paired with a pull quote, laid out side by side. The image sits on one side, the quote on the other. Used in interviews to pair a guest's words with their image. Stacks vertically on mobile.

**Editor's Note (EditorNote)**
A short callout from the editor, visually distinct from the body text. Set on a light parchment background with a subtle left border or icon. Used for context, corrections, updates or personal asides.

**Quick Answer (QuickAnswer)**
A concise, direct answer to the article's headline question, placed high in the body (within the first two or three paragraphs). Styled as a quiet card on parchment. Feeds AI answer engines (ChatGPT, Perplexity, Gemini) and rewards scanners. Critical for AEO strategy.

**YouTube Embed (YouTubeEmbed)**
A responsive video player at the body width. Used for podcast video episodes, brand videos or tutorial content embedded in a story. Lazy-loaded.

**Numbered Entry (big serif numeral)**
A large serif numeral (01, 02, 03) marking each entry in a listicle or each step in a how-to. EB Garamond, oversized, in chocolate or a muted tone. The numeral sits above or beside the entry's heading. Only used in the listicle/roundup and how-to presets.

---

### Commerce Components

These drive product discovery and conversion. They can be placed inline or in dedicated blocks.

**Product Card (ProductInset)**
A single product tile placed inline in the body at the point a product is mentioned. Clean and minimal: product image on a neutral background, brand name, product name, price, and a quiet "Shop" action. No visible cart button on the card surface. Reference: SheerLuxe and Net-a-Porter product cards.

**Shop Grid (ShopGrid / ShopItem)**
A row of three product cards at the body width. Used for inline product moments (mid-article) when the writer wants to surface a curated trio. Think of it as a shoppable shelf break in the reading flow.

**Shop the Edit**
A dedicated product section, typically at the foot of the article. Uses the ShopGrid component, displaying six products in two rows of three (desktop) or a scrollable row (mobile). This is the primary conversion block and the scripted default for migration. Heading: "Shop the Edit" in EB Garamond. Every article with product links gets one.

**Shop the Look**
A variant of Shop the Edit used when the products relate to a specific outfit, room or styled moment in the story. Same grid, different heading: "Shop the Look." Used on style, interiors and travel pieces where the products map to an image above.

**Affiliate CTA (AffiliateCTA)**
A soft call-to-action linking to a product or retailer. Styled as a quiet text link or a small button, not a banner. Used inline when a single product mention warrants a direct link but a full ProductInset card would be too heavy.

**Collection Embed (CollectionEmbed)**
An embedded Shopify collection, pulling a curated set of products from the Beauticate shop. Used when an article maps to an existing shop collection (e.g. "Little Luxuries Under $50"). Displays as a scrollable product row.

---

### Conversion Components

These grow the audience and deepen engagement.

**Subscribe Band**
A single email capture field with a headline and one supporting line. Placed once mid-article at a natural reading break. Never more than once in the body. The footer signup is the second touchpoint. No checkboxes, no name field, no category preferences. One field, one button.

Two versions:

*Beauty and Wellness version (on Beauty and Wellness articles):*
Headline: The Beauticate Edit
Supporting: More where this came from. Beauty, wellness and conversations worth having. Fortnightly.

*Generic version (on Style, Living, Destinations, Interviews, Podcast, Home):*
Headline: The Beauticate Edit
Supporting: Beauty, wellness and everything worth knowing. In your inbox fortnightly.

**Follow Line**
A simple line near the foot of the article: "Follow @beauticate" with a link to Instagram. No embedded feed on articles. The themed Curator feed lives on category pages only.

**Share Buttons**
A row at the foot of the article, after the FAQ block. Pinterest, Email, Copy Link. Pinterest is the priority for beauty and lifestyle content. Optional sticky share strip on mobile (small, unobtrusive, disappears on scroll-up).

---

### Structure and SEO Components

These serve discoverability and trust. They are typically automated or templated.

**FAQ Accordion (FAQPage)**
A collapsible question-and-answer block near the foot of the article. Feeds AI answer engines for AEO. Not expected to show as Google rich-result dropdowns (restricted since 2023) but kept for on-page clarity and AI discoverability. Every article type except personal essays should have one.

**Affiliate Disclosure**
Small print at the foot of the article, shown only when the article has `affiliate_disclosure: true`. Required for compliance.

**Related Posts ("You might also like")**
A grid of three related article cards after the FAQ/share block. Driven by category and tags. Three cards on desktop, scrollable on mobile.

**Continuous Scroll**
As the reader nears the end of the article, the next related story lazy-loads below. Keeps the reader on-site and lifts dwell time. Key footer links must remain reachable via the sticky footer or a separate route so they are not buried.

---

### Preset-Specific Components

These only appear in certain article types. They switch on when the preset is applied.

**Guest Bio (interviews only)**
A small card with the guest's photo, name, title and a one-line bio. Placed after the title block or after the opening paragraphs. Feeds the Person schema.

**Verdict and Rating (single reviews only)**
A summary card with the editor's verdict, a score or rating, and key pros and cons. Placed near the top (after the Quick Answer) or at the foot before Shop the Edit. Feeds the Review schema.

**Map and Location (travel only)**
An embedded map showing the venue, hotel or destination discussed in the article. Placed inline near the relevant section. Feeds the Place schema.

**Sponsored Disclosure Layer**
A label and disclaimer that overlays any preset. Not a template of its own. When switched on it adds a "Paid Partnership" or "Sponsored" label beneath the byline and a disclosure paragraph at the foot. Transparent and compliant, never hidden.

---

## Part 2: Template Layouts

Three templates. The Story shell serves six of eight article types via presets. The Directory and Episode are separate layouts.

Each layout below lists the components in reading order, top to bottom.

---

### Template 1: The Story

The flexible editorial shell. The backbone of the site, covering interviews, product roundups, single reviews, personal essays, how-tos and travel.

**Fixed structure (every Story has these):**

1. Masthead and Nav
2. Breadcrumb
3. Hero (landscape or editorial split, determined by available imagery)
4. Title Block (title, standfirst, byline, read time)
5. Body Container opens
6. Body Text, Section Headers, Inline Images as needed
7. Subscribe Band (once, mid-article)
8. Body Container closes
9. Shop the Edit (if article has product links)
10. FAQ Accordion (if article has FAQs)
11. Share Buttons
12. Follow Line
13. Related Posts
14. Continuous Scroll trigger
15. Footer

**Optional components (placed by the writer or editor as the story calls for them):**

Pull Quote, Full-Bleed Image, Image Pair, Image Grid, Sticky Scroll Portrait, Portrait with Quote, Editor's Note, Quick Answer, YouTube Embed, Product Card (inline), Shop Grid (inline), Affiliate CTA, Collection Embed.

---

### Story Presets

Each preset switches on specific components and schema. The shell stays the same.

**Interview or Profile**
Switches on: Guest Bio, Sticky Scroll Portrait, Portrait with Quote, Pull Quote (generous use).
Commerce: light. Product Cards and Shop the Edit only if the guest discusses specific products.
Schema: BlogPosting + Person + FAQPage.
Editorial rhythm: conversational, flowing, broken by portraits and quotes. Images are the star.
Examples: Rae Morris, Alyce Tran, Abbey Gelmi, Delta Goodrem.

**Product Roundup or Listicle**
Switches on: Numbered Entry (big serif numerals), Product Card per entry, Shop Grid (inline, after every second or third entry), Shop the Edit (at foot, dialled up to nine or twelve products if needed).
Commerce: heavy. This is the primary conversion format.
Schema: ItemList + FAQPage, plus Product per item.
Editorial rhythm: numbered entries with product imagery. Each entry has a numeral, an H2, body text and a product card.
Examples: Top 50 Skincare Products, Italian pharmacy buys, wisteria-scented fragrances.

**Single Product Review**
Switches on: Quick Answer (high in the body), Verdict and Rating, one hero Product Card.
Commerce: focused. One product, reviewed in depth.
Schema: Review + Product + FAQPage.
Editorial rhythm: opens with the Quick Answer and verdict, then the long-form review, then Shop the Edit with related products.
Examples: Dyson V16, Olaplex, Qure helmet.

**First-Person Routine or Personal Essay**
Switches on: Pull Quote (generous use), Sticky Scroll Portrait (if a strong portrait exists).
Commerce: light or off. Product Cards only if the writer names specific products.
Schema: BlogPosting.
Editorial rhythm: intimate, flowing, image-led. No numbered entries, no grids. The writing is the focus.
Examples: Fine-frizzy-hair routine, nightly rituals, personal reflections.

**Expert How-To or Tips**
Switches on: Numbered Entry (big serif numerals for steps), Quick Answer, Shop Grid (after the steps if products are relevant).
Commerce: moderate. Product recommendations follow the advice.
Schema: Article + FAQPage. (Not HowTo markup. Google removed HowTo rich results in 2023.)
Editorial rhythm: numbered steps with clear H2s. Images illustrate each step.
Examples: Brow mistakes, skincare layering guide.

**Travel or Stay**
Switches on: Map and Location, Image Grid (for venue or destination mood), Full-Bleed Image (for atmosphere shots).
Commerce: light. Product Cards only if travel-specific products are mentioned.
Schema: BlogPosting or Review + Place.
Editorial rhythm: evocative, image-heavy. Full-bleed images earn their place here more than in any other preset.
Examples: Hotel reviews, city guides, destination round-ups.

**Tribute (variant of Interview)**
Uses the Interview preset with a rights-sensitive flag. Images and quotes must be cleared for rights before publishing. Routes to a human review, never through the batch.
Examples: Farrah Fawcett tribute.

**Sponsored (disclosure layer, not a preset)**
Adds: Sponsored Disclosure Layer (label beneath byline, disclaimer at foot).
Can overlay any preset. Does not change the template structure.

---

### Template 2: The Directory

A separate layout for venue listings and individual venue pages (salons, spas, clinics, restaurants).

**Index page:**

1. Masthead and Nav
2. Breadcrumb
3. Hero (landscape or category header image)
4. Title Block (directory name, intro text)
5. Filter bar (location, category, type)
6. Venue cards (grid, each card shows venue image, name, suburb, category, rating)
7. Subscribe Band
8. Footer

**Individual venue page:**

1. Masthead and Nav
2. Breadcrumb
3. Hero (venue hero image)
4. Venue name, address, phone, website, hours
5. Map and Location (embedded map)
6. Body text (editorial description)
7. Image Grid (venue photos)
8. FAQ Accordion (if applicable)
9. Related venues ("Nearby" or "You might also like")
10. Footer

Schema: LocalBusiness with NAP (name, address, phone).

---

### Template 3: The Episode

A separate, player-led layout for podcast and vodcast episodes.

1. Masthead and Nav
2. Breadcrumb
3. Episode hero (guest portrait or episode artwork)
4. Episode title, guest name, date, duration
5. Audio player or video player (YouTube Embed for vodcast)
6. Listen-on links (Spotify, Apple Podcasts, YouTube)
7. Episode description (body text)
8. Guest Bio
9. Timestamps or chapters (if available)
10. Products mentioned (Shop Grid or Shop the Edit, if applicable)
11. Subscribe Band (podcast-specific copy if needed)
12. Related Episodes
13. Footer

Schema: PodcastEpisode + VideoObject.

---

## Part 3: Component-to-Preset Quick Reference

A matrix showing which optional components switch on for each preset. Fixed components (masthead, breadcrumb, hero, title, body, subscribe, FAQ, share, related, footer) are always present and not listed.

| Component | Interview | Roundup | Review | Essay | How-To | Travel |
|---|---|---|---|---|---|---|
| Guest Bio | yes | - | - | - | - | - |
| Pull Quote | yes | optional | optional | yes | optional | optional |
| Sticky Scroll Portrait | yes | - | - | yes | - | - |
| Portrait with Quote | yes | - | - | - | - | - |
| Numbered Entry | - | yes | - | - | yes | - |
| Product Card (inline) | optional | yes | yes | optional | optional | optional |
| Shop Grid (inline) | optional | yes | optional | - | optional | - |
| Shop the Edit (foot) | optional | yes | yes | optional | optional | optional |
| Shop the Look | - | optional | - | - | - | optional |
| Quick Answer | - | optional | yes | - | yes | - |
| Verdict and Rating | - | - | yes | - | - | - |
| Map and Location | - | - | - | - | - | yes |
| Full-Bleed Image | optional | optional | optional | optional | optional | yes |
| Image Pair | optional | optional | optional | optional | optional | optional |
| Image Grid | optional | - | optional | - | - | yes |
| YouTube Embed | optional | - | optional | - | optional | optional |
| Editor's Note | optional | optional | optional | optional | optional | optional |
| Collection Embed | - | optional | optional | - | - | - |
| Affiliate CTA | optional | yes | yes | optional | optional | optional |

"yes" = switched on by default for this preset.
"optional" = available, placed at the writer's discretion.
"-" = not typically used in this preset.

---

## Part 4: Design Tokens (quick reference)

**Typography**
Display and headings: EB Garamond
Body text: Hanken Grotesk (or locked v15 body face)
Pull quotes: EB Garamond, oversized, roman with selective italic
Numerals: EB Garamond, oversized
Captions: Hanken Grotesk, small, uppercase, letter-spaced, muted grey

**Colour (warm neutral scale, one hue, stepped in lightness)**
Paper: near-white page base
Parchment: soft panel and section backgrounds (cooled slightly from original, less yellow)
Greige: product cards and tiles
Deep Greige: feature panels needing weight (podcast section)
Wine: primary accent
Chocolate (#3a2a22): secondary accent (pull quotes, numerals, section labels)
Black: body text and headlines

Teal and rust are reserved for Instagram only. They do not appear on the website.

**Spacing**
Body container max-width aligns with the outer edges of the global nav (one shared container, one vertical spine). Generous white space around pull quotes, between sections and around images. The site should breathe.

---

## Part 5: Usage Rules

1. Never use more than one Subscribe Band per article.
2. Never use more than one Sticky Scroll Portrait per article.
3. Pull Quotes are applied to new and priority stories going forward, not retrofitted across the migrated 1,734 legacy articles.
4. Full-Bleed Images are reserved for heroes and occasional section breaks, one or two per story at most. They are not the default image treatment.
5. Every image must have alt text. No exceptions.
6. Image captions are quiet credits, never styled as body text.
7. No live Instagram feed on article pages. The Curator feed lives on category pages only.
8. No sidebar. Ever. Single column on all editorial pages.
9. No native comments box. The conversation lives on Instagram and in newsletter replies.
10. Sponsored is a disclosure layer, not a template. It overlays any preset.
11. Tribute pieces route to a human for rights review. They never run through the batch.
12. HowTo schema markup is not used. Google removed HowTo rich results in 2023.
13. FAQPage schema is kept for AEO (AI answer engines), not for Google rich-result dropdowns.
14. Shop the Edit is the scripted default for migration. Inline Product Cards are hand-placed on priority stories only.
15. The hero defaults to full-bleed landscape when a landscape image exists. The editorial split is the fallback, not the default.
