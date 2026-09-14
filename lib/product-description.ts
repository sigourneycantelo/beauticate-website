/**
 * Strip a promotional preamble off the front of a Shopify product description.
 *
 * Brands routinely paste a running promotion into the TOP of every product
 * description — during the BOOIE gift-with-purchase, all ~50 of their products
 * opened with "Free gift with any BOOIE Beauty order: a Bloody Delicious
 * illuminator, added to your cart automatically. While stocks last."
 *
 * On the page that is fine and self-correcting: the offer is edited or removed
 * when it ends. In a <meta name="description">, an og:description or Product
 * JSON-LD it is not, because those outlive the promotion:
 *
 *   • Google indexes the meta description and keeps serving it for weeks
 *   • Facebook/Instagram scrape og:description ONCE and cache it, so every
 *     shared link keeps advertising an offer that has ended
 *   • the offer wording is also the worst possible SEO opener — it says nothing
 *     about the product, and it is identical across every product in the brand
 *
 * So metadata takes the description with any leading offer sentences removed.
 * Only LEADING sentences are dropped, and only ones that actually read as an
 * offer, so a product whose real copy happens to mention a gift later is left
 * alone. If stripping would empty the description, the original is kept — a
 * missing meta description is worse than a stale one.
 */

/** Reads as a promotion rather than a description of the product itself. */
const OFFER = /(free gift|gift with (any|purchase|your)|while stocks last|added to your cart|spend \$\s*\d|free with any)/i

export function withoutOfferPreamble(description?: string | null): string {
  const text = (description ?? '').trim()
  if (!text) return ''

  // Sentences, terminators kept, so rejoining preserves the original spacing.
  const sentences = text.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) ?? [text]

  let i = 0
  while (i < sentences.length && OFFER.test(sentences[i])) i++
  if (i === 0) return text

  const rest = sentences.slice(i).join('').trim()
  return rest || text
}

/** The description as it should appear in metadata: offer stripped, capped. */
export function metaDescription(description?: string | null, max = 160): string {
  const clean = withoutOfferPreamble(description)
  return clean.length > max ? clean.slice(0, max).trimEnd() : clean
}
