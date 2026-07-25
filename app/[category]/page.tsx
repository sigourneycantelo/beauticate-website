import { getArticlesByCategory } from '@/lib/content'
import { getCollectionByHandle, getProductsByHandles } from '@/lib/shopify'
import ArticleGrid from '@/components/article/ArticleGrid'
import ShopStrip from '@/components/home/ShopStrip'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ category: string }> }

const CATEGORY_COLLECTIONS: Record<string, { handle: string; eyebrow: string; heading: string }> = {
  'beauty-style': {
    handle: 'beauty',
    eyebrow: 'Beauticate Shop',
    heading: 'Beauty buys the team loves',
  },
  wellness: {
    handle: 'wellness',
    eyebrow: 'Beauticate Shop',
    heading: 'Wellness picks for every day',
  },
  living: {
    handle: 'living',
    eyebrow: 'Beauticate Shop',
    heading: 'Living essentials we love',
  },
}

const LA_EDIT_HANDLES = [
  'blush-pink-makeup-bag-bundle-for-stylish-organization',
  'natural-marine-collagen-berry-30-sachets',
  'no-7-soft-glam',
]

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const articles = getArticlesByCategory(category)
  if (!articles.length) notFound()

  const config = CATEGORY_COLLECTIONS[category]
  let products: import('@/types/shopify').ShopifyProduct[] = []
  if (config) {
    const collection = await getCollectionByHandle(config.handle)
    products = collection?.products?.nodes ?? []
  }

  const laEditProducts = category === 'beauty-style'
    ? await getProductsByHandles(LA_EDIT_HANDLES)
    : []

  const firstBatch = articles.slice(0, 6)
  const rest = articles.slice(6)

  return (
    <div className="max-w-wide mx-auto px-4 py-6 sm:py-12">
      <h1 className="font-sans uppercase tracking-[0.34em] text-xs mb-6 sm:mb-8">{category.replace(/-/g, ' ')}</h1>
      <ArticleGrid articles={firstBatch as any} />

      {products.length > 0 && config && (
        <div className="-mx-4 mt-8 sm:mt-12">
          <ShopStrip
            products={products}
            eyebrow={config.eyebrow}
            heading={<>{config.heading}</>}
            subheading="Curated by the Beauticate Collective"
          />
        </div>
      )}

      {laEditProducts.length > 0 && (
        <div className="-mx-4 mt-8 sm:mt-12">
          <ShopStrip
            products={laEditProducts}
            eyebrow="Kate Waterhouse"
            heading={<>The LA Style Edit</>}
            subheading="Shop the looks from Beverly Hills"
            cta={{ label: 'Read the story', href: '/beauty-style/beauty-tips/the-la-effect-beverly-hills-style-lessons' }}
          />
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <ArticleGrid articles={rest as any} />
        </div>
      )}
    </div>
  )
}
