import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Beauticate',
  description: 'Privacy policy for Beauticate — how we collect, use and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-14 md:py-20">

      <header className="mb-10 border-b border-camel/30 pb-8">
        <p className="label-editorial mb-2">Legal</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">Privacy Policy</h1>
        <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mt-3">
          Last updated: July 2026
        </p>
      </header>

      <div className="font-serif text-charcoal/80 leading-relaxed space-y-8">

        <p>
          This Privacy Policy explains how Cantelo Corporation Pty Ltd (ABN 71 105 175 317),
          trading as Beauticate, collects, uses, shares and protects your personal information.
          It covers beauticate.com, our shop at beauticate.com/shop, our newsletter and our
          podcast. In this policy, Beauticate, we and us mean Cantelo Corporation Pty Ltd.
        </p>
        <p>
          We handle your personal information in line with the Australian Privacy Act 1988 and the
          Australian Privacy Principles.
        </p>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">How our shop works, and why it matters for your privacy</h2>
          <p>
            Beauticate is a curated editorial shop. We select, describe and sell the products. The
            brands we partner with hold the stock and post your order to you direct from their own
            warehouses, through a fulfilment platform called Modern Dropship. This means that when
            you place an order, some of your details are passed to the brand that ships it, so your
            order can reach you. We set out exactly what we share, and with whom, below.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Information we collect</h2>
          <p>
            We collect only what we need to run the shop, deliver your order and keep you updated.
            This includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-charcoal/70 mt-3">
            <li><strong>Contact and order details.</strong> Your name, email address, delivery and billing address, phone number if you give it, and the details of what you have ordered.</li>
            <li><strong>Payment information.</strong> Processed securely by our payment provider. We do not see or store your full card number.</li>
            <li><strong>Account and marketing preferences.</strong> Newsletter subscriptions and your communication choices.</li>
            <li><strong>Site and usage data.</strong> Cookies, IP address and how you browse the site, so we can keep it working well.</li>
          </ul>
          <p className="mt-4">
            You can browse most of the site without telling us who you are. To place an order or
            subscribe, we need the details above.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">How we use your information</h2>
          <p>
            We use your personal information to process and deliver your orders, send you order and
            shipping updates, answer your questions, send you our newsletter and offers where you
            have opted in, improve the site and our editorial, prevent fraud and meet our legal
            obligations. You can unsubscribe from marketing at any time using the link in any email,
            or by contacting us.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">How we share your information</h2>
          <p>
            We share only what is needed, only with the parties below, and never for their own
            unrelated marketing. We do not sell your personal information.
          </p>
          <ul className="list-disc list-inside space-y-2 text-charcoal/70 mt-3">
            <li><strong>Shopify.</strong> Our ecommerce platform, which hosts the shop and processes your order.</li>
            <li><strong>Modern Dropship.</strong> The platform that routes your order to the brand that fulfils it.</li>
            <li><strong>The fulfilling brand or supplier.</strong> Receives your name and delivery address so it can pick, pack and post your order. An order with items from more than one brand is shared with each of those brands.</li>
            <li><strong>Stripe.</strong> Processes your payment securely.</li>
            <li><strong>Klaviyo.</strong> Manages our order emails and newsletters.</li>
            <li><strong>Google.</strong> Provides analytics that help us understand how the site is used.</li>
            <li><strong>Couriers and Australia Post.</strong> Deliver your parcel, arranged by the brand that ships it.</li>
            <li><strong>Authorities and advisers.</strong> Where we are required or authorised by law, or need to protect our legal rights.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Overseas transfer</h2>
          <p>
            Some of our providers, including Shopify, Stripe, Klaviyo and Google, store data on
            servers outside Australia, including in the United States. Where your information is
            handled overseas, we take reasonable steps to ensure it is protected consistent with
            the Australian Privacy Principles.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Cookies</h2>
          <p>
            Our site uses cookies to remember your preferences, keep your cart working through
            checkout and help us understand site usage. Most browsers accept cookies automatically.
            You can set your browser to decline them, though some parts of the site may not work
            as well if you do.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Keeping your information secure</h2>
          <p>
            We take reasonable steps to protect your personal information from misuse, loss and
            unauthorised access, including through our platform partners&apos; security measures.
            No system is ever completely secure, but we work only with reputable providers and
            hold your information for no longer than we need it.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Accessing or correcting your information</h2>
          <p>
            You can ask us for a copy of the personal information we hold about you, or ask us to
            correct it, at any time. Email us at{' '}
            <a href="mailto:hello@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              hello@beauticate.com
            </a>{' '}
            and we will respond as quickly as we can.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The current version will always be posted
            on this page, with the date it was last updated.
          </p>
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
