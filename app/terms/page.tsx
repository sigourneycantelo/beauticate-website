import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Beauticate',
  description: 'Terms and conditions for use of Beauticate — the editorial site and Beauticate Shop.',
}

export default function TermsPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-14 md:py-20">

      <header className="mb-10 border-b border-camel/30 pb-8">
        <p className="label-editorial mb-2">Legal</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">Terms &amp; Conditions</h1>
        <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mt-3">
          Last updated: July 2026
        </p>
      </header>

      <div className="font-serif text-charcoal/80 leading-relaxed space-y-8">

        <p>
          These terms apply when you use beauticate.com or shop at beauticate.com/shop. The shop is
          operated by Cantelo Corporation Pty Ltd (ABN 71 105 175 317), trading as Beauticate. By
          placing an order you agree to these terms. Please read them alongside our{' '}
          <a href="/privacy" className="text-ink hover:text-eucalypt transition-colors">Privacy Policy</a>,{' '}
          <a href="/shop/shipping" className="text-ink hover:text-eucalypt transition-colors">Shipping Policy</a>{' '}
          and{' '}
          <a href="/shop/refund-policy" className="text-ink hover:text-eucalypt transition-colors">Returns &amp; Refunds Policy</a>.
        </p>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">How Beauticate Shop works</h2>
          <p>
            Beauticate is a curated editorial shop. We choose, describe and sell the products you
            see. The brands we partner with hold the stock and fulfil, pack and post your order
            direct from their own warehouses, through a fulfilment platform called Modern Dropship.
            When you buy from us, your sale is with Beauticate, and your order is supplied and
            shipped by the brand. Each brand manages its own dispatch, shipping and returns.
          </p>
          <p className="mt-4">
            This model does not reduce your rights. Under the Australian Consumer Law you are
            entitled to consumer guarantees on the goods you buy from us, and nothing in these
            terms excludes, restricts or modifies those guarantees. Where a product is faulty or
            not as described, your rights sit with us and we will make sure it is put right.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Products, prices and availability</h2>
          <p>
            Prices are shown in Australian dollars and include GST. We work hard to keep listings
            accurate, but from time to time an error in price, description or availability may slip
            through. Where that happens we may correct it, or decline or cancel an affected order,
            and we will let you know. Stock depends on each brand&apos;s availability, so a product
            may sell out or be withdrawn.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Affiliate and sponsored content</h2>
          <p>
            Beauticate is an editorial platform. Some of our content contains affiliate links, and
            some content is sponsored or produced in paid partnership with a brand. Where content is
            sponsored or contains affiliate links, we aim to make this clear. If you buy through an
            affiliate link, we may earn a commission at no extra cost to you. Products in our shop
            are selected by our team, and we choose what to feature on merit.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Orders and payment</h2>
          <p>
            Placing an order is an offer to buy. Your order is accepted when we send you an order
            confirmation. Payment is processed securely through Stripe at checkout. We may refuse
            or cancel an order where there is a pricing or stock error, a payment issue or
            suspected fraud, and we will refund you in full if we do.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Shipping and delivery</h2>
          <p>
            We ship Australia-wide. Because each brand ships its own products from its own
            warehouse, shipping is set per brand, and an order with items from more than one brand
            may arrive in separate parcels, with separate tracking, on different days. Full detail
            is in our{' '}
            <a href="/shop/shipping" className="text-ink hover:text-eucalypt transition-colors">Shipping Policy</a>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Returns and refunds</h2>
          <p>
            Because each order is fulfilled and shipped by the brand, returns are managed by the
            brand that sent your item, in line with that brand&apos;s own policy and the Australian
            Consumer Law. Our{' '}
            <a href="/shop/refund-policy" className="text-ink hover:text-eucalypt transition-colors">Returns &amp; Refunds Policy</a>{' '}
            explains how. Your consumer guarantees under the Australian Consumer Law always apply,
            whatever our policy says.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Product information and health claims</h2>
          <p>
            Our editorial and product information is provided for general purposes and is not
            medical or professional advice. Some of our brands sell supplements, skincare and
            wellness products. Always read the label, follow the directions for use, and speak
            with your doctor or a qualified professional before starting a supplement or if you
            have a health concern.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Intellectual property</h2>
          <p>
            The content on beauticate.com, including our articles, photography, brand name and
            design, is owned by Beauticate or our partners and is protected by copyright. Product
            imagery and brand assets belong to the relevant brands. You may not reproduce,
            republish or use any of it without our written permission.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Our liability</h2>
          <p>
            Nothing in these terms excludes or limits the consumer guarantees or other rights you
            have under the Australian Consumer Law. To the extent the law allows, Beauticate is
            not liable for indirect or consequential loss, and our liability for any claim is
            limited to resupplying the product or refunding what you paid for it.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Privacy</h2>
          <p>
            We handle your personal information in line with our{' '}
            <a href="/privacy" className="text-ink hover:text-eucalypt transition-colors">Privacy Policy</a>{' '}
            and the Australian Privacy Act 1988.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Governing law</h2>
          <p>These terms are governed by the laws of New South Wales, Australia.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Contact us</h2>
          <p>
            Cantelo Corporation Pty Ltd (ABN 71 105 175 317), trading as Beauticate.
            Email{' '}
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
