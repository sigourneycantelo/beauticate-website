import type { Metadata } from 'next'
import ReviewSubmissionForm from '@/components/reviews/ReviewSubmissionForm'

const SITE = 'https://www.beauticate.com'

export const metadata: Metadata = {
  title: 'How We Review',
  description: "How Beauticate selects, tests and reviews beauty, wellness and lifestyle products — and how brands can submit theirs for consideration.",
  alternates: { canonical: `${SITE}/how-we-review` },
}

const FAQS = [
  {
    q: 'What products does Beauticate accept for review?',
    a: 'New product submissions and press releases from beauty, wellness and lifestyle brands and their PR agencies. Beauticate is looking for products that are genuinely new, well-made, or solving a problem readers keep raising — not every submission is accepted.',
  },
  {
    q: 'How does Beauticate test products before reviewing them?',
    a: "Nothing is written up cold. Products go through Beauticate's editorial team and, where relevant, Sigourney's Collective of contributing experts before a word is written. A submission might end up in a single review, a roundup, or a bigger trend story, depending on what's happening in that category.",
  },
  {
    q: 'What are Beauticate Trial Teams?',
    a: "Trial Teams are panels of real Beauticate readers, not staff, who use a brand's product in their own homes over a real testing period and report back honestly. It's offered to brands wanting more than a single editor's opinion.",
  },
  {
    q: 'Does Beauticate accept payment for positive reviews?',
    a: "No. Beauticate accepts product for consideration but does not accept payment for a positive review, and discloses clearly when a placement is sponsored. If a product doesn't work, the review says so.",
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function HowWeReviewPage() {
  return (
    <div className="bg-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Heading */}
      <section className="bg-parchment py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-charcoal/40 mb-5">Work with us</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-6">
            How We Review
          </h1>
          <p className="font-serif text-lg text-charcoal/70 leading-relaxed max-w-xl mx-auto italic">
            Boxes arrive at Beauticate HQ most days. Skincare, hair tools, supplements, the occasional
            gadget nobody asked for. Some get five minutes on my desk before I know. Some get properly
            tested, worn, argued about with the team, and written up. Here&rsquo;s how we decide which is
            which, and how to get yours considered.
          </p>
        </div>
      </section>

      {/* The process */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <div>
          <h2 className="font-serif text-2xl text-ink mb-3">What we accept</h2>
          <p className="font-serif text-base text-charcoal/75 leading-relaxed">
            We take new product submissions and press releases from beauty, wellness and lifestyle
            brands, PR agencies included. Send us what you&rsquo;ve got. If it&rsquo;s genuinely new,
            well-made, or solving a problem we keep hearing about from readers, we want to see it.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-ink mb-3">How we test</h2>
          <p className="font-serif text-base text-charcoal/75 leading-relaxed">
            Nothing gets written up cold. Products go through our editorial team and, where relevant,
            through Sigourney&rsquo;s Collective of contributing experts before a word is written.
            We&rsquo;re watching for trends and ingredients as we go, not just reviewing in isolation,
            so a submission might end up in a single review, a roundup, or a bigger trend story about
            where the category&rsquo;s heading.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-ink mb-3">Trial Teams</h2>
          <p className="font-serif text-base text-charcoal/75 leading-relaxed">
            For brands wanting more than an editor&rsquo;s opinion, we run Trial Teams: real Beauticate
            readers, not staff, using your product in their own homes over real time and reporting back
            honestly. It&rsquo;s the same rigour Byrdie and GLOW publish a methodology for, we&rsquo;ve
            just never written ours down until now.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-ink mb-3">Where to send it</h2>
          <p className="font-serif text-base text-charcoal/75 leading-relaxed">
            {/* TODO: replace with the real PO Box once Sig confirms it */}
            [PO Box address to be confirmed] &mdash; please include a note with your brand name, contact
            details and what you&rsquo;d like us to know about the product.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-ink mb-3">How our reviews work</h2>
          <p className="font-serif text-base text-charcoal/75 leading-relaxed">
            We accept product for consideration. We don&rsquo;t accept payment for a positive review,
            and we say so when a placement is sponsored. If something doesn&rsquo;t work, we&rsquo;ll
            say that too.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-parchment py-16">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-serif text-2xl text-ink mb-8 text-center">Submit a Product</h2>
          <ReviewSubmissionForm />
        </div>
      </section>
    </div>
  )
}
