import Masthead, { type Pillar, type MegaCard, type MegaSub, type MegaLink } from './Masthead'
import { getArticlesByCategory } from '@/lib/content'
import { getCollections } from '@/lib/shopify'
import { BROAD_CATEGORIES, SHOP_BRANDS, SHOP_MOMENTS } from '@/lib/shop-taxonomy'
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

// Shop pillar mirrors the beauticate.shop menu: three groups — Shop by Category,
// Shop by Brand, Shop by Moment — each with thumbnail cards. Thumbnails use the real
// Shopify collection image, falling back to the first product shot.
function buildShopPillar(collections: ShopifyCollection[]): Pillar {
  const imgByHandle = new Map<string, string>()
  for (const c of collections) {
    const url = c.image?.url ?? c.products?.nodes?.[0]?.featuredImage?.url
    if (url) imgByHandle.set(c.handle, url)
  }

  const categoryCards: MegaCard[] = BROAD_CATEGORIES.map((b): MegaCard => ({
    title: b.label,
    href: `/shop/${b.slug}`,
    image: b.handle ? imgByHandle.get(b.handle) : undefined,
    imageAlt: b.label,
    eyebrow: 'Category',
    soon: b.comingSoon,
  }))

  // Brand & Moment scale past what image cards can show, so they render as a full text
  // list with a few featured image highlights on top.
  const FEATURED_BRANDS = ['maison-balzac-1', 'lumira-1', 'tulita-parfum']
  const FEATURED_MOMENTS = ['autumn-edit', 'evening-unwind', 'little-luxuries-under-50']

  const brandCards: MegaCard[] = FEATURED_BRANDS
    .map(h => SHOP_BRANDS.find(b => b.handle === h))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .map((b): MegaCard => ({ title: b.name, href: `/shop/brands/${b.handle}`, image: imgByHandle.get(b.handle), imageAlt: b.name, eyebrow: 'Brand' }))
  const brandList: MegaLink[] = SHOP_BRANDS.map(b => ({ label: b.name, href: `/shop/brands/${b.handle}` }))

  const momentCards: MegaCard[] = FEATURED_MOMENTS
    .map(h => SHOP_MOMENTS.find(m => m.handle === h))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map((m): MegaCard => ({ title: m.name, href: `/shop/collections/${m.handle}`, image: imgByHandle.get(m.handle), imageAlt: m.name, eyebrow: 'Moment' }))
  const momentList: MegaLink[] = SHOP_MOMENTS.map(m => ({ label: m.name, href: `/shop/collections/${m.handle}` }))

  const subs: MegaSub[] = [
    { label: 'Shop by Category', href: '/shop', cards: categoryCards },
    { label: 'Shop by Brand', href: '/shop/brands', cards: brandCards, list: brandList },
    { label: 'Shop by Moment', href: '/shop/gifting', cards: momentCards, list: momentList },
  ]
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
  const destinations = editorialPillar('destinations', 'Destinations', 'destinations', 'Destinations', [])
  destinations.subs = [
    {
      label: 'Travel',
      href: '/destinations/travel',
      cards: cards('destinations', 'travel', 'Travel'),
      children: [
        { label: 'Reset & Heal', href: '/destinations/travel/feeling/reset' },
        { label: 'Girls Trip', href: '/destinations/travel/feeling/girls-trip' },
        { label: 'City Stays', href: '/destinations/travel/feeling/city' },
        { label: 'Family', href: '/destinations/travel/feeling/family' },
        { label: 'Romantic Mini-Breaks', href: '/destinations/travel/feeling/romantic' },
        { label: 'Switch Off', href: '/destinations/travel/feeling/switch-off' },
      ],
    },
  ]
  destinations.subs.push({
    label: 'Beauty & Wellness Directory',
    href: '/destinations/directory',
    cards: [],
    children: [
      { label: 'Navigate by State', href: '/destinations/directory' },
      { label: 'Spas & Bathhouses', href: '/destinations/spas-retreats' },
      { label: 'Skin Clinics', href: '/destinations/clinics' },
      { label: 'Hair Salons', href: '/destinations/directory?type=salon' },
      { label: 'Beauty Salons', href: '/destinations/directory?type=salon' },
      { label: 'Wellness', href: '/destinations/directory?type=retreat' },
    ],
  })
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
