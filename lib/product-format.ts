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

// Shade / colour names for a product card's second line. Brands like Basics By B
// keep every shade as a variant of one product, so the card title alone can't say
// which shades exist and readers had to open each PDP and read the description.
// Returns e.g. "8 colours · Napier, Boston, Athens" (the CSS truncates the tail, so
// the count always stays visible), or undefined for single-variant products and for
// variant options that aren't a shade (Size, Pack…). Bundle variants are skipped.
const SHADE_OPTION = /colou?r|shade|tone|tint/i

export function formatShadeLine(p: {
  variants?: { nodes?: { selectedOptions?: { name: string; value: string }[] }[] } | null
}): string | undefined {
  const nodes = p.variants?.nodes ?? []
  if (nodes.length < 2) return undefined
  const names: string[] = []
  let noun = 'shades'
  for (const v of nodes) {
    const opt = v.selectedOptions?.find(o => SHADE_OPTION.test(o.name))
    if (opt && /colou?r/i.test(opt.name) && !/shade/i.test(opt.name)) noun = 'colours'
    if (!opt || /bundle/i.test(opt.value) || names.includes(opt.value)) continue
    names.push(opt.value)
  }
  if (names.length < 2) return undefined
  return `${names.length} ${noun} · ${names.join(', ')}`
}
