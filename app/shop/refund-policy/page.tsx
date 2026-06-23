import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Refunds | Beauticate Shop',
  description: 'Returns and refund policy for Beauticate Shop. We want you to love every purchase.',
}

export default function RefundPolicyPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-14 md:py-20">

      <header className="mb-10 border-b border-camel/30 pb-8">
        <p className="label-editorial mb-2">Beauticate Shop</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">Returns &amp; Refunds</h1>
      </header>

      <div className="font-serif text-charcoal/80 leading-relaxed space-y-8">

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Our returns policy</h2>
          <p>
            We want you to love every product you receive from Beauticate Shop. If you are not
            completely satisfied with your purchase, we accept returns within 30 days of delivery
            for items that are unused, in original packaging and in resaleable condition.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">How to return an item</h2>
          <ol className="list-decimal list-inside space-y-3 text-charcoal/80">
            <li>
              Email us at{' '}
              <a href="mailto:shop@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
                shop@beauticate.com
              </a>{' '}
              with your order number and reason for return.
            </li>
            <li>We will reply within 1–2 business days with a return authorisation and instructions.</li>
            <li>Pack the item securely in its original packaging and include a note with your order number.</li>
            <li>Ship the item back to us using a tracked service. Return postage is at the customer&apos;s expense unless the item is faulty or incorrectly sent.</li>
            <li>Once received and inspected, your refund will be processed within 5–7 business days to your original payment method.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Non-returnable items</h2>
          <p>For hygiene reasons, we cannot accept returns on:</p>
          <ul className="list-disc list-inside space-y-2 text-charcoal/70 mt-3">
            <li>Opened skincare, makeup or haircare products</li>
            <li>Fragrances that have been opened or tested</li>
            <li>Items marked as final sale at time of purchase</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Faulty or incorrect items</h2>
          <p>
            If you receive a faulty, damaged or incorrect item, please contact us within 7 days
            of receiving your order at{' '}
            <a href="mailto:shop@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              shop@beauticate.com
            </a>{' '}
            with a photo and your order number. We will arrange a replacement or full refund at
            no cost to you.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Refund processing</h2>
          <p>
            Approved refunds are returned to the original payment method. Please allow 5–10
            business days for the refund to appear on your statement, depending on your bank or
            payment provider.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Questions</h2>
          <p>
            For any questions about your return or refund, please email{' '}
            <a href="mailto:shop@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              shop@beauticate.com
            </a>{' '}
            or visit our{' '}
            <Link href="/contact" className="text-ink hover:text-eucalypt transition-colors underline underline-offset-2">
              contact page
            </Link>
            .
          </p>
        </section>

        <p className="text-xs text-charcoal/40 font-sans pt-6 border-t border-camel/20">
          Cantelo Corporation Pty Ltd · ABN 71 105 175 317 · Last updated June 2026
        </p>
      </div>
    </div>
  )
}
