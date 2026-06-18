import Image from 'next/image'
import type { ShopifyProduct } from '@/types/shopify'
import AddToCartButton from './AddToCartButton'

interface Props { product: ShopifyProduct }

export default function ProductPage({ product: p }: Props) {
  const price = p.priceRange.minVariantPrice
  const formatted = new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: price.currencyCode
  }).format(parseFloat(price.amount))

  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          {p.featuredImage && (
            <div className="relative aspect-square bg-cream-100">
              <Image src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title} fill className="object-cover" />
            </div>
          )}
        </div>
        {/* Details */}
        <div>
          <p className="text-xs tracking-widest uppercase text-charcoal-light mb-2">{p.vendor}</p>
          <h1 className="text-2xl md:text-3xl mb-2">{p.title}</h1>
          <p className="text-xl mb-6">{formatted}</p>
          {p.editorial_note && (
            <blockquote className="border-l-2 border-gold pl-4 italic text-charcoal-light text-sm mb-6">
              "{p.editorial_note}"
            </blockquote>
          )}
          <div className="mb-6">
            <AddToCartButton product={p} />
          </div>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: p.descriptionHtml }}
          />
        </div>
      </div>
    </div>
  )
}
