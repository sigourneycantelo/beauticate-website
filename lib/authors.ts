const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com'

export interface Author {
  name: string
  slug: string
  role: string
  photo?: string          // path under /images/authors/
  instagram?: string      // full URL
  linkedin?: string       // full URL
  sameAs?: string[]       // all known profile URLs for Person schema
}

const AUTHORS: Author[] = [
  {
    name: 'Sigourney Cantelo',
    slug: 'sigourney-cantelo',
    role: 'Founder & Editor-in-Chief',
    photo: '/images/authors/sigourney-cantelo.jpg',
    instagram: 'https://www.instagram.com/sigourneycantelo/',
    linkedin: 'https://www.linkedin.com/in/sigourney-cantelo-027a38b/',
    sameAs: [
      'https://www.instagram.com/sigourneycantelo/',
      'https://www.linkedin.com/in/sigourney-cantelo-027a38b/',
      `${SITE_URL}/about-beauticate`,
    ],
  },
  {
    name: 'Kate Waterhouse',
    slug: 'kate-waterhouse',
    role: 'Style Editor',
    photo: '/images/authors/kate-waterhouse.png',
    instagram: 'https://www.instagram.com/katewaterhouse7/',
    sameAs: ['https://www.instagram.com/katewaterhouse7/'],
  },
  {
    name: 'Rae Morris',
    slug: 'rae-morris',
    role: 'Makeup Editor',
    photo: '/images/authors/rae-morris.png',
    instagram: 'https://www.instagram.com/raemorrismakeup/',
    sameAs: ['https://www.instagram.com/raemorrismakeup/'],
  },
  {
    name: 'Jocelyn Petroni',
    slug: 'jocelyn-petroni',
    role: 'Skin Editor',
    photo: '/images/authors/jocelyn-petroni.png',
    instagram: 'https://www.instagram.com/jocelynpetroni/',
    sameAs: ['https://www.instagram.com/jocelynpetroni/'],
  },
  {
    name: 'Monique McMahon',
    slug: 'monique-mcmahon',
    role: 'Hair Editor',
    photo: '/images/authors/monique-mcmahon.png',
    instagram: 'https://www.instagram.com/moniquemcmahoncolour/',
    sameAs: ['https://www.instagram.com/moniquemcmahoncolour/'],
  },
  {
    name: 'Michelle Bridges',
    slug: 'michelle-bridges',
    role: 'Fitness Expert',
    photo: '/images/authors/michelle-bridges.png',
    instagram: 'https://www.instagram.com/mishbridges/',
    sameAs: ['https://www.instagram.com/mishbridges/'],
  },
  {
    name: 'Jacqueline Alwill',
    slug: 'jacqueline-alwill',
    role: 'Nutrition Expert',
    photo: '/images/authors/jacqueline-alwill.png',
    instagram: 'https://www.instagram.com/brownpapernutrition/',
    sameAs: ['https://www.instagram.com/brownpapernutrition/'],
  },
  {
    name: 'Camilla Thompson',
    slug: 'camilla-thompson',
    role: 'Wellness Editor',
    photo: '/images/authors/camilla-thompson.png',
    instagram: 'https://www.instagram.com/camilla_thompson/',
    sameAs: ['https://www.instagram.com/camilla_thompson/'],
  },
  {
    name: 'Brooke Stevenson',
    slug: 'brooke-stevenson',
    role: 'Mindset Expert',
    photo: '/images/authors/brooke-stevenson.png',
    instagram: 'https://www.instagram.com/luxehealthconsulting/',
    sameAs: ['https://www.instagram.com/luxehealthconsulting/'],
  },
  {
    name: 'Kristin Rawson',
    slug: 'kristin-rawson',
    role: 'Interiors Editor',
    photo: '/images/authors/kristin-rawson.png',
    instagram: 'https://www.instagram.com/kristinrawsoninteriordesign/',
    sameAs: ['https://www.instagram.com/kristinrawsoninteriordesign/'],
  },
  {
    name: 'Shentel Lee',
    slug: 'shentel-lee',
    role: 'Culture Editor',
    photo: '/images/authors/shentel-lee.png',
    instagram: 'https://www.instagram.com/shentel/',
    sameAs: ['https://www.instagram.com/shentel/'],
  },
  {
    name: 'Dr Amy Chahal',
    slug: 'dr-amy-chahal',
    role: 'Aesthetics Expert',
    photo: '/images/authors/dr-amy-chahal.png',
    instagram: 'https://www.instagram.com/drachahal/',
    sameAs: ['https://www.instagram.com/drachahal/'],
  },
  {
    name: 'Dr Leanne Girgis',
    slug: 'dr-leanne-girgis',
    role: 'Health Expert',
    photo: '/images/authors/dr-leanne-girgis.png',
    instagram: 'https://www.instagram.com/leannegirgis/',
    sameAs: ['https://www.instagram.com/leannegirgis/'],
  },
  {
    name: 'Kerrie Gentle',
    slug: 'kerrie-gentle',
    role: 'Beauty Expert',
    photo: '/images/authors/kerrie-gentle.png',
    instagram: 'https://www.instagram.com/kerriegentlemakeupandbeauty/',
    sameAs: ['https://www.instagram.com/kerriegentlemakeupandbeauty/'],
  },
  {
    name: 'Simone Aspinall',
    slug: 'simone-aspinall',
    role: 'Beauty Expert',
    photo: '/images/authors/simone-aspinall.png',
    instagram: 'https://www.instagram.com/simoneaspinallmakeup/',
    sameAs: ['https://www.instagram.com/simoneaspinallmakeup/'],
  },
  {
    name: 'Jayde Balderston',
    slug: 'jayde-balderston',
    role: 'Contributing Editor',
    photo: '/images/authors/jayde-balderston.jpg',
  },
  {
    name: 'Paris Obakpolo',
    slug: 'paris-obakpolo',
    role: 'Contributing Writer',
    photo: '/images/authors/paris-obakpolo.png',
  },
  {
    name: 'Zoe Briggs',
    slug: 'zoe-briggs',
    role: 'Contributing Editor',
    photo: '/images/authors/zoe-briggs.png',
    instagram: 'https://www.instagram.com/zoebriggsbeauty/',
    linkedin: 'https://www.linkedin.com/in/zoe-briggs-8ba944233/',
    sameAs: [
      'https://www.instagram.com/zoebriggsbeauty/',
      'https://www.linkedin.com/in/zoe-briggs-8ba944233/',
      'https://muckrack.com/zoe-briggs-1/articles',
    ],
  },
  {
    name: 'Ally McManus',
    slug: 'ally-mcmanus',
    role: 'Contributing Writer',
  },
  {
    name: 'Kristina Zhou',
    slug: 'kristina-zhou',
    role: 'Contributing Writer',
  },
  {
    name: 'Yadira Galarza Cauchi',
    slug: 'yadira-galarza-cauchi',
    role: 'Contributing Writer',
  },
  {
    name: 'Rikki Hodge-Smith',
    slug: 'rikki-hodge-smith',
    role: 'Managing Editor',
    instagram: 'https://www.instagram.com/_rikkishell/',
    sameAs: [
      'https://www.instagram.com/_rikkishell/',
      'https://www.beautydirectory.com.au/news/business/beauticate-appoints-rikki-hodge-smith-managing-ed',
    ],
  },
  {
    // Bylined as Tess Schlink. Now Tess de Vivie, contributing editor at Harper's Bazaar.
    name: 'Tess Schlink',
    slug: 'tess-schlink',
    role: 'Contributing Writer',
    instagram: 'https://www.instagram.com/tessdevivie/',
    linkedin: 'https://www.linkedin.com/in/tess-de-vivie/',
    sameAs: [
      'https://www.instagram.com/tessdevivie/',
      'https://www.linkedin.com/in/tess-de-vivie/',
    ],
  },
  {
    // Bylined as Emily Algar. Now Emily Morello, writes for RUSSH, ELLE, Harper's Bazaar.
    name: 'Emily Algar',
    slug: 'emily-algar',
    role: 'Contributing Writer',
    instagram: 'https://www.instagram.com/emilyalgar/',
    sameAs: [
      'https://www.instagram.com/emilyalgar/',
      'https://www.bythem.co/creators/emily-algar',
    ],
  },
  {
    name: 'Chrisanthi Kaliviotis',
    slug: 'chrisanthi-kaliviotis',
    role: 'Contributing Writer',
    instagram: 'https://www.instagram.com/chrisanthi_kal/',
    linkedin: 'https://www.linkedin.com/in/chrisanthi-kaliviotis-933924126',
    sameAs: [
      'https://www.instagram.com/chrisanthi_kal/',
      'https://www.linkedin.com/in/chrisanthi-kaliviotis-933924126',
    ],
  },
  {
    name: 'Lisa Walker',
    slug: 'lisa-walker',
    role: 'Founder, Eir Women',
    instagram: 'https://www.instagram.com/walker_on_the_wild_side/',
    sameAs: [
      'https://www.instagram.com/walker_on_the_wild_side/',
      'https://www.instagram.com/eirforwomen/',
    ],
  },
  {
    name: 'Madeleine Boyd',
    slug: 'madeleine-boyd',
    role: 'Contributing Writer',
    instagram: 'https://www.instagram.com/madeleine_boyd/',
    linkedin: 'https://www.linkedin.com/in/madeleine-boyd-35133639/',
    sameAs: [
      'https://www.instagram.com/madeleine_boyd/',
      'https://www.linkedin.com/in/madeleine-boyd-35133639/',
    ],
  },
  {
    name: 'Molly Gay',
    slug: 'molly-gay',
    role: 'Contributing Writer',
    instagram: 'https://www.instagram.com/mollykatgay/',
    sameAs: ['https://www.instagram.com/mollykatgay/'],
  },
  {
    name: 'Marina Gainulina',
    slug: 'marina-gainulina',
    role: 'Contributing Writer',
    linkedin: 'https://www.linkedin.com/in/marinagainulina',
    sameAs: ['https://www.linkedin.com/in/marinagainulina'],
  },
  {
    // IG only. Academic ORCID / Macquarie identity user supplied looks like a
    // different Stephanie Russo, left out pending confirmation.
    name: 'Stephanie Russo',
    slug: 'stephanie-russo',
    role: 'Contributing Writer',
    instagram: 'https://www.instagram.com/steph.russo/',
    sameAs: ['https://www.instagram.com/steph.russo/'],
  },
]

const INDEX = new Map(AUTHORS.map(a => [a.name.toLowerCase(), a]))

export function getAuthor(name: string): Author | undefined {
  return INDEX.get(name.toLowerCase())
}

export function buildPersonSchema(author: Author, siteUrl: string) {
  return {
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role,
    url: `${siteUrl}/about-beauticate`,
    ...(author.photo ? { image: `${siteUrl}${author.photo}` } : {}),
    ...(author.sameAs && author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
    worksFor: {
      '@type': 'Organization',
      name: 'Beauticate',
      url: siteUrl,
    },
  }
}
