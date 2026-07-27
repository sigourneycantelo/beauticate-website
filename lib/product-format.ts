// Some Shopify product titles carry a stray leading dash/bullet that leaks in from
// the source data (e.g. "- You're Welcome Mascara", "- 15% Vitamin C Serum"). Strip
// a single leading dash/bullet + following whitespace for display only — this never
// mutates the Shopify record, so the fix is safe and reversible.
export function cleanProductTitle(title: string | undefined | null): string {
  if (!title) return ''
  return title.replace(/^\s*[-–—•·]+\s+/, '').trimStart()
}

const money = (n: number) => `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`

// A product card's price. When a product has variants at different prices (a range),
// show "From $X" so the card's cheapest-variant figure never reads as a flat price —
// this is what keeps a card ("From $25") honest against the product page, where picking
// a dearer variant shows its own price. Single-price products show a plain "$X".
// Degrades safely when maxVariantPrice is absent from the query (treated as flat).
export function formatCardPrice(p: {
  priceRange: { minVariantPrice: { amount: string }; maxVariantPrice?: { amount: string } | null }
}): string {
  const min = parseFloat(p.priceRange.minVariantPrice.amount)
  const maxRaw = p.priceRange.maxVariantPrice?.amount
  const max = maxRaw != null ? parseFloat(maxRaw) : min
  return max > min + 0.001 ? `From ${money(min)}` : money(min)
}
