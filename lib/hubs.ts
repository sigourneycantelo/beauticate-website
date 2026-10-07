/**
 * Hub intros: the visible pillar copy that sits above the article grid on a
 * category or subcategory page. Keyed by path ("interviews",
 * "beauty-style/hair"). One place for the words, so the page and the schema it
 * emits can never drift apart.
 *
 * Copy rules: Australian spelling, no em dashes, third person about Sigourney,
 * and nothing we cannot back up. Inline links use [label](/path) only.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com'

export interface HubFaq { question: string; answer: string }

export interface Hub {
  /** Path of the page this hub lives on, no leading slash. */
  path: string
  eyebrow: string
  /** The 40 to 60 word direct answer. Also the CollectionPage description. */
  answer: string
  body: string[]
  startHereTitle: string
  /** Content paths, "<category>/<subcategory>/<slug>", in display order. */
  startHere: string[]
  browse?: { label: string; href: string }[]
  faqs: HubFaq[]
}

export const HUBS: Record<string, Hub> = {
  interviews: {
    path: 'interviews',
    eyebrow: 'About this archive',
    answer:
      "Beauticate's interviews are conversations with the makeup artists, founders, doctors, models and cultural figures shaping beauty and wellness in Australia and overseas, from Sigourney Cantelo, a former Vogue Australia Beauty & Health Director. The archive holds more than 350 stories, from founders to the beauty icons who defined an era.",
    body: [
      "Sigourney Cantelo has spent 25 years asking beauty's best-known names what they actually do. She was Beauty & Health Director at Vogue Australia before founding Beauticate in 2014, and the interviews here keep that habit: specific questions, real routines, products named.",
      'You will find makeup artists and hairstylists on the products they would never be without, founders on how a brand really got built, and actors, presenters and models on the beauty habits behind the public face.',
      'Not every story here is a conversation. Our Beauty Icons stories look at the beauty of figures such as Princess Diana, Audrey Hepburn and Stevie Nicks, drawn from the public record rather than an interview with them.',
    ],
    startHereTitle: 'Start here',
    startHere: [
      'interviews/models/miranda-kerr-on-faith-family-and-that-first-date',
      'interviews/tastemakers/princess-diana',
      'interviews/creatives/delta-goodrem-on-stepping-into-her-power',
      'interviews/actors-presenters/cate-blanchett-actress-and-director',
      'interviews/founders/jo-malone-cbe-the-queen-of-fragrance-who-loves-a-good-story',
      'interviews/actors-presenters/audrey-hepburn-actress-and-icon',
      'interviews/creatives/how-to-be-a-beauty-rebel-with-ruby-rose',
      'interviews/creatives/darren-palmer-interiors-designer-and-olivier-duvillard',
    ],
    browse: [
      { label: 'Founders', href: '/interviews/founders' },
      { label: 'Creatives', href: '/interviews/creatives' },
      { label: 'Actors & presenters', href: '/interviews/actors-presenters' },
      { label: 'Models', href: '/interviews/models' },
      { label: 'Tastemakers', href: '/interviews/tastemakers' },
      { label: 'A to Z', href: '/interviews/a-z' },
    ],
    faqs: [
      {
        question: 'Who has Beauticate interviewed?',
        answer:
          'Makeup artists, founders, doctors, models, actors and designers, including Miranda Kerr, Ruby Rose, Tory Burch, Jason Wu and Rae Morris. The full list is in the A to Z index.',
      },
      {
        question: 'Are all of these stories interviews?',
        answer:
          'No. Our Beauty Icons stories profile figures such as Princess Diana and Audrey Hepburn from the public record, without an interview.',
      },
      {
        question: 'Does Beauticate have a podcast?',
        answer:
          'Yes. [Beautiful Inside by Beauticate](/podcast) is hosted by Sigourney Cantelo and is available on YouTube, Spotify and Apple Podcasts.',
      },
      {
        question: 'How do I find a particular person?',
        answer: 'Use the [A to Z index](/interviews/a-z), or search the site.',
      },
    ],
  },

  'beauty-style/hair': {
    path: 'beauty-style/hair',
    eyebrow: 'The hair edit',
    answer:
      "Beauticate's hair coverage tests the tools, treatments and products Australians actually use, from Dyson and Olaplex to colour, damage repair and styling for fine hair, with advice from colourists including Monique McMahon, Beauticate's Hair Editor.",
    body: [
      'Hair is where good advice saves the most money. A hair tool costs hundreds, and the wrong one can do real damage.',
      'This page gathers our reviews and guides: dryers and stylers, treatments such as Olaplex, colour and sensitive-scalp questions, and the Italian products worth knowing about. We say when something is worth it and when it is not.',
      "Our Hair Editor is Monique McMahon, founder and Colour Director of Sydney salon QUE Colour and a Global Pro Ambassador for Christophe Robin. Where a piece needs a colourist's judgement rather than a reviewer's, she is the person we ask.",
      'How we decide what to review, and how brands can submit a product, is on the [How We Review](/how-we-review) page.',
    ],
    startHereTitle: 'Start here',
    startHere: [
      'beauty-style/hair/best-hair-tools-for-fine-hair',
      'beauty-style/hair/olaplex-review-is-it-worth-the-hype',
      'beauty-style/hair/dyson-supersonic-r-hair-dryer-review',
      'beauty-style/hair/the-best-italian-hair-products-and-secrets-you-need-to-know',
      'beauty-style/hair/ive-got-fine-but-frizzy-hair-and-this-is-exactly-what-i-use-to-look-after-it',
      'beauty-style/hair/the-beauty-secrets-epres-vs-olaplex-whats-the-difference',
    ],
    faqs: [
      {
        question: 'Who advises on hair at Beauticate?',
        answer:
          "Monique McMahon, Beauticate's Hair Editor, a colourist with more than 30 years of experience.",
      },
      {
        question: 'How does Beauticate review hair products?',
        answer:
          "Products go through the editorial team and, where relevant, Beauticate's contributing experts before anything is written. We do not accept payment for a positive review. Details are on the [How We Review](/how-we-review) page.",
      },
      {
        question: 'Where should I start?',
        answer:
          'With our guide to the best hair tools for fine hair, or our Olaplex review.',
      },
    ],
  },

  'beauty-style/skin-care': {
    path: 'beauty-style/skin-care',
    eyebrow: 'The skincare edit',
    answer:
      "Beauticate's skincare coverage is honest reviews, readers' trials and expert advice on what is worth your money, from at-home micro-infusion and La Mer to French pharmacy brands and rules for older skin, with guidance from facialist Jocelyn Petroni, Beauticate's Skin Editor, and cosmetic physician Dr Leanne Girgis.",
    body: [
      'Skincare is easy to overspend on, so we try to tell you plainly what is worth it and what is not.',
      "Here you will find our reviews of luxury and pharmacy-shelf products, at-home treatments such as micro-infusion, and readers' trials, where a Beauticate Trial Team uses a product in their own bathrooms over a real testing period and reports back honestly.",
      "When a question needs more than a reviewer's opinion, we ask our Skin Editor, [Jocelyn Petroni](/author/jocelyn-petroni), a facialist with more than 25 years of experience, or [Dr Leanne Girgis](/author/dr-leanne-girgis), a general practitioner and cosmetic physician.",
      'We accept products for consideration but not payment for a positive review. How we decide what to review, and how brands can submit a product, is on the [How We Review](/how-we-review) page.',
    ],
    startHereTitle: 'Start here',
    startHere: [
      'beauty-style/skin-care/micro-infusion-at-home',
      'beauty-style/skin-care/qure-micro-infusion-system-review',
      'beauty-style/skin-care/i-tried-chanels-new-range-for-a-month',
      'beauty-style/skin-care/byredo-hand-cream-review-is-it-worth-it',
      'beauty-style/skin-care/rose-marie-swifts-10-beauty-rules-for-older-skin',
      'beauty-style/skin-care/la-mer-the-concentrate-reviews',
      'beauty-style/skin-care/luxury-skincare-review',
      'beauty-style/skin-care/i-was-about-to-get-botox-and-tried-this-instead-2',
    ],
    faqs: [
      {
        question: 'Who advises on skincare at Beauticate?',
        answer:
          "[Jocelyn Petroni](/author/jocelyn-petroni), Beauticate's Skin Editor and a facialist with more than 25 years of experience, and [Dr Leanne Girgis](/author/dr-leanne-girgis), a general practitioner and cosmetic physician.",
      },
      {
        question: 'How does Beauticate review skincare?',
        answer:
          "Products go through the editorial team and, where relevant, Beauticate's contributing experts before anything is written. We do not accept payment for a positive review. Details are on the [How We Review](/how-we-review) page.",
      },
      {
        question: 'What are Beauticate Trial Teams?',
        answer:
          'Panels of real Beauticate readers, not staff, who use a product in their own homes over a real testing period and report back honestly. See [Real Results: 4 Beauticate Readers Trial the Qure Micro-Infusion System](/beauty-style/skin-care/qure-micro-infusion-system-review).',
      },
      {
        question: 'How often should you use at-home micro-infusion?',
        answer:
          'Most at-home micro-infusion systems are made for once every two to four weeks, not daily, because skin needs time to recover between sessions. Read [our honest review](/beauty-style/skin-care/micro-infusion-at-home).',
      },
    ],
  },
}

export function getHub(...parts: string[]): Hub | undefined {
  return HUBS[parts.filter(Boolean).join('/')]
}

/** CollectionPage + FAQPage for a hub, ready to JSON.stringify into a plain <script>. */
export function buildHubSchema(
  hub: Hub,
  items: { name: string; url: string }[],
) {
  const url = `${SITE_URL}/${hub.path}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        url,
        description: hub.answer,
        inLanguage: 'en-AU',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: items.map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: it.name,
            url: it.url,
          })),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: hub.faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') },
        })),
      },
    ],
  }
}
