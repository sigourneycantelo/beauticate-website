import { getArticlesByCategory } from '@/lib/content'
import { getProductsByTag } from '@/lib/shopify'
import ArticleGrid from '@/components/article/ArticleGrid'
import { notFound } from 'next/navigation'

import HeroSplit from '@/components/home/HeroSplit'
import StoriesTrio from '@/components/home/StoriesTrio'
import DuoStagger from '@/components/home/DuoStagger'
import DuoLeft from '@/components/home/DuoLeft'
import ShopStrip from '@/components/home/ShopStrip'

const CATEGORY_LABELS: Record<string, string> = {
  'beauty-style': 'Beauty & Style',
  wellness: 'Wellness',
  living: 'Living',
  destinations: 'Destinations',
  interviews: 'Interviews',
  podcast: 'Podcast',
}

const CATEGORY_SHOP_TAG: Record<string, string> = {
  'beauty-style': 'beauty',
  wellness: 'wellness',
}

const EDITORIAL_CATEGORIES = new Set(['beauty-style', 'wellness', 'living'])

interface Props { params: Promise<{ category: string }> }

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const rawArticles = getArticlesByCategory(category)
  const allArticles = rawArticles.filter((a): a is NonNullable<typeof a> => a != null && a.frontmatter != null)
  if (!allArticles.length) notFound()

  const label = CATEGORY_LABELS[category] ?? category.replace(/-/g, ' ')

  if (!EDITORIAL_CATEGORIES.has(category)) {
    return (
      <div className="max-w-wide mx-auto px-4 py-6 sm:py-12">
        <h1 className="font-sans uppercase tracking-[0.34em] text-xs mb-6 sm:mb-8">{label}</h1>
        <ArticleGrid articles={allArticles as any} />
      </div>
    )
  }

  const MAX_EDITORIAL = 34
  const articles = allArticles.slice(0, MAX_EDITORIAL).map(a => ({
    frontmatter: a.frontmatter,
  }))

  const shopTag = CATEGORY_SHOP_TAG[category]
  const shopProducts = shopTag ? await getProductsByTag(shopTag, 12) : []

  // Consume articles into layout sections using a rolling index
  let i = 0
  function take(n: number) {
    const slice = articles.slice(i, i + n).filter(Boolean) as typeof articles
    i += n
    return slice
  }

  // Build repeating section blocks from the articles
  type Section =
    | { type: 'hero'; article: (typeof articles)[number] }
    | { type: 'trio'; articles: typeof articles }
    | { type: 'duo-stagger'; big: (typeof articles)[number]; small: (typeof articles)[number] }
    | { type: 'duo-left'; articles: typeof articles }
    | { type: 'shop' }

  const sections: Section[] = []
  let cycleCount = 0

  // First hero
  const [hero] = take(1)
  if (hero) sections.push({ type: 'hero', article: hero })

  while (i < articles.length) {
    // Trio
    const trio = take(3)
    if (trio.length) sections.push({ type: 'trio', articles: trio })

    // Product strip — only after first cycle, and only once
    if (cycleCount === 0 && shopProducts.length > 0) {
      sections.push({ type: 'shop' })
    }

    // Duo stagger
    const duo = take(2)
    if (duo.length === 2) {
      sections.push({ type: 'duo-stagger', big: duo[0], small: duo[1] })
    } else if (duo.length === 1) {
      // Odd article left — wrap in a trio-style single
      sections.push({ type: 'trio', articles: duo })
      break
    }

    if (i >= articles.length) break

    // Trio
    const trio2 = take(3)
    if (trio2.length) sections.push({ type: 'trio', articles: trio2 })

    if (i >= articles.length) break

    // Hero split (single highlight)
    const [split] = take(1)
    if (split) sections.push({ type: 'hero', article: split })

    if (i >= articles.length) break

    // Duo left
    const duoL = take(2)
    if (duoL.length >= 2) {
      sections.push({ type: 'duo-left', articles: duoL })
    } else if (duoL.length === 1) {
      sections.push({ type: 'trio', articles: duoL })
    }

    if (i >= articles.length) break

    // Trio
    const trio3 = take(3)
    if (trio3.length) sections.push({ type: 'trio', articles: trio3 })

    cycleCount++
  }

  return (
    <>
      {/* Category heading */}
      <div
        className="text-center"
        style={{ padding: 'clamp(48px,6vw,82px) clamp(20px,6vw,104px) 0' }}
      >
        <h1
          className="font-sans uppercase tracking-[0.34em] text-xs font-medium"
          style={{ opacity: 0.55 }}
        >
          {label}
        </h1>
      </div>

      {sections.map((section, idx) => {
        switch (section.type) {
          case 'hero':
            return <HeroSplit key={`hero-${idx}`} article={section.article as any} />
          case 'trio':
            return <StoriesTrio key={`trio-${idx}`} articles={section.articles as any} />
          case 'duo-stagger':
            return <DuoStagger key={`duo-s-${idx}`} big={section.big as any} small={section.small as any} />
          case 'duo-left':
            return <DuoLeft key={`duo-l-${idx}`} articles={section.articles as any} />
          case 'shop':
            return <ShopStrip key={`shop-${idx}`} products={shopProducts} />
          default:
            return null
        }
      })}
    </>
  )
}
