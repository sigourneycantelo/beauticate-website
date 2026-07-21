# Category taxonomy — current state (for the nav/UX lock)

The re-categorisation work (mega-menu retags, biohacking consolidation, beauty-tips declutter, health re-routing, fragrance-interview moves) **already materialised a working taxonomy and committed it to URLs**. URLs derive from `content/<category>/<subcategory>/<slug>` *and* frontmatter, and there are ~480 redirects in `next.config.ts` encoding it. Renaming/restructuring a category is not a design tweak — it invalidates redirects and requires re-moving content. **Reconcile the nav lock against `next.config.ts`; don't lock names that differ from what's live without budgeting a migration pass.**

## Current tree (as it exists today, with counts)

| Category | Subcategories (article counts) |
|---|---|
| beauty-style | skin-care 262, **beauty-tips 390**, makeup 129, hair 124, nails 18, style 13, cosmetic 12, fragrance 7 |
| wellness | health 72, fitness 18, mindset 11, biohacking 9 |
| living | lifestyle 21, interiors 12, sustainability 11, entertaining 5 |
| destinations | clinics 71, travel 56, spas-retreats 22 |
| interviews | creatives 140, founders 76, actors-presenters 58, models 48, tastemakers 43 |
| vodcast | episodes 44 |
| sigourneys-edit | edit 60, picks 4 |

## Decisions the lock must settle (surfaced by the retagging)

1. **Type ↔ category collision (the crux).** 6 of the 8 article *types* already exist as *category paths*: interview→`/interviews` (~365), travel→`/destinations/travel`, directory→`/destinations/clinics`+`spas-retreats`, episode→`/vodcast/episodes`, how-to (was a category, now redirected into beauty-style), single review (`/reviews/products/` still live). Decide whether these are **categories with a redundant type tag, or types on a flatter category set**. The site currently mixes both.

2. **`beauty-tips` is a 390-article residual** — the biggest bucket even after the declutter moved ~121 out. Real category, or dissolve into skin-care/makeup/hair/nails? If dissolve, it's the largest single tagging job.

3. **Where does the GO-TOs Directory live?** Treatments were parked in `/destinations/clinics` (+`spas-retreats`), but there's a dedicated Directory *template* and a "directory" *type*, and the legacy map still carries a separate `/destination/beauty-wellness/skin-salons|clinics` scheme. Never settled — the lock must place it (own top-level? under Destinations? template only?).

4. **Cross-listing is already in use** (`also_in` frontmatter; e.g. fragrance interviews live in Interviews *and* fragrance). Category pages, breadcrumbs, related posts, and canonical logic must support **one primary category + secondary categories**.

## Cleanup debt (the tagging pass should absorb; not blocking)
- Standardise `/destination` (singular, legacy) vs `/destinations` (plural, canonical).
- Interviews subcats were renamed (`creatives/founders/models/actors-presenters/tastemakers` replaced `who/entrepreneurs/influencers`) — adopt these.
- Stray slug-as-subcategory folders from moves (e.g. `destinations/where-family-memories-are-made`, `interviews/11-years-...`, `living/giving-back-...`) sit one level too shallow.
- `cosmetic` (12) under beauty-style — decide if real or fold into makeup/skin-care.

**Bottom line:** the category axis is effectively decided by what's on disk + in the redirect map. The nav lock's real job is (a) resolve type-vs-category, (b) rule on beauty-tips and the Directory, (c) confirm the tree — *then* tagging all 1,734 can proceed against a stable target.
