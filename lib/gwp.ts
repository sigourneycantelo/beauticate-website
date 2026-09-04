/**
 * Gift with purchase — BOOIE Beauty × the Bloody Delicious illuminator.
 *
 * Buy any BOOIE Beauty product, get the illuminator free. The gift SKU already
 * exists in Shopify (`9361189000023-GWP`) and is deliberately priced at $0.01,
 * NOT $0.00: Modern Dropship cannot process a zero-priced line item, so the cent
 * has to stay and is handled presentationally instead (see GWP.freeLabel).
 *
 * Why this lives in our own code rather than in an app: BOGOS.io's gift-adding
 * layer is a Liquid theme app embed, which only runs on a Shopify-rendered theme
 * — it never executes against this Next.js storefront. Shopify Functions (BOGOS's
 * other layer) run server-side but can only discount a line, never add one.
 * Adding a line is always the storefront's job, and this storefront is ours.
 *
 * The gift itself carries vendor "BOOIE Beauty", so it qualifies for its own
 * offer — every "does the cart qualify?" check must exclude the gift line, or the
 * cart keeps its gift forever once the real BOOIE product is removed.
 */
import type { Cart, CartLine, ShopifyProduct } from '@/types/shopify'

export const GWP = {
  /** Master switch. Flip to false to end the promotion — nothing else to undo. */
  enabled: true,

  /** Shopify product.vendor that qualifies a cart, matched case-insensitively. */
  vendor: 'BOOIE Beauty',

  giftVariantId: 'gid://shopify/ProductVariant/45618557026373',
  giftProductId: 'gid://shopify/Product/8251319976005',
  giftHandle: 'bloody-delicious-beauticate-gift-6a8f754d49fdffe4b8fe29fd',

  /** Tag on any product that must never surface in a grid, search or sitemap. */
  hiddenTag: 'gwp-hidden',

  giftName: 'Bloody Delicious illuminator',
  badge: 'Free gift',
  freeLabel: 'Free',
  /** Product-page pitch — the reason to buy, shown before anything is in the cart. */
  pitch: 'Buy any BOOIE Beauty product and we’ll add a Bloody Delicious illuminator to your order, free.',
  /** Cart-drawer line note, under the gift. */
  cartNote: 'Added free with your BOOIE Beauty order',

  /**
   * Line attributes written onto the gift line. Shopify shows any attribute whose
   * key is not prefixed with "_" as a line-item property at checkout — the only
   * lever a headless storefront has over how a line reads there. It labels the
   * line as a gift; it does NOT change the $0.01 price (that needs a Shopify
   * automatic discount — see docs/gwp-booie-cart.md).
   */
  lineAttributes: [{ key: 'Gift with purchase', value: 'Free gift — Bloody Delicious illuminator' }],
} as const

const norm = (s?: string | null) => (s ?? '').trim().toLowerCase()

/** Is this cart line the gift itself? Checked on variant AND product id. */
export function isGiftLine(line?: CartLine | null): boolean {
  return (
    line?.merchandise?.id === GWP.giftVariantId ||
    line?.merchandise?.product?.id === GWP.giftProductId
  )
}

/** Is this product the gift? Used to keep it out of grids and off its own page. */
export function isGiftProduct(p?: Pick<ShopifyProduct, 'id' | 'handle'> | null): boolean {
  return p?.id === GWP.giftProductId || p?.handle === GWP.giftHandle
}

/**
 * Products that must never appear in a listing, related rail, search result or
 * sitemap entry. Tag-driven so future gift SKUs only need `gwp-hidden` in Shopify.
 */
export function isHiddenProduct(p?: Partial<ShopifyProduct> | null): boolean {
  if (!p) return false
  if (p.id === GWP.giftProductId || p.handle === GWP.giftHandle) return true
  return (p.tags ?? []).some(t => norm(t) === GWP.hiddenTag)
}

export function stripHidden<T extends { id?: string; handle?: string; tags?: string[] }>(products: T[]): T[] {
  return products.filter(p => !isHiddenProduct(p))
}

export function giftLines(cart?: Cart | null): CartLine[] {
  return (cart?.lines?.nodes ?? []).filter(isGiftLine)
}

/**
 * The lines that earn the gift: a qualifying vendor, actually in the cart
 * (Shopify clamps a sold-out line to quantity 0), and not the gift itself.
 */
export function qualifyingLines(cart?: Cart | null): CartLine[] {
  return (cart?.lines?.nodes ?? []).filter(
    l => !isGiftLine(l) && norm(l.merchandise?.product?.vendor) === norm(GWP.vendor) && (l.quantity ?? 0) >= 1
  )
}

export function cartQualifies(cart?: Cart | null): boolean {
  return GWP.enabled && qualifyingLines(cart).length > 0
}
