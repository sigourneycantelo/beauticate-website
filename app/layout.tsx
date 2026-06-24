import type { Metadata } from 'next'
import { EB_Garamond, Hanken_Grotesk } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'

// EB Garamond — headlines, intros, body, links
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

// Hanken Grotesk — eyebrows, breadcrumbs, nav, tags, buttons
const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500'],
})
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import CartProvider from '@/components/shop/CartProvider'
import CartDrawer from '@/components/shop/CartDrawer'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com'),
  title: {
    default: 'Beauticate — Beauty Tips with Lifestyle',
    template: '%s | Beauticate',
  },
  description: 'Elevating beauty, wellness, and lifestyle with trusted tips, expert voices, and stories that inspire.',
  openGraph: {
    siteName: 'Beauticate',
    type: 'website',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@beauticate',
  },
  robots: { index: true, follow: true },
}

// Organisation + Person schema — tells AI engines exactly who Beauticate is.
// Doug's report: "single biggest unlock for named AI citation" — Brand 58→70+ expected.
const orgSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.beauticate.com/#organization',
      name: 'Beauticate',
      legalName: 'Cantelo Corporation Pty Ltd',
      url: 'https://www.beauticate.com',
      logo: { '@type': 'ImageObject', url: 'https://www.beauticate.com/logo-dark.png' },
      foundingDate: '2014',
      description: 'Beauticate is an Australian beauty, wellness and lifestyle publisher founded by Sigourney Cantelo. Trusted by 3.1 million readers monthly.',
      inLanguage: 'en-AU',
      areaServed: 'AU',
      taxID: '71 105 175 317',
      sameAs: [
        'https://www.instagram.com/beauticate/',
        'https://www.facebook.com/beauticate',
        'https://www.linkedin.com/company/beauticate.com',
        'https://www.youtube.com/@beauticate',
        'https://www.pinterest.com.au/beauticate/',
        'https://beauticate.shop',
      ],
    },
    {
      '@type': 'Person',
      '@id': 'https://www.beauticate.com/#sigourney-cantelo',
      name: 'Sigourney Cantelo',
      jobTitle: 'Founder & Editor-in-Chief',
      worksFor: { '@id': 'https://www.beauticate.com/#organization' },
      url: 'https://www.beauticate.com/about-beauticate',
      sameAs: [
        'https://www.instagram.com/sigourney.cantelo/',
        'https://www.linkedin.com/in/sigourneycantelo/',
      ],
      knowsAbout: ['Beauty', 'Wellness', 'Lifestyle', 'Skincare', 'Fashion'],
      alumniOf: 'Vogue Australia',
      description: 'Sigourney Cantelo is the founder of Beauticate and a 25-year veteran beauty journalist, former Vogue Australia Beauty & Health Director.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.beauticate.com/#website',
      url: 'https://www.beauticate.com',
      name: 'Beauticate',
      publisher: { '@id': 'https://www.beauticate.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://www.beauticate.com/search?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${ebGaramond.variable} ${hankenGrotesk.variable}`}>
      <body>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
          strategy="beforeInteractive"
        />
        <CartProvider>
          <AnnouncementBar message="Shop the Beauticate Edit — curated beauty, wellness & style" href="/shop" />
          <Header />
          <main id="main" data-pagefind-body>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}
