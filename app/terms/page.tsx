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
          Last updated: June 2026
        </p>
      </header>

      <div className="font-serif text-charcoal/80 leading-relaxed space-y-8">

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">1. About these terms</h2>
          <p>
            These terms and conditions govern your use of the Beauticate website (
            <a href="https://www.beauticate.com" className="text-ink hover:text-eucalypt transition-colors">www.beauticate.com</a>)
            and Beauticate Shop (
            <a href="https://beauticate.shop" className="text-ink hover:text-eucalypt transition-colors">beauticate.shop</a>)
            operated by Cantelo Corporation Pty Ltd (ABN 71 105 175 317). By accessing or using
            our site or shop, you agree to be bound by these terms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">2. Editorial content</h2>
          <p>
            All editorial content on Beauticate is provided for informational purposes only. While
            we take care to publish accurate and expert-led content, nothing on our site should
            be treated as professional medical, dermatological or health advice. Always consult a
            qualified professional for advice specific to your circumstances.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">3. Affiliate links &amp; commercial relationships</h2>
          <p>
            Beauticate may earn a commission on purchases made through affiliate links on our
            site. All affiliate relationships are disclosed. Commission arrangements do not
            influence our editorial recommendations — we only link to products we would
            genuinely recommend regardless of commercial arrangements.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">4. Purchases from Beauticate Shop</h2>
          <p>
            Purchases made through Beauticate Shop are subject to the purchase price, shipping
            costs and any applicable taxes displayed at checkout. By completing a purchase you
            confirm that you are authorised to use the payment method provided and that the
            information you have given is accurate.
          </p>
          <p className="mt-3">
            Beauticate Shop is powered by Shopify. Purchases are processed via Shopify Payments
            in accordance with Shopify&apos;s terms of service and payment processing policies.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">5. Intellectual property</h2>
          <p>
            All content on Beauticate — including editorial articles, photography, logos, brand
            assets and design — is the property of Cantelo Corporation Pty Ltd or its
            contributors and is protected by Australian and international copyright law.
            Reproduction without written permission is prohibited.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">6. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Cantelo Corporation Pty Ltd will not be
            liable for any indirect, incidental or consequential loss arising from use of our
            site, reliance on our editorial content, or purchases made through Beauticate Shop.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">7. Governing law</h2>
          <p>
            These terms are governed by the laws of New South Wales, Australia. Any disputes
            will be subject to the exclusive jurisdiction of the courts of New South Wales.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">8. Contact</h2>
          <p>
            For questions about these terms, please contact us at{' '}
            <a href="mailto:hello@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              hello@beauticate.com
            </a>.
          </p>
        </section>

        <p className="text-xs text-charcoal/40 font-sans pt-6 border-t border-camel/20">
          Cantelo Corporation Pty Ltd · ABN 71 105 175 317 · Sydney, Australia
        </p>
      </div>
    </div>
  )
}
