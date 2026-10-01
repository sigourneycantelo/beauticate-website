# Article Layout Width Tiers

## Three width tiers

| Tier | Width | What lives here |
|------|-------|----------------|
| **Narrow** | 720px centred | Body copy, H2 section headers, pull quotes, image captions, credits, FAQs, share buttons |
| **Wide** | 1200px centred (nav width) | Landscape body images, Shop the Edit/Shop the Look, portrait sticky-scroll sections |
| **Split** | 1200px, two-column grid | Portrait body images with sticky parallax (image sticks, text scrolls), alternating L/R |

## How it flows top to bottom

1. **Hero** - landscape hero at 1200px wide, or the editorial split hero (see below)
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

## Hero layouts

Two treatments, chosen per article with `hero_layout`:

| `hero_layout` | What renders |
|---------------|--------------|
| *(unset)* / `"full"` | Image full width at 1200px; breadcrumb, headline, standfirst and byline sit underneath it. Desktop uses `hero_aspect` (default `16/9`), mobile uses `featured_image` at 3:4. |
| `"split"` | SheerLuxe-style two-column: image one side, greige `#F3EFE8` panel the other carrying breadcrumb, headline, standfirst and byline. Stacks vertically on mobile. |

Split mode uses `featured_image` (the portrait) and falls back to `hero_image`.
`hero_focus` nudges the crop in both layouts.

Reach for `split` when there's no landscape holding shot and the portrait would
otherwise be hard-cropped to 16:9 - it gives the article a proper banner without
one. An article with no image at all always gets the split panel.

`ArticleHero` and `ArticlePage` both read this via `usesSplitHero()` in
`lib/hero-layout.ts` - the second so it can suppress its own title block, since
the split panel already carries the headline. Change the rule in one place only.

## Text needs breaking up, and a pair does it best

**No reader should meet three paragraphs in a row without a picture.** A wall of
body copy is where people leave, and on a phone a wall arrives much sooner than
it does on the desktop preview you are checking it in. Work down the finished
piece and break every run of long paragraphs with an image, the same way a
magazine does.

**Default to a pair, not a single shot.** Two portraits side by side at equal
size is the house treatment, and it beats one floated image for the same reason
a two-up product grid beats an orphan card: it reads as a deliberate spread
rather than something that failed to load.

Place the pair where the copy earns it. The floating-breakfast shot goes under
the paragraph about the floating breakfast, not three paragraphs later next to
something else. If a section is long enough to need two breaks, use two pairs
rather than stretching one across the whole section.

**On a phone the pair stacks.** Two portraits side by side on a 390px screen
gives each about 170px of width, which is too small to read a face or a detail
in. `grid-cols-1 md:grid-cols-2` stacks them full width on mobile and pairs them
from tablet up, so the spread survives on desktop and the phone gets images big
enough to look at. Most readers are on the phone.

The markup is an explicit grid of `InlineImage`, which opts out of the automatic
orientation handling below and keeps both shots the same size and uncropped:

```jsx
<div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-8" style={{clear:'both'}}>
<InlineImage src="/content/<cat>/<sub>/<slug>/left.jpg" alt="..." width="1350" height="1800" />
<InlineImage src="/content/<cat>/<sub>/<slug>/right.jpg" alt="..." width="1350" height="1800" />
</div>
```

A single landscape image is still right on its own when it is a proper
establishing shot and spans the wide tier. The pair rule is for portraits.

Reference: `destinations/travel/escape-haven-bali-retreat-review`, which runs a
pair inside almost every numbered section.

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


## Don't repeat a pull quote

A pull quote that also appears, word for word, in the paragraph beside it reads
as a mistake. Either lift the line out of the body entirely, or break the
sentence across the quote so the body runs up to it and picks up afterwards:

> ...And then he stopped and looked at me.
>
> **"I also want to say something about your pitta," he said. "Your mind."**
>
> I was, at this point, quietly unravelling about a work situation.

Three per article is the cap, under about fifteen words each, and each one sits
where the moment actually happens rather than floated in near it.
