# Article Layout Width Tiers

## Three width tiers

| Tier | Width | What lives here |
|------|-------|----------------|
| **Narrow** | 720px centred | Body copy, H2 section headers, pull quotes, image captions, credits, FAQs, share buttons |
| **Wide** | 1200px centred (nav width) | Landscape body images, Shop the Edit/Shop the Look, portrait sticky-scroll sections |
| **Split** | 1200px, two-column grid | Portrait body images with sticky parallax (image sticks, text scrolls), alternating L/R |

## How it flows top to bottom

1. **Hero** - landscape hero at 1200px wide (or editorial split hero as fallback if no landscape)
2. **Title block** - narrow (720px): breadcrumbs, h1, excerpt, byline
3. **Standfirst** - narrow: intro paragraph
4. **Guest Bio** - narrow: parchment box (interviews only)
5. **Body sections** - alternate between:
   - **Narrow**: text block with quiet uppercase H2 + body paragraphs
   - **Wide**: landscape image spanning 1200px, caption snaps back to 720px
   - **Split** (when portrait images exist): 1200px two-column sticky scroll, alternating sides
   - **Narrow**: pull quote (max 3 per article, under ~15 words each)
6. **Subscribe Band** - narrow
7. **Credits** - narrow
8. **Shop the Edit** - wide (1200px): 3-across for odd product count, 2-across for even
9. **FAQs + Share** - narrow

## The orientation rule

- Landscape image -> wide tier, centred, `aspect-[2/1]`
- Portrait image -> split tier, sticky parallax, alternating sides

## H2 styling

Small sans-serif uppercase (`clamp(18px, 2.2vw, 22px)`, Hanken Grotesk) - quiet signposts, not competing with pull quotes

## Pull quotes

`clamp(20px, 2.6vw, 32px)`, EB Garamond italic, chocolate colour - the signature moments

## Implementation

The MDX/rehype pipeline detects image orientation at build time and wraps:
- Landscape images in the wide container
- Portrait images in the sticky-scroll split grid

H2 styling and pull quote extraction handled by prose/MDX component overrides.

The article body uses a CSS Grid layout:
```
grid-template-columns: 1fr min(720px, 100%) 1fr
```
All prose children default to the narrow centre column (grid-column: 2).
Wide-tier and split-tier components use `grid-column: 1 / -1` to break out.
