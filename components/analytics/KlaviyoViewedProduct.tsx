'use client'

import { useEffect, useRef } from 'react'
import { klaviyoViewedProduct } from '@/lib/klaviyo-browser'

type Props = Parameters<typeof klaviyoViewedProduct>[0]

/**
 * Fires Klaviyo "Viewed Product" once when a shop product page mounts. Rendered
 * by ProductPage, which is server-rendered per request, so a fresh navigation to a
 * different product remounts it. The ref stops React StrictMode's dev double-run
 * (and any re-render) from sending a second event for the same page view.
 * Zero visual output.
 */
export default function KlaviyoViewedProduct(props: Props) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true
    klaviyoViewedProduct(props)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
