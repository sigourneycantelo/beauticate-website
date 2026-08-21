import Link from 'next/link'
import MetaViewContent from '@/components/analytics/MetaViewContent'
import ProductBuyBox from './ProductBuyBox'
import ProductGrid from './ProductGrid'
import ProductImageCarousel from './ProductImageCarousel'
import type { ShopifyProduct } from '@/types/shopify'
import { cleanProductTitle } from '@/lib/product-format'
import { resolveShopIntl } from '@/lib/shop-intl'

interface Props {
  product: ShopifyProduct
  related?: ShopifyProduct[]
  /** Real-time per-variant stock from getVariantAvailability; missing id ⇒ fall back to availableForSale. */
  availability?: Record<string, boolean>
}

const SITE = 'https://www.beauticate.com'

export default function ProductPage({ product: p, related = [], availability }: Props) {
  const images = p.images?.nodes?.length ? p.images.nodes : p.featuredImage ? [p.featuredImage] : []
  const title = cleanProductTitle(p.title)
  const isVariantAvailable = (v: ShopifyProduct['variants']['nodes'][number]) =>
    availability?.[v.id] ?? v.availableForSale
  const available = p.variants.nodes.some(isVariantAvailable)

  const variants = p.variants.nodes
  const minPrice = p.priceRange.minVariantPrice
  const maxPrice = p.priceRange.maxVariantPrice
  const hasMultipleVariants = variants.length > 1

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
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
    { name: title, url: `${SITE}/shop/products/${p.handle}` },
  ]
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  }

  const metaContentId = p.id?.split('/').pop() || p.handle

  return (
    <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(20px,4vw,56px)]">
      {/* Meta Pixel + CAPI: ViewContent for this product */}
      <MetaViewContent
        contentType="product"
        contentIds={[metaContentId]}
        contentName={title}
        contentCategory={p.productType || p.vendor}
        contentBrand={p.vendor}
        value={minPrice.amount}
        currency={minPrice.currencyCode}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-6">
        <Link href="/" className="hover:text-ink transition-colors">Home</Link>
        <span className="mx-2 opacity-40">/</span>
        <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
        <span className="mx-2 opacity-40">/</span>
        <span className="text-ink">{title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(24px,4vw,64px)]">
        <ProductImageCarousel images={images} vendor={p.vendor} title={p.title} />

        <ProductBuyBox
          product={p}
          availability={availability}
          intlOptions={resolveShopIntl(p.handle, p.vendor)}
        />
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
