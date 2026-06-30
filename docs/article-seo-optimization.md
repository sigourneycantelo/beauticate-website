# Article SEO / AEO / Conversion Optimisation Playbook

The **optimisation pass**: taking a single, already-migrated article and doing the
back-end SEO, answer-engine (AEO) and conversion work on it. This is distinct
from — and usually runs *after* — the migration **audit** pass in
[`article-audit-and-fix.md`](./article-audit-and-fix.md) (restore images,
de-glue paragraphs, fix broken markdown). Audit first, then optimise.

> The worked example throughout is the Qure micro-infusion review
> (`/beauty-style/skin-care/micro-infusion-at-home`). Its specific values
> (slug, FAQs, 4.5 rating) are **illustrative, not a template** — see below.

---

## 1. The one rule: mechanics are universal, content is per-article

Every step below is one of two kinds. Keep them straight.

- **[mechanic]** — *how* the repo works. Same for every article. Repo-specific,
  not editorial. These are safe to apply by rote.
- **[editorial]** — *what* this article should say. Different every time. Comes
  from the writer's brief (e.g. Sigourney's 15-point spec) or, failing that,
  from judgement. **Never invent editorial values to fill the checklist** — if a
  decision isn't in the brief and isn't obvious, ask.

So: the *process* is universal, the *answers* are not. A roundup, a personal
review, and a news piece all run the same mechanics but get different slugs,
schema types, CTAs and FAQs. When in doubt, an item is [editorial].

---

## 2. Before you start: get (or assemble) the brief

Ideally the writer supplies a brief. If there's a written brief, use its copy
**verbatim** — your job is to *place, wire and tag*, not to rewrite voice copy.

If there is **no brief**, these are the [editorial] questions to settle first
(ask the writer; don't guess):

- Is this a top performer? (If so, **do not change the URL without a redirect**.)
- New slug, or keep the current one?
- Focus keyphrase? SEO title and meta description?
- Schema type — plain Article, or a **Review** (and if so, the rating out of 5)?
- Are there affiliate links / a discount code? Which retailer, which code?
- FAQs — supplied, or to be drafted and approved?
- Any product to feature in an **EditorNote** (Beauticate Shop cross-sell)?
- Should this become the home-page hero? (See root `CLAUDE.md`.)

House style (applies to all written copy): **Australian/British spelling, no em
dashes, no Oxford commas.** En dashes are fine.

---

## 3. The pass, step by step

### A. Source of truth — [mechanic]
Pull the WordPress REST source for the original order and full content:
`https://www.beauticate.com/wp-json/wp/v2/posts?slug=<old-slug>` (cached under
`.cache/wp/`). Resolve image IDs via `/wp-json/wp/v2/media/<id>`.

### B. Slug, redirects, canonical — [mechanic] (decision to rename is [editorial])
- The **URL is the directory name**, not frontmatter `slug`. To rename: `git mv`
  the folder *and* the `.mdx` file, and update frontmatter `slug` to match.
- Add a permanent redirect in `next.config.ts` `redirects()` from the old path
  (`permanent: true` → HTTP 308, which Google treats as 301).
- **Re-point any existing redirects** whose destination was the old path to the
  new path, so you don't create a redirect chain to a dead URL.
- Canonical needs no frontmatter change — `lib/seo.ts` builds it from the URL.

### C. Metadata / frontmatter — [editorial] values, [mechanic] fields
Set `title` (the visible H1), `seo_title`, `meta_description`, `excerpt` (the
visible dek), `focus_keyphrase`, `tags`, `date_modified` (freshness). For a
review, set `review_rating` / `review_item` / `review_brand` (these drive the
Review schema; see §E). `author` must match a name in `lib/authors.ts`.

### D. Images — [mechanic] process, [editorial] alt/captions
- **Image files live in `public/content/<cat>/<sub>/<slug>/`** (served at the web
  root), *not* the source `content/…` dir (which holds only the `.mdx`).
- Download from WP, **rename** (kebab-case, descriptive, no keyword stuffing),
  convert `.png`/`.webp` → `.jpg` if asked (sharp is broken under Node 24 — use
  PowerShell WIC; see [`beauticate-local-dev` memory]).
- **Alt text:** sentence case, under 125 chars, no "image of".
- **Interleave** in the original WP order. Layout: use **`<SplitRow>`** (text
  beside a smaller image, alternating sides) for body shots; a 2-up grid for a
  detail pair; centre + cap width for a standalone packshot. Link product shots
  to the affiliate URL; leave editorial photos unlinked.

### E. Structure & AEO — [mechanic] components, [editorial] copy
- Lead with a **`<QuickAnswer>`** box (concise answer, high on the page).
- Use **question-style H2s** so each section can be lifted out and still read.
- Place an **`<AffiliateCTA>`** near the top and another at the end (it forces
  `rel="sponsored noopener" target="_blank"` on the button).
- Apply house-style fixes to the prose: de-glue merged paragraphs, fix
  spelling, remove em dashes and Oxford commas, and **soften any overclaim** to
  an honest framing.

### F. Links — [mechanic] rules, [editorial] targets
- **Affiliate / sponsored** links: `rel="sponsored noopener" target="_blank"`
  (raw `<a>` inline, or via `AffiliateCTA` / `SplitRow href=`).
- **At least two internal links** to related Beauticate articles (use the real
  resolved path, e.g. `/beauty-style/beauty-tips/<slug>`, not a WP path).
- One **external authority** link where relevant (`rel="noopener"`).

### G. Schema (JSON-LD) — [mechanic]
`app/[…]/page.tsx` emits JSON-LD as **server-rendered `<script>`** tags (so it's
in the initial HTML). `lib/seo.ts` auto-resolves the type (Review when the title
contains "review"/"we tried"; FAQPage when frontmatter `faqs` is present) and
builds the Person author from `lib/authors.ts` (`sameAs`). Review rating fields
only emit when `review_rating` is set. **FAQ schema is built from frontmatter
`faqs`** and rendered by `<FAQPanel>` from the same source, so visible text and
schema always match — never hand-write FAQs in the body. Validate in Google's
Rich Results Test before publish.

### H. Freshness — [mechanic] + [editorial]
Set `date_modified`, and surface a visible "Last updated <month year>" near the
byline if the brief asks.

---

## 4. Verify before commit — [mechanic]

- Dev server returns **200** for the new route (see [`beauticate-local-dev`]).
- `npx tsc --noEmit` is clean.
- **No browser hydration errors** — the dev overlay's "N issues" is usually
  client-side, not in the server log. Read it via the preview MCP console /
  `nextjs-portal` shadow DOM. (Common trap: an MDX component that wraps text
  `{children}` in a `<p>` → `<p><p>` → use a `<div>`.)
- Images load (check `public/content` paths) and JSON-LD parses.
- Schema is the expected type with the expected fields.

## 5. Flag, don't hide — [mechanic]
Surface anything you couldn't fully verify: affiliate link destination / discount
(resolve the link, but you can't confirm a discount programmatically), placeholder
external sources to confirm, date discrepancies, invented bridging copy.

## 6. Commit & PR — [mechanic]
One feature branch per article, tidy commits per logical step, PR to `main`
(protected — needs the owner's approving review; Vercel deploys on merge). Stage
files explicitly; keep churn (`.claude/settings.local.json`, `.claude/launch.json`,
`qa/wp-audit/*`) out. See the [`article-cleanup-workflow` memory] for the exact flow.

---

## Component quick-reference (MDX)

| Component | Use | Notes |
|-----------|-----|-------|
| `<QuickAnswer>` | Featured answer box high on the page | Eyebrow + copy |
| `<AffiliateCTA href label>` | Boxed CTA with a tracked button | Forces `rel="sponsored noopener"` |
| `<SplitRow image alt side imageWidth>` | Text beside a smaller image (2-col) | `side` left/right; `imageWidth` is a **string** (`"260"`) — MDX drops `{expression}` props |
| `<EditorNote …>` | Boxed Beauticate-Shop cross-sell | Pair beside an image via `SplitRow` |
| `<Portrait src alt side>` | Floated portrait that wraps text | Watch float bleed across `##` headings |

> MDX gotchas worth remembering: pass component props as **strings**, not
> `{expressions}` (they don't reliably forward); Tailwind classes used *only*
> in MDX need `./content/**/*.mdx` in the Tailwind `content` glob, and a `.next`
> cache clear after any Tailwind change.
