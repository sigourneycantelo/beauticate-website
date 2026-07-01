import Masthead, { type Pillar, type MegaCard, type MegaSub } from './Masthead'
import { getArticlesByCategory } from '@/lib/content'

// Latest 4 real stories for a subcategory, shaped into mega-menu cards.
function cards(cat: string, sub: string | undefined, eyebrow: string): MegaCard[] {
  return getArticlesByCategory(cat, sub)
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .slice(0, 4)
    .map((a) => {
      const f = a.frontmatter as Record<string, unknown> & {
        title: string; slug: string; category: string; subcategory?: string
        featured_image?: string; featured_image_alt?: string; excerpt?: string
      }
      const url = f.subcategory ? `/${f.category}/${f.subcategory}/${f.slug}` : `/${f.category}/${f.slug}`
      const meta = typeof f.excerpt === 'string' && f.excerpt
        ? f.excerpt.replace(/\s+/g, ' ').trim().slice(0, 52)
        : undefined
      return { title: f.title, href: url, image: f.featured_image, imageAlt: f.featured_image_alt || f.title, eyebrow, meta }
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

export default function MastheadData() {
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

  // Shop: real Shopify collections only. New In points to the shop landing until a
  // dedicated New In collection exists; Gifting surfaces the three budget tiers.
  const giftTiles: MegaCard[] = [
    { title: 'Little Luxuries', href: '/shop/collections/little-luxuries-under-50', eyebrow: 'Under $50' },
    { title: 'Thoughtful Gestures', href: '/shop/collections/thoughtful-gestures-under-100', eyebrow: 'Under $100' },
    { title: 'Luxe Lovers', href: '/shop/collections/luxe-lovers-under-300', eyebrow: 'Under $300' },
  ]
  const shop: Pillar = {
    key: 'shop', label: 'Shop', href: '/shop', eyebrow: 'Shop', isShop: true,
    allLabel: 'Shop all', allHref: '/shop',
    subs: [
      { label: 'New In', href: '/shop', cards: giftTiles },
      { label: 'Gifting', href: '/shop/by-moment', cards: giftTiles },
      { label: 'Shop All', href: '/shop', cards: giftTiles },
    ],
  }

  const pillars: Pillar[] = [shop, beauty, wellness, living, destinations, interviews, podcast]
  return <Masthead pillars={pillars} />
}
