import { getProductByHandle, getProductsByType, getProducts, getVariantAvailability } from '@/lib/shopify'
import ProductPage from '@/components/shop/ProductPage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ShopifyProduct } from '@/types/shopify'

interface Props { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) return {}
  return {
    title: `${product.title} — ${product.vendor}`,
    description: product.description.slice(0, 160),
    alternates: { canonical: `https://www.beauticate.com/shop/products/${handle}` },
    openGraph: {
      title: `${product.title} — ${product.vendor}`,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  }
}

export default async function ProductRoute({ params }: Props) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) notFound()

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

  return <ProductPage product={product} related={related} availability={availability} />
}
