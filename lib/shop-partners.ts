// Rest (sleep brand) — front-end rules that are not expressible in Shopify.
// Brief: 12 Oct 2026. Remove the colour allowlist once Rest has taken the other
// colours off the Beauticate price list; it hides variants in the theme only.

/** Rest arrives under two vendor strings ("Rest" and "Rest (AU)"). Match both. */
export const isRestVendor = (vendor?: string | null): boolean =>
  /^rest(\s*\(au\))?$/i.test((vendor ?? '').trim())

/** Brand collection handles that carry the paid-partnership line. */
const PAID_PARTNERSHIP_BRAND_HANDLES = new Set(['rest'])

export const PAID_PARTNERSHIP_LABEL = 'Paid partnership'

export const hasPaidPartnership = (p: { vendor?: string | null }): boolean => isRestVendor(p.vendor)
export const brandHasPaidPartnership = (handle: string): boolean =>
  PAID_PARTNERSHIP_BRAND_HANDLES.has(handle)

// ─── Colour allowlist ────────────────────────────────────────────────────────
// Modern Dropship cannot select colours on our side, so every colour syncs.
// Comforter and sheet set show White + Ivory only; pyjamas keep every colour.
const REST_ALLOWED_COLOURS = ['arctic white', 'snow ivory']
const REST_COLOUR_RESTRICTED = /comforter|sheet set/i
const COLOUR_OPTION = /^colou?r$/i

type VariantLike = { selectedOptions?: { name: string; value: string }[] }

/**
 * Drops the colourways Sig doesn't want listed from a Rest product, in memory
 * only. Never deletes variants in Shopify (that breaks the Modern Dropship
 * mapping). If the filter would leave nothing, for instance because Rest renamed
 * a colour, the product is returned untouched rather than rendered empty.
 */
export function applyVariantAllowlist<T extends { vendor?: string; title?: string; variants?: { nodes?: VariantLike[] } }>(p: T): T {
  if (!isRestVendor(p.vendor) || !REST_COLOUR_RESTRICTED.test(p.title ?? '')) return p
  const nodes = p.variants?.nodes
  if (!nodes?.length) return p
  const kept = nodes.filter(v => {
    const colour = v.selectedOptions?.find(o => COLOUR_OPTION.test(o.name))?.value
    return colour ? REST_ALLOWED_COLOURS.includes(colour.trim().toLowerCase()) : true
  })
  if (!kept.length) {
    console.warn(`Rest colour allowlist matched no variants on "${p.title}" — showing all`)
    return p
  }
  return { ...p, variants: { ...p.variants, nodes: kept } }
}

/** Walks a Storefront response and applies the allowlist to every product in it. */
export function scrubVariantAllowlist<T>(data: T): T {
  const walk = (node: any): any => {
    if (Array.isArray(node)) return node.map(walk)
    if (node && typeof node === 'object') {
      const out: any = {}
      for (const k of Object.keys(node)) out[k] = walk(node[k])
      return typeof out.vendor === 'string' && out.variants?.nodes ? applyVariantAllowlist(out) : out
    }
    return node
  }
  return walk(data)
}

// ─── Exclusive bundles ───────────────────────────────────────────────────────
const EXCLUSIVE_BUNDLE = /^\s*the (whole night|skin layer)\b/i
export const EXCLUSIVE_BADGE = 'Exclusive to Beauticate'
export const isExclusiveBundle = (p: { vendor?: string | null; title?: string | null }): boolean =>
  isRestVendor(p.vendor) && EXCLUSIVE_BUNDLE.test(p.title ?? '')
