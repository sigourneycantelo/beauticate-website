import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Policy | Beauticate Shop',
  description: 'Shipping information for Beauticate Shop — how brands ship direct to you across Australia.',
}

export default function ShippingPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-14 md:py-20">

      <header className="mb-10 border-b border-camel/30 pb-8">
        <p className="label-editorial mb-2">Beauticate Shop</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">Shipping Policy</h1>
        <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mt-3">
          Last updated: July 2026
        </p>
      </header>

      <div className="font-serif text-charcoal/80 leading-relaxed space-y-8">

        <p>
          At Beauticate, we partner with a curated edit of brands who fulfil and post their
          products to you direct. Each brand ships its own items from its own warehouse, so your
          order comes straight from the source. It also means shipping is managed by each brand,
          and shipping costs vary from brand to brand.
        </p>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Where we ship</h2>
          <p>
            We ship right across Australia. We are not shipping internationally just yet, though
            we hope to in the future.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Shipping costs</h2>
          <p>
            Because each brand ships from its own warehouse, each brand sets its own shipping rate.
            Your shipping is calculated at checkout, so you always see the cost before you pay.
            Some of our brands offer free shipping, and you can find them here:{' '}
            <Link href="/shop/free-shipping" className="text-ink hover:text-eucalypt transition-colors">
              our free-shipping brands
            </Link>.
            For every other brand, a set shipping rate applies per brand. That rate does not change
            based on where you are in Australia, so a city order and a regional order pay the same
            for that brand. A small number of larger or bulky items ship on their own terms, which
            are shown on the product page.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Orders from more than one brand</h2>
          <p>
            Because each brand ships its own products, an order with items from several brands is
            sent as separate parcels, each with its own tracking, and they may arrive on different
            days. Where more than one brand charges for shipping, your total may include a shipping
            charge for each of those brands, with any free-shipping items sitting alongside them.
            Nothing has gone wrong if one parcel arrives before another.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Dispatch and delivery times</h2>
          <p>
            Most orders are dispatched within 1 to 2 business days. Once posted, most parcels
            arrive within 2 to 5 business days, depending on the brand and where you are. You will
            receive tracking as soon as your order is on its way.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Delays</h2>
          <p>
            Now and then a delivery runs late for reasons outside our control, like weather,
            courier delays or peak periods. The brand shipping your order will keep you updated.
            If something has not arrived when it should, email us at{' '}
            <a href="mailto:hello@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              hello@beauticate.com
            </a>{' '}
            and we will follow it up.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Questions</h2>
          <p>
            Email us any time at{' '}
            <a href="mailto:hello@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              hello@beauticate.com
            </a>.
          </p>
        </section>

        <p className="text-xs text-charcoal/40 font-sans pt-6 border-t border-camel/20">
          Cantelo Corporation Pty Ltd · ABN 71 105 175 317
        </p>
      </div>
    </div>
  )
}
