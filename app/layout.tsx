import type { Metadata } from 'next'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { EB_Garamond, Hanken_Grotesk, Italiana, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import MastheadData from '@/components/layout/MastheadData'

// EB Garamond — headlines, intros, body, links
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

// Italiana — big section numerals (NumberedSection)
const italiana = Italiana({
  subsets: ['latin'],
  variable: '--font-numeral',
  display: 'swap',
  weight: ['400'],
})

// Playfair Display — section titles and subheadings
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '700'],
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
import CartProvider from '@/components/shop/CartProvider'
import ScrollReveal from '@/components/shared/ScrollReveal'
import BetaTicker from '@/components/home/BetaTicker'
import CartDrawer from '@/components/shop/CartDrawer'
import AskSigLauncher from '@/components/chat/AskSigLauncher'
import MetaPixel from '@/components/analytics/MetaPixel'
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
  // Meta (Facebook) domain verification for beauticate.com — renders
  // <meta name="facebook-domain-verification" ...> into <head> on every page.
  verification: {
    other: {
      'facebook-domain-verification': 'ja6130rj6o80vjdzsv8qo3d8utdyl8',
    },
  },
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
      description: 'Beauticate is an Australian beauty, wellness and lifestyle publisher founded by Sigourney Cantelo.',
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
        'https://www.wikidata.org/wiki/Q139643093',
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
        'https://www.instagram.com/sigourneycantelo/',
        'https://www.linkedin.com/in/sigourney-cantelo-027a38b/',
        'https://www.wikidata.org/wiki/Q139644159',
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

// Early-access gate — matches middleware.ts. Set false for full public launch.
const EARLY_ACCESS_GATE = false

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const showChrome = !EARLY_ACCESS_GATE || cookieStore.has('early_access')

  return (
    <html lang="en-AU" className={`${ebGaramond.variable} ${hankenGrotesk.variable} ${playfairDisplay.variable} ${italiana.variable}`}>
      <body>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
          strategy="beforeInteractive"
        />
        {showChrome ? (
          <CartProvider>
            <ScrollReveal />
            <BetaTicker />
            <MastheadData />
            <main id="main" data-pagefind-body><div className="site-wrap">{children}</div></main>
            <Footer />
            <CartDrawer />
            <AskSigLauncher />
          </CartProvider>
        ) : (
          children
        )}
        {showChrome && (
          <>
            {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
            )}
            {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
              <Suspense fallback={null}>
                <MetaPixel />
              </Suspense>
            )}
            <Script
              id="klaviyo-sdk"
              src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=WSuntA"
              strategy="afterInteractive"
            />
            {process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER && (
              <Script
                id="travelpayouts-sdk"
                src={`https://tp.media/content?marker=${process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER}`}
                strategy="afterInteractive"
              />
            )}
          </>
        )}
      </body>
    </html>
  )
}
