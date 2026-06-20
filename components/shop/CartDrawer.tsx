'use client'
import { useCart } from './CartProvider'
import Image from 'next/image'
import Link from 'next/link'

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeItem } = useCart()

  if (!isOpen) return null

  const lines = cart?.lines?.nodes ?? []
  const total = cart?.cost?.totalAmount
    ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
        .format(parseFloat(cart.cost.totalAmount.amount))
    : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-charcoal/30"
        onClick={closeCart}
      />
      {/* Drawer */}
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-cream shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h2 className="text-base">Your Cart ({lines.length})</h2>
          <button onClick={closeCart} className="p-1 hover:text-gold transition-colors">✕</button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <p className="text-charcoal-light text-sm">Your cart is empty.</p>
            <button onClick={closeCart} className="btn-primary">Continue Shopping</button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {lines.map(line => {
                const img = line.merchandise.product.featuredImage
                const unitPrice = line.merchandise?.price ?? line.cost?.totalAmount
                const price = unitPrice
                  ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
                      .format(parseFloat(unitPrice.amount) * (line.quantity ?? 1))
                  : null
                return (
                  <li key={line.id} className="flex gap-3">
                    {img && (
                      <div className="relative w-16 h-16 flex-none bg-cream-100">
                        <Image src={img.url} alt={img.altText ?? ''} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-charcoal-light">{line.merchandise.product.vendor}</p>
                      <p className="text-sm font-medium leading-tight line-clamp-2">
                        {line.merchandise.product.title}
                      </p>
                      {line.merchandise.title !== 'Default Title' && (
                        <p className="text-xs text-charcoal-light">{line.merchandise.title}</p>
                      )}
                      {price && <p className="text-sm mt-1">{price}</p>}
                    </div>
                    <button
                      onClick={() => removeItem(line.id)}
                      className="text-xs text-charcoal-light hover:text-charcoal self-start mt-1"
                    >
                      Remove
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="border-t border-cream-200 px-6 py-4 space-y-3">
              {total && (
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">{total}</span>
                </div>
              )}
              {cart?.checkoutUrl && (
                <a href={cart.checkoutUrl} className="btn-primary w-full text-center block">
                  Checkout
                </a>
              )}
              <button onClick={closeCart} className="btn-secondary w-full text-center">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
