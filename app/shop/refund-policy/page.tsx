import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Refunds | Shop',
  description: 'Returns and refund policy for Beauticate Shop — how returns work with our brand-direct model.',
}

export default function RefundPolicyPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-14 md:py-20">

      <header className="mb-10 border-b border-camel/30 pb-8">
        <p className="label-editorial mb-2">Beauticate Shop</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">Returns &amp; Refunds</h1>
        <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mt-3">
          Last updated: July 2026
        </p>
      </header>

      <div className="font-serif text-charcoal/80 leading-relaxed space-y-8">

        <p>
          We want you to love what you order. If something is not right, here is how returns work.
          Beauticate is a curated shop where every order is fulfilled and shipped by the brand
          direct. The brand manages the return itself, and we look after your refund, so a return
          takes two quick steps.
        </p>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Your rights come first</h2>
          <p>
            Under the Australian Consumer Law, our products come with guarantees that cannot be
            excluded. If an item is faulty, not as described, or does not do what it should, you
            are entitled to a repair, replacement or refund. These rights apply no matter what the
            rest of this policy says.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">How to start a return</h2>
          <p>Starting a return takes two steps.</p>
          <p className="mt-4">
            First, contact the brand that shipped your item. The brand manages the return and will
            confirm the return address and the next steps. You will find its returns details in your
            order confirmation, in your dispatch email and on the packing slip inside your parcel.
          </p>
          <p className="mt-4">
            Second, email us at{' '}
            <a href="mailto:hello@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              hello@beauticate.com
            </a>{' '}
            with your order number and what you are returning, so we can log it and take care of
            your refund once the brand has approved the return.
          </p>
          <p className="mt-4">
            Please do not post anything back before the brand has approved your return, as items
            sent without a request may not be accepted.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Faulty, damaged or incorrect items</h2>
          <p>
            Please check your order when it arrives. If anything is faulty, damaged or not what
            you ordered, contact the brand that shipped it as soon as you can, ideally within
            7 days of delivery, and email us at{' '}
            <a href="mailto:hello@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              hello@beauticate.com
            </a>{' '}
            so we have a record. The brand will arrange a repair, replacement or refund and cover
            the cost of return postage.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Changed your mind</h2>
          <p>
            It happens. Because each item ships from the brand, the brand sets and manages its own
            change-of-mind policy. That covers whether a change-of-mind return is accepted, how
            long you have to request one, and who pays return postage. Contact the brand to check
            what is possible for your item, then follow the two steps above to start the return. To be eligible, it must be unused, unopened and in its
            original condition and packaging.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Items we cannot accept for change of mind</h2>
          <p>
            For health and hygiene reasons, brands cannot accept change-of-mind returns on opened
            or used beauty, skincare, makeup, haircare or fragrance, or on consumables like
            supplements, food or drink, or on gift cards. This does not affect your rights if an
            item is faulty or not as described.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Refunds</h2>
          <p>
            Once the brand has approved your return, we process your refund back to your original
            payment method. Refunds usually take 5 to 10 business days to appear, depending on
            your bank or card provider. This is why we ask you to email us when you start a return,
            so we can take care of it promptly.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Exchanges</h2>
          <p>
            The quickest way to get what you want is to return the original item to the brand, and
            once your return is approved, place a new order for the one you would prefer.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Your consumer rights</h2>
          <p>
            Your purchase is made from Beauticate, so your consumer guarantees under the Australian
            Consumer Law always apply, even though the brand handles the return. In the rare case
            that you cannot resolve a faulty, damaged or incorrect item with the brand, email us
            at{' '}
            <a href="mailto:hello@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              hello@beauticate.com
            </a>{' '}
            and we will make it right.
          </p>
        </section>

        <p className="text-xs text-charcoal/40 font-sans pt-6 border-t border-camel/20">
          Cantelo Corporation Pty Ltd · ABN 71 105 175 317
        </p>
      </div>
    </div>
  )
}
