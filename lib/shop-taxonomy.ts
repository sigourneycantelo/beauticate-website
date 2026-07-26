// ─── Broad shop categories ────────────────────────────────────────────────────
// The shop nav mirrors the editorial pillars: broad categories first
// (Beauty · Wellness · Living · Style), each mapped to a real Shopify collection
// the team curated. Every broad category is a curated superset collection; its
// `subs` are the sub-collections used both as mega-menu thumbnails and as the
// in-page filter buttons. Style has no products yet and shows "coming soon".
//
// Handles below are the live Shopify collection handles — keep them in sync with
// the store (see `getcols.py`).

export type SubCat = {
  slug: string     // url filter value, e.g. ?cat=makeup
  label: string    // button / card label
  handle?: string  // Shopify collection handle (omit for classify-only filters, e.g. Living)
  comingSoon?: boolean  // greyed, non-clickable tile with no products yet (e.g. Nails)
  // Auto-classification signals — used to place a product in this bucket when it
  // isn't (or is wrongly) filed in the Shopify sub-collection. productTypes match
  // Shopify's productType exactly; keywords are substring-matched (case-insensitive)
  // against productType + title + tags. Order of subs matters: first match wins.
  productTypes?: string[]
  keywords?: string[]
}

export type BroadCat = {
  slug: string       // /shop/<slug>
  label: string
  handle?: string    // Shopify collection handle for the full product list + hero image
  comingSoon?: boolean
  subs: SubCat[]
}

export const BROAD_CATEGORIES: BroadCat[] = [
  {
    slug: 'beauty',
    label: 'Beauty',
    handle: 'beauty',
    subs: [
      {
        slug: 'makeup', label: 'Makeup', handle: 'makeup',
        productTypes: ['Lipstick', 'Lipgloss', 'Eyeliner', 'Eyeshadow', 'Concealer', 'Mascara', 'BB Cream', 'Illuminator', 'Multi-Use Tint', 'Eyebrow Pencil', 'Eyebrow Tint and Gel', 'Foundation', 'Blush', 'Bronzer', 'Highlighter', 'Setting Powder', 'Lip Liner', 'Lip Balm'],
        keywords: ['lipstick', 'lip gloss', 'lipgloss', 'mascara', 'eyeliner', 'eyeshadow', 'concealer', 'foundation', 'blush', 'bronzer', 'highlighter', 'eyebrow', 'brow ', 'lip tint', 'lip balm', 'makeup', 'make-up'],
      },
      {
        slug: 'skincare', label: 'Skincare', handle: 'skincare',
        productTypes: ['Masque', 'Serum', 'Skincare', 'Skin Care', 'Eye & Lip Care', 'Mist', 'Cleanser', 'Moisturiser', 'Moisturizer', 'Toner', 'Exfoliant', 'SPF', 'Sunscreen', 'Face Oil', 'Pigmentation & uneven skin tone', 'Acne Prone', 'Dry & Dehydration'],
        keywords: ['serum', 'cleanser', 'moisturis', 'moisturiz', 'toner', 'masque', 'face mask', 'spf', 'sunscreen', 'exfoliat', 'retinol', 'hyaluronic', 'eye cream', 'face oil', 'skin '],
      },
      {
        slug: 'hair', label: 'Hair', handle: 'hair',
        productTypes: ['Shampoo', 'Conditioner', 'Conditioners', 'Haircare', 'Hair Care', 'Hair Serum', 'Hair Oil', 'Hair Mask', 'Leave-in', 'Pre-Shampoo Treatment', 'Scalp Treatment', 'Dry Shampoo'],
        keywords: ['shampoo', 'conditioner', 'scalp', 'hair '],
      },
      {
        slug: 'fragrance', label: 'Fragrance', handle: 'fragrance',
        productTypes: ['Perfume', 'Eau de Parfum', 'Eau de Toilette', 'Perfume Oil', 'Cologne', 'Fragrance', 'Solid Perfume'],
        keywords: ['perfume', 'fragrance', 'cologne', 'eau de parfum', 'eau de toilette', 'parfum'],
      },
      {
        slug: 'body', label: 'Body', handle: 'body',
        productTypes: ['Hand & Body Wash', 'Hand & Body Lotion', 'Hand & Body Cream', 'Body Oil', 'Body Glow', 'Hand Cream', 'Hand Wash', 'Body Wash', 'Body Lotion', 'Body Cream', 'Body Scrub', 'Deodorant', 'Bath Soak', 'Scented Soap'],
        keywords: ['body wash', 'body lotion', 'body cream', 'body oil', 'body glow', 'hand cream', 'hand wash', 'deodorant', 'body scrub', 'bath soak', 'shower'],
      },
      {
        slug: 'accessories', label: 'Accessories', handle: 'beauty-accessories',
        productTypes: ['Beauty Tools', 'Makeup Brush Holder', 'Makeup sponge', 'Vanity Toiletry Cosmetic bags', 'Accessories', 'Accessory'],
        keywords: ['makeup brush', 'beauty tool', 'makeup sponge', 'cosmetic bag', 'vanity bag', 'tweezer', 'applicator'],
      },
      { slug: 'nails', label: 'Nails', comingSoon: true },
    ],
  },
  {
    slug: 'wellness',
    label: 'Wellness',
    handle: 'wellness',
    subs: [
      {
        slug: 'supplements', label: 'Supplements', handle: 'supplements',
        productTypes: ['Nutrition', 'Vitamin', 'Collagen Supplement', 'Collagen', 'Supplement Powder', 'Supplement', 'Probiotic', 'Protein', 'Tea', 'Tonic'],
        keywords: ['vitamin', 'supplement', 'collagen', 'probiotic', 'magnesium', 'protein', 'nutrition', 'capsule', 'powder', 'adaptogen'],
      },
      {
        slug: 'tools', label: 'Tools', handle: 'wellness-accessories',
        productTypes: ['Massager', 'Foam Roller', 'Acupressure Mat', 'Body Brush', 'Wellness Device', 'Period Relief Device', 'Sleep Mask', 'Bluelight', 'Wearable Wellness Patch', 'Accessories', 'Accessory'],
        keywords: ['massager', 'foam roller', 'acupressure', 'body brush', 'device', 'wellness patch', 'sleep mask', 'blue light', 'bluelight', 'gua sha'],
      },
    ],
  },
  {
    slug: 'living',
    label: 'Living',
    handle: 'living-interiors',
    // No Shopify sub-collections exist for Living, so these filters are classify-only
    // (matched from productType / title). handle omitted on purpose.
    subs: [
      {
        slug: 'candles', label: 'Candles & Incense',
        productTypes: ['Candles', 'Candle', 'Incense & Holders', 'Essential Oils & Burners'],
        keywords: ['candle', 'incense', 'burner'],
      },
      {
        slug: 'glassware', label: 'Glassware & Barware',
        productTypes: ['Glassware', 'Serveware', 'Decanter', 'Carafe', 'Jug', 'Serving Spoon'],
        keywords: ['glass', 'carafe', 'decanter', 'tumbler', 'coupe', 'flute', 'jug', 'pitcher', 'serving', 'vinaigrette', 'balsamic', 'cake server', 'whisk', 'culinary'],
      },
      {
        slug: 'home-fragrance', label: 'Home Fragrance',
        productTypes: ['Room Spray', 'Scented Water', 'Scented Soap', 'Mist'],
        keywords: ['room spray', 'scented water', 'scented soap', 'pot pourri', 'potpourri'],
      },
      // {
      //   slug: 'decor', label: 'Vases & Décor',
      //   productTypes: ['Vases', 'Vase', 'Furniture'],
      //   keywords: ['vase', 'furniture', 'blanket', 'cushion', 'throw'],
      // },
    ],
  },
  {
    slug: 'style',
    label: 'Style',
    handle: 'style',   // placeholder collection — only used for the tile image; stays coming-soon
    comingSoon: true,
    subs: [],
  },
]

export function getBroad(slug: string): BroadCat | undefined {
  return BROAD_CATEGORIES.find(b => b.slug === slug)
}

// ─── Shop by Brand ────────────────────────────────────────────────────────────
// Mirrors the beauticate.shop "Shop by Brand" menu. `handle` is the live Shopify
// collection handle → /shop/brands/<handle>.

export type ShopBrand = { name: string; handle: string }

// The brand menus/index are now built dynamically from Shopify collections, named from
// each collection's title and sorted alphabetically (see `brandsFromCollections`). This
// static list is retained only as the vendor→collection-handle lookup that maps
// FREE_SHIPPING_VENDORS to the collections fetched by the free-shipping pages — so each
// `name` here must match the Shopify vendor string exactly for that join to work.
export const SHOP_BRANDS: ShopBrand[] = [
  { name: 'Maison Balzac', handle: 'maison-balzac' },
  { name: 'Booie Beauty', handle: 'booie-beauty' },
  { name: 'Lumira', handle: 'lumira' },
  { name: 'JSHealth Vitamins', handle: 'jshealth-vitamins' },
  { name: 'Mukti Organics', handle: 'mukti-organics' },
  { name: 'Saint Louve', handle: 'saint-louve' },
  { name: 'Christophe Robin', handle: 'christophe-robin' },
  { name: 'Lamav', handle: 'lamav' },
  { name: 'Subtle Energies', handle: 'subtle-energies' },
  { name: 'Sunescape', handle: 'sunescape' },
  { name: 'Tulita', handle: 'tulita' },
  { name: 'Archer Farrar Perfume Atelier', handle: 'archer-farrar-perfume-atelier' },
  { name: 'Chiquita', handle: 'chiquita' },
  { name: 'Estetika', handle: 'estetika' },
  { name: 'Eir Women', handle: 'eir-women' },
  { name: 'Innour', handle: 'innour' },
  { name: 'Bon Wellness', handle: 'bon-patch' },
  { name: 'OiTO Haircare', handle: 'oito-haircare' },
  { name: 'Lash Armour', handle: 'lash-armour' },
  { name: 'buj', handle: 'buj' },
  { name: 'Kiicity', handle: 'kiicity' },
  { name: 'Sontse.', handle: 'sontse' },
  { name: 'St. Louis Says', handle: 'st-louis-says' },
  { name: 'Basics by B', handle: 'basics-by-b' },
]

// ─── Shop by Moment ───────────────────────────────────────────────────────────
// Mirrors the beauticate.shop "Shop by Moment" menu. `handle` is the live Shopify
// collection handle → /shop/collections/<handle>.

export type ShopMoment = { name: string; handle: string }

export const SHOP_MOMENTS: ShopMoment[] = [
  { name: 'Winter Edit', handle: 'autumn-edit' },
  { name: 'Deepest Sleep', handle: 'evening-unwind' },
  { name: 'Fit Girl Glow', handle: 'fit-girl-glow' },
  { name: 'Selfcare Sunday', handle: 'selfcare-sunday' },
  { name: 'Winter Skin', handle: 'winter-skin' },
  { name: 'Best Friend Birthday', handle: 'best-friend-bday' },
  { name: 'Mama Love', handle: 'mothers-day' },
  { name: 'Little Luxuries — Under $50', handle: 'little-luxuries-under-50' },
  { name: 'Thoughtful Gestures — Under $100', handle: 'thoughtful-gestures-under-100' },
  { name: 'Luxe Lovers — Under $300', handle: 'luxe-lovers-under-300' },
]

// Gifting edits are the occasion / price-tier moments; they live under the "Gifting"
// nav item and the /shop/gifting page. Everything else is a "mood" moment shown under
// Shop by Moment (/shop/by-moment). Order in SHOP_MOMENTS = newest first.
export const GIFTING_HANDLES = new Set<string>([
  'best-friend-bday', 'mothers-day', 'little-luxuries-under-50',
  'thoughtful-gestures-under-100', 'luxe-lovers-under-300',
])
export const MOOD_MOMENTS: ShopMoment[] = SHOP_MOMENTS.filter(m => !GIFTING_HANDLES.has(m.handle))
// Explicit display order for the Gifting menu: price tiers first, then occasions.
const GIFTING_ORDER = [
  'little-luxuries-under-50', 'thoughtful-gestures-under-100', 'luxe-lovers-under-300',
  'best-friend-bday', 'mothers-day',
]
export const GIFTING_MOMENTS: ShopMoment[] = GIFTING_ORDER
  .map(h => SHOP_MOMENTS.find(m => m.handle === h))
  .filter((m): m is ShopMoment => Boolean(m))

// ─── New In Shop ──────────────────────────────────────────────────────────────
// The latest brands to onboard, curated by hand (Shopify's Storefront API exposes no
// collection creation date). Update this list when a new brand comes on board.
export const NEW_IN_BRANDS: ShopBrand[] = [
  { name: 'WaterRower', handle: 'waterrower' },
  { name: 'NOHRD', handle: 'nohrd' },
  { name: 'Kiicity', handle: 'kiicity' },
]

// ─── Curator edits (Editor's Picks → "Shop by Curator") ───────────────────────
// The curated "picks" collections shown as previews under Editor's Picks. Will grow
// into a "Shop by Curator" section as more curators are added.
export type CuratorEdit = { name: string; handle: string }
export const CURATOR_EDITS: CuratorEdit[] = [
  { name: "Editor's Essentials", handle: 'editors-essentials' },
  { name: 'Team Picks', handle: 'team-picks' },
]

// ─── Free Shipping Brands ────────────────────────────────────────────────────
// Vendor names (matching Shopify product.vendor) that offer free shipping on all
// orders. Sourced from the Master Brand List spreadsheet, column D. Brands with
// conditional free shipping (e.g. "over $110") are excluded — only unconditional.
export const FREE_SHIPPING_VENDORS = new Set<string>([
  'Archer Farrar Perfume Atelier',
  'Bon Wellness',
  'buj',
  'Estetika',
  'Kiicity',
  'St. Louis Says',
  'Subtle Energies',
])

export function isFreeShipping(vendor: string): boolean {
  return FREE_SHIPPING_VENDORS.has(vendor)
}

// ─── Brand collection discovery ───────────────────────────────────────────────
// Collection handles that are NOT brands: the broad categories + their sub-collections,
// moments / gifting tiers, curator edits, and Shopify system / non-brand edit
// collections. Everything else in the store is treated as a brand collection, so newly
// onboarded brands (e.g. Avive Hydration) surface in "Shop by Brand" with no code change.
// See `brandsFromCollections` in lib/shopify.ts.
export const NON_BRAND_COLLECTION_HANDLES = new Set<string>(
  [
    ...BROAD_CATEGORIES.flatMap(b => [b.handle, ...b.subs.map(s => s.handle)]),
    ...SHOP_MOMENTS.map(m => m.handle),
    ...CURATOR_EDITS.map(c => c.handle),
    // system + non-brand edits with no home in the taxonomy above
    'frontpage', 'affiliate-products', 'summer-lovin', 'fine-hair-club',
  ].filter((h): h is string => Boolean(h)),
)

// Auto-classify a product into one of a broad category's sub-buckets from its own
// signals, for when it isn't filed in the Shopify sub-collection. First sub to match
// wins (subs are ordered most-specific first). Returns undefined if nothing matches.
export function classifySub(
  broad: BroadCat,
  product: { productType?: string | null; title?: string | null; tags?: string[] | null },
): string | undefined {
  const type = (product.productType ?? '').trim().toLowerCase()
  const hay = [product.productType ?? '', product.title ?? '', ...(product.tags ?? [])].join(' ').toLowerCase()
  // Pass 1: exact productType match (most reliable) wins across all buckets.
  if (type) {
    for (const sub of broad.subs) {
      if (sub.productTypes?.some(t => t.toLowerCase() === type)) return sub.slug
    }
  }
  // Pass 2: keyword match, respecting sub order (most-specific first).
  for (const sub of broad.subs) {
    if (sub.keywords?.some(k => hay.includes(k))) return sub.slug
  }
  return undefined
}
