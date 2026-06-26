import Header, { type MegaArticle, type MegaMenuEntry } from './Header'
import { getArticlesByCategory } from '@/lib/content'

type RawArticle = ReturnType<typeof getArticlesByCategory>[number]

function toMegaArticle(a: RawArticle): MegaArticle {
  if (!a) return { frontmatter: { title: '', slug: '', category: '' } }
  return {
    frontmatter: {
      title: a.frontmatter.title,
      slug: a.frontmatter.slug,
      category: a.frontmatter.category,
      subcategory: a.frontmatter.subcategory,
      featured_image: a.frontmatter.featured_image,
      featured_image_alt: a.frontmatter.featured_image_alt,
    },
  }
}

function makeEntries(
  subcategories: Array<{ label: string; href: string; cat: string; sub?: string }>
): MegaMenuEntry[] {
  return subcategories.map(({ label, href, cat, sub }) => ({
    label,
    href,
    articles: getArticlesByCategory(cat, sub).slice(0, 4).map(toMegaArticle),
  }))
}

export default function HeaderWithData() {
  const megaMenuArticles = {
    beauty: makeEntries([
      { label: 'Skin care', href: '/beauty-style/skin-care', cat: 'beauty-style', sub: 'skin-care' },
      { label: 'Makeup', href: '/beauty-style/makeup', cat: 'beauty-style', sub: 'makeup' },
      { label: 'Hair', href: '/beauty-style/hair', cat: 'beauty-style', sub: 'hair' },
      { label: 'Fragrance', href: '/beauty-style/fragrance', cat: 'beauty-style', sub: 'fragrance' },
      { label: 'Beauty tips', href: '/beauty-style/beauty-tips', cat: 'beauty-style', sub: 'beauty-tips' },
    ]),
    style: makeEntries([
      { label: 'Fashion', href: '/beauty-style/fashion', cat: 'beauty-style', sub: 'fashion' },
      { label: 'Accessories', href: '/beauty-style/accessories', cat: 'beauty-style', sub: 'accessories' },
      { label: 'Shopping edits', href: '/beauty-style/shopping-edits', cat: 'beauty-style', sub: 'shopping-edits' },
      { label: 'Style', href: '/beauty-style/style', cat: 'beauty-style', sub: 'style' },
    ]),
    wellness: makeEntries([
      { label: 'Health', href: '/wellness/health', cat: 'wellness', sub: 'health' },
      { label: 'Fitness', href: '/wellness/fitness', cat: 'wellness', sub: 'fitness' },
      { label: 'Mindset', href: '/wellness/mindset', cat: 'wellness', sub: 'mindset' },
      { label: 'All wellness', href: '/wellness', cat: 'wellness' },
    ]),
    interviews: makeEntries([
      { label: 'Creatives', href: '/interviews/creatives', cat: 'interviews', sub: 'creatives' },
      { label: 'Founders', href: '/interviews/founders', cat: 'interviews', sub: 'founders' },
      { label: 'Tastemakers', href: '/interviews/tastemakers', cat: 'interviews', sub: 'tastemakers' },
      { label: 'All interviews', href: '/interviews', cat: 'interviews' },
    ]),
  }

  return <Header megaMenuArticles={megaMenuArticles} />
}
