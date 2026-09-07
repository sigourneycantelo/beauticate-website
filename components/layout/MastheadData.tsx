import Masthead, { type Pillar, type MegaCard, type MegaSub, type MegaLink } from './Masthead'
import { getArticlesByCategory } from '@/lib/content'
import { getCollections, brandsFromCollections } from '@/lib/shopify'
import { BROAD_CATEGORIES, SHOP_MOMENTS, MOOD_MOMENTS, GIFTING_MOMENTS, NEW_IN_BRANDS, CURATOR_EDITS } from '@/lib/shop-taxonomy'
import type { ShopifyCollection } from '@/types/shopify'

// Latest 4 real stories for a subcategory, shaped into mega-menu cards.
function cards(cat: string, sub: string | undefined, eyebrow: string): MegaCard[] {
  return getArticlesByCategory(cat, sub)
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .slice(0, 4)
    .map((a) => {
      const f = a.frontmatter
      const url = f.subcategory ? `/${f.category}/${f.subcategory}/${f.slug}` : `/${f.category}/${f.slug}`
      return { title: f.title, href: url, image: f.featured_image, imageAlt: f.featured_image_alt || f.title, imagePosition: f.nav_image_position, eyebrow }
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

  // Brand names come from Shopify (vendor, alphabetical) — the single source of truth.
  const brands = brandsFromCollections(collections)
  const brandName = (handle: string, fallback = handle) =>
    brands.find(b => b.handle === handle)?.name ?? fallback

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
  const FEATURED_BRANDS = ['maison-balzac', 'lumira', 'tulita']
  const FEATURED_MOMENTS = ['autumn-edit', 'evening-unwind', 'fit-girl-glow']

  const brandCards: MegaCard[] = FEATURED_BRANDS
    .map((h): MegaCard => ({ title: brandName(h), href: `/shop/brands/${h}`, image: imgByHandle.get(h), imageAlt: brandName(h), eyebrow: 'Brand' }))
  const brandList: MegaLink[] = brands.map(b => ({ label: b.name, href: `/shop/brands/${b.handle}` }))

  // Shop by Moment = the mood edits only (gifting edits move to the Gifting item).
  const momentCards: MegaCard[] = FEATURED_MOMENTS
    .map(h => SHOP_MOMENTS.find(m => m.handle === h))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map((m): MegaCard => ({ title: m.name, href: `/shop/collections/${m.handle}`, image: imgByHandle.get(m.handle), imageAlt: m.name, eyebrow: 'Moment' }))
  const momentList: MegaLink[] = MOOD_MOMENTS.map(m => ({ label: m.name, href: `/shop/collections/${m.handle}` }))

  // New In Shop — the three latest brands to onboard, as image cards.
  const newInCards: MegaCard[] = NEW_IN_BRANDS.map((b): MegaCard => ({
    title: brandName(b.handle, b.name), href: `/shop/brands/${b.handle}`, image: imgByHandle.get(b.handle), imageAlt: brandName(b.handle, b.name), eyebrow: 'New In',
  }))

  // Editor's Picks — curator edits shown as previews (becomes "Shop by Curator").
  const curatorCards: MegaCard[] = CURATOR_EDITS.map((c): MegaCard => ({
    title: c.name, href: `/shop/collections/${c.handle}`, image: imgByHandle.get(c.handle), imageAlt: c.name, eyebrow: 'Curated',
  }))

  // Free Shipping — brands that ship free on every order.
  const FREE_SHIP_FEATURED = ['subtle-energies', 'bon-patch', 'archer-farrar-perfume-atelier']
  const freeShipCards: MegaCard[] = FREE_SHIP_FEATURED
    .map((h): MegaCard => ({ title: brandName(h), href: `/shop/brands/${h}`, image: imgByHandle.get(h), imageAlt: brandName(h), eyebrow: 'Free Shipping' }))

  // Gifting — the occasion / price-tier edits; the /shop/gifting page lists them all.
  // Featured previews are the three price tiers (under $50 / $100 / $300).
  const FEATURED_GIFTING = ['little-luxuries-under-50', 'thoughtful-gestures-under-100', 'luxe-lovers-under-300']
  const giftingCards: MegaCard[] = FEATURED_GIFTING
    .map(h => GIFTING_MOMENTS.find(m => m.handle === h))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map((m): MegaCard => ({ title: m.name, href: `/shop/collections/${m.handle}`, image: imgByHandle.get(m.handle), imageAlt: m.name, eyebrow: 'Gifting' }))
  const giftingList: MegaLink[] = GIFTING_MOMENTS.map(m => ({ label: m.name, href: `/shop/collections/${m.handle}` }))

  const subs: MegaSub[] = [
    { label: 'Shop by Category', href: '/shop/by-category', cards: categoryCards },
    { label: 'Shop by Brand', href: '/shop/brands', cards: brandCards, list: brandList },
    { label: 'Shop by Moment', href: '/shop/by-moment', cards: momentCards, list: momentList },
    { label: 'New In Shop', href: '/shop/new-in-shop', cards: newInCards },
    { label: 'Free Shipping', href: '/shop/free-shipping', cards: freeShipCards },
    { label: "Editor's Picks", href: '/shop/collections/editors-essentials', cards: curatorCards },
    { label: 'Gifting', href: '/shop/gifting', cards: giftingCards, list: giftingList },
  ]
  return {
    key: 'shop', label: 'Shop', href: '/shop', eyebrow: 'The Beauticate Shop', isShop: true,
    allLabel: 'Shop all', allHref: '/shop',
    subs,
  }
}

export default async function MastheadData() {
  const beauty = editorialPillar('beauty', 'Beauty & Style', 'beauty-style', 'Beauty & Style', [
    ['Skin Care', 'skin-care'], ['Makeup', 'makeup'], ['Hair', 'hair'], ['Cosmetic', 'cosmetic'],
    ['Style', 'style'], ['Fragrance', 'fragrance'], ['Nails', 'nails'], ['Beauty Tips', 'beauty-tips'],
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
    },
    {
      label: 'Beauty & Wellness Directory',
      href: '/destinations/directory',
      cards: cards('destinations', 'spas-retreats', 'Directory'),
    },
  ]
  const interviews = editorialPillar('interviews', 'Interviews', 'interviews', 'Interviews', [
    ['Creatives', 'creatives'], ['Founders', 'founders'], ['Actors & Presenters', 'actors-presenters'],
    ['Models', 'models'], ['Tastemakers', 'tastemakers'],
  ])

  // Podcast: the hub lives at /podcast (/vodcast 301s to it). Individual
  // episodes still sit under /vodcast/episodes/ — those URLs are what external
  // show notes and the WP-era redirect map point at, so they stay put.
  const podcast: Pillar = {
    key: 'podcast', label: 'Podcast', href: '/podcast', eyebrow: 'Beautiful Inside',
    allLabel: 'All episodes', allHref: '/vodcast/episodes',
    subs: [{ label: 'Episodes', href: '/vodcast/episodes', cards: cards('vodcast', 'episodes', 'Beautiful Inside') }],
  }

  // Shop: broad categories mirroring the editorial nav, with real collection thumbnails.
  const collections = await getCollections(100)
  const shop = buildShopPillar(collections)

  const pillars: Pillar[] = [shop, beauty, wellness, living, destinations, interviews, podcast]
  return <Masthead pillars={pillars} />
}
