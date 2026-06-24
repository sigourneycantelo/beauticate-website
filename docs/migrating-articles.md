# Migrating articles

> How to audit and upgrade an article that has already migrated from the old WordPress site. Written for Claude and Claude Code to follow when Sig or the team works through the back catalogue. Read CLAUDE.md first for the durable rules. For publishing a brand new story, use `docs/updating-stories.md` instead. This file is the cleanup loop.

## When to use this

When an article is already live but came across from WordPress broken in some way: FAQ in the wrong place, thin metadata, missing schema, images without alt text. Not for new stories, and not for single-brand conversion pieces. If a migrated piece is built around one brand or product, also read `docs/shoppable-story.md` and CLAUDE.md section 12.

The job runs fix-tech-first, in two sweeps:

- **Sweep one, mechanical.** Runs across every article. FAQ-to-frontmatter, schema, metadata, alt text. Scriptable, no editorial judgement.
- **Sweep two, editorial.** Runs only on top-performing evergreen pieces. Fresh imagery, fresh information, commerce, video. Needs judgement and human sign-off.

Finish sweep one across the whole catalogue before starting sweep two.

## What I need from you

For sweep one, almost nothing per article, it is mechanical and runs across the set. The one exception: when a piece is bylined to a writer new to the site, I need sign-off on their role and profile links before adding them to `lib/authors.ts`.

For sweep two on a chosen piece, the person upgrading provides:

- Which articles are the top-performing evergreen pieces to deepen.
- Any fresh imagery, and sign-off on image swaps. New photos of the subject where they strengthen the piece.
- Sign-off on any factual change, refreshed claim or updated statistic.
- The products to feature, with prices and Shopify or affiliate links.
- Any video to embed, with its URL.

If any of these are missing, ask. Do not guess prices, links, facts or imagery.

## Steps

### Sweep one, mechanical (all articles)

1. Apply house style from CLAUDE.md section 5. Australian spelling, no em dashes, no Oxford commas, never the word "genuinely", prose not bullets, short sentences.
2. Move any `## Frequently Asked Questions` block from the body into the `faqs:` frontmatter field, then delete the body block. The renderer builds the FAQ panel and the FAQPage schema from frontmatter only, so body FAQs earn nothing. Format:

   ```yaml
   faqs:
     - question: "Question text?"
       answer: "Lead answer first, so AI search can lift it. Then the detail."
   ```
3. Attribute the real author. Most migrated pieces carry `author: "Beauticate Editorial"` in frontmatter, but the true byline sits in the credit line at the foot of the body: "Story by", "Words by", "Written by", "Interview by". Set the frontmatter `author:` to that writer, normalising byline variants to one spelling. Match the name to an entry in `lib/authors.ts`, which is the single source of author truth. If the writer is new, add them there with a role and `sameAs` profile links. Only fall back to Beauticate as an Organization author when there is genuinely no byline. About half the catalogue is not Sig, so real-person attribution is the biggest EEAT and AEO lever in this sweep.
4. Add schema per CLAUDE.md section 13. Article always, with the author resolved from `lib/authors.ts` so `sameAs` and `jobTitle` carry through. FAQPage when `faqs:` is present. Product when the piece has shop modules.
5. Write the metadata. SEO title around 60 characters, not just the headline. Meta description around 155 characters, written, not the truncated excerpt. Confirm the slug, category and tags.
6. Bump `date_modified` to the edit date. Leave `date_published` untouched.
7. Add plain, descriptive alt text to every image. Portrait-orientation images use the `<Portrait>` component, not markdown, alternating sides.

### Sweep two, editorial (top evergreen pieces only)

8. Refresh dated facts, claims and statistics. Research first, then get human sign-off before anything lands. Keep claims experiential, not medical.
9. Refresh imagery where a newer photo of the subject is stronger. Propose the swap and get human sign-off before replacing. Hold the loose visual consistency from CLAUDE.md section 7.
10. Add product cards per CLAUDE.md section 8. No button. Own products link to the Beauticate product page, affiliates show "$X at [retailer]" and open in a new tab. Add the affiliate footnote if the piece mixes both. Pull product data from Shopify.
11. Embed relevant video where it earns its place, and add VideoObject schema for the embed. Watch the JavaScript bundle, CLAUDE.md section 14.

## Rules that always apply

- House style: CLAUDE.md section 5. Product cards: section 8. Shoppable structure: section 12. Schema: section 13.
- FAQs live in `faqs:` frontmatter, never only in the body.
- Schema coverage: Article always, FAQPage when there is an FAQ, Product when there are shop modules, VideoObject when there is an embed.
- Real author attributed from the body credit line, matched to `lib/authors.ts`. New writers added there with `sameAs`. A new writer's identity links need human sign-off before they land, a same-name person is easy to attach by mistake.
- Alt text on every image. Portraits use the `<Portrait>` component.
- Never invent prices, links, quotes, statistics, facts or imagery. Ask.
- Fresh imagery and any factual change need human sign-off before they land.
- Preserve the author's words. Add structure around them, do not rewrite their voice.

## Definition of done

Sweep one:

- [ ] House style applied (spelling, no em dashes, no Oxford commas, prose)
- [ ] FAQs moved to `faqs:` frontmatter, body block removed
- [ ] Real author attributed from the body credit, matched to `lib/authors.ts`; new writers added with `sameAs` (signed off)
- [ ] Schema added (Article with resolved author, plus FAQPage and Product where they apply)
- [ ] SEO title around 60 characters, meta description around 155, written not truncated
- [ ] `date_modified` bumped, `date_published` untouched
- [ ] Every image has alt text, portraits use `<Portrait>`

Sweep two (evergreen pieces only):

- [ ] Dated facts and claims refreshed, signed off by a human
- [ ] Fresh imagery where it helps, signed off by a human
- [ ] Product cards correct, own vs affiliate, footnote if mixed
- [ ] Video embedded where it earns its place, VideoObject schema added

## If something's missing

Ask for it in one short list. The usual gaps: which pieces are the evergreen ones to deepen, sign-off on a factual change or an image swap, final prices and product links, and the video URL.

## Example request

What the team types:

> Run sweep one across the Interviews category. Then deepen the Rebecca Judd piece, it is one of our top performers. Fresh hero is in this folder [link], I have signed off on it. Add the buj Uplifter from our shop and the YouTube interview clip. Save as draft.

What you do: run the mechanical sweep across the category, then on the Rebecca Judd piece follow sweep two, ask only for anything missing, and hand back a preview with the checklist ticked.

---

*Built on the playbook template in `updating-stories.md`.*
