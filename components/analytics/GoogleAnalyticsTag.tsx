import Script from 'next/script'

// GA4 base tag, replacing @next/third-parties' <GoogleAnalytics>, which has no
// way to pass a `linker` config. Same behaviour otherwise: one gtag.js load,
// one 'config' call, `dataLayer` as the layer name, Enhanced Measurement
// handles SPA route changes.
//
// The linker is what carries the GA session across to checkout.beauticate.com.
// gtag decorates any <a href> click whose host is in `domains` with a `_gl`
// parameter. Keep the list in step with GA4 Admin → Data streams → Configure
// tag settings → Configure your domains (both should list the same hosts).
//
// ONE measurement ID everywhere. lib/ga/events.ts, lib/ga/measurement-protocol.ts
// and the Shopify Customer Events pixel must all use this same value.
const LINKER_DOMAINS = ['beauticate.com', 'checkout.beauticate.com']

export default function GoogleAnalyticsTag({ gaId }: { gaId: string }) {
  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){ window.dataLayer.push(arguments); }
        window.gtag = window.gtag || gtag;
        gtag('js', new Date());
        gtag('config', ${JSON.stringify(gaId)}, {
          linker: { domains: ${JSON.stringify(LINKER_DOMAINS)} }
        });
      `}</Script>
      <Script
        id="ga4-lib"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
        strategy="afterInteractive"
      />
    </>
  )
}
