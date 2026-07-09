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
  handle: string   // Shopify collection handle
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
    handle: 'beauty-1',
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
        slug: 'fragrance', label: 'Fragrance', handle: 'fragrance-1',
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
        slug: 'accessories', label: 'Accessories', handle: 'wellness-accessories',
        productTypes: ['Massager', 'Foam Roller', 'Acupressure Mat', 'Body Brush', 'Wellness Device', 'Period Relief Device', 'Sleep Mask', 'Bluelight', 'Wearable Wellness Patch', 'Accessories', 'Accessory'],
        keywords: ['massager', 'foam roller', 'acupressure', 'body brush', 'device', 'wellness patch', 'sleep mask', 'blue light', 'bluelight', 'gua sha'],
      },
    ],
  },
  {
    slug: 'living',
    label: 'Living',
    handle: 'living-interiors',
    subs: [],
  },
  {
    slug: 'style',
    label: 'Style',
    comingSoon: true,
    subs: [],
  },
]

export function getBroad(slug: string): BroadCat | undefined {
  return BROAD_CATEGORIES.find(b => b.slug === slug)
}

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
