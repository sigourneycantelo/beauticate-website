# CLAUDE.md — Beauticate build rulebook

This file is the single source of truth for building Beauticate. Read it at the start of every session. It holds the durable rules. Individual task briefs will be given to you alongside it. Build in small, scoped, shippable pieces. When a task and this file conflict, ask before proceeding.

---

## 0. How to work

- Build one scoped thing at a time. A page, a component, a template. Never "rebuild the site".
- Every component inherits the tokens and rules below. Do not invent new colours, fonts or spacing.
- Mobile-first, always. Design the phone view first, then let it breathe on desktop.
- Prioritise speed and SEO. If something looks nice but slows the page, flag it.
- Ask before adding a dependency, a third-party embed, or anything that ships heavy JavaScript.
- Keep a short running note at the bottom of this file: what's built, what's next.
- Task playbooks live in /docs. Before a specific task, read its playbook: `docs/updating-stories.md` to add or edit a story, `docs/shoppable-story.md` for single-brand product stories. This file holds the rules. The playbooks hold the steps.

## 1. Stack

- Framework: Next.js (App Router), deployed on Vercel.
- Commerce: headless Shopify (Storefront API). Shopify owns cart, checkout, payments, inventory.
- Content: headless CMS for editorial (articles, interviews, guides, podcast notes).
- Media: video hosted on Mux or Cloudflare Stream, never in /public. Images optimised and served responsively.

## 2. Brand principle

Editorial first, commerce woven through. Black ink on white, the SheerLuxe and Goop model, where the photography carries the colour. Minimal but never empty. It reads as a magazine, not a storefront. It has to welcome someone arriving cold from Google, a shared link or an AI answer, while still feeling like home to someone who already follows on Instagram. Clear to a stranger, familiar to a fan.

## 3. Colour tokens

- Paper `#FFFFFF` — default background, the whole site
- Parchment `#FBF9F4` — accent surface only (long-read, the odd block, social tiles)
- Product tile `#EEE9E1` — the soft beige behind deep-etched products. This is the card shape. Matches beauticate.shop.
- Ink `#1C1A17` — all text and all buttons (warm near-black)
- Eucalypt `#8E9A82` — soft accent, tags, small wellness moments
- Deep Teal `#104760` — dark sections, podcast blocks, footer
- Brand accents (camel `#DBCEB9`, terracotta `#B5613A`, mist `#BABED8`, aqua `#bffff5`) appear rarely, mostly social. Black and white always leads.

## 4. Typography

- Headlines, intros, body, links: **EB Garamond** (400 / 500 / italic). Set sentence case or lowercase, with one word in italic for lift. EB Garamond carries the site.
- Eyebrows, breadcrumbs, nav, tags, buttons: **Hanken Grotesk** (500 / 600), uppercase, letter-spacing ~0.34em. This stands in for Century Gothic from the logo.
- Both are free on Google Fonts.
- Times New Roman and The Seasons are social-only. Never on the website.

## 5. House style (applies to all visible copy)

- Australian / British English. Never American spelling.
- No em dashes, ever. Use full stops, commas, or a single hyphen.
- No Oxford commas.
- Never the word "genuinely".
- Short sentences. Full stops over trailing clauses.
- Prose is the default for editorial and personal pieces. Avoid bullets there. Lists are fine where the content is genuinely a list (a shopping edit, a step-by-step, a quick reference), and when used they should be styled to the brand, not default browser bullets. When in doubt, prose.
- Voice: elevated but chatty, intelligent but accessible, like Vogue or Refinery29.

## 6. Layout and motion

- Hierarchy, not equality. One clear lead per screen, then smaller supporting cards.
- Staggered, not rigid. Mixed card sizes, vertical offsets, generous white space. Mirror the staggered rhythm of the home page. Category listings can use a calmer grid, never a flat identical 3x3 as the only device.
- Hairlines and white space divide, not heavy boxes or shadows.
- Motion: soft scroll-reveals, slow hover zoom (~scale 1.04), short muted video loops. Easings 300 to 700ms. Always respect `prefers-reduced-motion`.

## 7. Photography and the signature

- Aim for loose visual consistency: favour natural light, warm neutral tones and real moments, and avoid clashing heavy filters. This is a guideline for choosing and lightly editing photos, not a single forced filter over everything.
- **The scrim headline** is the signature. Full-bleed photo, a black lower-third gradient `linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 58%)`, white EB Garamond headline bottom-left. Text can sit top or bottom third depending on the photo. This is the most important device on the site.
- Product imagery: deep-etched (cut-out) products on the Product tile beige `#EEE9E1`, styled as still life.

## 8. The product card (the most repeated element, get it right)

One card design, used everywhere. **No frame, no border.** The beige Product tile `#EEE9E1` behind a deep-etched product is the card shape. Image tile on top, then brand (Hanken caps), product name (EB Garamond), price (EB Garamond). Centre-aligned. No button on the card. The whole card is clickable and links through to the product page, where the Add to bag button lives, the Net-a-Porter and SheerLuxe model. A save (heart) icon sits top-right for wishlisting. Pull product data and images from Shopify so cards stay consistent.

**Three image types, one card.** The image can be (a) a deep-etched product on the beige tile, the default for clean product shots, (b) a full-bleed photo of a model wearing or using the product, or (c) an Instagram shot that credits the creator, which feels social-first and references the person. Model and Instagram images fill the tile edge to edge. A small save icon top-right lets readers build a wishlist.

It is a **hybrid**. The card looks identical every time. Only the destination and the price line change:

- **Own products (in the Shopify shop):** price reads "$X". The card links to the Beauticate product page, where Add to bag and checkout happen on site. Examples: Eir Women, Tulita, Maison Balzac, buj.
- **Affiliate products (external retailers):** price reads "$X at [retailer]" with a small outward arrow. The card opens the retailer's product page in a new tab. Examples: Amazon products.
- Any edit or row that mixes the two carries a quiet line at the foot: "Some links are affiliate links."

Reference mocks: `beauticate-product-cards.html`, `beauticate-cards-on-a-story.html`.

## 9. Kit of parts

- **Scrim headline** — editorial hero (section 7).
- **The Edit** — a numbered or titled shoppable flat-lay with an editorial caption, on parchment. Hero of shopping-led categories.
- **Shop strip** — horizontal scrolling row of product cards (section 8).
- **Staggered grid** — mixed card sizes, the default story listing.
- **The long read** — centred EB Garamond column on parchment, for personal essays.
- **Social rail** — a Curator.io feed, curated per category (beauty feed on Beauty, wellness on Wellness, etc).
- **Story-page modules** — Shop / Listen / Guide blocks, on story pages only, never on category pages. They replace the old WordPress sidebar.

## 10. Category page

Two hero archetypes, one system. Differentiate categories by photography and pace, never by changing type, colour or grid.

- Shopping-led (Beauty, Style, Wellness, Living): lead with **The Edit**, which carries a single "Shop the whole collection" button to that Shopify collection.
- Editorial-led (Interviews, Vodcast, Destinations): lead with a **scrim image** headline.

Order: breadcrumb (no big heading), hero, staggered stories, a mid-page shop strip, more stories, a category-curated Curator.io feed, Insiders sign-up, footer. **No sidebar on category pages.**

Reference: `beauticate-beauty-page-v4.html`.

## 11. Home page

Order: video hero (scrim, headline, one button), insiders bar with the tagline, the team shop strip, staggered editorial stories, Shop by Moment (edits linking to Shopify collections), a letter from Sigourney with her portrait, Beautiful Inside podcast hero and episode row, a Curator.io community feed, the Collective, footer.

Video hero rules: host on Mux or Cloudflare Stream, muted, autoplay, loop, playsInline, audio removed, ~10 to 12s seamless loop. A still poster frame loads first for fast LCP, the video fades in after and only when in view. Brand-open edit on home. Product-open edit on the Shop hero.

Reference: `beauticate-home-page-mock.html`.

## 12. Shoppable Story template (single-brand and product pieces)

The repeatable structure for any story built around one brand or product:

1. An author box on every piece. A disclosure line up top only when there's a commercial relationship (founder, paid partnership, or affiliate-led). Regular editorial doesn't need one.
2. A hero image with the title below, long-read style. Usually a person, but it can be a product, landscape or interior where that's stronger.
3. The hook. A real, first-person problem.
4. The education. What actually works. Earn trust before selling.
5. The turn. The product enters as the earned answer, in context. First shop module here.
6. The proof. Author bio, reviews, results, real research.
7. The offer. Shop the edit, the range, an exclusive reader code.
8. The FAQ. Doubles as AI-search bait and objection handling.
9. An email capture or topic lead magnet, where one exists. Optional, not required.
10. Related stories and podcast.

Rules: disclose up top, educate before selling, one repeated call to action, product modules styled as the card in section 8 not raw Shopify, pull quotes never sit directly next to their source line, prose not bullets, no em dashes, keep product claims experiential not medical. Every piece carries an author box, an FAQ, an offer and an email capture.

Reference: `eir-women-conversion-layout.md`.

## 13. SEO and AI search

- Add Article, FAQPage and Product schema to editorial and shoppable templates.
- Lead answers in FAQs and explainer sections so AI search can lift them.
- Strong author credibility (EEAT): author box, bio, expertise.
- Descriptive alt text on every image. Clean semantic headings.
- The state-by-state beauty and wellness directory is a major SEO asset. Carry it across from the old site, do not lose it.

## 14. Performance

- Poster-first video, lazy-loaded.
- Responsive images, modern formats, correct sizing. No oversized hero files.
- No unnecessary third-party embeds. The Curator.io feed loads lower on the page so it never slows the first view, and can be a full grid where it earns the space.
- Watch the JavaScript bundle. Flag anything heavy.

---

## Build status

**Locked:** design language v3 (colour, type, layout, motion, scrim signature), house style, the product card system (shop vs affiliate), the kit of parts, the Shoppable Story template.

**Mocked and approved as direction:** Beauty category page, home page, product cards on a story.

**Next up:** build the Beauty category page in Next.js to the section 10 spec, then template the other categories. Then the home page. Then wire the Shoppable Story template with schema.

**Reference mocks** (design intent, not production code): `beauticate-design-language-v3-locked.html`, `beauticate-beauty-page-v4.html`, `beauticate-home-page-mock.html`, `beauticate-product-cards.html`, `beauticate-cards-on-a-story.html`.
