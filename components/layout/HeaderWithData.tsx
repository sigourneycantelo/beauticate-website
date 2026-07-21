import Header, { type MegaArticle, type MegaMenuEntry } from './Header'
import { getArticlesByCategory, getArticlesBySubcategory } from '@/lib/content'

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
    articles: (sub ? getArticlesBySubcategory(cat, sub) : getArticlesByCategory(cat))
      .slice(0, 4)
      .map(toMegaArticle),
  }))
}

// Beauty and Style both live under the `beauty-style` category, so each menu's
// mix must be built from its own explicit subcategory list rather than from the
// whole category (which would blend the two together).
const BEAUTY_SUBS = [
  { label: 'Skin care', href: '/beauty-style/skin-care', cat: 'beauty-style', sub: 'skin-care' },
  { label: 'Makeup', href: '/beauty-style/makeup', cat: 'beauty-style', sub: 'makeup' },
  { label: 'Hair', href: '/beauty-style/hair', cat: 'beauty-style', sub: 'hair' },
  { label: 'Nails', href: '/beauty-style/nails', cat: 'beauty-style', sub: 'nails' },
  { label: 'Fragrance', href: '/beauty-style/fragrance', cat: 'beauty-style', sub: 'fragrance' },
  { label: 'Cosmetic', href: '/beauty-style/cosmetic', cat: 'beauty-style', sub: 'cosmetic' },
  { label: 'Beauty tips', href: '/beauty-style/beauty-tips', cat: 'beauty-style', sub: 'beauty-tips' },
]

// Only `style` currently has content. Fashion / Accessories / Shopping edits had
// no articles in the repo, so they're omitted until that content exists.
const STYLE_SUBS = [
  { label: 'Style', href: '/beauty-style/style', cat: 'beauty-style', sub: 'style' },
]

const LIVING_SUBS = [
  { label: 'Interiors', href: '/living/interiors', cat: 'living', sub: 'interiors' },
  { label: 'Lifestyle', href: '/living/lifestyle', cat: 'living', sub: 'lifestyle' },
  { label: 'Entertaining', href: '/living/entertaining', cat: 'living', sub: 'entertaining' },
  { label: 'Sustainability', href: '/living/sustainability', cat: 'living', sub: 'sustainability' },
]

const WELLNESS_SUBS = [
  { label: 'Biohacking', href: '/wellness/biohacking', cat: 'wellness', sub: 'biohacking' },
  { label: 'Mindset', href: '/wellness/mindset', cat: 'wellness', sub: 'mindset' },
  { label: 'Fitness', href: '/wellness/fitness', cat: 'wellness', sub: 'fitness' },
  { label: 'Health', href: '/wellness/health', cat: 'wellness', sub: 'health' },
]

// Default preview for a menu: the freshest story from each subcategory, sorted
// newest-first and capped at 4 — so opening the menu shows a genuine mix across
// its subcategories rather than only the first one.
function latestAcross(subs: Array<{ cat: string; sub?: string }>): MegaArticle[] {
  const ts = (a: RawArticle) =>
    new Date(a?.frontmatter.date_published ?? '2000-01-01').getTime()
  return subs
    .map(({ cat, sub }) => getArticlesByCategory(cat, sub)[0])
    .filter((a): a is RawArticle => Boolean(a))
    .sort((a, b) => ts(b) - ts(a))
    .slice(0, 4)
    .map(toMegaArticle)
}

export default function HeaderWithData() {
  const megaMenuArticles = {
    beauty: [
      // Default preview shown on hover — a mix across all beauty subcategories.
      // `hidden` keeps it out of the tab rail; the visible tabs are the five
      // subcategories below.
      { label: 'Latest', href: '/beauty-style', articles: latestAcross(BEAUTY_SUBS), hidden: true },
      ...makeEntries(BEAUTY_SUBS),
    ],
    // Only one Style subcategory has content for now, so no hidden "Latest" mix
    // is needed — the single Style tab shows its latest 4 by default.
    style: makeEntries(STYLE_SUBS),
    living: [
      { label: 'Latest', href: '/living', articles: latestAcross(LIVING_SUBS), hidden: true },
      ...makeEntries(LIVING_SUBS),
    ],
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
    wellness: [
      { label: 'Latest', href: '/wellness', articles: latestAcross(WELLNESS_SUBS), hidden: true },
      ...makeEntries(WELLNESS_SUBS),
    ],
    interviews: makeEntries([
      { label: 'Creatives', href: '/interviews/creatives', cat: 'interviews', sub: 'creatives' },
      { label: 'Founders', href: '/interviews/founders', cat: 'interviews', sub: 'founders' },
      { label: 'Tastemakers', href: '/interviews/tastemakers', cat: 'interviews', sub: 'tastemakers' },
      { label: 'All interviews', href: '/interviews', cat: 'interviews' },
    ]),
  }

  return <Header megaMenuArticles={megaMenuArticles} />
}
