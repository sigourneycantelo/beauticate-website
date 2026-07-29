import HeroSplit from '@/components/home/HeroSplit'
import StoriesTrio from '@/components/home/StoriesTrio'
import DuoStagger from '@/components/home/DuoStagger'
import DuoLeft from '@/components/home/DuoLeft'
import ShopStrip from '@/components/home/ShopStrip'
import type { ShopifyProduct } from '@/types/shopify'

interface Article {
  frontmatter: {
    title: string
    slug: string
    category: string
    subcategory?: string
    excerpt?: string
    featured_image?: string
    featured_image_alt?: string
    thumbnailPortrait?: string
    thumbnailPortrait_alt?: string
  }
}

interface ShopStripCopy {
  eyebrow?: string
  heading?: React.ReactNode
  subheading?: string
  cta?: { label: string; href: string }
}

interface Props {
  articles: Article[]
  shopProducts?: ShopifyProduct[]
  /** Optional custom copy for the embedded shop rail (first cycle only). */
  shopStrip?: ShopStripCopy
}

export default function EditorialSections({ articles, shopProducts = [], shopStrip }: Props) {
  let i = 0
  function take(n: number) {
    const slice = articles.slice(i, i + n).filter(Boolean)
    i += n
    return slice
  }

  type Section =
    | { type: 'hero'; article: Article }
    | { type: 'trio'; articles: Article[] }
    | { type: 'duo-stagger'; big: Article; small: Article }
    | { type: 'duo-left'; articles: Article[] }
    | { type: 'shop' }

  const sections: Section[] = []
  let cycleCount = 0

  const [hero] = take(1)
  if (hero) sections.push({ type: 'hero', article: hero })

  while (i < articles.length) {
    const trio = take(3)
    if (trio.length) sections.push({ type: 'trio', articles: trio })

    if (cycleCount === 0 && shopProducts.length > 0) {
      sections.push({ type: 'shop' })
    }

    const duo = take(2)
    if (duo.length === 2) {
      sections.push({ type: 'duo-stagger', big: duo[0], small: duo[1] })
    } else if (duo.length === 1) {
      sections.push({ type: 'trio', articles: duo })
      break
    }

    if (i >= articles.length) break

    const trio2 = take(3)
    if (trio2.length) sections.push({ type: 'trio', articles: trio2 })

    if (i >= articles.length) break

    const [split] = take(1)
    if (split) sections.push({ type: 'hero', article: split })

    if (i >= articles.length) break

    const duoL = take(2)
    if (duoL.length >= 2) {
      sections.push({ type: 'duo-left', articles: duoL })
    } else if (duoL.length === 1) {
      sections.push({ type: 'trio', articles: duoL })
    }

    if (i >= articles.length) break

    const trio3 = take(3)
    if (trio3.length) sections.push({ type: 'trio', articles: trio3 })

    cycleCount++
  }

  return (
    <>
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
            return (
              <ShopStrip
                key={`shop-${idx}`}
                products={shopProducts}
                eyebrow={shopStrip?.eyebrow}
                heading={shopStrip?.heading}
                subheading={shopStrip?.subheading}
                cta={shopStrip?.cta}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
