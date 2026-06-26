import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Policy | Beauticate Shop',
  description: 'Shipping information for Beauticate Shop — delivery times, rates and carriers for Australia and international orders.',
}

export default function ShippingPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-14 md:py-20">

      <header className="mb-10 border-b border-camel/30 pb-8">
        <p className="label-editorial mb-2">Beauticate Shop</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">Shipping Policy</h1>
      </header>

      <div className="prose prose-serif max-w-none space-y-8 font-serif text-charcoal/80 leading-relaxed">

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Processing time</h2>
          <p>
            Orders are processed and dispatched within 1–3 business days. You will receive a
            confirmation email with tracking information once your order has been dispatched.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Australian delivery</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-camel/30">
              <thead>
                <tr className="bg-parchment">
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.2em] uppercase border border-camel/30">Method</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.2em] uppercase border border-camel/30">Estimated delivery</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.2em] uppercase border border-camel/30">Cost</th>
                </tr>
              </thead>
              <tbody className="font-serif">
                <tr>
                  <td className="px-4 py-3 border border-camel/30">Standard</td>
                  <td className="px-4 py-3 border border-camel/30">3–7 business days</td>
                  <td className="px-4 py-3 border border-camel/30">$9.95 (free over $100)</td>
                </tr>
                <tr className="bg-parchment/50">
                  <td className="px-4 py-3 border border-camel/30">Express</td>
                  <td className="px-4 py-3 border border-camel/30">1–3 business days</td>
                  <td className="px-4 py-3 border border-camel/30">$14.95</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-charcoal/50 mt-3 font-sans italic">
            Free standard shipping on Australian orders over $100 AUD.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">International shipping</h2>
          <p>
            We currently ship to New Zealand, the United Kingdom and the United States.
            International shipping rates and delivery times are calculated at checkout.
          </p>
          <p>
            Please note that international customers are responsible for any customs duties,
            taxes or import fees that may apply on delivery.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Order tracking</h2>
          <p>
            Once your order has been dispatched you will receive a shipping confirmation email
            containing a tracking number. You can use this to monitor your delivery via the
            carrier&apos;s website.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Questions</h2>
          <p>
            If you have a question about your order or delivery, please contact us at{' '}
            <a href="mailto:shop@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              shop@beauticate.com
            </a>{' '}
            and we will respond within 1–2 business days.
          </p>
        </section>

        <p className="text-xs text-charcoal/40 font-sans pt-6 border-t border-camel/20">
          Cantelo Corporation Pty Ltd · ABN 71 105 175 317
        </p>
      </div>
    </div>
  )
}
