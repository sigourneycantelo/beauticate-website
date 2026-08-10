'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { META_PIXEL_ID, track } from '@/lib/meta/pixel'
import { gaSelectContent } from '@/lib/ga/events'

/**
 * Loads the Meta Pixel base code and fires PageView on every route — including
 * client-side App Router navigations. Also hosts one delegated click listener
 * that fires AffiliateProductClick for outbound "shop this" product links
 * (tagged with data-mp-* attributes by ProductTile), which keeps those cards
 * server-rendered.
 *
 * This is a custom event, deliberately NOT named AddToCart — a click on an
 * outbound affiliate link is not a real Shopify cart addition (that fires its
 * own, separate AddToCart from CartProvider.addItem). The two used to share the
 * AddToCart name, which conflated real cart adds with affiliate-link clicks and
 * polluted AddToCart-based campaign optimization/reporting.
 *
 * Because it reads useSearchParams(), it must be rendered inside <Suspense>.
 */
export default function MetaPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // PageView on initial load + every client-side navigation.
  useEffect(() => {
    if (!META_PIXEL_ID) return
    track('PageView')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  // Outbound "shop this" links → AffiliateProductClick (Meta custom event) +
  // select_content (GA4). Not AddToCart — see comment above.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      const el = target?.closest ? (target.closest('[data-mp-addtocart]') as HTMLElement | null) : null
      if (!el) return
      const ds = el.dataset
      const priceNum = ds.mpPrice ? parseFloat(ds.mpPrice) : NaN
      if (META_PIXEL_ID) {
        track('AffiliateProductClick', {
          content_type: 'product',
          ...(ds.mpName ? { content_name: ds.mpName } : {}),
          ...(ds.mpId ? { content_ids: [ds.mpId] } : {}),
          ...(ds.mpBrand ? { content_category: ds.mpBrand } : {}),
          ...(Number.isFinite(priceNum) ? { value: priceNum } : {}),
          currency: ds.mpCurrency || 'AUD',
        })
      }
      gaSelectContent('affiliate_product', ds.mpId || ds.mpName || 'unknown', {
        item_name: ds.mpName,
        item_brand: ds.mpBrand,
        ...(Number.isFinite(priceNum) ? { value: priceNum } : {}),
        currency: ds.mpCurrency || 'AUD',
      })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true } as EventListenerOptions)
  }, [])

  if (!META_PIXEL_ID) return null

  // Base snippet WITHOUT the auto PageView — we fire PageView ourselves (above)
  // so every one is mirrored to CAPI with a shared event_id.
  return (
    <Script id="meta-pixel-base" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');`}
    </Script>
  )
}
