# Rewriting clinic listings — the editorial template

**Status: DRAFT — the voice needs Sig's sign-off before it goes on the other 21
listings.** The legal reasoning behind it is in
[`docs/ask-sig-compliance.md`](ask-sig-compliance.md), which is itself
unreviewed and not legal advice.

## The problem

Twenty-two clinic directory listings are written as first-person accounts of
having a treatment at a clinic that offers cosmetic injectables, laser, skin
needling, IPL, chemical peels or LED. They were commissioned and paid for.

Section 133(1)(c) of the National Law prohibits advertising a regulated health
service using a testimonial, and a *purported* testimonial counts, meaning
anything that "appears to be a testimonial, whether provided in the first or
third person". Payment makes it worse rather than better: under the TGA Code,
valuable consideration deems the writer to be engaged in marketing the goods or
service, and there's no disclosure that cures a testimonial. Disclosure fixes
endorsements.

So "I had the facial and my skin looked amazing" can't stay, and it can't be
patched either. Trimming the offending sentence out of a piece whose whole
architecture is a first-person visit leaves damaged prose. The Youth Lab listing
is the cautionary example: an earlier pass swapped one sentence and left
"After the Hydrafacial, Tash leads me into another stunning treatment room for
15 minutes of bliss under the Healite. The clinic offers LED light treatments as
part of its menu." These listings need rewriting, not editing.

## What replaces it

A factual editorial listing. Closer to a good directory entry than to a review:
what the clinic does, who runs it, what the space is like, what's on the menu,
what it costs. The reader should finish it knowing whether to book, not knowing
how someone else's skin looked afterwards.

The house precedent already exists in the directory. Aesthetica, Byron Bay is
written this way and reads well.

### Structure

Five sections, roughly 400 to 550 words, images kept where they are.

1. **The place.** Open on a scene, third person or second person, never first.
   Where it is, what the room is actually like. This is where the specificity
   lives: the architect, the furniture, the artist on the wall, the handwash.
   All of it is observable fact, none of it is a claim.
2. **Who runs it.** Named practitioner, real qualifications, where they trained,
   what they did before. Link the Beauticate interview if there is one.
3. **The signature treatment.** What it consists of, step by step, and how long
   it takes. Describe the *procedure*, never the *outcome*.
4. **The rest of the menu.** What else is offered, named plainly.
5. **Booking and prices.** Address, phone, booking link, price if we can verify
   one. This section is the reason someone reads a directory listing.

### Rules

**Never.**

- First person about a treatment. No "I arrive", "my therapist", "my skin".
- Anyone else's account either. A relayed client or patient experience is caught
  by the same section.
- Outcome language attached to a clinical service or a device: brightens,
  tightens, stimulates collagen, promotes healing, reduces, results.
- Comparison or superiority: "Perth's premier", "the best in Melbourne",
  "particularly sought-after thanks to natural-looking results". AHPRA
  prohibits claims that a service is better than another's.
- "Painless", "no downtime", "risk-free". These minimise risk, which is its own
  prohibition.
- Anything we can't source. If the original reporting didn't say it and the
  clinic doesn't publish it, it doesn't go in. Inventing a price is also an
  Australian Consumer Law problem, not just a sloppiness problem.

**Fine, and worth protecting.**

- Naming the treatments, the devices and the technology. Factual,
  non-promotional description of a therapeutic good is expressly not restricted.
- Exclusivity of availability. "The only clinic in WA where the Accor Plasma Pen
  is available" is a fact about supply, not a claim about results.
- Editorial judgement about the *non-clinical* experience. The room, the
  service, the coffee, how long the massage runs. Facials, waxing, brows and
  tints aren't regulated health services and aren't therapeutic goods.
- Voice. Dry, specific, warm. See `sigourney-writing-voice`. Losing the
  first-person doesn't mean losing the writing.

### Frontmatter

The body isn't the only place a testimonial or a claim hides. Every rewrite has
to also clear:

- `excerpt` and `meta_description`, which usually carry the outcome claim.
- `seo_title`. "Perth's Premier Cosmetic Clinic" was a superiority claim sitting
  in a title tag.
- `faqs`. These were auto-generated from the body, so they inherit whatever the
  body said, and several of them refer to "the article" out loud.
- `date_modified`, which should move.

Leave `published` alone. Draft status in this directory is a sticky editorial
decision (see CLAUDE.md) and compliance work is not a reason to publish
something that was hidden for a different reason.

## Status

All 22 clinic listings are rewritten. `content/destinations/clinics/blanc-wa/blanc-wa.mdx`
is the worked example; the before of every one is in git.

## Things the 22 taught us

Each of these came out of a real listing and is worth checking for on the next
tranche.

- **The frontmatter is where the claims hide.** Roughly half the breaches were
  in an excerpt, a `seo_title` or an auto-generated FAQ rather than the body.
  "Perth's Premier Cosmetic Clinic" was a superiority claim in a title tag.
- **A claim about typical results is worse than one person's account.** La Belle
  Peau's FAQ said what "most clients notice" in the first week. That reads as
  evidence rather than as one experience.
- **Practitioners get held out as more than they are.** Dermal therapists
  described as "qualified to diagnose", a herbalist crediting herself with
  treating psoriasis. Diagnosis is the first item on the TGA's list of what
  makes something a medical purpose.
- **Prescription-only medicines cannot be advertised to the public at all.**
  Assure named a prescription Vitamin A as a reason to choose them. This is a
  separate prohibition from anything about testimonials.
- **Relayed praise is still a testimonial.** Reve quoted a client in the
  doorway. Me Skin & Body used a celebrity's patronage. Liberty Belle described
  clients' before and after photographs on the walls.
- **Undated offers and prices go stale.** A "20% off for Beauticate readers"
  with no terms and no date, and a $45 blow dry at a neighbouring salon. Neither
  is verifiable now, and advertising a discount nobody will honour is an
  Australian Consumer Law problem in its own right.
- **Some listings are stale rather than non-compliant.** The Facial Hub's body
  described the previous business at the previous address. Fix that in the same
  pass and record it in `draft_reason`.
- **Downtime and contraindications are the best thing on the page.** They are
  not claims, they cut against the advertising, and they are what a reader
  actually needs. Promote them rather than cutting them.

## Finding the work

```bash
python3 scripts/audit-directory-ahpra.py
```

Writes `docs/audit/directory-ahpra.csv`, priority-ordered. P1 is a first-person
account of a regulated health service, P2 a first-person account of a
therapeutic device, P3 a claim without a testimonial, P4 a first-person account
with no clinical service detected. Live listings sort above drafts inside each
band, on the TGA's view that every day a contravention stays up may be a fresh
contravention. A draft isn't up.

The script over-flags on purpose and every hit needs a human read. It is not a
legal determination.
