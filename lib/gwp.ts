/**
 * Gift-with-purchase offers — the storefront cart mechanic.
 *
 * Buy a product from the qualifying brand, get that brand's gift free. The gift
 * is added to the cart by us (`lib/gwp-cart.ts`), which is the only way it can
 * happen: Shopify has no server-side primitive that ADDS a line to a cart.
 * Functions can discount a line but never create one, Scripts are Plus-only and
 * also can't, and checkout extensions can only display. Every gift-with-purchase
 * app works around this with storefront JavaScript — which is why an app whose
 * script runs on a Liquid theme (BOGOS) can do nothing for this headless site.
 *
 * The gifting suite runs one brand at a time on a rotation, so this is a LIST of
 * offers with optional date windows. Swapping brands is a config edit here: add
 * the next brand's entry, set its window, and nothing else in the codebase
 * changes. Two offers may overlap safely — a cart qualifying for both gets both
 * gifts, each reconciled independently.
 *
 * Per-brand setup that must happen OUTSIDE this file (each of these was a real
 * failure during the BOOIE launch):
 *
 *   1. The brand creates the gift SKU on their side at $0.01 — never $0.00.
 *      Modern Dropship cannot process a zero-priced line item. It must sync
 *      through MD so it carries a Convictional product id; a SKU invented in our
 *      Shopify has nothing for MD to route to the brand.
 *   2. Tag the gift product `gwp-hidden` so it stays out of listings, tag
 *      queries and the sitemap, and its own PDP 404s.
 *   3. Create a Shopify BXGY automatic discount that takes $0.01 off one of the
 *      BRAND's products — never off the gift line. Zeroing the gift line
 *      reintroduces the $0.00 case MD can't process, and MD invoices us from the
 *      line price.
 *   4. Put the gift in the same delivery profile as the brand's products.
 *      BOOIE's gift sat in General at $11 while its products were free shipping,
 *      which would have added $11 to a cart whose page promised free delivery.
 *   5. Nothing here needs the gift's own vendor excluded by hand — `qualifying
 *      LinesFor` already ignores every offer's gift line. A gift usually carries
 *      its brand's vendor, so without that it would qualify for its own offer and
 *      never leave the cart.
 */
import type { Cart, CartLine, ShopifyProduct } from '@/types/shopify'

/** Tag on any product that must never surface in a grid, search or sitemap. */
export const GWP_HIDDEN_TAG = 'gwp-hidden'

export type GiftOffer = {
  /** Stable slug. Used in logs and as the React key; don't change once live. */
  key: string
  /** Master switch for this offer, independent of its date window. */
  enabled: boolean
  /** Shopify `product.vendor` that qualifies a cart, matched case-insensitively. */
  vendor: string
  giftVariantId: string
  giftProductId: string
  giftHandle: string
  /** How the gift reads in customer-facing copy: "a Bloody Delicious illuminator". */
  giftName: string
  badge: string
  freeLabel: string
  /** Product-page pitch — the reason to buy, shown before anything is in the cart. */
  pitch: string
  /** Cart-drawer note under the gift line. */
  cartNote: string
  /**
   * Written onto the gift line. Shopify shows any attribute whose key isn't
   * prefixed "_" as a line-item property at checkout — the only lever a headless
   * storefront has over how a line reads there. It labels the line as a gift; it
   * does NOT change the $0.01 (that's the BXGY discount's job).
   */
  lineAttributes: { key: string; value: string }[]
  /**
   * Minimum spend (AUD) on THIS BRAND's products before the gift is earned.
   * 0 or absent means no minimum.
   *
   * Measured on the brand's own subtotal, never the order total — otherwise a
   * customer could reach the threshold with another brand's products and take
   * this brand's gift, which is not what the brand funded. The gift line itself
   * is excluded from the sum.
   */
  minSpend?: number
  /**
   * Products of this vendor that do NOT count toward minSpend and never earn the
   * gift. Gift cards belong here: they are deferred revenue, not a sale of goods,
   * so a gift card purchase would send out real product against money the customer
   * hasn't spent yet.
   */
  excludedProductIds?: string[]
  /** Optional rotation window, ISO 8601. Absent means "no bound on that end". */
  startsAt?: string
  endsAt?: string
}

export const GWP_OFFERS: GiftOffer[] = [
  {
    key: 'booie-beauty',
    enabled: true,
    vendor: 'BOOIE Beauty',
    giftVariantId: 'gid://shopify/ProductVariant/45618557026373',
    giftProductId: 'gid://shopify/Product/8251319976005',
    giftHandle: 'bloody-delicious-beauticate-gift-6a8f754d49fdffe4b8fe29fd',
    giftName: 'a Bloody Delicious illuminator',
    badge: 'Free gift',
    freeLabel: 'Free',
    pitch: 'Spend $45 on BOOIE Beauty and we’ll add a Bloody Delicious illuminator to your order, free.',
    cartNote: 'Added free with your BOOIE Beauty order',
    minSpend: 45,
    // BOOIE Gift Card — starts at $50, so without this it would clear the
    // threshold on its own and earn a $39 illuminator against deferred revenue.
    excludedProductIds: ['gid://shopify/Product/8095275155525'],
    lineAttributes: [{ key: 'Gift with purchase', value: 'Free gift — Bloody Delicious illuminator' }],
  },
]

const norm = (s?: string | null) => (s ?? '').trim().toLowerCase()

/** Is this offer running right now? Enabled, and inside its window if it has one. */
export function isOfferLive(offer: GiftOffer, now: Date = new Date()): boolean {
  if (!offer.enabled) return false
  if (offer.startsAt && now < new Date(offer.startsAt)) return false
  if (offer.endsAt && now > new Date(offer.endsAt)) return false
  return true
}

export function liveOffers(now: Date = new Date()): GiftOffer[] {
  return GWP_OFFERS.filter(o => isOfferLive(o, now))
}

/** The live offer a product's vendor qualifies for, if any. */
export function offerForVendor(vendor?: string | null, now: Date = new Date()): GiftOffer | undefined {
  if (!vendor) return undefined
  return liveOffers(now).find(o => norm(o.vendor) === norm(vendor))
}

/**
 * The offer this cart line is the gift OF — live or not. Deliberately ignores the
 * date window: a gift added while an offer was running still has to be
 * recognisable afterwards so it can be rendered correctly and removed cleanly.
 */
export function offerForGiftLine(line?: CartLine | null): GiftOffer | undefined {
  if (!line) return undefined
  return GWP_OFFERS.find(
    o => line.merchandise?.id === o.giftVariantId || line.merchandise?.product?.id === o.giftProductId
  )
}

export function isGiftLine(line?: CartLine | null): boolean {
  return offerForGiftLine(line) !== undefined
}

/** Is this variant id any offer's gift? Used to refuse direct add-to-cart. */
export function isGiftVariantId(variantId?: string | null): boolean {
  return !!variantId && GWP_OFFERS.some(o => o.giftVariantId === variantId)
}

export function isGiftProduct(p?: Pick<ShopifyProduct, 'id' | 'handle'> | null): boolean {
  if (!p) return false
  return GWP_OFFERS.some(o => p.id === o.giftProductId || p.handle === o.giftHandle)
}

/** Every gift handle, for keeping them out of the sitemap. */
export const GIFT_HANDLES: string[] = GWP_OFFERS.map(o => o.giftHandle)

/**
 * Products that must never appear in a listing, related rail, search result or
 * sitemap entry. Tag-driven, so a new gift SKU only needs `gwp-hidden` in Shopify.
 */
export function isHiddenProduct(p?: Partial<ShopifyProduct> | null): boolean {
  if (!p) return false
  if (isGiftProduct(p as Pick<ShopifyProduct, 'id' | 'handle'>)) return true
  return (p.tags ?? []).some(t => norm(t) === GWP_HIDDEN_TAG)
}

export function stripHidden<T extends { id?: string; handle?: string; tags?: string[] }>(products: T[]): T[] {
  return products.filter(p => !isHiddenProduct(p))
}

export function giftLinesFor(offer: GiftOffer, cart?: Cart | null): CartLine[] {
  return (cart?.lines?.nodes ?? []).filter(l => offerForGiftLine(l)?.key === offer.key)
}

/** Every gift line in the cart, whichever offer it belongs to. */
export function allGiftLines(cart?: Cart | null): CartLine[] {
  return (cart?.lines?.nodes ?? []).filter(isGiftLine)
}

/**
 * The lines that earn this offer's gift: the right vendor, actually in the cart
 * (Shopify clamps a sold-out line to quantity 0), and not a gift themselves —
 * a gift normally carries its own brand's vendor, so without that last check it
 * would qualify for its own offer and never leave the cart.
 */
export function qualifyingLinesFor(offer: GiftOffer, cart?: Cart | null): CartLine[] {
  const excluded = offer.excludedProductIds ?? []
  return (cart?.lines?.nodes ?? []).filter(
    l =>
      !isGiftLine(l) &&
      norm(l.merchandise?.product?.vendor) === norm(offer.vendor) &&
      !excluded.includes(l.merchandise?.product?.id ?? '') &&
      (l.quantity ?? 0) >= 1
  )
}

/**
 * What the customer has spent on this brand, gift line excluded.
 *
 * Deliberately measured on LIST price, not the discounted line cost. The gift's
 * own cent-offset discount takes $0.01 off one of this brand's products, so a
 * basket of exactly the threshold ($45.00 of BB Cream) reads as $44.99 the moment
 * the gift is granted — which would disqualify it, remove the gift, remove the
 * discount, requalify it, and add the gift again. An exact-threshold basket would
 * flip between states on every cart read.
 *
 * Using list price breaks that loop: qualification is decided by what the customer
 * chose to buy, and our own gift mechanic can't feed back into it.
 */
export function brandSubtotalFor(offer: GiftOffer, cart?: Cart | null): number {
  return qualifyingLinesFor(offer, cart).reduce(
    (sum, l) => sum + parseFloat(l.merchandise?.price?.amount ?? '0') * (l.quantity ?? 1),
    0
  )
}

export function cartQualifiesFor(offer: GiftOffer, cart?: Cart | null): boolean {
  if (qualifyingLinesFor(offer, cart).length === 0) return false
  const min = offer.minSpend ?? 0
  if (min <= 0) return true
  return brandSubtotalFor(offer, cart) >= min
}

/** How much more this brand's products are needed to earn the gift. 0 when earned. */
export function amountToGiftFor(offer: GiftOffer, cart?: Cart | null): number {
  const min = offer.minSpend ?? 0
  if (min <= 0) return 0
  return Math.max(0, min - brandSubtotalFor(offer, cart))
}
