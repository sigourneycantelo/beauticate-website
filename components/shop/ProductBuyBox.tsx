'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from './CartProvider'
import type { ShopifyProduct } from '@/types/shopify'
import { isFreeShipping } from '@/lib/shop-taxonomy'
import { cleanProductTitle } from '@/lib/product-format'
import { useGeo } from '@/components/geo/GeoProvider'
import type { ShopIntlOptions } from '@/lib/shop-intl'

const fmt = (amount: string, currency: string) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency }).format(parseFloat(amount))

// Sticky right-hand buy box: brand, title, price, editorial note, variant, qty, add-to-cart.
export default function ProductBuyBox({ product: p, availability, intlOptions }: {
  product: ShopifyProduct
  /** Real-time per-variant stock from getVariantAvailability; missing id ⇒ fall back to availableForSale. */
  availability?: Record<string, boolean>
  /** Stockists that ship outside AU/NZ, resolved server-side (see lib/shop-intl.ts). */
  intlOptions?: ShopIntlOptions
}) {
  const variants = p.variants.nodes
  // Open on the cheapest in-stock variant so the price shown matches the card's
  // "From $X" (Shopify's first variant is often not the cheapest). Falls back to
  // cheapest overall, then the first variant.
  const cheapestFirst = [...variants].sort(
    (a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount)
  )
  const defaultVariant =
    cheapestFirst.find(v => (availability?.[v.id] ?? v.availableForSale)) ??
    cheapestFirst[0] ??
    variants[0]
  const [variantId, setVariantId] = useState(defaultVariant?.id)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const { addItem } = useCart()
  const { lane, market, ready } = useGeo()

  // The shop ships within AU/NZ only. Everyone else gets the buy action
  // substituted for a stockist who ships to them, or an honest note when we
  // don't have one yet. `ready` gates this until the country cookie is read,
  // so the statically rendered HTML stays the AU view.
  const intlLane = ready && lane === 'intl'
  const stockist = intlLane
    ? (market && intlOptions?.[market]) || intlOptions?.default
    : undefined

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

      {intlLane ? (
        stockist ? (
          <div className="mt-6">
            <a
              href={stockist.url}
              target="_blank"
              rel="sponsored noopener"
              className="block text-center bg-ink text-white font-sans text-[11px] tracking-[0.16em] uppercase rounded-[2px] py-3 hover:bg-charcoal-light transition-colors"
            >
              Shop via {stockist.retailer}
            </a>
            <p className="font-sans text-[10px] tracking-[0.06em] text-charcoal-light/70 text-center mt-3">
              Our shop ships within Australia and New Zealand, so we have pointed
              you to a stockist who delivers to you.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <div className="border border-cream-200 rounded-[2px] px-4 py-3.5 text-center">
              <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-charcoal-light">
                Ships within Australia and New Zealand
              </p>
            </div>
            <p className="font-sans text-[10px] tracking-[0.06em] text-charcoal-light/70 text-center mt-3">
              We cannot deliver this one to you yet. Try {p.vendor} directly, and
              tell us where you are shopping from so we know where to expand.
            </p>
          </div>
        )
      ) : (
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
      )}

      {!intlLane && (isFreeShipping(p.vendor) ? (
        <p className="font-sans text-[12px] tracking-[0.16em] uppercase text-eucalypt font-semibold text-center mt-3.5">
          Free Shipping
        </p>
      ) : (
        <p className="font-sans text-[10px] tracking-[0.06em] text-charcoal-light/70 text-center mt-3">
          Shipping calculated at checkout
        </p>
      ))}
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
