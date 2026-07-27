import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import NewsletterForm from '@/components/shared/NewsletterForm'

export const metadata: Metadata = {
  title: 'Partner with Beauticate Shop',
  description:
    'A curated, editorially-led home for the brands we love. We tell your story, we drive the demand, you fulfil. Register your interest to partner with Beauticate Shop.',
}

const POINTS = [
  {
    title: 'Editorial first.',
    body: 'You’re featured in stories, social, podcast and email. Not just listed.',
  },
  {
    title: 'You stay in control.',
    body: 'You hold your stock, shipping and pricing. We drive demand, you fulfil.',
  },
  {
    title: 'No upfront cost.',
    body: 'It’s a commission model, so we only earn when you sell.',
  },
  {
    title: 'Curated, not crowded.',
    body: 'A considered edit of brands we genuinely rate.',
  },
]

export default function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-ink"
        style={{
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          height: 'clamp(320px,40vw,420px)',
        }}
      >
        <Image
          src="/images/shop/category-beauty.jpg"
          alt=""
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1
            className="font-serif text-white text-center"
            style={{ fontSize: 'clamp(32px,5vw,56px)', lineHeight: 1.1 }}
          >
            Be part of the Shop.
          </h1>
        </div>
      </section>

      <div className="max-w-content mx-auto px-6 py-14 md:py-20">
        {/* Invitation */}
        <p
          className="mx-auto max-w-[62ch] text-center font-serif text-ink"
          style={{ fontSize: 'clamp(18px,2vw,24px)', lineHeight: 1.55 }}
        >
          A curated, editorially-led home for the brands we love. We tell your story, we
          drive the demand, you fulfil. If that sounds like your kind of partnership, leave
          your email and we&rsquo;ll send you everything.
        </p>

        {/* Email capture — primary action */}
        <div className="mt-10 flex flex-col items-center">
          <NewsletterForm
            variant="light"
            source="partner_interest"
            endpoint="/api/partners/register"
            buttonLabel="Register your interest"
            successMessage="Thank you. We’ll be in touch with everything you need to know."
          />
          <p
            className="mt-4 max-w-[46ch] text-center font-serif italic text-charcoal-light"
            style={{ fontSize: 'clamp(13px,1.3vw,15px)', lineHeight: 1.5, opacity: 0.75 }}
          >
            Pop your email in and we&rsquo;ll send you the details.
          </p>
        </div>

        {/* Key points */}
        <div className="mx-auto mt-16 grid max-w-[760px] gap-x-12 gap-y-9 sm:grid-cols-2">
          {POINTS.map(point => (
            <div key={point.title}>
              <h2
                className="font-serif text-wine"
                style={{ fontSize: 'clamp(17px,1.7vw,21px)' }}
              >
                {point.title}
              </h2>
              <p
                className="mt-1.5 font-serif text-charcoal-light"
                style={{ fontSize: 'clamp(14px,1.4vw,16px)', lineHeight: 1.6 }}
              >
                {point.body}
              </p>
            </div>
          ))}
        </div>

        {/* Apply CTA */}
        <p className="mt-16 text-center">
          <Link
            href="/shop/partners/apply"
            className="font-serif text-wine hover:text-wine/70 transition-colors"
            style={{ fontSize: 'clamp(15px,1.4vw,17px)' }}
          >
            Think your brand belongs here? Tell us about it.
          </Link>
        </p>
      </div>
    </>
  )
}
