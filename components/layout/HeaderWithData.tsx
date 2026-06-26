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
    destinations: [
      { label: 'Hotels & Resorts', href: '/destinations/hotels-resorts', groupHeader: 'Travel', articles: getArticlesByCategory('destinations', 'hotels-resorts').slice(0, 4).map(toMegaArticle) },
      { label: 'Spas & Retreats', href: '/destinations/spas-retreats', articles: getArticlesByCategory('destinations', 'spas-retreats').slice(0, 4).map(toMegaArticle) },
      { label: 'City Guides', href: '/destinations/city-guides', articles: getArticlesByCategory('destinations', 'city-guides').slice(0, 4).map(toMegaArticle) },
      { label: 'Stays', href: '/destinations/stays', articles: getArticlesByCategory('destinations', 'stays').slice(0, 4).map(toMegaArticle) },
      { label: 'Beauty & Wellness Directory', href: '/destinations/beauty-wellness-directory', groupHeader: 'Beauty & Wellness Directory', articles: getArticlesByCategory('destinations', 'beauty-wellness-directory').slice(0, 4).map(toMegaArticle) },
      { label: 'NSW', href: '/destinations/nsw', articles: getArticlesByCategory('destinations', 'nsw').slice(0, 4).map(toMegaArticle) },
      { label: 'VIC', href: '/destinations/vic', articles: getArticlesByCategory('destinations', 'vic').slice(0, 4).map(toMegaArticle) },
      { label: 'QLD', href: '/destinations/qld', articles: getArticlesByCategory('destinations', 'qld').slice(0, 4).map(toMegaArticle) },
      { label: 'WA', href: '/destinations/wa', articles: getArticlesByCategory('destinations', 'wa').slice(0, 4).map(toMegaArticle) },
      { label: 'SA', href: '/destinations/sa', articles: getArticlesByCategory('destinations', 'sa').slice(0, 4).map(toMegaArticle) },
      { label: 'TAS', href: '/destinations/tas', articles: getArticlesByCategory('destinations', 'tas').slice(0, 4).map(toMegaArticle) },
      { label: 'ACT', href: '/destinations/act', articles: getArticlesByCategory('destinations', 'act').slice(0, 4).map(toMegaArticle) },
      { label: 'NT', href: '/destinations/nt', articles: getArticlesByCategory('destinations', 'nt').slice(0, 4).map(toMegaArticle) },
    ],
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
