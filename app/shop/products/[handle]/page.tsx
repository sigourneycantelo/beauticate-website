import { getProductByHandle, getProductsByType, getProducts, getVariantAvailability } from '@/lib/shopify'
import ProductPage from '@/components/shop/ProductPage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ShopifyProduct } from '@/types/shopify'
import { cleanProductTitle } from '@/lib/product-format'
import { GWP, isGiftProduct } from '@/lib/gwp'

interface Props { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  if (handle === GWP.giftHandle) return {}
  const product = await getProductByHandle(handle)
  if (!product) return {}
  const title = cleanProductTitle(product.title)
  return {
    title: `${title} — ${product.vendor}`,
    description: product.description.slice(0, 160),
    alternates: { canonical: `https://www.beauticate.com/shop/products/${handle}` },
    openGraph: {
      title: `${title} — ${product.vendor}`,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  }
}

export default async function ProductRoute({ params }: Props) {
  const { handle } = await params
  // The gift-with-purchase SKU has no page of its own. It is a real, purchasable
  // $0.01 product in Shopify (Modern Dropship can't take $0.00), which without this
  // would let anyone who found the URL buy the illuminator for a cent. The cart API
  // refuses to add it directly too — this just closes the front door.
  if (handle === GWP.giftHandle) notFound()

  const product = await getProductByHandle(handle)
  if (!product || isGiftProduct(product)) notFound()

  // Probe real-time stock in parallel with the related-products fetch (see
  // getVariantAvailability — the product query's availableForSale can't be trusted).
  const availabilityPromise = getVariantAvailability(product.variants.nodes.map(v => v.id))

  let pool: ShopifyProduct[] = product.productType
    ? await getProductsByType(product.productType, 8, product.vendor)
    : []
  if (pool.length < 5) {
    const extra = await getProducts(8)
    pool = [...pool, ...extra.filter(p => p.vendor === product.vendor)]
  }

  const seen = new Set<string>([product.handle])
  const related = pool.filter(r => {
    if (seen.has(r.handle)) return false
    seen.add(r.handle)
    return true
  }).slice(0, 4)

  const availability = await availabilityPromise

  // Pitch the BOOIE gift only when the gift can actually be given: right brand, and
  // stock left of the 22. getVariantAvailability probes a throwaway cart because the
  // product query's availableForSale is unreliable — and it fails open, so a hiccup
  // shows the offer rather than hiding it (the cart then reconciles for real).
  const qualifiesForGift =
    GWP.enabled && product.vendor?.trim().toLowerCase() === GWP.vendor.toLowerCase()
  const giftStock = qualifiesForGift ? await getVariantAvailability([GWP.giftVariantId]) : {}
  const showGift = qualifiesForGift && (giftStock[GWP.giftVariantId] ?? true)

  return <ProductPage product={product} related={related} availability={availability} showGift={showGift} />
}
