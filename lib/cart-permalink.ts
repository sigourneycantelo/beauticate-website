/**
 * Shopify cart permalink parsing.
 *
 * Format: `variantId:quantity`, comma-separated for multiple items —
 * `45350813564997:1,45009309302853:1`. This is what Instagram Shopping sends
 * when a customer taps a tagged product on a post or reel (confirmed on real
 * devices, 7 Sep 2026; see docs/instagram-checkout-handoff.md).
 *
 * Lives here rather than in the route so it can be unit-tested without a DOM,
 * and so a page file exports only its component.
 */

export type CartPermalinkLine = { variantId: string; quantity: number }

/**
 * Unparseable pairs are dropped rather than throwing. One delisted or malformed
 * product should never cost the customer the other three items in their basket —
 * a partial cart is recoverable, an error page is not.
 */
export function parseCartPermalink(raw: string): CartPermalinkLine[] {
  return raw
    .split(',')
    .map((entry): CartPermalinkLine | null => {
      const [id, qty] = entry.trim().split(':')
      if (!/^\d+$/.test(id ?? '')) return null
      const quantity = qty === undefined ? 1 : Number(qty)
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) return null
      return { variantId: `gid://shopify/ProductVariant/${id}`, quantity }
    })
    .filter((line): line is CartPermalinkLine => line !== null)
}
