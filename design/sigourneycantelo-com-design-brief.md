# sigourneycantelo.com — Design Brief

## For the design chat

Australian spelling and no em dashes throughout. This is house style and non-negotiable.

---

## What this is

A new personal site for Sigourney Cantelo at **sigourneycantelo.com** (domain purchased, along with .com.au). It is a separate site from beauticate.com, on its own repo and its own Vercel project.

It is not a portfolio site in the ordinary sense. It is an **entity site**: its primary job is to be the single canonical, machine-readable answer to "who is Sigourney Cantelo", so that search engines and AI answer engines (ChatGPT, Perplexity, Gemini, Google AI Overviews) resolve her correctly and consistently. Everything else the site does hangs off that.

Sigourney's 25 years of work is currently scattered across vogue.com.au, marieclaire.com.au, beauticate.com, Spotify, YouTube and LinkedIn, with no single page tying it together. This site consolidates it.

### The commercial jobs it also has to do

Four audiences, arriving on four different query classes:

| Audience | Arrives searching | Needs |
|---|---|---|
| Search engines / AI systems | "Sigourney Cantelo", "who founded Beauticate" | Clear, consistent, crawlable identity |
| Brand marketing managers | "beauty copywriter Australia" | Proof of commercial copywriting work, a way to brief her |
| Event and TV bookers | "beauty MC", "beauty expert commentator" | Showreel, events hosted, a way to book her |
| Journalists and partners | her name, cold | Credentials, press, contact |

The homepage must assert **one** thing clearly, then offer four labelled doors. A hero that tries to say four things says none.

---

## The one non-negotiable

**Every headline, credential, clip title and case study must be real, selectable HTML text. Never text baked into an image.**

This is the single most important constraint in the brief and it overrides visual preference.

The reference site Sigourney likes (emmabangay.com) is gorgeous and gets this exactly wrong: its entire folio is images. Extract the text from that page and you get one word, "Folio". For a site whose whole purpose is being read and cited by machines, that would be self-defeating.

Design freely with type, colour and shape. Just never flatten copy into a JPG. If a layout only works as an image, it does not work.

Related: decorative shapes should be CSS or inline SVG, not image files, so they stay crisp and cost nothing to load.

---

## Reference points

- **emmabangay.com** — take the *energy*. Warm retro palette, oversized lowercase serif, bold geometric shapes (arcs, half-circles, quarter-circles) as full-bleed compositional blocks. Confident and fun. Do not take the technique (see above).
- **douglord.com** — take the *structure*. One identity line, then clearly separated proof sections, then a plain-language FAQ at the bottom. Nothing decorative gets between a reader and a fact.
- **beauticate.com** — the family resemblance. This site should read as unmistakably related, but louder and more personal. Beauticate is the masthead voice; this is her own.

---

## Palette

Built deliberately from Beauticate's own accent tokens, several of which are barely used on the main site. This is what makes the two sites read as family without this one feeling like a clone.

**Ground and ink**
| Token | Hex | Use |
|---|---|---|
| `parchment` | `#F5F3F0` | Primary warm ground |
| `paper` | `#FFFFFF` | Cards, text panels |
| `ink` | `#2a2621` | All body copy and headlines |
| `muted` | `#7a7268` | Secondary text, captions |

**The accents — this is where the site gets its personality**
| Token | Hex | Notes |
|---|---|---|
| `terracotta` | `#B5613A` | The workhorse. Warm burnt orange, closest to the Emma Bangay ochre |
| `eucalypt` | `#8E9A82` | Soft sage green |
| `camel` | `#DBCEB9` | Pale sand |
| `mist` | `#BABED8` | Dusty periwinkle |
| `aqua` | `#BFFFF5` | Bright mint. Use as a sparing pop, never a large field |
| `wine` | `#7a2733` | Beauticate's signature. Use *sparingly* as the deliberate visual bridge back to the masthead |

**One honest flag:** `camel #DBCEB9` and `aqua #BFFFF5` are both quite pale. They will not carry a large full-bleed arc the way Emma Bangay's saturated ochre does. If the composition needs a deep shape colour, `terracotta` is the one that can hold it, or propose a deeper camel and we will add it as a new token. Please raise this rather than working around it.

---

## Typography

Same four families as Beauticate, so the sites are visibly related. All are already loaded via next/font/google.

| Role | Family | Use here |
|---|---|---|
| Serif | **EB Garamond** | Body copy, article text |
| Display | **Playfair Display** | Section headings |
| Sans | **Hanken Grotesk** | Eyebrows, nav, tags, buttons. Uppercase, 10–12px, wide tracking (0.2–0.34em) |
| Numeral | **Italiana** | Large decorative numerals |

**The one place to break from Beauticate:** the name treatment. Beauticate's headline convention is restrained EB Garamond, often italic. Her name on this site should be the boldest typographic moment on the whole build. Oversized, confident, ideally lowercase, allowed to run wide or bleed off the edge. This is the piece we most want to see options for.

---

## Structure

```
/                  Entity hub. Identity line, credentials strip, four doors, FAQ
/about             Long-form bio, narrative with dated verifiable specifics
/awards            12 awards itemised and dated
/press             In the media, what others have written about her
/contact           One page, four intents: brief me / book me / interview me / partner

The four doors:
/journalism        Hub, 25 years of mastheads
/journalism/<slug> ~27 individual clip pages
/copywriting       Service page + case studies
/copywriting/<slug>
/television        TV and presenting, plus early acting credits
/speaking          Events hosted
/podcast           Beautiful Inside, her podcast
```

Roughly 60 pages. Most are one of a small number of repeating templates, so the design work is: **hub page, clip/case-study page, and the homepage**. Get those three right and the rest follow.

---

## Who she is (for tone, and for the copy that has to appear)

Canonical one-line identity, to be used verbatim across the site:

> Australian beauty journalist, editor and founder of Beauticate.

Supporting facts, all verifiable and all worth designing around:

- 25 years across print, digital and broadcast
- Former **Beauty & Health Director, Vogue Australia** (approx. six years)
- Founder of **Beauticate** (2014), reaching ~3.1 million monthly touchpoints
- **Six Jasmine Awards**, including twice winning the Jasmine Award for Journalistic Excellence (2010 and 2014)
- **Six Star Beauty Awards**
- Regular TV commentator: Sunrise, the Today show, A Current Affair, Nine News, Channel 10's The Circle (resident beauty expert)
- Has hosted events for Chanel and Dior at Vogue's Fashion's Night Out, plus Myer, Clinique and Bobbi Brown
- Work syndicated by Vogue titles internationally including Vogue China, Korea and Portugal
- BA Communications, UTS, graduated with a Distinction average
- Host of the podcast *Beautiful Inside by Beauticate*, 44 episodes

Tone: warm, expert, unstuffy. She is genuinely senior and genuinely approachable, and the design should not pick only one of those. Avoid clinical-luxury minimalism (reads cold, and Beauticate already owns restrained) and avoid influencer-bright (undersells 25 years and six Jasmine Awards).

---

## Images

Sigourney has a large, strong library, so images are not a constraint. What the design needs to specify is **what shapes to ask for**. Please call these out explicitly in the direction so we can pull the right shots:

- **One hero portrait.** The single defining image of the site. Landscape or full-bleed.
- **Portrait crops (3:4)** for the four door cards.
- **A working/candid set** — her at work, on set, interviewing, presenting. These carry the journalism and TV sections and stop the site feeling like a headshot gallery.
- **Clip and case-study thumbnails.** The magazine spreads exist as PDFs and can be rendered to images, but note the *headline text must still be real HTML on the page*; the spread image is illustrative only.
- **Black and white vs colour.** Her 2018 bio used a striking B&W portrait set. Worth proposing whether B&W portraiture against the warm accent palette is the signature, or whether it is all colour. Please show a view.

Assume every image needs a meaningful `alt` description. Portrait shots must be genuinely portrait in the pixels, not landscape files rotated by EXIF flag.

---

## What we would like back

1. **Homepage direction**, 2–3 options. This is the priority. Specifically the name treatment and how the four doors are expressed.
2. **The shape language.** What the geometric motif actually is, and the rules for using it, so it stays consistent across 60 pages without a designer touching each one.
3. **Palette application.** Which accent leads, which support, and how much colour a page carries. A rule we can apply, not a one-off composition.
4. **The three core templates:** hub page, clip/case-study page, contact.
5. **Mobile.** Roughly half the traffic. Big geometric compositions are the thing most likely to break at 375px, so please show mobile alongside desktop rather than after.
6. **A named image shot-list** based on the section above, so Sigourney can pull files in one pass.

Accessibility is a real requirement, not a nice-to-have: text on any accent colour must meet WCAG AA contrast. `aqua` and `camel` will fail against white, so please check rather than assume.

---

## Out of scope for the design chat

Schema markup, llms.txt, robots.txt, crawler access and the Wikidata work are all being handled separately on the build side. The design does not need to account for them beyond the real-HTML-text rule above.
