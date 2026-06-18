'use client'
import { useCart } from './CartProvider'

export default function CartButton() {
  const { cart, openCart } = useCart()
  const count = cart?.totalQuantity ?? 0
  return (
    <button onClick={openCart} className="relative p-2 hover:text-gold transition-colors" aria-label="Cart">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-gold text-cream text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  )
}
