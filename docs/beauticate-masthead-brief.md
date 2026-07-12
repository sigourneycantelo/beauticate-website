# Beauticate: Masthead and Nav Build Brief

**For:** Claude Code
**From:** Sig (creative direction)
**Reference mock:** `docs/beauticate-masthead-v1.html`
**Taxonomy source of truth:** `docs/taxonomy-and-nav-lock.md`

---

## What this is

The global masthead and primary navigation. One shared component, imported into every template (home, category, story, directory, episode). Build it once. The nav must be identical on every page.

## Read this first: what in the mock is real

The HTML mock is the reference for the masthead only. Everything below the nav in that file, the hero, the "Beauty. Wellness. Style. Living." tagline and the placeholder story rows, is filler. It exists so the menu had something to open over and the page had enough length to show the scroll behaviour. Do not build any of it. The homepage is a separate brief that comes later.

---

## Structure: two tiers

**Utility tier (top)**
- Left: social icons (Instagram, TikTok, YouTube, Pinterest, Spotify), then Subscribe and About as small text links
- Centre: BEAUTICATE. wordmark
- Right: Search, Sign In, bag (with a small count badge)

**Primary tier (below)**
- Seven pillars, Shop first: **Shop · Beauty & Style · Wellness · Living · Destinations · Interviews · Podcast**
- Shop rendered in the wine token so it reads as the commercial entry point
- Pillar labels and subcategories come from `docs/taxonomy-and-nav-lock.md`. That is the source of truth. Do not invent or rename categories.

---

## Behaviours

1. **Mega-menu.** Hover or keyboard focus on a pillar opens a full-width panel: subcategories on the left, four story cards on the right. SheerLuxe pattern.
2. **Subcategory swap.** Hovering or focusing a subcategory swaps the four story cards on the right to that subcategory's stories. In the mock, Beauty & Style is fully wired as the reference. Replicate the mechanic across every pillar.
3. **Collapse on scroll.** Past roughly 64px the utility tier collapses and a small wordmark appears at the left of the primary bar. Header stays sticky throughout.
4. **Mobile (under 900px).** Utility tier becomes hamburger left, wordmark centre, Search and bag right. The hamburger opens a left drawer: pillars as accordions that reveal their subcategories, with Subscribe, About, Sign In and social at the foot.

Quality floor: visible keyboard focus, mega-menu reachable by keyboard (focus-within), reduced motion respected.

---

## Design tokens (inherit v15, do not invent)

- **Typefaces:** EB Garamond (serif, for story titles and headlines), Hanken Grotesk (sans, for nav labels, eyebrows and meta)
- **Colours:** paper `#FFFFFF` (bright white — the site background), greige panel `#efece6`, ink `#2a2621`, muted `#7a7268`, wine `#7a2733`, choc `#3a2a22`, hairline `rgba(42,38,33,.14)`
- **Nav labels:** Hanken Grotesk 500, uppercase, ~11.5px, letter-spacing .12em
- **Wordmark:** Hanken Grotesk 300, uppercase, letter-spacing .30em

The exact values live in the mock's CSS. Treat that CSS as the spec and match it against the existing v15 tokens in the codebase. Where a token already exists in the repo, use the repo's version and flag any mismatch rather than duplicating it.

---

## Story cards

Placeholder tonal blocks in the mock on purpose, so nothing depends on assets that are not shot yet. In the build, each card slot takes a real story image, a category eyebrow, a serif headline and a short meta line. Card image ratio is 4:5 portrait.

---

## Wordmark full stop

The full stop after BEAUTICATE is set in the ink (black) token, matching the letters. Keep it as a single colour token or variable so it can be switched later without touching anything else, but the current decision is black.

---

## Do not, in this task

Do not build the homepage, any category page, or any of the filler content in the mock. This task is the shared masthead and nav component only.
