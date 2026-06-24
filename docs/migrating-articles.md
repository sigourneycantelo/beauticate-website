# Migrating articles

> How to audit, repair and optimise an article carried over from the old WordPress site. For Claude and Claude Code. Read CLAUDE.md first for the durable rules, and `docs/updating-stories.md` for publishing new stories. This file is the cleanup loop for migrated pieces.

## When to use this

Every article that came across in the WordPress migration. They are generally broken in some way: missing images, thin metadata, FAQs in the wrong place, no products. This is the checklist that ticks off AEO, GEO and SEO, plus commerce and multimedia, one piece at a time.

## The two sweeps

Cleanup runs as two passes, not one. Sweep 1 is technical and batchable. Sweep 2 is editorial and per-article.

### Sweep 1 — technical (site-wide, scriptable)

The goal: every article generates correct schema and clean metadata. No editorial judgement needed.

1. **Render check.** Hero and body images load. No leftover Visual Composer shortcode text. No Word CSS in any frontmatter field.
2. **FAQ in the right place.** Move any `## Frequently Asked Questions` Q&A from the body into the `faqs:` frontmatter field, then delete the body block. The renderer builds the FAQPage schema and the styled FAQ panel from frontmatter only. Body markdown earns nothing. Format:

   ```yaml
   faqs:
     - question: "Question text?"
       answer: "Lead answer first, so AI search can lift it. Then detail."
   ```
3. **Metadata.** `seo_title` ~60 chars and not just the headline. `meta_description` ~155 chars, written, not the truncated excerpt. Clean lowercase hyphenated slug. Real tags. Bump `date_modified` to the edit date.
4. **Schema.** Article always. FAQPage when `faqs:` is present. Product when shop modules exist. Verify it builds (`lib/seo.ts`).
5. **Alt text.** Every image has plain descriptive alt text. Portrait-orientation images use the `<Portrait>` component, not markdown, alternating sides.
6. **House style.** Australian / British spelling, no em dashes, no Oxford commas, never the word "genuinely", prose over bullets, short sentences. (CLAUDE.md section 5.)

### Sweep 2 — editorial (per-article, needs judgement)

The goal: the piece sells and stays current. Runs after Sweep 1.

7. **Freshness.** Refresh dated facts and claims. I research current info and propose changes; Sig approves before anything lands. Never invent.
8. **Imagery.** Where a fresh photo of the subject strengthens the piece, propose the swap for approval. Keep the loose visual consistency: natural light, warm neutral tones.
9. **Commerce.** Add product cards per CLAUDE.md section 8. Own products link to the Beauticate product page. Affiliates read "$X at [retailer]" and open in a new tab. Add the affiliate footnote if a row mixes both. Pull product data from Shopify.
10. **Multimedia.** Embed a relevant YouTube video or other media where it earns its place. Watch the JS bundle (CLAUDE.md section 14).

## Rules that always apply

- Never invent prices, links, quotes, statistics, claims or bios. Ask or research-then-approve.
- Preserve the author's words. Add structure and modules around them.
- FAQs live in frontmatter, never only in the body.
- Keep product claims experiential, not medical.

## Definition of done

Sweep 1:
- [ ] Images render, no shortcode or Word CSS remnants
- [ ] FAQs in `faqs:` frontmatter, body block removed
- [ ] `seo_title`, `meta_description`, slug, tags written; `date_modified` bumped
- [ ] Schema builds (Article, FAQPage, Product as applicable)
- [ ] Every image has alt text; portraits use `<Portrait>`
- [ ] House style applied

Sweep 2:
- [ ] Dated facts refreshed (researched, approved)
- [ ] Fresh imagery where it helps (approved)
- [ ] Product / affiliate cards added, footnote if mixed
- [ ] Relevant multimedia embedded
- [ ] Saved, preview shared

## Known issue at time of writing

761 articles have `## Frequently Asked Questions` markdown in the body with no matching `faqs:` frontmatter, so they generate no FAQPage schema. Fixing these is the first job of Sweep 1.

---

*Built on the playbook template in `updating-stories.md`.*
