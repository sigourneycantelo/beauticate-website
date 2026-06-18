import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <CartProvider>
          <AnnouncementBar message="THE BEAUTIFUL INSIDE PODCAST HAS LAUNCHED — LISTEN HERE" href="/vodcast" />
          <Header />
          <main id="main">{children}</main>
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
