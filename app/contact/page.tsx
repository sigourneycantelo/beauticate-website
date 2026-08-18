import type { Metadata } from 'next'
import AskSigCTA from './AskSigCTA'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Beauticate — general enquiries, advertising, brand partnerships, PR, events and marketing.',
}

const CONTACT_TYPES = [
  {
    heading: 'General',
    email: 'hello@beauticate.com',
  },
  {
    heading: 'Advertising & Brand Partnerships',
    email: 'sales@beauticate.com',
  },
  {
    heading: 'PR, Events & Marketing',
    email: 'jayde@beauticate.com',
  },
]

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-14 md:py-20">

      <header className="mb-12 text-center max-w-xl mx-auto">
        <p className="label-editorial mb-3">Get in touch</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-5">Contact Beauticate</h1>
        <p className="font-serif text-base text-charcoal/60 leading-relaxed">
          We are a small, independent team. We read every message and aim to reply within
          1&ndash;2 business days.
        </p>
      </header>

      {/* Ask Sig CTA */}
      <div className="flex flex-col items-center mb-14">
        <AskSigCTA />
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-camel/20 mb-14">
        {CONTACT_TYPES.map(c => (
          <div key={c.heading} className="bg-paper px-8 py-8 hover:bg-parchment transition-colors">
            <h2 className="font-sans text-[11px] tracking-[0.2em] uppercase text-ink mb-3">{c.heading}</h2>
            <a
              href={`mailto:${c.email}`}
              className="font-sans text-[11px] tracking-[0.15em] uppercase text-ink hover:text-eucalypt transition-colors underline underline-offset-4"
            >
              {c.email}
            </a>
          </div>
        ))}
      </div>

      {/* Social */}
      <div className="text-center border-t border-camel/30 pt-12">
        <p className="label-editorial mb-6">Or find us here</p>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: 'Instagram', href: 'https://www.instagram.com/beauticate/' },
            { label: 'TikTok', href: 'https://www.tiktok.com/@beauticate' },
            { label: 'Pinterest', href: 'https://www.pinterest.com.au/beauticate/' },
            { label: 'YouTube', href: 'https://www.youtube.com/sigourneycantelo' },
          ].map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/50 hover:text-ink transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
        <p className="font-sans text-[10px] tracking-widest uppercase text-charcoal/30 mt-10">
          Cantelo Corporation Pty Ltd · ABN 71 105 175 317 · Sydney, Australia
        </p>
      </div>

    </div>
  )
}
