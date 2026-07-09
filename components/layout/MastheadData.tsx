import Masthead, { type Pillar, type MegaCard, type MegaSub } from './Masthead'
import { getArticlesByCategory } from '@/lib/content'
import { getCollections } from '@/lib/shopify'
import { BROAD_CATEGORIES } from '@/lib/shop-taxonomy'
import type { ShopifyCollection } from '@/types/shopify'

// Latest 4 real stories for a subcategory, shaped into mega-menu cards.
function cards(cat: string, sub: string | undefined, eyebrow: string): MegaCard[] {
  return getArticlesByCategory(cat, sub)
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .slice(0, 4)
    .map((a) => {
      const f = a.frontmatter
      const url = f.subcategory ? `/${f.category}/${f.subcategory}/${f.slug}` : `/${f.category}/${f.slug}`
      return { title: f.title, href: url, image: f.featured_image, imageAlt: f.featured_image_alt || f.title, eyebrow }
    })
}

// A pillar built from an ordered list of [visible label, folder subcategory].
function editorialPillar(
  key: string, label: string, cat: string, eyebrow: string,
  subs: Array<[string, string]>,
): Pillar {
  return {
    key, label, href: `/${cat}`, eyebrow,
    allLabel: `View all ${label}`, allHref: `/${cat}`,
    subs: subs.map(([lbl, slug]): MegaSub => ({
      label: lbl, href: `/${cat}/${slug}`, cards: cards(cat, slug, lbl),
    })),
  }
}

// Shop pillar: broad categories (Beauty · Wellness · Living · Style-soon) mirroring
// the editorial nav, each with sub-category thumbnail cards. Thumbnails use the real
// Shopify collection image, falling back to the first product shot when a collection
// has no banner set yet.
function buildShopPillar(collections: ShopifyCollection[]): Pillar {
  const imgByHandle = new Map<string, string>()
  for (const c of collections) {
    const url = c.image?.url ?? c.products?.nodes?.[0]?.featuredImage?.url
    if (url) imgByHandle.set(c.handle, url)
  }

  const subs: MegaSub[] = BROAD_CATEGORIES.map((b): MegaSub => ({
    label: b.label,
    href: b.comingSoon ? '/shop/style' : `/shop/${b.slug}`,
    disabled: b.comingSoon,
    cards: b.subs.map((s): MegaCard => ({
      title: s.label,
      href: `/shop/${b.slug}?cat=${s.slug}`,
      image: imgByHandle.get(s.handle),
      imageAlt: s.label,
      eyebrow: b.label,
    })),
  }))
  return {
    key: 'shop', label: 'Shop', href: '/shop', eyebrow: 'The Beauticate Shop', isShop: true,
    allLabel: 'Shop all', allHref: '/shop',
    subs,
  }
}

export default async function MastheadData() {
  const beauty = editorialPillar('beauty', 'Beauty & Style', 'beauty-style', 'Beauty & Style', [
    ['Skin Care', 'skin-care'], ['Makeup', 'makeup'], ['Hair', 'hair'], ['Style', 'style'],
    ['Fragrance', 'fragrance'], ['Nails', 'nails'], ['Beauty Tips', 'beauty-tips'],
  ])
  const wellness = editorialPillar('wellness', 'Wellness', 'wellness', 'Wellness', [
    ['Health', 'health'], ['Fitness', 'fitness'], ['Mindset', 'mindset'], ['Biohacking', 'biohacking'],
  ])
  const living = editorialPillar('living', 'Living', 'living', 'Living', [
    ['Lifestyle', 'lifestyle'], ['Interiors', 'interiors'], ['Sustainability', 'sustainability'], ['Entertaining', 'entertaining'],
  ])
  const destinations = editorialPillar('destinations', 'Destinations', 'destinations', 'Destinations', [
    ['Travel', 'travel'], ['Clinics', 'clinics'], ['Spas & Retreats', 'spas-retreats'],
  ])
  destinations.subs.push({ label: 'Directory', href: '/destinations/directory', cards: [] })
  const interviews = editorialPillar('interviews', 'Interviews', 'interviews', 'Interviews', [
    ['Creatives', 'creatives'], ['Founders', 'founders'], ['Actors & Presenters', 'actors-presenters'],
    ['Models', 'models'], ['Tastemakers', 'tastemakers'],
  ])

  // Podcast: real route is still /vodcast until the vodcast->podcast migration runs.
  const podcast: Pillar = {
    key: 'podcast', label: 'Podcast', href: '/vodcast', eyebrow: 'Beautiful Inside',
    allLabel: 'All episodes', allHref: '/vodcast/episodes',
    subs: [{ label: 'Episodes', href: '/vodcast/episodes', cards: cards('vodcast', 'episodes', 'Beautiful Inside') }],
  }

  // Shop: broad categories mirroring the editorial nav, with real collection thumbnails.
  const collections = await getCollections(100)
  const shop = buildShopPillar(collections)

  const pillars: Pillar[] = [shop, beauty, wellness, living, destinations, interviews, podcast]
  return <Masthead pillars={pillars} />
}
