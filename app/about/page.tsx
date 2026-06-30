import type { Metadata } from 'next'
import Script from 'next/script'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Beauticate | Sigourney Cantelo, Founder & Editor-in-Chief',
  description: 'Beauticate is Australia\'s most trusted beauty, wellness and lifestyle editorial brand. Founded in 2014 by Sigourney Cantelo — former Vogue Australia Beauty & Health Director — and trusted by 3.1 million readers monthly.',
  alternates: { canonical: 'https://www.beauticate.com/about-beauticate' },
  openGraph: {
    title: 'About Beauticate | Founded by Sigourney Cantelo',
    description: 'Eleven years of trusted beauty, wellness and lifestyle editorial. Meet the founder, the team, and the story behind Australia\'s most-cited beauty brand.',
    url: 'https://www.beauticate.com/about-beauticate',
    type: 'website',
  },
}

// Person schema for Sigourney — Doug's report: "gold-standard E-E-A-T signals"
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

const collectivePeople = [
  {
    name: 'Sigourney Cantelo',
    role: 'Founder & Editor-in-Chief',
    credential: 'Former Vogue Australia Beauty & Health Director · 25 years in beauty journalism',
    image: '/images/team/sigourney.jpg',
    instagram: 'https://www.instagram.com/sigourney.cantelo/',
  },
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
    answer: 'Beauticate is an Australian digital publisher based in Sydney. We publish content specifically for Australian readers — covering local stockists, Australian clinics and spas, travel within Australia, and the Australian wellness and beauty landscape.',
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

export default function AboutPage() {
  return (
    <>
      <Script id="schema-person" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sigourneySchema) }} />
      <Script id="schema-faq-about" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="bg-white">

        {/* Founder — image left, story right */}
        <section className="max-w-6xl mx-auto px-6 pt-14 pb-16 md:grid md:grid-cols-[minmax(0,440px)_1fr] md:gap-16 items-start">
          {/* Photo */}
          <div className="md:sticky md:top-24 mb-10 md:mb-0">
            <div className="relative w-full aspect-[2/3] bg-cream rounded-lg overflow-hidden">
              <Image
                src="/images/sigourney-about.jpg"
                alt="Sigourney Cantelo, Founder and Editor-in-Chief of Beauticate"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 440px"
                priority
              />
            </div>
            <div className="mt-4">
              <p className="font-serif text-base text-charcoal">Sigourney Cantelo</p>
              <p className="font-sans text-[11px] tracking-widest uppercase text-charcoal/40 mt-0.5">Founder &amp; Editor-in-Chief</p>
              <a
                href="https://www.instagram.com/sigourney.cantelo/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[11px] tracking-widest uppercase text-gold hover:text-charcoal transition-colors mt-2 inline-block"
              >
                @sigourney.cantelo
              </a>
              <Link
                href="/sigourneys-edit"
                className="font-sans text-[11px] tracking-widest uppercase text-charcoal/60 hover:text-charcoal transition-colors mt-2 block"
              >
                Read Sigourney&apos;s Edit →
              </Link>
            </div>
          </div>

          {/* Story */}
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-3">About</p>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal leading-tight mb-7">About Beauticate</h1>
            <div className="font-serif text-base text-charcoal/80 leading-relaxed space-y-4">
              <p>Beauticate began more than a decade ago, as a side project, while I was Beauty &amp; Health Director at Vogue Australia.</p>
              <p>After years of writing for magazines, I wanted to create something of my own. A space that honoured beauty properly. Not as something trivial, but as something powerful.</p>
              <p>The name came from two words: beauty + educate. But over time, it&apos;s become something deeper. To Beauticate is to live beautifully and well. To be curious, to question, to seek pleasure, purpose and presence in equal measure.</p>
              <p>Because real beauty has never been just about what you put on your skin. It&apos;s the bold lip that gets you through a hard morning. The fragrance that makes a stranger smile. The bath that finally lets you exhale. Small things that are actually enormous things.</p>
              <p>And it&apos;s so much more than that, too. It&apos;s how you nourish yourself, how you move through the world, how you design your home, where you travel to restore. How you heal. How you feel on the inside, because that shapes everything.</p>
              <p>So Beauticate grew with me. Into wellness and longevity, interiors and destinations, identity, reinvention, motherhood, burnout, perimenopause. Into every corner of a life lived as beautifully as possible.</p>
              <p>That philosophy led to <Link href="/vodcast" className="text-gold hover:text-charcoal transition-colors">Beautiful Inside</Link>, a video podcast filmed in the homes and spaces of people we admire, exploring healing, mental health and what lies beneath the lives we present to the world.</p>
              <p>And now to the <Link href="https://beauticate.shop" className="text-gold hover:text-charcoal transition-colors">Beauticate Shop</Link>, our curated edit of the products we actually use, love and recommend. It&apos;s in its testing/beta stage now and we&apos;d love you to be among the first to explore (and give us your feedback). No noise, no fillers. Just the things genuinely worth your time and money.</p>
              <p>This is a space for curious minds and wise souls. For seekers, quiet rebuilders and people who believe that how you live matters as much as how you look.</p>
              <p>Across all of it, the intention is exactly the same as day one. To help you look, live and feel your best, with honesty, expertise and a little joy thrown in.</p>
              <p>Thank you for being here. It means more than you know.</p>
              <p className="font-serif italic text-charcoal">Sigourney x</p>
            </div>

            {/* Founder bio box */}
            <div className="mt-10 bg-[#f7f5f2] border border-gray-100 rounded-lg p-6 md:p-8 space-y-4">
              <p className="font-serif text-sm text-charcoal/75 leading-relaxed">
                <strong className="font-semibold">Sigourney Cantelo</strong> is the founder and publisher of Beauticate. With over 25 years across print, digital and broadcast — including her tenure as Beauty &amp; Health Director at Vogue Australia and regular appearances on Sunrise and the Today show as a beauty and style commentator — she is one of Australia&apos;s most recognised voices in beauty, health and wellness media. Her work has appeared in Body + Soul, marie claire, Sunday Life and numerous Australian and international publications. She is a six-time Star Beauty Award winner and a five-time Jasmine Award recipient, including twice winning the Jasmine Award for Journalistic Excellence.
              </p>
              <p className="font-serif text-sm text-charcoal/75 leading-relaxed">
                She founded Beauticate in 2014 as an independent editorial platform: the depth and rigour of a major masthead, with the freedom of something entirely her own. Today it reaches 3.1 million monthly touchpoints across editorial, podcast, newsletter, Instagram and e-commerce.
              </p>
            </div>
          </div>
        </section>

        {/* What we stand for */}
        <section className="bg-[#f7f5f2] py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-serif text-2xl text-charcoal mb-10 text-center">What we stand for</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  heading: 'Editorial independence',
                  body: 'Advertising never dictates editorial. What we recommend is what we would personally use, visit or buy — full stop.',
                },
                {
                  heading: 'Real expertise',
                  body: 'Our content is written and vetted by working professionals — dermatologists, makeup artists, nutritionists, hair scientists and journalists with decades of experience.',
                },
                {
                  heading: 'Australian perspective',
                  body: 'We write for Australian readers. That means Australian stockists, Australian clinics, Australian climate conditions, and an Australian sensibility about beauty.',
                },
              ].map(v => (
                <div key={v.heading}>
                  <h3 className="font-serif text-lg text-charcoal mb-2">{v.heading}</h3>
                  <p className="font-serif text-sm text-charcoal/70 leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — visible on page for AI extractability (Doug: "not hidden in code") */}
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
