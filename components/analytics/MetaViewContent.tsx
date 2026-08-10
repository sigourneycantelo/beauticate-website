'use client'

import { useEffect } from 'react'
import { track } from '@/lib/meta/pixel'
import { gaViewItem } from '@/lib/ga/events'

interface Props {
  contentType: 'product' | 'article'
  contentIds?: string[]
  contentName?: string
  contentCategory?: string
  contentBrand?: string
  value?: string | number
  currency?: string
}

/**
 * Fires Meta ViewContent (browser + CAPI) when the page mounts, plus GA4
 * view_item for products (view_item is ecommerce-specific — articles don't get
 * a GA4 event here). Rendered by article and product pages. Zero visual output.
 */
export default function MetaViewContent(props: Props) {
  const { contentType, contentIds, contentName, contentCategory, contentBrand, value, currency } = props

  useEffect(() => {
    const data: Record<string, unknown> = { content_type: contentType }
    if (contentIds?.length) data.content_ids = contentIds
    if (contentName) data.content_name = contentName
    if (contentCategory) data.content_category = contentCategory
    const v = typeof value === 'string' ? parseFloat(value) : value
    if (v != null && Number.isFinite(v)) data.value = v
    if (currency) data.currency = currency
    track('ViewContent', data)

    if (contentType === 'product' && contentIds?.[0] && v != null && Number.isFinite(v)) {
      gaViewItem(
        {
          item_id: contentIds[0],
          item_name: contentName ?? contentIds[0],
          item_brand: contentBrand,
          item_category: contentCategory,
          price: v,
        },
        currency ?? 'AUD'
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
