'use client'

import { useEffect, useState, useMemo } from 'react'
import type { ShopifyProduct } from '@/types/shopify'
import ProductRail from '@/components/shared/ProductRail'
import { isFreeShipping } from '@/lib/shop-taxonomy'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function FreeShippingStrip({ products }: { products: ShopifyProduct[] }) {
  const eligible = useMemo(() => products.filter(p => isFreeShipping(p.vendor)), [products])
  const [shuffled, setShuffled] = useState(eligible)
  useEffect(() => { setShuffled(shuffle(eligible)) }, [eligible])

  if (!shuffled.length) return null

  return (
    <ProductRail
      products={shuffled}
      rows={2}
      eyebrow="Free Shipping"
      heading="Complimentary delivery on select brands"
      badge="Free Shipping"
      cta={{ label: 'Shop free shipping', href: '/shop/free-shipping' }}
    />
  )
}
