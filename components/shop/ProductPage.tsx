import Image from 'next/image'
import Link from 'next/link'
import ProductBuyBox from './ProductBuyBox'
import ProductGrid from './ProductGrid'
import type { ShopifyProduct } from '@/types/shopify'

interface Props { product: ShopifyProduct; related?: ShopifyProduct[] }

const SITE = 'https://www.beauticate.com'

export default function ProductPage({ product: p, related = [] }: Props) {
  const images = p.images?.nodes?.length ? p.images.nodes : p.featuredImage ? [p.featuredImage] : []
  const available = p.variants.nodes.some(v => v.availableForSale)

  const variants = p.variants.nodes
  const minPrice = p.priceRange.minVariantPrice
  const maxPrice = p.priceRange.maxVariantPrice
  const hasMultipleVariants = variants.length > 1

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    image: images.map(i => i.url),
    description: p.description,
    brand: { '@type': 'Brand', name: p.vendor },
    ...(p.productType ? { category: p.productType } : {}),
    ...(variants[0]?.sku ? { sku: variants[0].sku } : {}),
    ...(variants[0]?.barcode ? { gtin: variants[0].barcode } : {}),
    offers: hasMultipleVariants
      ? {
          '@type': 'AggregateOffer',
          lowPrice: parseFloat(minPrice.amount).toFixed(2),
          highPrice: parseFloat(maxPrice.amount).toFixed(2),
          priceCurrency: minPrice.currencyCode,
          offerCount: variants.length,
          availability: available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: `${SITE}/shop/products/${p.handle}`,
          seller: { '@type': 'Organization', name: 'Beauticate' },
        }
      : {
          '@type': 'Offer',
          price: parseFloat(minPrice.amount).toFixed(2),
          priceCurrency: minPrice.currencyCode,
          availability: available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: `${SITE}/shop/products/${p.handle}`,
          seller: { '@type': 'Organization', name: 'Beauticate' },
        },
  }

  const crumbs = [
    { name: 'Home', url: `${SITE}/` },
    { name: 'Shop', url: `${SITE}/shop` },
    { name: p.title, url: `${SITE}/shop/products/${p.handle}` },
  ]
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  }

  return (
    <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(20px,4vw,56px)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-6">
        <Link href="/" className="hover:text-ink transition-colors">Home</Link>
        <span className="mx-2 opacity-40">/</span>
        <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
        <span className="mx-2 opacity-40">/</span>
        <span className="text-ink">{p.title}</span>
      </nav>

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
