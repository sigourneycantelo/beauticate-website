import { getArticlesByCategory } from '@/lib/content'
import { getCollectionByHandle, getProductsByHandles } from '@/lib/shopify'
import { buildCategoryMetadata } from '@/lib/seo'
import ArticleGrid from '@/components/article/ArticleGrid'
import EditorialSections from '@/components/shared/EditorialSections'
import ShopStrip from '@/components/home/ShopStrip'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  if (!getArticlesByCategory(category).length) return {}
  return buildCategoryMetadata(category)
}

// Top-level category pages that get the full editorial magazine layout
// (HeroSplit → trio → shop rail → duo → trio → hero → duo-left → trio, repeating),
// exactly like the subcategory archive pages. Each maps to a broad Shopify
// collection for the product rail sitting under the first trio. Handles are the
// live collection handles from lib/shop-taxonomy.ts.
const CATEGORY_COLLECTIONS: Record<string, { handle: string; eyebrow: string; heading: string; subheading: string }> = {
  'beauty-style': {
    handle: 'beauty',
    eyebrow: 'Beauticate Shop',
    heading: 'Beauty buys the team loves',
    subheading: 'Curated by the Beauticate Collective',
  },
  wellness: {
    handle: 'wellness',
    eyebrow: 'Beauticate Shop',
    heading: 'Wellness picks for every day',
    subheading: 'Curated by the Beauticate Collective',
  },
  living: {
    handle: 'living-interiors',
    eyebrow: 'Beauticate Shop',
    heading: 'Living essentials we love',
    subheading: 'Curated by the Beauticate Collective',
  },
}

const EDITORIAL_CATEGORIES = new Set(Object.keys(CATEGORY_COLLECTIONS))
const MAX_EDITORIAL = 34

const LA_EDIT_HANDLES = [
  'blush-pink-makeup-bag-bundle-for-stylish-organization',
  'natural-marine-collagen-berry-30-sachets',
  'no-7-soft-glam',
]

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const rawArticles = getArticlesByCategory(category)
    .filter((a): a is NonNullable<typeof a> => a != null && a.frontmatter != null)
  if (!rawArticles.length) notFound()

  // Non-editorial categories keep the simple grid.
  if (!EDITORIAL_CATEGORIES.has(category)) {
    return (
      <div className="max-w-wide mx-auto px-4 py-6 sm:py-12">
        <h1 className="font-sans uppercase tracking-[0.34em] text-xs mb-6 sm:mb-8">{category.replace(/-/g, ' ')}</h1>
        <ArticleGrid articles={rawArticles as any} />
      </div>
    )
  }

  const config = CATEGORY_COLLECTIONS[category]

  // Strip content/products from the payload — only frontmatter is needed for the
  // editorial cards, and serialising full MDX bodies blows the RSC payload limit.
  const articles = rawArticles.slice(0, MAX_EDITORIAL).map(a => ({ frontmatter: a.frontmatter }))

  const collection = await getCollectionByHandle(config.handle)
  const shopProducts = collection?.products?.nodes ?? []

  const laEditProducts = category === 'beauty-style'
    ? await getProductsByHandles(LA_EDIT_HANDLES)
    : []

  return (
    <>
      <div
        className="text-center"
        style={{ padding: 'clamp(48px,6vw,82px) clamp(20px,6vw,104px) 0' }}
      >
        <h1
          className="font-sans uppercase tracking-[0.34em] text-xs font-medium"
          style={{ opacity: 0.55 }}
        >
          {category.replace(/-/g, ' ')}
        </h1>
      </div>

      <EditorialSections
        articles={articles as any}
        shopProducts={shopProducts}
        shopStrip={{
          eyebrow: config.eyebrow,
          heading: <>{config.heading}</>,
          subheading: config.subheading,
        }}
      />

      {laEditProducts.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <ShopStrip
            products={laEditProducts}
            eyebrow="Kate Waterhouse"
            heading={<>The LA Style Edit</>}
            subheading="Shop the looks from Beverly Hills"
            cta={{ label: 'Read the story', href: '/beauty-style/beauty-tips/the-la-effect-beverly-hills-style-lessons' }}
          />
        </div>
      )}
    </>
  )
}
