'use client'
import { useState } from 'react'
import { useCart } from './CartProvider'
import type { ShopifyProduct, ShopifyImage, ShopifyPrice } from '@/types/shopify'

// Can accept a full product OR individual variant props (used by ProductEmbed in MDX)
type Props =
  | { product: ShopifyProduct; variantId?: never; variantTitle?: never; productTitle?: never; productImage?: never; price?: never }
  | { product?: never; variantId: string; variantTitle: string; productTitle: string; productImage?: ShopifyImage; price: ShopifyPrice }

export default function AddToCartButton(props: Props) {
  const { addItem } = useCart()
  const [loading, setLoading] = useState(false)

  const variantId = props.product ? props.product.variants.nodes[0]?.id : props.variantId
  const available = props.product ? props.product.variants.nodes[0]?.availableForSale : true

  if (!variantId || !available) return <p className="text-xs text-charcoal-light">Out of stock</p>

  const handleAdd = async () => {
    setLoading(true)
    await addItem(variantId)
    setLoading(false)
  }

  return (
    <button onClick={handleAdd} disabled={loading} className="btn-primary w-full text-xs py-2">
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
