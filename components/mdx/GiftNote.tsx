import { offerForVendor } from '@/lib/gwp'
import { getVariantAvailability } from '@/lib/shopify'

/**
 * The gift-with-purchase offer, stated inside an article body.
 *
 * Exists because the alternative — writing the offer into the MDX as prose —
 * cannot be true for long. Article copy can't know the minimum spend changed,
 * and it can't know the gift ran out; it just keeps promising. During the BOOIE
 * launch the body copy of three stories said "free with any BOOIE order" while
 * `lib/gwp.ts` had already moved to a $45 minimum, and there were 20 units of
 * gift stock behind a homepage hero.
 *
 * So this renders nothing at all unless the offer can actually be honoured, and
 * takes every word from the offer config rather than repeating it:
 *
 *   • no live offer for the vendor (ended, switched off, outside its window)
 *     → renders nothing
 *   • gift out of stock → renders nothing
 *   • otherwise → `offer.pitch`, which carries the current minimum spend
 *
 * The stock probe fails OPEN, matching the product page: a Shopify hiccup shows
 * the offer rather than hiding it, and the cart reconciler is the real gate — it
 * quietly declines to add a gift that isn't there.
 *
 * Usage in MDX, wherever the offer belongs in the story:
 *
 *   <GiftNote />                        // defaults to the BOOIE offer
 *   <GiftNote vendor="Maison Balzac" /> // when the rotation moves on
 */
export default async function GiftNote({ vendor = 'BOOIE Beauty' }: { vendor?: string }) {
  const offer = offerForVendor(vendor)
  if (!offer) return null

  const stock = await getVariantAvailability([offer.giftVariantId])
  if (!(stock[offer.giftVariantId] ?? true)) return null

  return (
    <aside className="not-prose my-8 border border-eucalypt/30 bg-eucalypt/[0.06] px-5 py-4 rounded-[2px]">
      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-eucalypt font-semibold">
        {offer.badge}
      </p>
      <p className="font-serif text-charcoal mt-1.5" style={{ fontSize: '15px', lineHeight: 1.5 }}>
        {offer.pitch}
      </p>
      {/* Deliberately avoids "added to your cart automatically" — true on this
          storefront, false for an Instagram Shopping order, which gets the gift
          put in the parcel instead (lib/gift-campaign.ts). This wording holds on
          both lanes. */}
      <p className="font-sans text-[10px] tracking-[0.06em] text-charcoal-light/70 mt-2">
        While stocks last.
      </p>
    </aside>
  )
}
