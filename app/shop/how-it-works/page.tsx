import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Beauticate Shop Works | Beauticate',
  description: 'How the Beauticate Shop works — curated by editors, shipped direct from the brand, supporting independent journalism.',
}

export default function HowItWorksPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-14 md:py-20">

      <header className="mb-10 border-b border-camel/30 pb-8">
        <p className="label-editorial mb-2">Beauticate Shop</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">How Beauticate Shop Works</h1>
      </header>

      <div className="font-serif text-charcoal/80 leading-relaxed space-y-8">

        <p>
          Welcome to the Beauticate Shop. Here is how it works, and what makes it different.
        </p>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Chosen, not listed</h2>
          <p>
            This isn&apos;t a marketplace. The Beauticate Shop is curated by Sigourney Cantelo and
            the Beauticate Collective, a standing group of 14 editors and experts across beauty,
            wellness, style, interiors and health. If a product is here, it is because someone on
            the team uses it, has tested it properly, or has the credentials to know exactly why it
            deserves your attention. Nothing is here by accident.
          </p>
          <p className="mt-4">
            More than 20 brands joined Beauticate before the shop even opened, on the strength of
            the platform alone. They came for the audience, the editorial standards and a shared
            belief that the best products deserve more than a paid ad. They deserve a story.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Two ways to shop</h2>
          <p>
            Some products you can buy right here, shipped straight from the brand. Others link you
            through to the retailer to buy, where something we love is sold elsewhere. Either way,
            we may earn a small commission, and it never changes the price you pay. A share of what
            we earn goes back into Beauticate, which supports the independent journalism you come
            to us for.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Straight from the brand</h2>
          <p>
            When you buy through our shop, your order ships directly from the brand that makes it.
            This keeps products fresh, supports the brands we champion and means you are buying
            from the source. Most orders are dispatched within a business day or two. Because each
            brand ships from its own warehouse, shipping is set per brand and shown clearly at
            checkout, and some of our brands offer{' '}
            <Link href="/shop/free-shipping" className="text-ink hover:text-eucalypt transition-colors">
              free shipping
            </Link>.
            An order with items from more than one brand may arrive in separate parcels, each with
            its own tracking, and on different days. You will find the full detail on our{' '}
            <Link href="/shop/shipping" className="text-ink hover:text-eucalypt transition-colors">
              Shipping page
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Returns</h2>
          <p>
            If something is not right, returns are handled by the brand that shipped your item,
            following that brand&apos;s own policy and your rights under the Australian Consumer
            Law. You contact the brand to send the item back, then email us at{' '}
            <a href="mailto:hello@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              hello@beauticate.com
            </a>{' '}
            so we can assist. The steps are set out on our{' '}
            <Link href="/shop/refund-policy" className="text-ink hover:text-eucalypt transition-colors">
              Returns page
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Suggest a brand</h2>
          <p>
            Know a brand we would love?{' '}
            <Link href="/shop/suggest" className="text-ink hover:text-eucalypt transition-colors">
              Tell us here
            </Link>.
            And if you are a brand who shares how we think, you can{' '}
            <Link href="/shop/partners" className="text-ink hover:text-eucalypt transition-colors">
              apply to join the shop
            </Link>.
          </p>
        </section>

        <p className="text-xs text-charcoal/40 font-sans pt-6 border-t border-camel/20">
          Cantelo Corporation Pty Ltd · ABN 71 105 175 317
        </p>
      </div>
    </div>
  )
}
