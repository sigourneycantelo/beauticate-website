import type { Metadata } from 'next'
import Script from 'next/script'
import Image from 'next/image'
import Link from 'next/link'
import StoryTimeline from '@/components/about/StoryTimeline'

export const metadata: Metadata = {
  title: 'About Beauticate | Sigourney Cantelo, Founder & Editor-in-Chief',
  description: 'Beauticate is Australia\'s most trusted beauty, wellness and lifestyle editorial brand. Founded in 2014 by Sigourney Cantelo, former Vogue Australia Beauty & Health Director, and trusted by 3.1 million readers monthly.',
  alternates: { canonical: 'https://www.beauticate.com/about-beauticate' },
  openGraph: {
    title: 'About Beauticate | Founded by Sigourney Cantelo',
    description: 'Eleven years of trusted beauty, wellness and lifestyle editorial. Meet the founder, the team, and the story behind Australia\'s most-cited beauty brand.',
    url: 'https://www.beauticate.com/about-beauticate',
    type: 'website',
  },
}

// Person schema for Sigourney, Doug's report: "gold-standard E-E-A-T signals"
const sigourneySchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://www.beauticate.com/#sigourney-cantelo',
  name: 'Sigourney Cantelo',
  givenName: 'Sigourney',
  familyName: 'Cantelo',
  jobTitle: 'Founder & Editor-in-Chief',
  description: 'Sigourney Cantelo is an Australian beauty journalist, author and digital publisher with 25 years of experience. She is the founder of Beauticate and former Beauty & Health Director at Vogue Australia.',
  url: 'https://www.beauticate.com/about-beauticate',
  image: 'https://www.beauticate.com/images/sigourney-cantelo.jpg',
  worksFor: {
    '@type': 'Organization',
    '@id': 'https://www.beauticate.com/#organization',
    name: 'Beauticate',
  },
  alumniOf: [
    { '@type': 'Organization', name: 'Vogue Australia' },
  ],
  knowsAbout: [
    'Beauty', 'Skincare', 'Wellness', 'Lifestyle', 'Health', 'Fashion', 'Cosmetics',
    'Anti-ageing', 'Beauty Journalism', 'Content Strategy',
  ],
  sameAs: [
    'https://www.instagram.com/sigourney.cantelo/',
    'https://www.linkedin.com/in/sigourneycantelo/',
  ],
  nationality: { '@type': 'Country', name: 'Australia' },
}

type Member = { name: string; role: string; image: string; bio: string; instagram?: string }

const editors: Member[] = [
  { name: 'Kate Waterhouse', instagram: 'https://www.instagram.com/katewaterhouse7', role: 'Style Editor', image: '/images/collective/kate-waterhouse.png', bio: "Kate Waterhouse is a fashion expert and style commentator with over 15 years of experience across Australia's media and fashion landscape. Her career spans television and print, including her role as Channel 7's racing fashion reporter, alongside positions as Style Editor and Fashion Editor at The Sun-Herald and The Sunday Telegraph. She is also the author of the Sophia the Show Pony children's book series. Known for her relaxed yet polished aesthetic, Kate brings a refined, modern perspective to Beauticate." },
  { name: 'Rae Morris', instagram: 'https://www.instagram.com/raemorrismakeup', role: 'Makeup Editor', image: '/images/collective/rae-morris.png', bio: "Rae Morris is one of Australia's most respected makeup artists, with more than 30 years of experience across editorial, celebrity and education. Known for her refined, skin-first approach, she specialises in clean, timeless beauty that enhances rather than masks. A four-time Makeup Artist of the Year and founder of her award-winning brush range, Rae brings expert techniques, trusted product edits and a clear, considered perspective to Beauticate." },
  { name: 'Jocelyn Petroni', instagram: 'https://www.instagram.com/jocelynpetroni', role: 'Skin Editor', image: '/images/collective/jocelyn-petroni.png', bio: "Jocelyn Petroni is one of Australia's most respected facialists and nail artists, with more than 25 years of experience shaping the local beauty landscape. Known for her work with leading luxury houses and her unwavering commitment to skin integrity, she has built a devoted clientele who value both results and ritual. At Beauticate, she brings an experience-led perspective to beauty, sharing insights from decades spent working closely with the world's most respected skincare brands." },
  { name: 'Monique McMahon', instagram: 'https://www.instagram.com/moniquemcmahoncolour', role: 'Hair Editor', image: '/images/collective/monique-mcmahon.png', bio: "Monique McMahon is one of Australia's leading colourists, with more than 30 years of experience defining modern, natural-looking hair. As founder and Colour Director of Sydney salon QUE Colour, she believes in healthy hair and is known for her mastery of French hand-painting techniques. Monique is also Christophe Robin's Global Pro Ambassador, along with Wella and Dyson, bringing an international perspective and sharing practical, expert-led advice on achieving healthy, beautifully lived-in hair." },
  { name: 'Michelle Bridges', instagram: 'https://www.instagram.com/mishbridges', role: 'Fitness Expert', image: '/images/collective/michelle-bridges.png', bio: "Michelle Bridges is one of Australia's most recognised voices in health and fitness, known for translating science-backed training into practical, sustainable habits. With decades of experience as a trainer, author and wellness educator, she has helped millions of people rethink their relationship with movement, strength and longevity. Today, as host of podcast We Have A Situation, she creates relatable content that focuses on strength, longevity and sustainable health. At Beauticate, she brings her signature warmth and expertise to the conversation around movement and long-term wellbeing." },
  { name: 'Jacqueline Alwill', instagram: 'https://www.instagram.com/brownpapernutrition', role: 'Nutrition Expert', image: '/images/collective/jacqueline-alwill.png', bio: "Jacqueline Alwill is an Accredited Nutritionist, television host and author with more than 15 years in health and wellness. As founder of Brown Paper Nutrition and co-host of Channel 10's Good Chef Bad Chef, she is known for translating complex nutritional science into practical, achievable strategies. Her approach blends evidence-based nutrition with real-life warmth, shaped by her own journey toward a balanced relationship with food. At Beauticate, Jacqueline brings a thoughtful, holistic perspective to nourishment, beauty and everyday living." },
  { name: 'Camilla Thompson', instagram: 'https://www.instagram.com/camilla_thompson', role: 'Wellness Editor', image: '/images/collective/camilla-thompson.png', bio: "Camilla Thompson is an author, executive coach and biohacker who helps ambitious people optimise their health, longevity and performance. For nearly a decade she has worked with founders, executives and high-performing women, translating cutting-edge science into practical strategies for sustained energy, mental clarity and resilience. She is the author of Biohack Me, Australia's first biohacking book. At Beauticate, Camilla explores the intersection of science, longevity and modern wellness." },
  { name: 'Brooke Stevenson', instagram: 'https://www.instagram.com/luxewellnesscollective', role: 'Mindset Expert', image: '/images/collective/brooke-stevenson.png', bio: "Brooke Stevenson is a Transformation and Mindset Coach, Reiki Master and certified 9D Breathwork Facilitator whose work is rooted in one belief: that lasting change begins with a profound shift within. Brooke spent over two decades coaching founders, executives and high-performing teams in Australia and LA before starting Luxe Wellness Collective and her signature Reset by Design retreats and programs. As a founding Mindset Expert for Beauticate Collective, she offers a grounded, elevated perspective on what it truly means to live well." },
  { name: 'Kristin Rawson', instagram: 'https://www.instagram.com/kristinrawsoninteriordesign', role: 'Interiors Editor', image: '/images/collective/kristin-rawson.png', bio: "A magazine stylist turned interior designer, Kristin Rawson brings a decade of global fashion and editorial experience to every space she creates. Known for her intuitive, quietly luxurious approach, she shapes interiors that feel collected, calm and deeply personal. Her work reflects a belief in thoughtful craftsmanship, nuanced palettes and the details that elevate the everyday. At Beauticate, Kristin offers a warm, intelligent lens on interiors and design, distilling global influences into ideas you can actually use." },
  { name: 'Shentel Lee', instagram: 'https://www.instagram.com/shentel', role: 'Culture Editor', image: '/images/collective/shentel-lee.png', bio: "Shentel Lee is an Australian-Malaysian designer and entrepreneur with over 25 years of experience shaping brands through thoughtful design, retail curation and community-driven initiatives. As the founder of fashion accessory labels Bowerhaus and Sereni & Shentel and NGO Kuching Food Aid, her work spans creative direction, product development and impactful grassroots philanthropy, reflecting a career defined by both aesthetic sensibility and social purpose. With a passion for travel and a keen eye for relatable, thoughtful details, she shares the things she loves in a way that feels both personal and considered." },
  { name: 'Dr Amy Chahal', instagram: 'https://www.instagram.com/drachahal', role: 'Aesthetics Expert', image: '/images/collective/dr-amy-chahal.png', bio: "Dr Amy Chahal is a Sydney-based medical doctor and cosmetic physician with more than a decade of experience at the intersection of clinical medicine and modern skin science. Founder and Medical Director of The Centre for Medical Aesthetics and FutureSkin in Sydney, she has built a reputation for results-driven, evidence-based care that is informed, never overdone and always considered. At Beauticate, Dr Amy brings a clinician's discernment and an insider's eye to the treatments, tools and products worth your attention." },
  { name: 'Dr Leanne Girgis', instagram: 'https://www.instagram.com/leannegirgis', role: 'Health Expert', image: '/images/collective/dr-leanne-girgis.png', bio: "Dr Leanne Girgis is a general practitioner and cosmetic physician with more than a decade of clinical experience, approaching beauty and wellbeing through a genuinely holistic lens. She is also the founder of Innour, an ingestible wellness brand born from her work alongside a plastic surgeon and a belief in the power of inside-out health. At Beauticate, Dr Leanne brings a thoughtful, real-world perspective shaped by medicine, motherhood and the experience of building a brand from the ground up." },
  { name: 'Kerrie Gentle', instagram: 'https://www.instagram.com/kerriegentlemakeupandbeauty', role: 'Beauty Expert', image: '/images/collective/kerrie-gentle.png', bio: "Kerrie Gentle is a Sydney-based makeup artist, beauty therapist and educator with more than three decades of industry experience. Her career spans film, television, editorial, bridal and red carpet, alongside her role as Senior Colour Specialist for MECCA and extensive work mentoring emerging artists. Known for her refined, skin-first approach to polished, modern makeup, she has a particular passion for enhancing the natural beauty of women over 40. Kerrie is also one half of Kerrie x Simone, the in-demand makeup workshops she co-hosts, bringing expert, hands-on education to women wanting to refine their skills." },
  { name: 'Simone Aspinall', instagram: 'https://www.instagram.com/simoneaspinallmakeup', role: 'Beauty Expert', image: '/images/collective/simone-aspinall.png', bio: "Simone Aspinall is a beauty therapist and makeup artist with more than 28 years of industry experience, known for her refined, natural approach to modern beauty. With a loyal clientele built across salon and freelance environments, she has earned a reputation for her expertise in brows, skin and effortless, event-ready makeup. Her philosophy is simple: enhance, never mask. Simone co-hosts Kerrie x Simone makeup workshops, known for their practical, confidence-building approach, making her a natural fit for Beauticate's expert-led tutorials and education." },
]

const team: Member[] = [
  { name: 'Jayde Balderston', role: 'Managing Editor, PR & Partnerships', image: '/images/collective/jayde-balderston.jpg', bio: "With more than 20 years in public relations, Jayde has shaped the story of some of Australia's most influential fashion, beauty and lifestyle brands. Known for her energetic, collaborative approach, she specialises in partnerships, brand storytelling and earned media. At Beauticate, she leads marketing, PR and brand partnerships, bringing campaigns, events and editorial initiatives to life with warmth and precision." },
  { name: 'Paris Obakpolo', instagram: 'https://www.instagram.com/nailsxpariso', role: 'Content Creator & Editor', image: '/images/team/paris-obakpolo.png', bio: "Paris has been creating since the moment she picked up a camera at 13. After graduating high school, she studied her Cert IV in Screen & Media and a Cert IV in Entrepreneurship & Small Business whilst also becoming 7x certified as a nail artist. Now she continues to pursue her passion in the creative and storytelling space through film work, videography, editing for her company Studio Blue Productions and nail artistry. She helps film and shoot Beauticate events and edits the Beautiful Inside podcast." },
  { name: 'Zoe Briggs', instagram: 'https://www.instagram.com/zoebriggsbeauty', role: 'Contributing Editor', image: '/images/team/zoe-briggs.png', bio: "Zoe Briggs came to beauty writing via law school, a stint as a paralegal and a detour as Real Weddings Editor for a US editorial blog, a journey that gave her both a researcher's rigour and a genuine appreciation for arriving somewhere good. At Beauticate, she channels a deep personal obsession with skincare into considered, knowledgeable writing that cuts through the noise, covering beauty with the thoroughness of someone who has tested, questioned and truly lived the products she recommends." },
  { name: 'Kristina Zhou', role: 'Beauty Writer', image: '/images/team/kristina-zhou.jpg', bio: "Kristina Zhou brings a media-trained eye and a researcher's instincts to everything she writes. With a background spanning broadcast and print media, including The Sydney Morning Herald, Channel 9 and The Daily Telegraph, she approaches beauty with the same precision she brings to everything else. At Beauticate, Kristina covers skincare, hair, global beauty practices and the latest in aesthetic treatments, translating complex topics into copy that is sharp, clear and genuinely useful." },
]

const faqs = [
  {
    question: 'Who founded Beauticate?',
    answer: 'Beauticate was founded in 2014 by Sigourney Cantelo, a Sydney-based beauty journalist and former Beauty & Health Director at Vogue Australia. Sigourney has more than 25 years of experience in the Australian beauty and media industries.',
  },
  {
    question: 'What is Beauticate?',
    answer: 'Beauticate is an Australian beauty, wellness and lifestyle editorial brand publishing expert-led content across skincare, haircare, wellness, travel, interviews and lifestyle. It reaches more than 3.1 million readers monthly and is one of the most-cited independent beauty publishers in Australia.',
  },
  {
    question: 'Is Beauticate an independent publication?',
    answer: 'Yes. Beauticate is independently owned and operated by its founder Sigourney Cantelo. Editorial decisions are made by the Beauticate team, not by advertisers or brand partners.',
  },
  {
    question: 'Where is Beauticate based?',
    answer: 'Beauticate is an Australian digital publisher based in Sydney. We publish content specifically for Australian readers, covering local stockists, Australian clinics and spas, travel within Australia, and the Australian wellness and beauty landscape.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
}

const PRESS_LOGOS = [
  { src: '/images/press/vogue.png', alt: 'Vogue' },
  { src: '/images/press/marie-claire.png', alt: 'marie claire' },
  { src: '/images/press/daily-telegraph.png', alt: 'The Daily Telegraph' },
  { src: '/images/press/daily-mail.png', alt: 'Daily Mail' },
  { src: '/images/press/mumbrella.png', alt: 'Mumbrella' },
  { src: '/images/press/beauty-directory.png', alt: 'Beauty Directory' },
]

export default function AboutPage() {
  return (
    <>
      <Script id="schema-person" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sigourneySchema) }} />
      <Script id="schema-faq-about" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="bg-white">

        {/* Founder letter: portrait left, letter right */}
        <section className="max-w-6xl mx-auto px-6 pt-14 pb-12 md:grid md:grid-cols-[minmax(0,440px)_1fr] md:gap-16 items-start">
          {/* Portrait + identity */}
          <div className="md:sticky md:top-24 mb-10 md:mb-0">
            <div className="relative w-full aspect-[2/3] bg-gray-100 overflow-hidden">
              <Image
                src="/images/sigourney-about.jpg"
                alt="Sigourney Cantelo, Founder and Editor-in-Chief of Beauticate"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 440px"
                priority
              />
            </div>
            <div className="mt-5">
              <p className="font-serif text-base text-charcoal">Sigourney Cantelo</p>
              <p className="font-sans text-[11px] tracking-widest uppercase text-charcoal/40 mt-0.5">Founder &amp; Editor-in-Chief</p>
              <a
                href="https://www.instagram.com/sigourney.cantelo/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[11px] tracking-widest uppercase text-wine hover:text-charcoal transition-colors mt-2 inline-block"
              >
                @sigourney.cantelo
              </a>
              <Link
                href="/sigourneys-edit"
                className="font-sans text-[11px] tracking-widest uppercase text-wine hover:text-charcoal transition-colors mt-2 block"
              >
                Explore Sigourney&apos;s Edit →
              </Link>
            </div>
          </div>

          {/* Letter */}
          <div>
            <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-muted mb-4">From the Founder</p>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal leading-tight mb-7">About Beauticate</h1>
            <div className="font-serif text-base text-charcoal/80 leading-relaxed space-y-4">
              <p>Beauticate began more than a decade ago, as a side project, while I was Beauty &amp; Health Director at Vogue Australia.</p>
              <p>After years of writing for magazines, I wanted to create something of my own. A space that honoured beauty properly. Not as something trivial, but as something powerful.</p>
              <p>The name came from two words: beauty + educate. But over time, it&apos;s become something deeper. To Beauticate is to live beautifully and well. To be curious, to question, to seek pleasure, purpose and presence in equal measure.</p>

              <blockquote className="my-8 border-l-2 border-wine/50 pl-6">
                <p className="font-serif italic text-2xl md:text-[28px] text-charcoal leading-snug">Real beauty has never been just about what you put on your skin.</p>
              </blockquote>

              <p>It&apos;s the bold lip that gets you through a hard morning. The fragrance that makes a stranger smile. The bath that finally lets you exhale. Small things that are actually enormous things.</p>
              <p>And it&apos;s so much more than that, too. It&apos;s how you nourish yourself, how you move through the world, how you design your home, where you travel to restore. How you heal. How you feel on the inside, because that shapes everything.</p>
              <p>So Beauticate grew with me. Into wellness and longevity, interiors and destinations, identity, reinvention, motherhood, burnout, perimenopause. Into every corner of a life lived as beautifully as possible.</p>
              <p>That philosophy led to <Link href="/vodcast" className="text-wine hover:text-charcoal transition-colors">Beautiful Inside</Link>, a video podcast filmed in the homes and spaces of people we admire, exploring healing, mental health and what lies beneath the lives we present to the world.</p>
              <p>And now to the <Link href="https://beauticate.shop" className="text-wine hover:text-charcoal transition-colors">Beauticate Shop</Link>, our curated edit of the products we actually use, love and recommend. It&apos;s in its testing/beta stage now and we&apos;d love you to be among the first to explore (and give us your feedback). No noise, no fillers. Just the things genuinely worth your time and money.</p>
              <p>This is a space for curious minds and wise souls. For seekers, quiet rebuilders and people who believe that how you live matters as much as how you look.</p>
              <p>Across all of it, the intention is exactly the same as day one. To help you look, live and feel your best, with honesty, expertise and a little joy thrown in.</p>
              <p>Thank you for being here. It means more than you know.</p>
              <p className="font-serif italic text-charcoal">Sigourney x</p>
            </div>
          </div>
        </section>

        {/* Full-width bio panel */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-gray-100 border-t-2 border-wine/30 rounded-lg p-7 md:p-10 space-y-4">
            <p className="font-serif text-sm md:text-base text-charcoal/75 leading-relaxed">
              <strong className="font-semibold">Sigourney Cantelo</strong> is the founder and publisher of Beauticate. With over 25 years across print, digital and broadcast, including her tenure as Beauty &amp; Health Director at Vogue Australia and regular appearances on Sunrise and the Today show as a beauty and style commentator, she is one of Australia&apos;s most recognised voices in beauty, health and wellness media. Her work has appeared in Body + Soul, marie claire, Sunday Life and numerous Australian and international publications. She is a six-time Star Beauty Award winner and a five-time Jasmine Award recipient, including twice winning the Jasmine Award for Journalistic Excellence.
            </p>
            <p className="font-serif text-sm md:text-base text-charcoal/75 leading-relaxed">
              She founded Beauticate in 2014 as an independent editorial platform, with the depth and rigour of a major masthead and the freedom of something entirely her own. Today it reaches 3.1 million monthly touchpoints across editorial, podcast, newsletter, Instagram and e-commerce.
            </p>
            <p>
              <Link href="/archive" className="font-sans text-[11px] tracking-[0.16em] uppercase text-wine hover:text-charcoal transition-colors inline-block">Read Sigourney&apos;s magazine work →</Link>
            </p>
          </div>
        </section>

        {/* Press band */}
        <section className="bg-white border-t border-b border-gray-100 py-10">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-charcoal/40 mb-7">As seen in</p>
            <Link href="/press" className="group block">
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
                {PRESS_LOGOS.map(logo => (
                  <div key={logo.src} className="relative h-7 w-[120px] grayscale opacity-45 group-hover:opacity-70 transition-opacity">
                    <Image src={logo.src} alt={logo.alt} fill className="object-contain" sizes="120px" />
                  </div>
                ))}
              </div>
            </Link>
          </div>
        </section>

        {/* Our Story timeline */}
        <StoryTimeline />

        {/* Our Editors & Experts */}
        <section className="bg-gray-50 border-t border-b border-gray-100 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted mb-3 text-center">The Collective</p>
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-4 text-center">Our editors &amp; experts</h2>
            <p className="font-serif text-base text-charcoal/70 leading-relaxed max-w-3xl mx-auto text-center mb-12">
              The Beauticate Collective is a curated group of editors and experts who shape the voice, perspective and vision of this platform. From beauty editors and cosmetic physicians to wellness coaches, nutritionists and interior designers, together they cover every pillar of a beautifully lived life.
            </p>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
              {editors.map(p => (
                <div key={p.name}>
                  <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden mb-4">
                    <Image src={p.image} alt={p.name} fill className="object-cover object-top" sizes="(max-width: 640px) 100vw, 360px" />
                  </div>
                  <h3 className="font-serif text-lg text-charcoal">{p.instagram ? <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-wine transition-colors">{p.name}</a> : p.name}</h3>
                  <p className="font-sans text-[11px] tracking-widest uppercase text-muted mt-0.5 mb-2">{p.role}</p>
                  <p className="font-serif text-sm text-charcoal/70 leading-relaxed">{p.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Team */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-12 text-center">The team</h2>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
            {team.map(p => (
              <div key={p.name}>
                <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden mb-4">
                  <Image src={p.image} alt={p.name} fill className="object-cover object-top" sizes="(max-width: 640px) 100vw, 360px" />
                </div>
                <h3 className="font-serif text-lg text-charcoal">{p.instagram ? <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-wine transition-colors">{p.name}</a> : p.name}</h3>
                <p className="font-sans text-[11px] tracking-widest uppercase text-muted mt-0.5 mb-2">{p.role}</p>
                <p className="font-serif text-sm text-charcoal/70 leading-relaxed">{p.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ: visible on page for AI extractability (Doug: "not hidden in code") */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="font-serif text-2xl text-charcoal mb-8">Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map(f => (
              <div key={f.question} className="border-b border-gray-100 pb-6">
                <h3 className="font-serif text-base text-charcoal mb-2">{f.question}</h3>
                <p className="font-serif text-sm text-charcoal/70 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact / work with us */}
        <section className="bg-charcoal py-16 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-serif text-2xl text-cream mb-4">Work with Beauticate</h2>
            <p className="font-serif text-sm text-cream/70 leading-relaxed mb-8">
              We partner with beauty, wellness and lifestyle brands whose values align with ours. For editorial partnerships, advertising enquiries, events or press, contact us below.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/advertise-with-us"
                className="font-sans text-[11px] tracking-[0.2em] uppercase border border-cream/30 text-cream px-8 py-3 hover:bg-cream hover:text-charcoal transition-colors"
              >
                Advertise with us
              </Link>
              <a
                href="mailto:sigourney@beauticate.com"
                className="font-sans text-[11px] tracking-[0.2em] uppercase border border-cream/30 text-cream px-8 py-3 hover:bg-cream hover:text-charcoal transition-colors"
              >
                Contact Sigourney
              </a>
            </div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-cream/30 mt-8">
              Cantelo Corporation Pty Ltd · ABN 71 105 175 317
            </p>
          </div>
        </section>

      </main>
    </>
  )
}
