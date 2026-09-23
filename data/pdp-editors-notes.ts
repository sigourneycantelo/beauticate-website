/**
 * Editor's Notes for product detail pages.
 *
 * Each entry is keyed by Shopify product handle. The note is a prose paragraph
 * in Sigourney's voice with interviewee mentions as hyperlinks.  "As seen in"
 * cards link to the articles where the product appears.
 *
 * `mentions` are rendered as terracotta-coloured links inside the note text.
 * The note body uses `{name}` placeholders that are replaced at render time
 * with `<a>` tags pointing to the mention's `href`.
 *
 * Add entries as new products get editorial coverage.
 */

export type EditorMention = {
  name: string
  href: string
}

export type ArticleCard = {
  title: string
  /** Full slug path: category/subcategory/slug */
  slug: string
  type: 'interview' | 'editorial' | 'vodcast'
}

export type EditorNote = {
  note: string
  author: string
  authorTitle: string
  mentions: EditorMention[]
  cards: ArticleCard[]
}

export const PDP_EDITORS_NOTES: Record<string, EditorNote> = {
  'christophe-robin-cleansing-purifying-scrub-with-sea-salt-250ml': {
    note: `If there is one product that comes up in our interviews more than almost any other, it is this scrub. {Delta Goodrem} uses it with the Regenerating Mask. {Megan Gale} says her scalp feels "squeaky clean." {Jessica Mauboy} follows it with the Protein Toner. {Bridget Yorston} from Bec & Bridge is obsessed with the whole range. Even {Mathilde Thomas} - who founded Caudalie and has tried literally everything - is a Christophe Robin devotee. I keep the big tub in my shower permanently. A tablespoon of that gritty, salty paste, a hit of cool menthol on the scalp, and it dissolves into the most satisfying foam. Once a week in place of shampoo. My fine hair gets a volume boost that lasts days. This is the one.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [
      { name: 'Delta Goodrem', href: '/interviews/creatives/delta-goodrem-on-stepping-into-her-power/delta-goodrem-on-stepping-into-her-power' },
      { name: 'Megan Gale', href: '/interviews/models/megan-gale-model-entrepreneur/megan-gale-model-entrepreneur' },
      { name: 'Jessica Mauboy', href: '/interviews/creatives/jessica-mauboy/jessica-mauboy' },
      { name: 'Bridget Yorston', href: '/interviews/creatives/who-bridget-yorston-designer/who-bridget-yorston-designer' },
      { name: 'Mathilde Thomas', href: '/interviews/founders/caudalies-mathilde-thomas-on-must-visit-paris-destinations-and-the-importance-of-pleasure/caudalies-mathilde-thomas-on-must-visit-paris-destinations-and-the-importance-of-pleasure' },
    ],
    cards: [
      { title: 'Delta Goodrem on Stepping Into Her Power', slug: 'interviews/creatives/delta-goodrem-on-stepping-into-her-power', type: 'interview' },
      { title: 'Megan Gale, Model & Entrepreneur', slug: 'interviews/models/megan-gale-model-entrepreneur', type: 'interview' },
    ],
  },

  'christophe-robin-cleansing-volumising-paste-pure-with-rose-extracts-75ml': {
    note: `This is the product I reach for when my hair has given up. You open the tub and there is this browny-red paste the colour of terracotta, studded with sugar crystals, and it smells unmistakably of Grasse roses - romantic, green, nothing like your grandmother's pot-pourri. A tablespoon, worked through wet roots, and it transforms into this extraordinary foam. My hair comes out weightless and full of body for days. I use it before the wave iron and the volume is almost absurd. {Zanna Roberts Rassi} uses it on recommendation from her colourist. {Sara Fuller} from Pam Pam swears by the whole volumising range. If you have fine hair, this is the Christophe Robin to start with.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [
      { name: 'Zanna Roberts Rassi', href: '/interviews/actors-presenters/zanna-roberts-rassi-the-fashion-darling-re-energising-the-beauty-game/zanna-roberts-rassi-the-fashion-darling-re-energising-the-beauty-game' },
      { name: 'Sara Fuller', href: '/interviews/founders/sara-fuller-entrepreneur/sara-fuller-entrepreneur' },
    ],
    cards: [
      { title: 'Zanna Roberts Rassi, the Fashion Darling Re-Energising the Beauty Game', slug: 'interviews/actors-presenters/zanna-roberts-rassi-the-fashion-darling-re-energising-the-beauty-game', type: 'interview' },
      { title: 'Sara Fuller, Pam Pam Boutique', slug: 'interviews/founders/sara-fuller-entrepreneur', type: 'interview' },
    ],
  },

  'balinese-ylang-ylang-candle': {
    note: `Lumira is one of those Australian brands that does not shout. Clean architectural glass, minimal labelling, and scents that are genuinely transportive. The Balinese Ylang Ylang is heady and tropical - sweet, almost narcotic, somewhere between jasmine and tuberose - and it fills a room within minutes. {Almira Armstrong} from Lumira told us how she builds each fragrance around a place and a memory. We have featured her candles across our gift guides and self-care rituals because they are the ones we actually burn at home. Not decorative. Not performative. Just beautiful scent.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [
      { name: 'Almira Armstrong', href: '/interviews/founders/almira-armstrong-lumira/almira-armstrong-lumira' },
    ],
    cards: [
      { title: 'Almira Armstrong, Lumira', slug: 'interviews/founders/almira-armstrong-lumira', type: 'interview' },
    ],
  },

  '1642-large-scented-candle': {
    note: `I am an aesthete and Maison Balzac is my weakness. Elise Pioch Balzac trained at Hermes under Martin Margiela, and you can feel it in every piece - the hand-blown borosilicate glass, the jewel-toned colour, the sculptural whimsy. Her candle vessels glow like lanterns when lit. The 1642 is inspired by a 17th-century Dutch still-life painting: violet opens it, then a darker, juicier blackberry, over warm cedarwood. It is cerebral and gallery-worthy. And when the wax is gone, the vessel stays on the shelf as an object. Everything Elise makes - the Bow Coupes, the coloured Gobelets, the candles - looks collected, not purchased. That is the point.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [],
    cards: [],
  },

  'mogra-rejuvenating-gold-cream': {
    note: `Subtle Energies is the spa world's best-kept secret. Farida Irani has been formulating Ayurvedic aromatherapy in Sydney since 1993 - her blends are in The Peninsula, Six Senses and Mandarin Oriental spas globally. The Mogra Gold Cream has 24K gold leaf, mogra jasmine (the "Queen of Jasmines" - deeper and more intoxicating than any Western variety) and Himalayan rose. The pump dispenses this perfect consistency - neither too liquid nor too solid - and the scent is subtly sweet, floral and woody. Beauty Bible called it "absolute heaven to use." By morning, your skin looks genuinely glowier. This is ceremonial skincare. Not something you rush through.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [],
    cards: [],
  },

  'hair-energy-formula': {
    note: `Jessica Sepel started JSHealth with 2,000 units of this formula and sold out in four weeks. It is the hero for a reason. We have featured {Jessica Sepel} across our wellness coverage because she is a clinical nutritionist who actually practices what she formulates - and the Hair + Energy capsules are backed by the kind of evidence we look for. The packaging is clean, blush-pink, wellness-luxe - it sits on the same shelf as Vida Glow and The Beauty Chef, not the pharmacy aisle. Several of our interviewees take JSHealth daily. It is one of the few supplement brands we stock because we trust the science behind it.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [
      { name: 'Jessica Sepel', href: '/interviews/tastemakers/jessica-sepel-nutritionist-health-blogger/jessica-sepel-nutritionist-health-blogger' },
    ],
    cards: [
      { title: 'Jessica Sepel, JSHealth Vitamins', slug: 'interviews/tastemakers/jessica-sepel-nutritionist-health-blogger', type: 'interview' },
    ],
  },

  'sleep-wellness-patch': {
    note: `I wrote about BonPatch in my nightly beauty rituals piece - "light the special candle, lather in the good body wash, pop on a BonPatch." The Sleep patches are discreet little transparent squares that you press onto your upper arm or shoulder before bed. They have a faint lavender scent and you forget they are there within minutes. The delivery is slow and steady - valerian, hemp extract, passionflower - and I sleep more deeply when I use them. No pills, no powders, no remembering to drink something. Just peel, stick, sleep. That simplicity is what I love about them.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [],
    cards: [],
  },

  'natural-marine-collagen-berry-30-sachets': {
    note: `The Berry flavour is genuinely delicious - raspberry-forward, no fishiness, no chalkiness - and it dissolves cleanly into water with a light, drinkable consistency. The sachets live in my handbag. Innour uses premium French marine collagen and every batch is independently lab-tested, which matters when you are putting something in your body daily. Their clinical trial showed a 22% improvement in skin hydration over twelve weeks. We like that the brand is Australian, doctor-developed, and transparent about sourcing. This is the collagen we stock because it meets our bar for both efficacy and taste.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [],
    cards: [],
  },

  'flourish-vitality-greens': {
    note: `Lisa Walker co-founded Eir Women after discovering how poorly most supplements are formulated for women over 40. We published her story because it is one of those founder narratives that is driven by frustration, not opportunism. The Flourish Vitality Greens taste tropical rather than grassy - a meaningful distinction when you are committing to drinking something every morning. The matte black packaging with bold colour accents reads as clinical-meets-editorial, which is exactly where this brand sits. TGA-approved, ARTG-listed, made in Australia. Not wellness cosplay. The real thing.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [],
    cards: [],
  },

  'les-huilette-hair-serum-50ml': {
    note: `This is the kind of brand you discover on a back street in the Marais and never stop buying. Les Huilettes is stocked at Le Bon Marche and Printemps. The hair serum comes in dark green tinted glass with a pipette dropper - it looks beautiful and intentional on a shelf, like something between Aesop and a traditional French herboristerie remedy. The scent is cade wood and lavender - earthy, grounding, almost good enough to wear as a perfume oil. Two drops warmed between your fingertips, smoothed through dry ends. Lightweight, non-greasy, and your hair drinks it up. Silver winner at the Clean + Conscious Awards for Best Hair Treatment.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [],
    cards: [],
  },

  'excellent-bb-cream-1': {
    note: `{Celeste Barber} did not set out to make a beauty brand. She set out to make a BB cream she would actually wear. The Excellent BB Cream has medium coverage that genuinely looks like skin - no mask, no slipping, no oxidising orange by lunchtime. The texture is thin enough to spread with your fingers but pigmented enough that you skip foundation. I use shade Sand and it blends out in about ten seconds. Celeste formulated it with her makeup artist to work on real skin, in real light, on a woman who does not have time for seven steps. That is the whole brief, and it delivers. BOOIE is the brand she built because nothing on the shelf did what she needed.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [
      { name: 'Celeste Barber', href: '/interviews/actors-presenters/celeste-barber-on-body-shaming-fame-and-wanking-i-have-no-interest-in-fame/celeste-barber-on-body-shaming-fame-and-wanking-i-have-no-interest-in-fame' },
    ],
    cards: [
      { title: 'Celeste Barber on Body Shaming, Fame and the Battle with Social Media', slug: 'interviews/actors-presenters/celeste-barber-on-body-shaming-fame-and-wanking-i-have-no-interest-in-fame', type: 'interview' },
      { title: 'Celeste Barber on ADHD, Bullying, Boundaries and Social Media', slug: 'interviews/actors-presenters/celeste-barber-on-adhd-bullying-boundaries-and-the-battle-with-social-media', type: 'interview' },
    ],
  },

  'bloody-delicious': {
    note: `The Bloody Delicious Illuminator is the other half of {Celeste Barber}'s BOOIE range, and it is the one that surprised me. A liquid highlighter in a slim tube with a doe-foot applicator, in a champagne shade that catches light without screaming "highlighter." One dot on each cheekbone, blended with a fingertip, and you get that lit-from-within glow that expensive facials promise. Layer it over the BB Cream or wear it alone on bare skin - it works both ways. The formula is lightweight, not glittery, and it lasts. Celeste wanted something that looked expensive and felt effortless. This is it.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [
      { name: 'Celeste Barber', href: '/interviews/actors-presenters/celeste-barber-on-body-shaming-fame-and-wanking-i-have-no-interest-in-fame/celeste-barber-on-body-shaming-fame-and-wanking-i-have-no-interest-in-fame' },
    ],
    cards: [
      { title: 'Celeste Barber on Body Shaming, Fame and the Battle with Social Media', slug: 'interviews/actors-presenters/celeste-barber-on-body-shaming-fame-and-wanking-i-have-no-interest-in-fame', type: 'interview' },
    ],
  },

  'aha-face-exfoliant': {
    note: `La Mav was the first certified organic skincare range in Australia, and it was founded by a veterinarian and research scientist, Dr Tarj Mavi. That combination of scientific rigour and Ayurvedic philosophy is what makes the formulations interesting. The AHA Exfoliant has fine bamboo particles that do not drag, combined with chemical exfoliation from desert lime, sugar cane and bilberry. It smells like the Australian bush - lemon myrtle, bergamot, lavender and cedar. The glass bottle has genuine weight to it. This is Australian natural skincare that looks and performs like a prestige brand, because it is one.`,
    author: 'Sigourney Cantelo',
    authorTitle: 'Editor-in-Chief',
    mentions: [],
    cards: [],
  },
}

/**
 * Look up the editor's note for a product handle.
 * Handles sometimes carry a `-1` suffix from duplicated Shopify collections.
 */
export function editorNoteForHandle(handle: string): EditorNote | undefined {
  return PDP_EDITORS_NOTES[handle] ?? PDP_EDITORS_NOTES[handle.replace(/-1$/, '')]
}
