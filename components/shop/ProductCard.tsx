'use client'
import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/types/shopify'
import AddToCartButton from './AddToCartButton'

interface Props { product: ShopifyProduct; showEditorial?: boolean }

export default function ProductCard({ product: p, showEditorial = false }: Props) {
  const price = p.priceRange.minVariantPrice
  const formatted = new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: price.currencyCode
  }).format(parseFloat(price.amount))

  return (
    <article className="group">
      <Link href={`/shop/products/${p.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          {p.featuredImage && (
            <Image
              src={p.featuredImage.url}
              alt={p.featuredImage.altText ?? p.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <div className="mt-3">
          <p className="text-xs tracking-widest uppercase text-charcoal-light mb-1">{p.vendor}</p>
          <h3 className="font-sans text-sm font-medium leading-snug group-hover:text-gold transition-colors">{p.title}</h3>
          <p className="text-sm mt-1">{formatted}</p>
          {showEditorial && p.editorial_note && (
            <p className="text-xs text-charcoal-light mt-1 italic">"{p.editorial_note}"</p>
          )}
        </div>
      </Link>
      <div className="mt-3">
        <AddToCartButton product={p} />
      </div>
    </article>
  )
}
