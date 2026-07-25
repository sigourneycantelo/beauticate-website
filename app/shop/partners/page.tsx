import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PartnerAccordion from '@/components/shop/PartnerAccordion'

export const metadata: Metadata = {
  title: 'Partner with Beauticate Shop',
  description:
    'How to sell your brand through Beauticate Shop. Commission, shipping, returns and what an editorial partnership looks like.',
}

const FAQS = [
  {
    q: 'What does it cost to join?',
    a: 'Nothing upfront. There is no listing fee and no joining fee. It is a commission model, so we only earn when you sell. Commission varies depending on the editorial package you choose, plus a 5 percent platform fee to Modern Dropship. You receive the balance.',
  },
  {
    q: 'How does the technology work?',
    a: 'Beauticate Shop runs on Shopify, connected through Modern Dropship. You connect your store, and your products, images, pricing and stock sync automatically. Modern Dropship integrates natively with Shopify and WooCommerce, and connects to other platforms via feed or API.',
  },
  {
    q: 'Who fulfils the orders?',
    a: 'You do. A customer buys through Beauticate Shop, the order routes straight to your warehouse, and you ship it exactly as you would any other order. Your courier, your packaging, your brand experience. Nothing about your operation changes.',
  },
  {
    q: 'How and when do we get paid?',
    a: 'You are paid on dispatch, minus commission, through Stripe. Tracking and stock levels sync back automatically.',
  },
  {
    q: 'Are there any other fees?',
    a: 'Stripe applies its standard processing fees on both sides of the transaction, as it does with any Stripe-powered payment. On the customer side, those fees sit with us as the merchant of record. On the supplier payout side, Stripe applies its standard fee to your payout, currently 1.7 percent plus 30 cents per domestic transaction in Australia. These are Stripe\'s own fees and are separate from commission. They are not charged by Beauticate or Modern Dropship.',
  },
  {
    q: 'How does shipping work?',
    a: 'Shipping is controlled through Shopify, and each brand has its own shipping profile. You tell us your shipping rate and we configure it. When a customer buys from more than one brand in a single cart, the rates stack, so nobody absorbs another brand\'s freight. Your shipping cost is then passed back to you automatically as a per-order fee on the same payment rail as your payout. No invoicing, no monthly reconciliation. Many of our partners use a simple flat rate.',
  },
  {
    q: 'What about returns and refunds?',
    a: 'Two scenarios. If a customer cancels before the order ships, the order is voided and no commission is charged on either side. If an order has already shipped and is then returned, the commission on that transaction stands. This is standard across marketplace and dropship models, since the commission is earned on the fulfilled transaction. Modern Dropship reverses the invoice between us automatically on completed returns, so the payout mechanics stay clean. The same logic applies to partial refunds on a pro rata basis.\n\nYou manage returns under Australian Consumer Law and your own returns policy. We will not process a refund on your behalf without consulting you first, unless the law requires it.',
  },
  {
    q: 'What about GST and the tax invoice?',
    a: 'Beauticate operates as the customer-facing merchant of record. The customer purchases through our Shopify checkout. We are finalising the formal GST documentation with our tax adviser so the structure is properly recorded for both parties. This is a documentation step and it will not hold up onboarding or integration.',
  },
  {
    q: 'Who owns the customer?',
    a: 'The customer belongs to both of us. Beauticate does not receive or hold your existing customer list, and we do not solicit it. Customers who discover you through Beauticate Shop are shared.',
  },
  {
    q: 'What do you expect from us?',
    a: 'Quality imagery and your brand story. A willingness to collaborate on content, interviews and events. And an understanding that this is not a passive sales channel. Our partners get the most out of it when they lean in.',
  },
  {
    q: 'What happens next?',
    a: 'If you think your brand is a fit, apply below and register your email address. Our editorial team will review your product to see whether it belongs in the edit. If it does, we will send you instructions on next steps including onboarding, imagery and your partner agreement.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function PartnersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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

      {/* FAQ accordion */}
      <div className="max-w-content mx-auto px-6 py-14 md:py-20">
        <PartnerAccordion items={FAQS} />

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
