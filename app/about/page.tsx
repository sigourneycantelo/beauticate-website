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

const stats = [
  { value: '3.1M+', label: 'Monthly readers' },
  { value: '11', label: 'Years publishing' },
  { value: '2,082', label: 'Referring domains' },
  { value: '67%', label: 'AU beauty AI share of voice' },
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

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-4">About</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight mb-6">
            Beauty, wellness and lifestyle —<br className="hidden md:block" /> trusted for eleven years
          </h1>
          <p className="font-serif text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
            Beauticate is Australia&apos;s most-cited independent beauty publisher, founded in 2014 by journalist and former Vogue Australia Beauty &amp; Health Director Sigourney Cantelo. We reach more than 3.1 million readers every month.
          </p>
        </section>

        {/* Stats */}
        <section className="border-t border-b border-gray-100 py-10">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="font-serif text-3xl text-charcoal mb-1">{s.value}</div>
                <div className="font-sans text-[11px] tracking-widest uppercase text-charcoal/40">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Founder section */}
        <section className="max-w-4xl mx-auto px-6 py-16 md:flex gap-14 items-start">
          <div className="md:w-64 flex-shrink-0 mb-8 md:mb-0">
            <div className="relative w-full aspect-[3/2] bg-cream rounded-lg overflow-hidden">
              <Image
                src="/images/sigourney-cantelo.jpg"
                alt="Sigourney Cantelo, Founder and Editor-in-Chief of Beauticate"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 256px"
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
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-serif text-2xl text-charcoal mb-5">Our story</h2>
            <div className="font-serif text-base text-charcoal/80 leading-relaxed space-y-4">
              <p>
                Beauticate launched in 2014 with a simple idea: that beauty content should be honest, expert and actually useful. Sigourney Cantelo had spent more than a decade as Beauty &amp; Health Director at Vogue Australia, and before that at magazines across the industry. She had seen firsthand which information readers could trust — and how much of what was published they couldn&apos;t.
              </p>
              <p>
                Eleven years later, Beauticate has grown into one of Australia&apos;s most-trusted independent beauty publishers — with a reach of more than 3.1 million readers monthly, 2,082 referring domains, and a 67% share of voice in Australian beauty content across AI engines. It has won multiple industry awards and been cited in Vogue, Harper&apos;s BAZAAR and major Australian media.
              </p>
              <p>
                We cover beauty, skincare, wellness, hair, destinations, living and interviews — always through the lens of real expertise. Our writers and contributors include working makeup artists, dermatologists, nutritionists and industry insiders. We test products ourselves, visit the clinics we recommend, and only publish what we would genuinely stand behind.
              </p>
              <p>
                In 2025 Beauticate launched <Link href="https://beauticate.shop" className="text-gold hover:text-charcoal transition-colors">Beauticate Shop</Link> — a curated beauty and wellness edit built on the same editorial philosophy: fewer, better things, chosen by editors not algorithms.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-3">Credentials</h3>
              <ul className="font-serif text-sm text-charcoal/70 space-y-2">
                <li>— Former Beauty &amp; Health Director, Vogue Australia</li>
                <li>— 25+ years in Australian beauty and media</li>
                <li>— Founder, Beauticate (est. 2014)</li>
                <li>— 3.1M monthly readers across editorial and social</li>
                <li>— #1 independent beauty publisher, Australian AI search (67% share of voice)</li>
              </ul>
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
