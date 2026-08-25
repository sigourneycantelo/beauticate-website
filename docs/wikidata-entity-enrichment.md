# Wikidata enrichment — Sigourney Cantelo (Q139644159)

Wikidata is the durable external anchor for the entity work. It is the one signal
that citation-weighted AI engines (Perplexity, Gemini) lean on hardest, and it is
the lever Doug Lord's entity case study could never pull: his item was **deleted
on notability grounds in July 2026**. Sigourney's survives. Protecting and
enriching it is therefore higher value than any on-site markup.

Related: [`design/sigourneycantelo-com-design-brief.md`](../design/sigourneycantelo-com-design-brief.md)

---

## Read this before adding anything

**Do not bulk-add unreferenced statements.** It is the intuitive move and it is
the wrong one.

Of the 10 statements currently on the item, most have **zero references**.
Wikidata's verifiability policy means unreferenced claims about a living person
can be challenged and removed, and an item padded with unsourced statements looks
more like self-promotion than an encyclopedic entity, which *raises* deletion
risk rather than lowering it.

Every statement below should carry a reference to an **independent** source, not
to beauticate.com or sigourneycantelo.com. The 38 items on the existing press
page are the reference pool: Mumbrella, marie claire, Daily Telegraph, Beauty
Directory, Vogue Australia itself.

Rule of thumb: one well-referenced statement beats five bare ones.

---

## Current state (audited)

| Property | Value | Refs |
|---|---|---|
| P31 instance of | Q5 (human) | 0 |
| P106 occupation | Q1930187 (journalist) | 1 |
| P27 country of citizenship | Q408 (Australia) | 0 |
| P39 position held | Q4479442, Q1607826 | 2 |
| P101 field of work | Q7242, Q11030 | 1 |
| P856 official website | `https://www.beauticate.com/` | 0 |
| P2003 Instagram | `sigourneycantelo` | 0 |
| P2013 Facebook | `sigourneycantelobeauticate` | 0 |
| P2397 YouTube | `UCfuyyVnNfbiwovULXTRQiVA` | 0 |
| P6634 LinkedIn | `sigourney-cantelo-027a38b` | 0 |

The four social handles are all **verified correct** against the live profiles
and are now the single source of truth in `lib/authors.ts`. Do not change them
without re-running `npm run verify:entity`.

---

## Priority 1 — do these first

### Add sigourneycantelo.com as official website
`P856` currently points only at beauticate.com. Once the new site is live, add
`https://sigourneycantelo.com` as a **second** P856 value and mark it preferred
rank. Keep beauticate.com; both are hers.

This is the statement that tells every AI engine the new domain is the canonical
personal property. It is the single highest-value edit on this list.

### Add the awards
`P166` (award received). The strongest credential she has and completely absent.

- Jasmine Award for Journalistic Excellence — **2010**
- Jasmine Award for Journalistic Excellence — **2014**
- Jasmine Award ×4 further (add with dates where known)
- Star Beauty Award ×6 (add with dates where known)

Use qualifier `P585` (point in time) on each. If no Wikidata item exists for
"Jasmine Award", use a string value or create the award item separately — an
award item with independent coverage is itself a useful entity.

### Add employer
`P108` (employer):
- **Vogue Australia** — `Q16682865`, qualified with P580/P582 (start/end time)
- Cantelo Corporation Pty Ltd, if an item exists or is warranted

### Add educated at
`P69` (educated at): **University of Technology Sydney** — `Q1145731`.
Qualify with P512 (academic degree) BA Communications and P582 (end time) 2004.

---

## Priority 2 — completes the picture

### Broaden occupation
`P106` currently lists only journalist. Add:
- editor — `Q1607826`
- magazine editor — `Q106568011`
- television presenter — `Q947873`
- copywriter — `Q14466416`

This multi-occupation array is what lets a machine legitimately understand one
person doing several things, and it directly supports the four commercial silos
on the new site.

### Connect the two entities
Beauticate has its own item, **Q139643093**. The link between them should be
explicit and bidirectional:
- On Q139643093: `P112` (founded by) → Q139644159
- On Q139644159: `P1830` (owner of) or `P800` (notable work) → Q139643093

A person item and a company item that do not reference each other are two
unconnected entities as far as a knowledge graph is concerned.

### Add name components
`P735` (given name) and `P734` (family name). Low effort, helps disambiguation
and name-form matching between "Sigourney Cantelo" and "Sigourney".

---

## Priority 3 — optional, with caveats

### Image (P18)
Would materially strengthen the item and can feed a Google Knowledge Panel.
**Hurdle:** the photo must be uploaded to Wikimedia Commons under a free licence
(CC BY-SA or similar), which means irrevocably licensing it for commercial reuse
by anyone. Sigourney should choose a shot she is genuinely happy to release on
those terms. Do not upload a photographer's work without their permission.

### Date of birth (P569)
Standard for person items but entirely her call. Skip it if she would rather not
have it public; the item works without it.

---

## Things to be careful about

**Conflict of interest.** Wikidata permits subjects and their representatives to
edit, but expects disclosure. Editing should be done from a declared account, and
edits should stay factual and referenced. Aggressive self-promotional editing is
the fastest route to the deletion discussion that killed Doug's item.

**Don't touch the social handles.** They are verified and correct. Any change
should be made in `lib/authors.ts` first, then run:

```bash
npm run verify:entity
```

That script cross-checks the site's `sameAs` graph against this Wikidata item, so
if the two ever drift apart it fails loudly instead of breaking silently.

**Propagation is slow.** Wikidata changes take weeks to reach downstream AI
systems, which is precisely why this should be done early rather than saved for
launch week.
