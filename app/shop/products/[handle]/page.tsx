import { getProductByHandle } from '@/lib/shopify'
import ProductPage from '@/components/shop/ProductPage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) return {}
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  }
}

export default async function ProductRoute({ params }: Props) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) notFound()
  return <ProductPage product={product} />
}
