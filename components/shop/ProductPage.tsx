import Link from 'next/link'
import { withoutOfferPreamble } from '@/lib/product-description'
import MetaViewContent from '@/components/analytics/MetaViewContent'
import ProductBuyBox from './ProductBuyBox'
import ProductGrid from './ProductGrid'
import ProductImageCarousel from './ProductImageCarousel'
import PDPEditorNote from './PDPEditorNote'
import VariantSelectionProvider from './VariantSelectionProvider'
import ProductReviews from './ProductReviews'
import type { ShopifyProduct } from '@/types/shopify'
import type { Review, Rating } from '@/lib/judgeme'
import { aggregateOf } from '@/lib/judgeme'
import type { GiftOffer } from '@/lib/gwp'
import type { EditorNote } from '@/data/pdp-editors-notes'
import { cleanProductTitle } from '@/lib/product-format'
import { resolveShopIntl } from '@/lib/shop-intl'
import { buildGallery, findVariant, pickDefaultVariant } from '@/lib/shop-variant'

interface ArticleThumb {
  title: string
  slug: string
  type: 'interview' | 'editorial' | 'vodcast'
  image?: string
}

interface Props {
  product: ShopifyProduct
  related?: ShopifyProduct[]
  /** Real-time per-variant stock from getVariantAvailability; missing id ⇒ fall back to availableForSale. */
  availability?: Record<string, boolean>
  /** The gift offer this product qualifies for, when its gift is in stock. */
  giftOffer?: GiftOffer
  /** Raw `?variant=` off the URL — the id an editorial card's variantHref writes. */
  variantParam?: string
  /** Displayable Judge.me reviews for this product, newest first. */
  reviews?: Review[]
  /** Aggregates for the "Complete the ritual" cards, by handle. */
  relatedRatings?: Record<string, Rating>
  /** Aggregate for those reviews, or null when there are none. */
  rating?: Rating | null
  /** Editor's note for this product, resolved by handle in the route. */
  editorNote?: EditorNote
  /** Resolved article thumbnails for the "As seen in" cards. */
  editorArticles?: ArticleThumb[]
}

const SITE = 'https://www.beauticate.com'

export default function ProductPage({ product: p, related = [], availability, giftOffer, variantParam, reviews = [], rating = null, relatedRatings, editorNote, editorArticles = [] }: Props) {
  // Resolve the opening variant here, on the server, so the buy box and the gallery
  // agree on it from the first paint — including on the `?variant=` links editorial
  // product cards already write (see variantHref).
  const openingVariant = findVariant(p, variantParam) ?? pickDefaultVariant(p.variants.nodes, availability)
  const { images, variantImageIndex, fallbackIndex } = buildGallery(p, openingVariant?.id)
  const title = cleanProductTitle(p.title)
  const isVariantAvailable = (v: ShopifyProduct['variants']['nodes'][number]) =>
    availability?.[v.id] ?? v.availableForSale
  const available = p.variants.nodes.some(isVariantAvailable)

  const variants = p.variants.nodes
  const minPrice = p.priceRange.minVariantPrice
  const maxPrice = p.priceRange.maxVariantPrice
  const hasMultipleVariants = variants.length > 1

  // Schema describes only reviews from confirmed buyers — see the note inside
  // productSchema below. The page itself still shows everything published.
  const verifiedReviews = reviews.filter(r => r.verified)
  const verifiedRating = aggregateOf(verifiedReviews)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    image: images.map(i => i.url),
    description: withoutOfferPreamble(p.description),
    brand: { '@type': 'Brand', name: p.vendor },
    ...(p.productType ? { category: p.productType } : {}),
    ...(variants[0]?.sku ? { sku: variants[0].sku } : {}),
    ...(variants[0]?.barcode ? { gtin: variants[0].barcode } : {}),
    // Ratings are emitted ONLY when the same reviews are rendered on this page,
    // below. Google's structured-data policy requires markup to reflect content
    // visible to the user, and an invisible star rating is exactly what its
    // spammy-markup manual action exists for — see the "Review ratings must be
    // visible or absent" note in CLAUDE.md, which this follows deliberately.
    //
    // Only VERIFIED-PURCHASE reviews are marked up, which is stricter than what
    // the page displays. Judge.me's moderation is a 14-day window, not a gate:
    // a pending review nobody moderates is auto-published after 14 days to meet
    // Shopify's policy. So an injected review that slipped past the guards in
    // app/api/reviews and went unnoticed for a fortnight would publish itself.
    // Keeping unverified reviews out of the schema means such a review can reach
    // the page but never the star rating in Google's results — the thing with by
    // far the slowest recovery time, since it outlives the review that caused it.
    //
    // Marking up a SUBSET of what is displayed is compliant; marking up more than
    // is displayed is the violation. The aggregate is therefore recomputed over
    // the verified subset rather than reusing the page's own average, so the
    // ratingValue always describes exactly the reviews listed beneath it.
    ...(verifiedRating && verifiedReviews.length > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: verifiedRating.average.toFixed(1),
            reviewCount: verifiedRating.count,
            bestRating: 5,
            worstRating: 1,
          },
          review: verifiedReviews.slice(0, 10).map(r => ({
            '@type': 'Review',
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
            author: { '@type': 'Person', name: r.author },
            datePublished: r.createdAt.slice(0, 10),
            ...(r.title ? { name: r.title } : {}),
            ...(r.body ? { reviewBody: r.body } : {}),
          })),
        }
      : {}),
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

      <VariantSelectionProvider
        initialVariantId={openingVariant?.id}
        variantIds={p.variants.nodes.map(v => v.id)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(24px,4vw,64px)]">
          <ProductImageCarousel
            images={images}
            vendor={p.vendor}
            title={p.title}
            variantImageIndex={variantImageIndex}
            fallbackIndex={fallbackIndex}
          />

          <ProductBuyBox
            product={p}
            availability={availability}
            intlOptions={resolveShopIntl(p.handle, p.vendor)}
            giftOffer={giftOffer}
          />
        </div>
      </VariantSelectionProvider>

      {editorNote && (
        <PDPEditorNote note={editorNote} articles={editorArticles} />
      )}

      <ProductReviews reviews={reviews} rating={rating} handle={p.handle} />

      {related.length > 0 && (
        <section className="mt-[clamp(48px,7vw,96px)]">
          <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-eucalypt font-semibold text-center mb-8">
            Complete the ritual
          </p>
          <ProductGrid products={related.slice(0, 4)} ratings={relatedRatings} />
        </section>
      )}
    </div>
  )
}
