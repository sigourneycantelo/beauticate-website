'use client'
import { useCart } from './CartProvider'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gaViewCart, gaBeginCheckout, gidToId, GAItem } from '@/lib/ga/events'
import { track } from '@/lib/meta/pixel'
import { GWP, isGiftLine } from '@/lib/gwp'

function cartToGAItems(lines: any[]): GAItem[] {
  return lines.map((line: any) => ({
    item_id: gidToId(line.merchandise?.product?.id ?? line.merchandise?.id ?? ''),
    item_name: line.merchandise?.product?.title ?? line.merchandise?.title,
    item_brand: line.merchandise?.product?.vendor,
    price: parseFloat(line.merchandise?.price?.amount ?? '0'),
    quantity: line.quantity,
  }))
}

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeItem } = useCart()
  const lines = cart?.lines?.nodes ?? []
  const currency = cart?.cost?.totalAmount?.currencyCode ?? 'AUD'
  const cartValue = cart?.cost?.totalAmount ? parseFloat(cart.cost.totalAmount.amount) : 0

  // cart_viewed (GA4 view_cart only — Meta has no standard "cart viewed" event).
  // Fires once per open transition, not on every re-render while open.
  const firedForOpenRef = useRef(false)
  useEffect(() => {
    if (isOpen && lines.length > 0 && !firedForOpenRef.current) {
      firedForOpenRef.current = true
      gaViewCart(cartToGAItems(lines), cartValue, currency)
    }
    if (!isOpen) firedForOpenRef.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleCheckoutClick = () => {
    // checkout_started — fired via the same sendBeacon path Meta CAPI already
    // uses (lib/meta/pixel.ts `track`), so it survives the outbound navigation
    // without delaying it. This is a plain <a href> click — nothing here calls
    // preventDefault or awaits anything, so the browser's redirect chain through
    // to Shop Pay checkout starts immediately, unblocked.
    track('InitiateCheckout', {
      content_type: 'product',
      contents: lines.map((l: any) => ({ id: l.merchandise?.product?.id ?? l.merchandise?.id, quantity: l.quantity })),
      value: cartValue,
      currency,
    })
    gaBeginCheckout(cartToGAItems(lines), cartValue, currency)
  }

  if (!isOpen) return null

  const total = cart?.cost?.totalAmount
    ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
        .format(parseFloat(cart.cost.totalAmount.amount))
    : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/30"
        style={{ zIndex: 1300 }}
        onClick={closeCart}
      />
      {/* Drawer */}
      <aside className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-cream shadow-2xl flex flex-col" style={{ zIndex: 1400 }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h2 className="text-base">Your Cart ({lines.length})</h2>
          <button onClick={closeCart} className="p-1 hover:text-wine transition-colors">✕</button>
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
                // Shopify clamps a sold-out line's quantity to 0 (this happens even
                // when the product query reported availableForSale: true), which is
                // why such lines used to render as "$0". Detect it and label the line
                // truthfully instead of showing a price.
                const soldOut = (line.quantity ?? 0) < 1
                // The gift-with-purchase line. It is priced at $0.01 in Shopify
                // because Modern Dropship cannot process a $0.00 line item, so the
                // cent is handled here presentationally: the customer is told they
                // have a free gift, never shown a one-cent price that reads as a
                // pricing bug. It has no Remove control either — the cart owns it
                // (lib/gwp-cart.ts), and removing the last BOOIE product is what
                // takes it away.
                const gift = isGiftLine(line as any)
                // Line-level cost is Shopify's canonical figure (already ×quantity);
                // fall back to per-unit price × quantity only if the line cost is absent.
                const lineCost = parseFloat(line.cost?.totalAmount?.amount ?? '0')
                const price = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
                  .format(lineCost > 0 ? lineCost : parseFloat(line.merchandise.price.amount) * (line.quantity ?? 1))
                return (
                  <li key={line.id} className="flex gap-3">
                    {img && (
                      <div className="relative w-16 h-16 flex-none bg-cream-100">
                        <Image src={img.url} alt={img.altText ?? ''} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {gift && (
                        <span className="inline-block font-sans text-[9px] tracking-[0.18em] uppercase text-eucalypt font-semibold border border-eucalypt/40 rounded-full px-2 py-[2px] mb-1">
                          {GWP.badge}
                        </span>
                      )}
                      <p className="text-xs text-charcoal-light">{line.merchandise.product.vendor}</p>
                      <p className="text-sm font-medium leading-tight line-clamp-2">
                        {line.merchandise.product.title}
                      </p>
                      {line.merchandise.title !== 'Default Title' && (
                        <p className="text-xs text-charcoal-light">{line.merchandise.title}</p>
                      )}
                      {gift ? (
                        <>
                          <p className="text-sm mt-1 text-eucalypt font-semibold">{GWP.freeLabel}</p>
                          <p className="text-[11px] text-charcoal-light mt-0.5">{GWP.cartNote}</p>
                        </>
                      ) : soldOut ? (
                        <p className="text-sm mt-1 text-wine">Sold out</p>
                      ) : (
                        <p className="text-sm mt-1">{price}</p>
                      )}
                    </div>
                    {!gift && (
                      <button
                        onClick={() => removeItem(line.id)}
                        className="text-xs text-charcoal-light hover:text-charcoal self-start mt-1"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
            <div className="border-t border-cream-200 px-6 py-4 space-y-3">
              {total && (
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">{total}</span>
                </div>
              )}
              <button
                onClick={closeCart}
                className="block text-xs font-sans tracking-[0.06em] text-charcoal-light hover:text-ink transition-colors underline underline-offset-2"
              >
                Edit cart
              </button>
              {cart?.checkoutUrl && (
                <a
                  href={cart.checkoutUrl}
                  onClick={handleCheckoutClick}
                  className="btn-primary w-full text-center block"
                >
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
