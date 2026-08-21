# Ask Sig — TGA / AHPRA / ACL guardrails

**Status: decisions settled by Sigourney, 21 Aug 2026. See "Decisions" below.**

Researched and written by Claude from the primary sources linked at the bottom.
**This is not legal advice.** Sig has read it, answered the open questions and
chosen to act on this analysis plus her own judgement rather than engage a
lawyer. That is a deliberate decision, recorded here so the basis for it is not
lost later.

The rules in `lib/chat/guardrails.ts` are derived from this document; change
this first, then the code.

Jurisdiction: Australia. Beauticate is operated by Cantelo Corporation Pty Ltd
(NSW).

---

## Why Beauticate is caught by this at all

Three facts stack up, and together they are the whole reason these guardrails
are strict:

1. **Beauticate sells therapeutic goods.** Roughly 90 of ~430 shop products are
   supplements, ingestibles, patches, electrolytes or light-therapy devices —
   JSHealth Vitamins, Innour collagen, BonWellness patches, Eir Women, Avive
   Hydration, San Lueur LED masks. Supplements are *listed medicines*; LED masks
   and similar are *medical devices*; therapeutic sunscreens are also
   therapeutic goods.

2. **Beauticate is the merchant of record.** Per the shop terms, Beauticate is
   the customer-facing seller. That makes Beauticate a person "engaged in the
   production, marketing or supply" of those goods, in the Code's words.

3. **Beauticate receives gifted product and affiliate revenue.** The Code treats
   free product, gifts, discounts, flights, accommodation and "promise of future
   benefit" as *valuable consideration*, and deems anyone who receives it to be
   engaged in marketing or supply.

Any one of those three is enough to trigger the testimonial prohibition below.
All three apply.

---

## Rule 1 — Sig can never give a testimonial about a therapeutic good

This is the sharpest rule and the least negotiable.

A **testimonial** is a statement about a therapeutic good by a person claiming to
have used it personally, or used it while caring for someone else. Product
reviews and user comments count.

The Code prohibits testimonials from people engaged in the production, marketing
or supply of the good — and separately deems anyone who received valuable
consideration to be such a person, explicitly naming social media influencers,
bloggers and brand ambassadors.

**Therefore: Sig cannot say she uses, takes, loves, or has benefited from any
supplement, ingestible, patch or therapeutic device — full stop.** Not for shop
products (merchant of record), not for gifted products (valuable consideration).
There is no disclosure that cures this. Disclosure fixes *endorsements*, not
testimonials.

This holds even though the first-person voice is the whole point of Ask Sig. The
voice survives everywhere else; it just cannot attach personal use to a
therapeutic good.

### Also prohibited as testimonial *or* endorsement sources

The Code bars testimonials and endorsements from:

- a government or government authority (health campaigns excepted)
- a hospital or healthcare facility
- employees or contractors of any of the above
- **a current or former health practitioner, health professional or medical
  researcher**
- anyone representing themselves as qualified or trained to diagnose, treat or
  prevent disease

The fourth bullet is the one that bites Beauticate hardest, because the archive
is full of interviews with doctors, dermatologists, nutritionists and
naturopaths. **Ask Sig must not relay a practitioner's view about a therapeutic
good, even when quoting a genuine Beauticate interview.**

---

## Rule 2 — Beauticate owns every testimonial it surfaces or links to

The advertiser is responsible for keeping testimonials and endorsements
compliant even where they "didn't write it, don't know the person who wrote it,
don't agree with it."

And: "If your advertisement provides links to other websites or information,
including international websites, the linked material is considered part of the
advertisement and must also be compliant."

Two direct consequences for Ask Sig:

- It must not quote or paraphrase reader comments, reviews or interview
  testimonials about therapeutic goods out of the archive.
- **The web-search fallback cannot link out when a therapeutic good is in play.**
  Linked material becomes part of Beauticate's advertising, and a live search
  result cannot be vetted before the model cites it. Decided: beauticate.com
  links only, and the web-search fallback is not to be built. See "Decisions".

---

## Rule 3 — the claims layer

Content of any testimonial or endorsement must not:

- contravene any provision of the Act or the Code
- be inconsistent with the label, instructions for use, warnings or precautions
- be inconsistent with the ARTG indications or intended purpose for that product
- refer to health benefits that are not typical of expected benefits when used
  as directed

Practically, for Ask Sig: no treat / cure / prevent / heal / fix / clears /
eliminates / boosts-immunity language attached to a therapeutic good, no naming
a serious condition next to a product, and no efficacy claim that goes beyond
what the label says.

Separately, **Australian Consumer Law** applies to everything Ask Sig says.
Misleading or deceptive conduct is actionable regardless of the TGA position,
which is why the honesty rules ("never invent a price", "say when you don't
know") are compliance features, not just quality features.

Two further Code points worth carrying:

- Advertising therapeutic goods to **children under 12 is prohibited outright**.
- **Each day a contravention remains up may be a fresh contravention.** Historical
  content is not grandfathered — this matters for the 1,749-article archive as
  much as for the chatbot.

---

## Rule 4 — AHPRA, and why the directory is in scope

Section 133(1)(c) of the National Law prohibits advertising a **regulated health
service** using testimonials or *purported* testimonials — a purported
testimonial being anything that "appears to be a testimonial, whether provided in
the first or third person." It bites where the service has a "clinical aspect".

Beauticate runs a clinics, salons, spas and wellness directory, and interviews
practitioners. Where a listing or answer promotes a service with a clinical
aspect — cosmetic injectables, laser, skin needling, IV therapy, anything
performed by a registered practitioner — testimonials about it are prohibited.

AHPRA does *not* hold an advertiser responsible for reviews on third-party
platforms it doesn't control. It does hold them responsible for *making use of*
those reviews to promote the service. Ask Sig repeating a glowing patient
account of a clinic would be making use of it.

---

## Rule 5 — stay out of "medical purpose" (the biggest one)

The TGA has published guidance that text-based AI products, explicitly including
ChatGPT-style large language models, **may themselves be regulated as
software-based medical devices** where they have a *medical purpose* and are
supplied to the Australian public. Where a developer "adapts, builds on or
incorporates a LLM into their product or service offering", that developer is
deemed the **manufacturer** with obligations under s41BD of the Act.

That is a different and larger order of risk than an advertising breach: it is
the difference between fixing some wording and shipping an unregistered medical
device.

Medical purpose covers diagnosis, prevention, monitoring, prediction, prognosis,
treatment or alleviation of disease, injury or disability. Consumer software
that encourages behavioural change for general health or wellness may be
*excluded*.

**Design rule: Ask Sig stays firmly on the general-wellness-and-education side
of that line.** Concretely, it must never:

- diagnose, or offer a probable cause for a symptom
- triage ("that sounds like it could be X")
- map a described symptom or condition onto a product recommendation
- suggest starting, stopping, combining or dosing anything ingestible
- imply monitoring or tracking of a condition

The symptom→product move is the one to watch. "I've got painful cystic acne,
what should I use" is exactly the shape of a medical-purpose interaction, and it
is also the most natural question a beauty site's chatbot will ever receive.
Ask Sig should answer with education and a referral, not a basket.

---

## What is *not* restricted

Worth stating plainly, so the guardrails don't flatten the product.

**Ordinary cosmetics are not therapeutic goods.** Moisturiser, cleanser, serum,
lipstick, fragrance, hair care, candles, homewares, fashion — none of this is
caught by the Code. Sig can be as warm and personal about those as she likes:
"I've used this cleanser for years and it's a proper workhorse" is fine.

The line falls at: ingestibles, supplements and vitamins, transdermal patches,
electrolytes, therapeutic devices (LED and light therapy), therapeutic
sunscreens, and anything making a therapeutic claim.

### A note on LED masks — the classification is claims-dependent

"All LED masks are medical devices" is **not** correct as a blanket statement,
and the guardrails should not be defended on that basis.

Whether a device is a medical device turns on its **intended purpose**. A device
whose labelling, advertising or documentation makes a therapeutic claim — treats
acne, stimulates collagen, reduces wrinkles — is a medical device and must be in
the ARTG. Red and infrared phototherapy units are a well-populated ARTG
category, and the Neutrogena Visibly Clear Light Therapy Acne Mask was regulated
on exactly this basis (and later carried a TGA safety alert over retinal risk).
A device sold with no therapeutic claim at all may sit outside the framework.

Two consequences that cut in opposite directions:

- The blanket rule is wrong, so don't state it as law.
- **Making the therapeutic claim is itself part of what pulls a device in.** If
  Beauticate says a mask stimulates collagen, Beauticate is making a therapeutic
  claim about it. We cannot claim the cosmetic exemption while describing a
  clinical mechanism.

**For the specific product in our shop this is settled: San Lueur markets the
Advanced LED Light Therapy Facial Mask as ARTG-listed.** An ARTG-listed device
is unambiguously a therapeutic good, so the full Code applies to it — including
the testimonial prohibition. The two flagged articles stand.

The operational rule in `lib/chat/guardrails.ts` still treats all LED and light
therapy as restricted. That is a deliberate over-inclusion: the chatbot cannot
determine a given device's ARTG status at runtime, and the cost of over-caution
is a slightly duller answer while the cost of under-caution is a breach. It is a
safety margin, not a statement of law.

Also unrestricted: talking about a therapeutic good *factually and
non-promotionally* — what it is, what's in it, what the label says — and linking
to its product page. What's restricted is the personal-use claim and the
efficacy claim.

---

## Decisions (settled by Sigourney, 21 Aug 2026)

These were the open questions. Sig has answered them and decided to proceed on
this analysis plus her own judgement rather than engage a lawyer. That is a
deliberate, informed choice and it is recorded here so the reasoning is not
lost. Nothing in this document is legal advice; it is a careful reading of the
legislation by someone who is not a lawyer.

**1. External linking — DECIDED: beauticate.com only.**
Linked material becomes part of the advertisement and a live search result
cannot be vetted before it is cited. Ask Sig links only to our own pages.
Implemented: `lib/chat/links.ts` strips any link whose target is not in the
index, and the restricted-query directive forbids external links outright. The
web-search fallback from the original brief is **not to be built** as specced.

**2. Archive exposure — IN PROGRESS.**
35 articles remediated, 244 flagged and untouched. `scripts/audit-testimonials.mjs`
finds candidates; it points at articles rather than at every issue inside one,
so each flagged article needs a human read.

**3. Gifting — DECIDED: assume everything is gifted.**
Sig: "almost everything I write about is gifted." Valuable consideration is
therefore the norm, not the exception, which means the testimonial prohibition
applies across the board and no relaxation is available. The guardrails already
assume this. There is no gifting register to consult.

**4. Directory listings — DECIDED: the reviews must be rewritten.**
Sig: "almost all of them. We sent reviewers to write the reviews and they wrote
first person testimonial style reviews. Many of these were paid for."

This is now the highest-risk area on the site, above the article backlog:

- s133(1)(c) of the National Law prohibits advertising a **regulated health
  service** using testimonials or purported testimonials. Unlike a TGA
  endorsement, disclosure does not cure it. There is no compliant way to publish
  a paid first-person account of a clinic that performs injectables, laser or
  skin needling.
- Payment is an aggravating fact under the TGA Code too: a paid testimonial is
  prohibited outright, not merely disclosable.
- The whole format is the problem, not a line within it. These need rewriting as
  editorial descriptions, not trimming.

Indicative scale (counts are from a regex sweep, not an audit):
271 listings, 122 with first-person narration. Of 100 clinic listings, 52 are
first person and **22 are first person and name a clinical service**. Start
there. Note some first-person hits are the salon owner speaking rather than a
customer, which is not a testimonial; each needs reading.

**5. Sig's own supplement reviews — DECIDED: retire or reword.**
Includes retitling "Sigourney Road Tests a Hair Loss Preventing Strand Boosting
Elixir", where the therapeutic claim is in the headline and the URL slug.
Retitling affects SEO and inbound links, so slugs need a redirect.

---

## Priority order

1. **Clinic directory listings.** Absolute prohibition, paid, whole-format. 22
   worst, 52 to read, 271 in total.
2. **The 244 flagged articles.** Mostly claims rather than testimonials.
3. **Sig's supplement reviews and the hair-loss headline** (item 5).
4. Re-run the audit after each pass; it under-reports by design.

---

## Sources

- [TGA — Testimonials and endorsements in advertising](https://www.tga.gov.au/products/regulations-all-products/advertising/applying-advertising-code/testimonials-and-endorsements-advertising) (Part 6 of the Code)
- [TGA — Advertising therapeutic goods on social media](https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media) (influencers, linked material, AI-generated advertising, acceptable-use policy template)
- [Therapeutic Goods (Therapeutic Goods Advertising Code) Instrument 2021](https://www.tga.gov.au/resources/legislation/therapeutic-goods-therapeutic-goods-advertising-code-instrument-2021)
- [TGA — Understanding how we regulate software-based medical devices](https://www.tga.gov.au/resources/guidance/understanding-how-we-regulate-software-based-medical-devices)
- [TGA — AI and medical device software](https://www.tga.gov.au/products/medical-devices/software-and-artificial-intelligence-ai/manufacturing/artificial-intelligence-ai-and-medical-device-software)
- [TGA — Software-based medical device exclusions](https://www.tga.gov.au/products/medical-devices/software-and-artificial-intelligence-ai/overview/software-based-medical-device-exclusions)
- [AHPRA — Advertising guidelines](https://www.ahpra.gov.au/Publications/Advertising-resources/Legislation-guidelines/Advertising-guidelines.aspx) (s133 National Law, testimonials, purported testimonials)
- [AHPRA — Testimonials](https://www.ahpra.gov.au/Publications/Advertising-resources/Check-and-correct/Testimonials.aspx)
- [ACCC — Online product and service reviews](https://www.accc.gov.au/business/advertising-and-promotions/online-product-and-service-reviews)
