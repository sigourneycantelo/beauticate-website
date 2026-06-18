import { getCollectionByHandle } from '@/lib/shopify'
import { getArticlesByCategory } from '@/lib/content'
import ProductGrid from '@/components/shop/ProductGrid'
import ArticleGrid from '@/components/article/ArticleGrid'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props { params: Promise<{ collection: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection: handle } = await params
  const collection = await getCollectionByHandle(handle)
  if (!collection) return {}
  return { title: collection.title, description: collection.description }
}

export default async function CollectionPage({ params }: Props) {
  const { collection: handle } = await params
  const collection = await getCollectionByHandle(handle)
  if (!collection) notFound()

  // Surface related editorial alongside products
  const relatedArticles = getArticlesByCategory('sigourneys-edit').slice(0, 3)

  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <h1 className="mb-4">{collection.title}</h1>
      {collection.description && (
        <p className="text-lg text-charcoal-light mb-10 max-w-2xl">{collection.description}</p>
      )}
      <ProductGrid products={collection.products.nodes} />
      {relatedArticles.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8">From the edit</h2>
          <ArticleGrid articles={relatedArticles as any} />
        </section>
      )}
    </div>
  )
}
