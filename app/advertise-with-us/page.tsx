import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advertise with Beauticate | Brand Partnerships',
  description: 'Partner with Beauticate — Australia\'s most-trusted independent beauty publisher. Editorial partnerships, sponsored content, events and campaigns.',
}

const FORMATS = [
  {
    title: 'Sponsored editorial',
    description: 'Long-form content written in Beauticate\'s editorial voice, published on the site and promoted across our channels. Full editorial treatment — no banner ads, no bolt-ons.',
  },
  {
    title: 'Product features',
    description: 'Dedicated product coverage within relevant editorial contexts — skincare, wellness, fragrance and more. Honest, expert-led, with genuine reader engagement.',
  },
  {
    title: 'Newsletter',
    description: 'Reach our engaged subscriber base with a dedicated feature or placement in our weekly edit. High open rates, highly targeted readership.',
  },
  {
    title: 'Social & vodcast',
    description: 'Partnerships across Instagram, TikTok and the Beauticate Vodcast — authentic integrations, not scripted testimonials.',
  },
  {
    title: 'Events',
    description: 'Curated brand events, product launches and experiences produced in partnership with Beauticate — with editorial coverage across all platforms.',
  },
  {
    title: 'Shop curation',
    description: 'Consideration for inclusion in Beauticate Shop — the curated beauty and wellness edit at beauticate.shop. Selection is editorial only; curation is not for sale.',
  },
]

const STATS = [
  { value: '3.1M+', label: 'Monthly readers' },
  { value: '11', label: 'Years in market' },
  { value: '67%', label: 'AU beauty AI share of voice' },
  { value: '2,082', label: 'Referring domains' },
]

export default function AdvertisePage() {
  return (
    <div className="bg-paper">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="label-editorial mb-4">Work with us</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-6">
          Advertise with Beauticate
        </h1>
        <p className="font-serif text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
          Eleven years of earned trust with Australia&apos;s most engaged beauty, wellness and
          lifestyle audience. We only partner with brands whose values align with ours.
        </p>
      </section>

      {/* Stats */}
      <section className="border-t border-b border-camel/30 py-10 bg-parchment">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="font-serif text-3xl text-ink mb-1">{s.value}</div>
              <div className="font-sans text-[11px] tracking-widest uppercase text-charcoal/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership formats */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-serif text-2xl text-ink mb-10">Partnership formats</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {FORMATS.map(f => (
            <div key={f.title} className="border-l-2 border-camel/50 pl-6">
              <h3 className="font-serif text-lg text-ink mb-2">{f.title}</h3>
              <p className="font-serif text-sm text-charcoal/70 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial policy */}
      <section className="bg-parchment py-14">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl text-ink mb-5">Our editorial policy</h2>
          <p className="font-serif text-base text-charcoal/70 leading-relaxed max-w-2xl">
            Advertising never dictates editorial content. Sponsored partnerships are always
            clearly labelled. Beauticate does not publish positive coverage in exchange for
            payment — commercial arrangements do not influence what we recommend, test or
            feature in our independent editorial.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-2xl text-paper mb-4">Start the conversation</h2>
          <p className="font-serif text-sm text-paper/70 leading-relaxed mb-8">
            Tell us about your brand and what you&apos;re hoping to achieve. We&apos;ll respond within 2
            business days.
          </p>
          <a
            href="mailto:sigourney@beauticate.com?subject=Partnership%20enquiry"
            className="btn-primary"
          >
            Email Sigourney
          </a>
          <p className="font-sans text-[10px] tracking-widest uppercase text-paper/30 mt-8">
            Cantelo Corporation Pty Ltd · ABN 71 105 175 317
          </p>
        </div>
      </section>

    </div>
  )
}
