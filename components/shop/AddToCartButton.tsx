'use client'
import { useState } from 'react'
import { useCart } from './CartProvider'
import type { ShopifyProduct } from '@/types/shopify'

interface Props { product: ShopifyProduct }

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart()
  const [loading, setLoading] = useState(false)
  const variant = product.variants.nodes[0]
  if (!variant?.availableForSale) return <p className="text-xs text-charcoal-light">Out of stock</p>

  const handleAdd = async () => {
    setLoading(true)
    await addItem(variant.id)
    setLoading(false)
  }

  return (
    <button onClick={handleAdd} disabled={loading} className="btn-primary w-full text-xs py-2">
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
