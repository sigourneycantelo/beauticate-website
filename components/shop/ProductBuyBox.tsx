'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from './CartProvider'
import type { ShopifyProduct } from '@/types/shopify'
import { isFreeShipping } from '@/lib/shop-taxonomy'
import { cleanProductTitle } from '@/lib/product-format'

const fmt = (amount: string, currency: string) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency }).format(parseFloat(amount))

// Sticky right-hand buy box: brand, title, price, editorial note, variant, qty, add-to-cart.
export default function ProductBuyBox({ product: p, availability }: {
  product: ShopifyProduct
  /** Real-time per-variant stock from getVariantAvailability; missing id ⇒ fall back to availableForSale. */
  availability?: Record<string, boolean>
}) {
  const variants = p.variants.nodes
  const [variantId, setVariantId] = useState(variants[0]?.id)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const { addItem } = useCart()

  // The product query's availableForSale can't be trusted (see getVariantAvailability),
  // so prefer the real-time cart probe when we have it for this variant.
  const isVariantAvailable = (v: typeof variants[number]) =>
    (availability?.[v.id] ?? v.availableForSale) ?? false

  const selected = variants.find(v => v.id === variantId) ?? variants[0]
  const price = selected?.price ?? p.priceRange.minVariantPrice
  const compareAt = selected?.compareAtPrice
  const available = selected ? isVariantAvailable(selected) : false
  const onSale = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount)
  const hasOptions = variants.length > 1

  const add = async () => {
    if (!variantId || !available) return
    setLoading(true)
    await addItem(variantId, qty)
    setLoading(false)
  }

  return (
    <div className="lg:sticky lg:top-28 self-start">
      <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-eucalypt font-semibold">{p.vendor}</p>
      <h1 className="font-serif font-normal mt-1.5" style={{ fontSize: 'clamp(24px,3vw,34px)', lineHeight: 1.15 }}>{cleanProductTitle(p.title)}</h1>

      <div className="flex items-baseline gap-3 mt-3">
        <span className="font-serif" style={{ fontSize: '20px' }}>{fmt(price.amount, price.currencyCode)}</span>
        {onSale && compareAt && (
          <span className="font-serif text-charcoal-light line-through" style={{ fontSize: '15px' }}>{fmt(compareAt.amount, compareAt.currencyCode)}</span>
        )}
      </div>

      {p.editorial_note && (
        <p className="font-serif italic text-wine mt-4" style={{ fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.4 }}>&ldquo;{p.editorial_note}&rdquo;</p>
      )}

      {hasOptions && (
        <div className="mt-5">
          <label htmlFor="variant" className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light block mb-2">Options</label>
          <select
            id="variant"
            value={variantId}
            onChange={e => setVariantId(e.target.value)}
            className="w-full border border-cream-200 rounded-[2px] px-3 py-2.5 font-sans text-sm bg-white"
          >
            {variants.map(v => {
              const vAvailable = isVariantAvailable(v)
              return (
                <option key={v.id} value={v.id} disabled={!vAvailable}>
                  {v.title}{vAvailable ? '' : ' — sold out'}
                </option>
              )
            })}
          </select>
        </div>
      )}

      <div className="flex items-stretch gap-3 mt-6">
        <div className="flex items-center border border-cream-200 rounded-[2px]">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3.5 py-3 font-sans text-charcoal-light hover:text-ink transition-colors" aria-label="Decrease quantity">&minus;</button>
          <span className="px-1 font-sans text-sm w-6 text-center tabular-nums">{qty}</span>
          <button onClick={() => setQty(q => q + 1)} className="px-3.5 py-3 font-sans text-charcoal-light hover:text-ink transition-colors" aria-label="Increase quantity">+</button>
        </div>
        <button
          onClick={add}
          disabled={loading || !available}
          className="flex-1 bg-ink text-white font-sans text-[11px] tracking-[0.16em] uppercase rounded-[2px] py-3 hover:bg-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!available ? 'Sold out' : loading ? 'Adding…' : 'Add to cart'}
        </button>
      </div>

      <p className="font-sans text-[10px] tracking-[0.06em] text-charcoal-light/70 text-center mt-3">
        {isFreeShipping(p.vendor)
          ? <><span className="text-eucalypt font-semibold tracking-[0.12em] uppercase">Free shipping</span> &middot; 30-day returns</>
          : <>Free shipping over $99 &middot; 30-day returns</>}
      </p>
      <p className="text-center mt-2">
        <Link href="/shop/how-it-works" className="font-sans text-[10px] tracking-[0.06em] text-charcoal-light/50 hover:text-ink transition-colors underline underline-offset-2 decoration-[0.5px]">
          How Beauticate Shop works
        </Link>
      </p>

      {p.descriptionHtml && (
        <div
          className="prose prose-sm max-w-none mt-7 font-serif text-charcoal-light border-t border-cream-200 pt-6"
          dangerouslySetInnerHTML={{ __html: p.descriptionHtml }}
        />
      )}
    </div>
  )
}
