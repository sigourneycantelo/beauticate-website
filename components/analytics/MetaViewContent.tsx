'use client'

import { useEffect } from 'react'
import { track } from '@/lib/meta/pixel'

interface Props {
  contentType: 'product' | 'article'
  contentIds?: string[]
  contentName?: string
  contentCategory?: string
  value?: string | number
  currency?: string
}

/**
 * Fires a single Meta ViewContent event (browser + CAPI) when the page mounts.
 * Rendered by article and product pages. Zero visual output.
 */
export default function MetaViewContent(props: Props) {
  const { contentType, contentIds, contentName, contentCategory, value, currency } = props

  useEffect(() => {
    const data: Record<string, unknown> = { content_type: contentType }
    if (contentIds?.length) data.content_ids = contentIds
    if (contentName) data.content_name = contentName
    if (contentCategory) data.content_category = contentCategory
    const v = typeof value === 'string' ? parseFloat(value) : value
    if (v != null && Number.isFinite(v)) data.value = v
    if (currency) data.currency = currency
    track('ViewContent', data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
