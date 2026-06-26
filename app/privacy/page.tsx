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
          Last updated: June 2026
        </p>
      </header>

      <div className="font-serif text-charcoal/80 leading-relaxed space-y-8">

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Who we are</h2>
          <p>
            Beauticate is operated by Cantelo Corporation Pty Ltd (ABN 71 105 175 317), a company
            registered in New South Wales, Australia. In this policy, &ldquo;Beauticate&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;
            and &ldquo;our&rdquo; refer to Cantelo Corporation Pty Ltd. Our website is{' '}
            <a href="https://www.beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              www.beauticate.com
            </a>
            {' '}and our shop is{' '}
            <a href="https://beauticate.shop" className="text-ink hover:text-eucalypt transition-colors">
              beauticate.shop
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Information we collect</h2>
          <p>We collect information you provide to us directly, including:</p>
          <ul className="list-disc list-inside space-y-2 text-charcoal/70 mt-3">
            <li>Name and email address when you subscribe to our newsletter</li>
            <li>Name, address, email and payment information when you place an order through Beauticate Shop</li>
            <li>Any information you provide when you contact us by email</li>
          </ul>
          <p className="mt-4">
            We also collect certain information automatically when you visit our site, including
            your IP address, browser type, pages viewed and referring URLs. This is collected via
            Google Analytics and similar tools.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">How we use your information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc list-inside space-y-2 text-charcoal/70 mt-3">
            <li>Process and fulfil orders placed through Beauticate Shop</li>
            <li>Send you our newsletter and editorial updates (only with your consent)</li>
            <li>Respond to your enquiries and provide customer support</li>
            <li>Improve our website and editorial content</li>
            <li>Comply with our legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Sharing your information</h2>
          <p>
            We do not sell your personal information. We may share your information with
            trusted third-party service providers who assist us in operating our website and
            fulfilling orders — including Shopify (e-commerce platform), Mailchimp (email),
            and Google Analytics (site analytics). These providers are required to protect your
            information and may only use it for the specific services they provide to us.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Cookies</h2>
          <p>
            Our website uses cookies to improve your experience, measure traffic and enable
            certain features. You can disable cookies in your browser settings, though this may
            affect the functionality of our site and shop.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Your rights</h2>
          <p>
            Under Australian privacy law you have the right to access, correct and request
            deletion of the personal information we hold about you. To exercise these rights,
            please contact us at{' '}
            <a href="mailto:hello@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              hello@beauticate.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Changes to this policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be noted at the
            top of this page with a revised date. Continued use of our site following any changes
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-4">Contact</h2>
          <p>
            For any privacy-related enquiries, please contact us at{' '}
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
