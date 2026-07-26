// ─── Gift-with-purchase campaign config ───────────────────────────────────────
//
// This is the single place to configure the launch gift-with-purchase (GWP)
// programme. Add / edit brands here — no other file needs to change.
//
// How matching works: the Shopify `orders/create` webhook payload includes each
// line item's `vendor`. We match that (case-insensitive) against each brand's
// `vendors` list. Shopify's Admin order search can't cleanly filter by a line
// item's vendor, so we inspect the payload's line items directly instead.
//
// How the count works: each order we send a gift for is tagged `gift-<key>` in
// Shopify. The "gifts already sent" count for a brand is simply the number of
// orders carrying that tag (see lib/shopify-admin.ts → countGiftsSent). So
// "gift X of 20" is always the true number dispatched.
//
// Caps & spend: `cap` is the number of gifts the brand will fund (default 20).
// `minSpend` is the minimum AUD spent **on that brand's products** in the order
// for the gift to qualify (0 = no minimum). Set `minSpendBasis: 'order'` to test
// the whole order total instead of the brand's subtotal.

export type GiftBrand = {
  /** Stable slug used in the Shopify order tag (`gift-<key>`), Blob state file,
   *  and phase-two API. Lowercase, kebab-case. Never change once live. */
  key: string
  /** Human label used in logs / emails where a brand name is shown. */
  label: string
  /** Shopify `product.vendor` strings that count as this brand. Case-insensitive.
   *  Include every spelling variant the store uses. */
  vendors: string[]
  /** Warehouse inbox that packs the parcels and receives the gift note. */
  warehouseEmail: string
  /** The gift to include, as it should read in the email ("a deluxe travel candle"). */
  giftName: string
  /** How many gifts this brand funds. Default 20. */
  cap?: number
  /** Minimum spend (AUD) required to qualify. Default 0 (no minimum). */
  minSpend?: number
  /** Whether minSpend is measured against this brand's subtotal in the order
   *  (default) or the whole order total. */
  minSpendBasis?: 'brand' | 'order'
  /** Optional per-brand launch date override (ISO). Falls back to CAMPAIGN.launchDate. */
  launchDate?: string
}

export type GiftCampaign = {
  /** Programme-wide launch date (ISO 8601). Orders before this are ignored, and
   *  the "gifts sent" count only looks at orders created on/after this. */
  launchDate: string
  /** Default cap when a brand doesn't set its own. */
  defaultCap: number
  /** From address for the warehouse emails. Must be a verified beauticate.com sender. */
  fromEmail: string
  /** Optional BCC so the Beauticate team keeps a copy of every gift note. */
  bccEmail?: string
  brands: GiftBrand[]
}

// ⚠️  EDIT ME — fill in real warehouse emails, gift names, caps and min spends.
// The two entries below are examples using real vendor strings from the store;
// replace/extend them for the actual launch line-up.
export const CAMPAIGN: GiftCampaign = {
  launchDate: '2026-07-28T00:00:00+10:00', // AEST — set to your real launch moment
  defaultCap: 20,
  fromEmail: 'gifts@beauticate.com',
  bccEmail: 'shop@beauticate.com',
  brands: [
    {
      key: 'maison-balzac',
      label: 'Maison Balzac',
      vendors: ['Maison Balzac'],
      warehouseEmail: 'warehouse@example.com', // ← set me
      giftName: 'a mini Josephine candle',      // ← set me
      cap: 20,
      minSpend: 0,
    },
    {
      key: 'subtle-energies',
      label: 'Subtle Energies',
      vendors: ['Subtle Energies'],
      warehouseEmail: 'warehouse@example.com', // ← set me
      giftName: 'a travel-size Rose Hydrating Mist', // ← set me
      cap: 20,
      minSpend: 80,
      minSpendBasis: 'brand',
    },
  ],
}

// ─── Helpers (pure) ────────────────────────────────────────────────────────────

export function capFor(brand: GiftBrand): number {
  return brand.cap ?? CAMPAIGN.defaultCap
}

export function launchDateFor(brand: GiftBrand): string {
  return brand.launchDate ?? CAMPAIGN.launchDate
}

export function getBrandByKey(key: string): GiftBrand | undefined {
  return CAMPAIGN.brands.find(b => b.key === key)
}

const normalize = (s: string) => s.trim().toLowerCase()

// A minimal shape of a Shopify webhook line item (only the fields we use).
export type OrderLineItem = {
  vendor?: string | null
  quantity?: number | null
  price?: string | null // per-unit price as a decimal string, e.g. "49.00"
}

/**
 * Which participating brands appear in this order, each with the AUD subtotal of
 * that brand's line items. Only brands with at least one matching line are returned.
 */
export function matchBrandsInOrder(
  lineItems: OrderLineItem[],
): { brand: GiftBrand; brandSubtotal: number }[] {
  const vendorIndex = new Map<string, GiftBrand>()
  for (const brand of CAMPAIGN.brands) {
    for (const v of brand.vendors) vendorIndex.set(normalize(v), brand)
  }

  const subtotals = new Map<string, number>() // brand.key → subtotal
  for (const li of lineItems) {
    const vendor = li.vendor ? normalize(li.vendor) : ''
    const brand = vendor ? vendorIndex.get(vendor) : undefined
    if (!brand) continue
    const price = parseFloat(li.price ?? '0') || 0
    const qty = li.quantity ?? 0
    subtotals.set(brand.key, (subtotals.get(brand.key) ?? 0) + price * qty)
  }

  return [...subtotals.entries()].map(([key, brandSubtotal]) => ({
    brand: getBrandByKey(key)!,
    brandSubtotal,
  }))
}

/** Does the order meet this brand's minimum spend? */
export function meetsMinSpend(
  brand: GiftBrand,
  brandSubtotal: number,
  orderTotal: number,
): boolean {
  const min = brand.minSpend ?? 0
  if (min <= 0) return true
  const basis = brand.minSpendBasis === 'order' ? orderTotal : brandSubtotal
  return basis >= min
}

export const orderTagFor = (brand: GiftBrand) => `gift-${brand.key}`
export const PROCESSED_TAG = 'gift-processed'
