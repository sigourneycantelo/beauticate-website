import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Exclusive Offers | Beauticate',
  description: 'Exclusive offers and subscriber benefits from Beauticate — beauty, wellness and lifestyle deals curated by our editors.',
}

export default function OffersPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-14 md:py-20">

      <header className="mb-12 text-center">
        <p className="label-editorial mb-3">For our community</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-5">Exclusive Offers</h1>
        <p className="font-serif text-base text-charcoal/60 leading-relaxed max-w-lg mx-auto">
          Curated beauty, wellness and lifestyle offers available exclusively for the Beauticate
          community. New offers added regularly.
        </p>
      </header>

      {/* Coming soon state — replace with actual offers when live */}
      <div className="bg-parchment border border-camel/30 px-8 py-16 text-center max-w-lg mx-auto">
        <p className="label-editorial mb-4">Coming soon</p>
        <h2 className="font-serif text-2xl text-ink mb-4">More to come</h2>
        <p className="font-serif text-base text-charcoal/60 leading-relaxed mb-8">
          Subscribe to the Beauticate newsletter to be the first to hear about exclusive offers,
          early access and curated deals from the brands we love.
        </p>
        <a
          href="https://beauticate.com/subscribe"
          className="btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Subscribe to the newsletter
        </a>
      </div>

      <div className="mt-14 text-center">
        <p className="font-serif text-sm text-charcoal/50 leading-relaxed max-w-md mx-auto">
          Already a subscriber?{' '}
          <Link href="/shop" className="text-ink hover:text-eucalypt transition-colors underline underline-offset-2">
            Explore the Beauticate Shop
          </Link>{' '}
          for our full curated edit.
        </p>
      </div>

    </div>
  )
}
