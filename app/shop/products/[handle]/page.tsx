import { getProductByHandle, getProductsByType, getProducts } from '@/lib/shopify'
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

  let pool: ShopifyProduct[] = product.productType ? await getProductsByType(product.productType, 8) : []
  if (pool.length < 5) pool = [...pool, ...(await getProducts(8))]

  const seen = new Set<string>([product.handle])
  const related = pool.filter(r => {
    if (seen.has(r.handle)) return false
    seen.add(r.handle)
    return true
  }).slice(0, 4)

  return <ProductPage product={product} related={related} />
}
