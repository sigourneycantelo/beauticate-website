const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com'

export interface Author {
  name: string
  slug: string
  role: string
  bio?: string
  photo?: string          // path under /images/authors/
  instagram?: string      // full URL
  linkedin?: string       // full URL
  sameAs?: string[]       // all known profile URLs for Person schema
  shopCollection?: string // Shopify collection handle for "Shop {Name}'s Favourites"
}

export const AUTHORS: Author[] = [
  {
    name: 'Sigourney Cantelo',
    slug: 'sigourney-cantelo',
    role: 'Founder & Editor-in-Chief',
    bio: 'Sigourney Cantelo is an Australian beauty journalist, author and digital publisher with 25 years of experience. She is the founder of Beauticate and former Beauty & Health Director at Vogue Australia.',
    photo: '/images/authors/sigourney-cantelo.png',
    instagram: 'https://www.instagram.com/sigourneycantelo/',
    linkedin: 'https://www.linkedin.com/in/sigourney-cantelo-027a38b/',
    sameAs: [
      'https://www.instagram.com/sigourneycantelo/',
      'https://www.linkedin.com/in/sigourney-cantelo-027a38b/',
      'https://www.wikidata.org/wiki/Q139644159',
      `${SITE_URL}/about-beauticate`,
    ],
  },
  {
    name: 'Kate Waterhouse',
    slug: 'kate-waterhouse',
    role: 'Style Editor',
    bio: "Kate Waterhouse is a fashion expert and style commentator with over 15 years of experience across Australia's media and fashion landscape. Her career spans television and print, including her role as Channel 7's racing fashion reporter, alongside positions as Style Editor and Fashion Editor at The Sun-Herald and The Sunday Telegraph.",
    photo: '/images/authors/kate-waterhouse.png',
    instagram: 'https://www.instagram.com/katewaterhouse7/',
    sameAs: ['https://www.instagram.com/katewaterhouse7/'],
    shopCollection: 'kates-favourites',
  },
  {
    name: 'Rae Morris',
    slug: 'rae-morris',
    role: 'Makeup Editor',
    bio: "Rae Morris is one of Australia's most respected makeup artists, with more than 30 years of experience across editorial, celebrity and education. A four-time Makeup Artist of the Year and founder of her award-winning brush range, she specialises in clean, timeless beauty that enhances rather than masks.",
    photo: '/images/authors/rae-morris.png',
    instagram: 'https://www.instagram.com/raemorrismakeup/',
    sameAs: ['https://www.instagram.com/raemorrismakeup/'],
    shopCollection: 'raes-favourites',
  },
  {
    name: 'Jocelyn Petroni',
    slug: 'jocelyn-petroni',
    role: 'Skin Editor',
    bio: "Jocelyn Petroni is one of Australia's most respected facialists and nail artists, with more than 25 years of experience shaping the local beauty landscape. Known for her work with leading luxury houses and her unwavering commitment to skin integrity, she brings an experience-led perspective to beauty.",
    photo: '/images/authors/jocelyn-petroni.png',
    instagram: 'https://www.instagram.com/jocelynpetroni/',
    sameAs: ['https://www.instagram.com/jocelynpetroni/'],
    shopCollection: 'jocelyns-favourites',
  },
  {
    name: 'Monique McMahon',
    slug: 'monique-mcmahon',
    role: 'Hair Editor',
    bio: "Monique McMahon is one of Australia's leading colourists, with more than 30 years of experience defining modern, natural-looking hair. As founder and Colour Director of Sydney salon QUE Colour, she is known for her mastery of French hand-painting techniques. She is also Christophe Robin's Global Pro Ambassador.",
    photo: '/images/authors/monique-mcmahon.png',
    instagram: 'https://www.instagram.com/moniquemcmahoncolour/',
    sameAs: ['https://www.instagram.com/moniquemcmahoncolour/'],
    shopCollection: 'moniques-favourites',
  },
  {
    name: 'Michelle Bridges',
    slug: 'michelle-bridges',
    role: 'Fitness Expert',
    bio: "Michelle Bridges is one of Australia's most recognised voices in health and fitness, known for translating science-backed training into practical, sustainable habits. She has helped millions rethink their relationship with movement, strength and longevity.",
    photo: '/images/authors/michelle-bridges.png',
    instagram: 'https://www.instagram.com/mishbridges/',
    sameAs: ['https://www.instagram.com/mishbridges/'],
    shopCollection: 'michelles-favourites',
  },
  {
    name: 'Jacqueline Alwill',
    slug: 'jacqueline-alwill',
    role: 'Nutrition Expert',
    bio: "Jacqueline Alwill is an Accredited Nutritionist, television host and author with more than 15 years in health and wellness. As founder of Brown Paper Nutrition and co-host of Channel 10's Good Chef Bad Chef, she translates complex nutritional science into practical, achievable strategies.",
    photo: '/images/authors/jacquiline-alwill.png',
    instagram: 'https://www.instagram.com/brownpapernutrition/',
    sameAs: ['https://www.instagram.com/brownpapernutrition/'],
    shopCollection: 'jacquelines-favourites',
  },
  {
    name: 'Camilla Thompson',
    slug: 'camilla-thompson',
    role: 'Wellness Editor',
    bio: "Camilla Thompson is an author, executive coach and biohacker who helps ambitious people optimise their health, longevity and performance. She is the author of Biohack Me, Australia's first biohacking book.",
    photo: '/images/authors/camille-thomson.png',
    instagram: 'https://www.instagram.com/camilla_thompson/',
    sameAs: ['https://www.instagram.com/camilla_thompson/'],
    shopCollection: 'camillas-favourites',
  },
  {
    name: 'Brooke Stevenson',
    slug: 'brooke-stevenson',
    role: 'Mindset Expert',
    bio: "Brooke Stevenson is a Transformation and Mindset Coach, Reiki Master and certified 9D Breathwork Facilitator. She spent over two decades coaching founders, executives and high-performing teams before starting Luxe Wellness Collective and her signature Reset by Design retreats.",
    photo: '/images/authors/brooke-stevenson.png',
    instagram: 'https://www.instagram.com/luxehealthconsulting/',
    sameAs: ['https://www.instagram.com/luxehealthconsulting/'],
    shopCollection: 'brookes-favourites',
  },
  {
    name: 'Kristin Rawson',
    slug: 'kristin-rawson',
    role: 'Interiors Editor',
    bio: "A magazine stylist turned interior designer, Kristin Rawson brings a decade of global fashion and editorial experience to every space she creates. Known for her intuitive, quietly luxurious approach, she shapes interiors that feel collected, calm and deeply personal.",
    photo: '/images/authors/kristin-rawson.png',
    instagram: 'https://www.instagram.com/kristinrawsoninteriordesign/',
    sameAs: ['https://www.instagram.com/kristinrawsoninteriordesign/'],
    shopCollection: 'kristins-favourites',
  },
  {
    name: 'Shentel Lee',
    slug: 'shentel-lee',
    role: 'Culture Editor',
    bio: "Shentel Lee is an Australian-Malaysian designer and entrepreneur with over 25 years of experience shaping brands through thoughtful design, retail curation and community-driven initiatives. She is the founder of fashion accessory labels Bowerhaus and Sereni & Shentel and NGO Kuching Food Aid.",
    photo: '/images/authors/shentel-lee.png',
    instagram: 'https://www.instagram.com/shentel/',
    sameAs: ['https://www.instagram.com/shentel/'],
    shopCollection: 'shentels-favourites',
  },
  {
    name: 'Dr Amy Chahal',
    slug: 'dr-amy-chahal',
    role: 'Aesthetics Expert',
    bio: "Dr Amy Chahal is a Sydney-based medical doctor and cosmetic physician with more than a decade of experience at the intersection of clinical medicine and modern skin science. She is the Founder and Medical Director of The Centre for Medical Aesthetics and FutureSkin.",
    photo: '/images/authors/amy-chahal.png',
    instagram: 'https://www.instagram.com/drachahal/',
    sameAs: ['https://www.instagram.com/drachahal/'],
    shopCollection: 'amys-favourites',
  },
  {
    name: 'Dr Leanne Girgis',
    slug: 'dr-leanne-girgis',
    role: 'Health Expert',
    bio: "Dr Leanne Girgis is a general practitioner and cosmetic physician with more than a decade of clinical experience. She is also the founder of Innour, an ingestible wellness brand born from her belief in the power of inside-out health.",
    photo: '/images/authors/leanne-girgis.png',
    instagram: 'https://www.instagram.com/leannegirgis/',
    sameAs: ['https://www.instagram.com/leannegirgis/'],
    shopCollection: 'leannes-favourites',
  },
  {
    name: 'Kerrie Gentle',
    slug: 'kerrie-gentle',
    role: 'Beauty Expert',
    bio: "Kerrie Gentle is a Sydney-based makeup artist, beauty therapist and educator with more than three decades of industry experience spanning film, television, editorial, bridal and red carpet. She is one half of Kerrie x Simone, the in-demand makeup workshops bringing expert education to women wanting to refine their skills.",
    photo: '/images/authors/kerrie-gentle.png',
    instagram: 'https://www.instagram.com/kerriegentlemakeupandbeauty/',
    sameAs: ['https://www.instagram.com/kerriegentlemakeupandbeauty/'],
    shopCollection: 'kerries-favourites',
  },
  {
    name: 'Simone Aspinall',
    slug: 'simone-aspinall',
    role: 'Beauty Expert',
    bio: "Simone Aspinall is a beauty therapist and makeup artist with more than 28 years of industry experience, known for her refined, natural approach to modern beauty. She co-hosts Kerrie x Simone makeup workshops, known for their practical, confidence-building approach.",
    photo: '/images/authors/simone-aspinall.png',
    instagram: 'https://www.instagram.com/simoneaspinallmakeup/',
    sameAs: ['https://www.instagram.com/simoneaspinallmakeup/'],
    shopCollection: 'simones-favourites',
  },
  {
    name: 'Jayde Balderston',
    slug: 'jayde-balderston',
    role: 'Managing Editor, PR & Partnerships',
    bio: "With more than 20 years in public relations, Jayde has shaped the story of some of Australia's most influential fashion, beauty and lifestyle brands. At Beauticate, she leads marketing, PR and brand partnerships.",
    photo: '/images/authors/jayde-balderston.png',
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
    bio: "Zoe Briggs came to beauty writing via law school, a stint as a paralegal and a detour as Real Weddings Editor. At Beauticate, she channels a deep personal obsession with skincare into considered, knowledgeable writing that cuts through the noise.",
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
    photo: '/images/authors/kristina-zhou.png',
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
    bio: "Rikki Hodge-Smith is Beauticate's Managing Editor, bringing editorial rigour and operational polish to the brand's daily publishing rhythm.",
    photo: '/images/authors/rikki-hodge-smith.png',
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
    photo: '/images/authors/tess-schlink.png',
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
    photo: '/images/authors/emily-algar.png',
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
    photo: '/images/authors/Christanthi-Kaliviotis.png',
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
    photo: '/images/authors/madeleine-boyd.png',
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
    // Confirmed by Sig: the academic Stephanie Russo (Macquarie / ORCID) is a
    // different person, and the steph.russo Instagram came bundled with it.
    // No verified profile for the Beauticate writer yet, so name-only.
    name: 'Stephanie Russo',
    slug: 'stephanie-russo',
    role: 'Contributing Writer',
    photo: '/images/authors/stephanie-russo.png',
  },
  {
    name: 'Ashley Ropati',
    slug: 'ashley-ropati',
    role: 'Beauty Editor & Lifestyle Journalist',
    photo: '/images/authors/ashley-ropati.png',
    linkedin: 'https://www.linkedin.com/in/ashley-ropati-77b7b280/',
    sameAs: [
      'https://www.linkedin.com/in/ashley-ropati-77b7b280/',
      'https://muckrack.com/ashley-ropati',
      'https://twitter.com/ashleyropati',
      'https://www.beautydirectory.com.au/news/nz/nz-5-minutes-with-ashley-ropati',
    ],
  },
  {
    name: 'Karina Wharton',
    slug: 'karina-wharton',
    role: 'Beauty Writer',
    instagram: 'https://www.instagram.com/karina_wharton/',
    sameAs: [
      'https://www.instagram.com/karina_wharton/',
      'https://www.facebook.com/karina.wharton.5',
    ],
  },
  {
    // Bylined Jess Burdon and Jessica Burdon. Writer and novelist.
    name: 'Jessica Burdon',
    slug: 'jessica-burdon',
    role: 'Writer & Novelist',
    instagram: 'https://www.instagram.com/jessicaburdon/',
    sameAs: [
      'https://www.instagram.com/jessicaburdon/',
      'http://www.jessicaburdon.com/',
      'https://www.huffpost.com/author/jessica-burdon',
    ],
  },
  {
    // IG / LinkedIn held back as unconfirmed. Portfolio + fragrance blog only.
    name: 'Rosalind Thomas',
    slug: 'rosalind-thomas',
    role: 'Beauty & Fragrance Writer',
    sameAs: [
      'https://rosalindthomas.com/',
      'https://theaccords.com.au/',
    ],
  },
  {
    name: 'Claudia De Berardinis',
    slug: 'claudia-de-berardinis',
    role: 'Digital Content Producer & Writer',
    sameAs: [
      'https://muckrack.com/claudia-de-berardinis',
      'https://www.theceomagazine.com/authors/writer/claudia-de-berardinis/',
    ],
  },
  {
    name: 'Maria Pielago',
    slug: 'maria-pielago',
    role: 'Former Editorial Intern',
    linkedin: 'https://www.linkedin.com/in/maria-pielago-25a408a0',
    sameAs: ['https://www.linkedin.com/in/maria-pielago-25a408a0'],
  },
  {
    name: 'Paige Murphy',
    slug: 'paige-murphy',
    role: 'Contributing Writer & Stylist',
    linkedin: 'https://au.linkedin.com/in/paige-murphy-b94b9465',
    sameAs: ['https://au.linkedin.com/in/paige-murphy-b94b9465'],
  },
  {
    name: 'Grace Parsons',
    slug: 'grace-parsons',
    role: 'Contributing Writer',
  },
  {
    name: 'Jill Sandringham',
    slug: 'jill-sandringham',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Lucy Searle',
    slug: 'lucy-searle',
    role: 'Contributing Writer',
  },
  {
    name: 'Elyse Goyen',
    slug: 'elyse-goyen',
    role: 'Contributing Writer',
  },
  {
    name: 'Lauren Kennedy',
    slug: 'lauren-kennedy',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Katherine Ring',
    slug: 'katherine-ring',
    role: 'Contributing Writer',
  },
  {
    name: 'Josie Taylor',
    slug: 'josie-taylor',
    role: 'Contributing Writer',
  },
  {
    name: 'Isabella Ousby',
    slug: 'isabella-ousby',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Megan McGlinchey',
    slug: 'megan-mcglinchey',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Gracie Clough',
    slug: 'gracie-clough',
    role: 'Contributing Writer',
  },
  {
    name: 'Amanda Chan',
    slug: 'amanda-chan',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Allanah Jansons',
    slug: 'allanah-jansons',
    role: 'Contributing Writer',
  },
  {
    name: 'Willa Zheng',
    slug: 'willa-zheng',
    role: 'Contributing Writer',
  },
  {
    name: 'Marvin Gloria',
    slug: 'marvin-gloria',
    role: 'Contributing Writer',
  },
  {
    name: 'Alexis Gilmer',
    slug: 'alexis-gilmer',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Michelle Mullen',
    slug: 'michelle-mullen',
    role: 'Contributing Writer',
  },
  {
    name: 'Amy Cannan',
    slug: 'amy-cannan',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Penny Hunt',
    slug: 'penny-hunt',
    role: 'Contributing Writer',
  },
  {
    name: 'Daniella Giancarli',
    slug: 'daniella-giancarli',
    role: 'Contributing Writer',
  },
  {
    name: 'Ashlee Campbell',
    slug: 'ashlee-campbell',
    role: 'Contributing Writer',
  },
  {
    name: 'Katrine Pascoe',
    slug: 'katrine-pascoe',
    role: 'Contributing Writer',
  },
  {
    name: 'Kath Karras',
    slug: 'kath-karras',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Sammi Keys',
    slug: 'sammi-keys',
    role: 'Contributing Writer',
  },
  {
    name: 'Danielle de Gail',
    slug: 'danielle-de-gail',
    role: 'Contributing Writer',
  },
  {
    name: 'Arianne Witt',
    slug: 'arianne-witt',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Juliette Tuck',
    slug: 'juliette-tuck',
    role: 'Contributing Writer',
  },
  {
    name: 'Jennah Porter',
    slug: 'jennah-porter',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Amy Mattes-Harris',
    slug: 'amy-mattes-harris',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Vickie Zarifopoulos',
    slug: 'vickie-zarifopoulos',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Zoe Brown',
    slug: 'zoe-brown',
    role: 'Contributing Writer',
  },
  {
    name: 'Lauren Wilson',
    slug: 'lauren-wilson',
    role: 'Contributing Reviewer',
  },
  {
    name: 'Margaret Zhang',
    slug: 'margaret-zhang',
    role: 'Contributing Writer',
    instagram: 'https://www.instagram.com/margaret__zhang/',
    sameAs: [
      'https://www.instagram.com/margaret__zhang/',
    ],
  },
  {
    name: 'Colette Harvey',
    slug: 'colette-harvey',
    role: 'Contributing Writer',
  },
  {
    name: 'Zoe Bingley-Pullin',
    slug: 'zoe-bingley-pullin',
    role: 'Nutrition Expert',
    instagram: 'https://www.instagram.com/zoebingleypullin/',
    sameAs: [
      'https://www.instagram.com/zoebingleypullin/',
    ],
  },
  {
    name: "Abigail O'Neill",
    slug: 'abigail-oneill',
    role: 'Contributing Writer',
    instagram: 'https://www.instagram.com/abigailoneill/',
    sameAs: [
      'https://www.instagram.com/abigailoneill/',
    ],
  },
  {
    name: 'Beauticate Editorial',
    slug: 'beauticate-editorial',
    role: 'Editorial Team',
    sameAs: [
      `${SITE_URL}/about-beauticate`,
    ],
  },
  {
    name: 'Samantha Blanchfield',
    slug: 'samantha-blanchfield',
    role: 'Contributing Writer',
  },
  {
    name: 'Catherine Barnes',
    slug: 'catherine-barnes',
    role: 'Contributing Writer',
  },
  {
    name: 'Mariah Bovee',
    slug: 'mariah-bovee',
    role: 'Contributing Writer',
  },
  {
    name: 'Sarina Zoe',
    slug: 'sarina-zoe',
    role: 'Contributing Writer',
  },
  {
    name: 'Libby Moffet',
    slug: 'libby-moffet',
    role: 'Contributing Writer',
  },
  {
    name: 'Emily Dee',
    slug: 'emily-dee',
    role: 'Contributing Writer',
  },
  {
    name: 'Faarah Ameerally',
    slug: 'faarah-ameerally',
    role: 'Contributing Writer',
  },
  {
    name: 'Emma Trimbur',
    slug: 'emma-trimbur',
    role: 'Contributing Writer',
  },
  {
    name: 'Annie Lin',
    slug: 'annie-lin',
    role: 'Contributing Writer',
  },
  {
    name: 'Nicola Donovan',
    slug: 'nicola-donovan',
    role: 'Contributing Writer',
  },
  {
    name: 'Velvet Garvey',
    slug: 'velvet-garvey',
    role: 'Contributing Writer',
  },
  {
    name: 'Sarah Jagger',
    slug: 'sarah-jagger',
    role: 'Contributing Writer',
  },
  {
    name: 'Canna Campbell',
    slug: 'canna-campbell',
    role: 'Finance & Lifestyle Writer',
    instagram: 'https://www.instagram.com/sugarmamma.tv/',
    sameAs: [
      'https://www.instagram.com/sugarmamma.tv/',
      'https://www.youtube.com/@SugarMammaTv',
    ],
  },
  {
    name: 'Jess Bowman',
    slug: 'jess-bowman',
    role: 'Contributing Writer',
  },
  {
    name: 'Lauren Rose Burke',
    slug: 'lauren-rose-burke',
    role: 'Contributing Writer',
  },
  {
    name: 'Jessica Sepel',
    slug: 'jessica-sepel',
    role: 'Nutrition & Wellness Expert',
    instagram: 'https://www.instagram.com/jshealth/',
    sameAs: [
      'https://www.instagram.com/jshealth/',
      'https://www.jshealth.com/',
    ],
  },
  {
    name: 'Josephine Taylor',
    slug: 'josephine-taylor',
    role: 'Contributing Writer',
  },
  {
    name: 'Bryce Anable',
    slug: 'bryce-anable',
    role: 'Contributing Writer',
  },
  {
    name: 'Natasha Ciesielski',
    slug: 'natasha-ciesielski',
    role: 'Contributing Writer',
  },
  {
    name: 'Gemma Dawkins',
    slug: 'gemma-dawkins',
    role: 'Contributing Writer',
  },
  {
    name: 'Grace Fernan',
    slug: 'grace-fernan',
    role: 'Contributing Writer',
  },
  {
    name: 'Angelica Xidias',
    slug: 'angelica-xidias',
    role: 'Contributing Writer',
  },
  {
    name: 'Julie Wakely',
    slug: 'julie-wakely',
    role: 'Contributing Writer',
  },
  {
    name: 'Jasmine Turvey',
    slug: 'jasmine-turvey',
    role: 'Contributing Writer',
  },
  {
    name: 'Shannon Carley',
    slug: 'shannon-carley',
    role: 'Contributing Writer',
  },
  {
    name: 'Sarah McLean',
    slug: 'sarah-mclean',
    role: 'Contributing Writer',
  },
  {
    name: 'Melinda Nanovsky',
    slug: 'melinda-nanovsky',
    role: 'Contributing Writer',
  },
  {
    name: 'Lyn Nguyen',
    slug: 'lyn-nguyen',
    role: 'Contributing Writer',
  },
  {
    name: 'Georgie Abay',
    slug: 'georgie-abay',
    role: 'Contributing Writer',
    instagram: 'https://www.instagram.com/georgieabay/',
    sameAs: [
      'https://www.instagram.com/georgieabay/',
    ],
  },
  {
    name: 'Amy Verner',
    slug: 'amy-verner',
    role: 'Contributing Writer',
  },
  {
    name: 'Katarina Diquez',
    slug: 'katarina-diquez',
    role: 'Contributing Writer',
  },
  {
    name: 'Clara Williams Roldan',
    slug: 'clara-williams-roldan',
    role: 'Contributing Writer',
  },
  {
    name: 'Han Hye Jin',
    slug: 'han-hye-jin',
    role: 'Contributing Writer',
  },
  {
    name: 'Sara Srochi',
    slug: 'sara-srochi',
    role: 'Contributing Writer',
  },
]

const INDEX = new Map(AUTHORS.map(a => [a.name.toLowerCase(), a]))

export function getAuthor(name: string): Author | undefined {
  return INDEX.get(name.toLowerCase())
}

export function getAllAuthorsWithPages(): Author[] {
  return AUTHORS.filter(a => a.photo)
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find(a => a.slug === slug)
}

export function buildPersonSchema(author: Author, siteUrl: string) {
  return {
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role,
    url: author.photo ? `${siteUrl}/author/${author.slug}` : `${siteUrl}/about-beauticate`,
    ...(author.photo ? { image: `${siteUrl}${author.photo}` } : {}),
    ...(author.sameAs && author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
    worksFor: {
      '@type': 'Organization',
      name: 'Beauticate',
      url: siteUrl,
    },
  }
}
