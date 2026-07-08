import Image from 'next/image'
import Script from 'next/script'
import ProductBuyBox from './ProductBuyBox'
import ProductGrid from './ProductGrid'
import type { ShopifyProduct } from '@/types/shopify'

interface Props { product: ShopifyProduct; related?: ShopifyProduct[] }

export default function ProductPage({ product: p, related = [] }: Props) {
  const price = p.priceRange.minVariantPrice
  const images = p.images?.nodes?.length ? p.images.nodes : p.featuredImage ? [p.featuredImage] : []
  const available = p.variants.nodes.some(v => v.availableForSale)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    image: images.map(i => i.url),
    description: p.description,
    brand: { '@type': 'Brand', name: p.vendor },
    ...(p.productType ? { category: p.productType } : {}),
    offers: {
      '@type': 'Offer',
      price: parseFloat(price.amount).toFixed(2),
      priceCurrency: price.currencyCode,
      availability: available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://www.beauticate.com/shop/products/${p.handle}`,
    },
  }

  return (
    <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(28px,4vw,56px)]">
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(24px,4vw,64px)]">
        <div className="flex flex-col gap-3">
          {images.map((img, i) => (
            <div key={img.url + i} className="relative bg-tile rounded-[2px] overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <Image
                src={img.url}
                alt={img.altText ?? `${p.vendor} ${p.title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-5"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        <ProductBuyBox product={p} />
      </div>

      {related.length > 0 && (
        <section className="mt-[clamp(48px,7vw,96px)]">
          <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-eucalypt font-semibold text-center mb-8">
            Complete the ritual
          </p>
          <ProductGrid products={related.slice(0, 4)} />
        </section>
      )}
    </div>
  )
}
