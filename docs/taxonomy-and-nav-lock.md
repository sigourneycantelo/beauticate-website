# Beauticate: Nav and Taxonomy Lock

**For:** Claude Code (build) and the retagging thread (tagging pass)
**From:** Sig (creative direction)
**Status:** Locked. This is the single map. Breadcrumbs, category pages, related posts and the tagging of all 1,734 build against this.

---

## In plain words first

The category axis was never a blank slate. Seven folders already live on disk and 487 redirects point at them. So this lock mostly ratifies what's there, changes only what's worth paying a migration for, and makes the nav mirror the URLs one to one. That alignment is the whole point. When the visible nav matches the folders, breadcrumbs read cleanly, tagging has a stable target and nothing downstream fights itself.

Two structural moves. Vodcast becomes Podcast, a tiny 44-article rename that fixes a real search and clarity problem. Sigourney's Edit retires as a category and its articles re-home to author pages plus their proper topic. Everything else on disk stays as is.

---

## The masthead (two tiers)

Grouped by intent, not habit. Left is "know us and join us." Right is "find and shop."

**Utility tier (top, small text and icons)**

- Far left: social icons
- Left of centre: **Subscribe**, **About** (small text links, sitting with the social cluster)
- Centre: **BEAUTICATE.** logotype
- Right: **Search**, **Sign In**, **bag**

About comes back here, on the masthead, grouped with the "understand us" links rather than competing with a topic pillar. Subscribe sits at the natural start of the reading line, which helps list growth. The right stays clean and transactional.

**Primary tier (topic row, seven pillars)**

```
SHOP · BEAUTY & STYLE · WELLNESS · LIVING · DESTINATIONS · INTERVIEWS · PODCAST
```

Every pillar is a real hub with real content behind it. No stubs.

---

## Nav pillars mapped to the folders on disk

| Nav pillar | On-disk folder | Action |
|---|---|---|
| Shop | (Shopify, not an editorial folder) | New commerce pillar, headless Shopify. Its internal taxonomy is a separate workstream |
| Beauty & Style | `beauty-style` | Label only. Folder unchanged, redirects unchanged |
| Wellness | `wellness` | As is |
| Living | `living` | As is |
| Destinations | `destinations` | As is. Umbrella for Travel plus the venue guides |
| Interviews | `interviews` | As is |
| Podcast | `vodcast` → `podcast` | Rename. 44 articles, small migration, redirect pass |
| (retired) | `sigourneys-edit` | Dissolve. Articles re-home to a primary topic plus the author page |

Seven folders in, seven pillars out. Shop takes the slot the dissolved `sigourneys-edit` frees, and Vodcast is renamed. The count stays clean.

---

## What sits in each mega-menu

SheerLuxe-style. Subcategories in uppercase Hanken Grotesk on the left, four live story cards on the right that swap on subcategory hover. The menu is a discovery engine, not just a list, so hovering teaches a newcomer the breadth without a click.

**Beauty & Style** — Style foregrounded per the staples-not-trends angle below.
Skin Care (262) · Makeup (129) · Hair (124) · Style (13) · Fragrance (7) · Nails (18) · Beauty Tips (curated hub, see below)
Tidy-ups for the tagging pass, non-blocking: fold `cosmetic` (12) into Makeup or Skin Care. Fragrance (7) is thin, keep for now.

**Wellness**
Health (72) · Fitness (18) · Mindset (11) · Biohacking (9)

**Living**
Lifestyle (21) · Interiors (12) · Sustainability (11) · Entertaining (5)

**Destinations** — Travel is the hero sub.
Travel (56) · Clinics (71) · Spas & Retreats (22)
Clinics and Spas & Retreats render through the Directory template as browsable guides. This is where the "best spas" or "best clinics like a guide" need is met, as content inside the topic, not as a separate searchable database.

**Interviews**
Creatives (140) · Founders (76) · Actors & Presenters (58) · Models (48) · Tastemakers (43)

**Podcast**
Episodes (44), plus themes and guests as the category page grows.

**Shop**
Shopify collections. Taxonomy TBD in the commerce workstream. Fashion in the shop, if confirmed, is decided there and does not affect this editorial nav.

---

## Beauty & Style, the detail

**Style, foregrounded, positioned as staples not trends.** The visible subcategory label is "Style." Its editorial angle is investment and staples, the pieces that last, not seasonal trend chasing. Evergreen by design, which keeps it ranking and selling and never dating. Suits Kate Waterhouse and suits the shop carrying investment pieces.

**SEO note.** Visible label stays "Style." Carry the word "fashion" in the hub's H1, intro copy and meta so the search term is still captured without putting it in the nav.

**Future trigger, not now.** Do not split into separate Beauty and Fashion pillars yet. Thirteen articles can't fill a standalone Fashion hall. Keep them paired, a proven magazine pairing, and let Style grow inside a room that already looks full. Split into two focused pillars when Kate's body of work and the shop's fashion offer make it an earned move rather than a gamble.

**Beauty Tips (390), curated hub not storage folder.** The keyword has real volume, so a page targeting "beauty tips" earns its place. The problem was using it as the physical shelf for 390 articles, which starves Skin Care, Makeup and Hair of the content that should strengthen them. So: keep a Beauty Tips hub page with intro copy and a curated best-of chasing the term, but over the tagging pass each of the 390 gets a specific primary home and Beauty Tips pulls them in as a curated view rather than owning them. Nothing is deleted. It rides along with the tagging already happening, and it can be paused. **This is the one call with a real price tag (a re-home plus redirect pass), so it stays Sig's to veto.** Recommendation is dissolve gradually as above.

---

## Sigourney's Edit and author pages

Sigourney's Edit is column writing in Sig's voice, editorial not commerce. It retires as a category. Build an author page per writer, an archive that pulls every article by that person regardless of which category folder it sits in. Sig's columns surface on her author page. Each Collective contributor gets one too. About links out to each author page.

Better for search than a vanity category. Author identity is a strong trust signal now, and a rich author page carrying Sig's Vogue history does more for credibility than `/sigourneys-edit` ever did. The writing is kept, it just lives somewhere that works harder.

Each of the 64 `sigourneys-edit` articles (edit 60, picks 4) gets a primary topic category via tagging, plus surfaces on the author page. Standard one-primary-plus-author model.

---

## The tagging model (for the retagging thread)

- **One primary category per article.** That is its URL and its breadcrumb.
- **Secondary topics via `also_in`.** Already in use. Category pages, breadcrumbs, related posts and canonical logic support one primary plus secondaries.
- **Types are tags, never URLs.** The eight types drive the template preset and on-page filters. They do not create paths.
- **Reviews and How-to dissolve into their parent category.** A product review is Beauty & Style with a `review` tag, not its own path. A how-to is its topic with a `how-to` tag. This keeps the topic hubs clean and avoids thin duplicate pages competing with them.
- **Interviews, Destinations and Podcast stay categories** even though they share a name with a type. They are real browsable topics, and the shared name is useful for filtering.

---

## Breadcrumbs and downstream

- Breadcrumb format: `Category > Subcategory > Article`, e.g. `Beauty & Style > Hair > Article`, `Destinations > Travel > Article`.
- Category pages: to be designed next, now that the tree is stable. Scrim hero, staggered grid, themed Curator feed per category.
- Related posts: match on primary category and type together, so a travel interview can pull other travel pieces or other interviews.

---

## Cleanup to standardise (non-blocking, absorb into the tagging pass)

- `/destination` singular (legacy) to `/destinations` plural (canonical).
- Interview subcategory renames already adopted: creatives, founders, models, actors-presenters, tastemakers (replacing who, entrepreneurs, influencers).
- Stray slug-as-subcategory folders sitting one level too shallow (e.g. `destinations/where-family-memories-are-made`, `interviews/11-years-...`, one-off `sigourneys-edit/*`). Re-home to the correct subcategory.
- 73 legacy dead-end redirects already triaged for Damo in `docs/redirect-triage-for-damo.md`.

---

## Locked vs Sig's to decide

**Locked:** the masthead, the seven pillars, the mega-menu contents, Vodcast to Podcast, Style label with the staples angle, Sigourney's Edit to author pages, Directory retired as a searchable product (template stays for venue guides under Destinations), the one-primary-plus-secondary tagging model.

**Sig's to veto:** the pace of dissolving Beauty Tips. Default recommendation is gradual dissolution through the tagging pass.

---

## Source spec

Templates build against `docs/Beauticate_Article_Template_Spec_for_Code_2.md` (confirmed the correct file). Three templates: Story shell, Directory, Episode. Eight types as tags across them.
