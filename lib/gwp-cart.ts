/**
 * Server-side gift-with-purchase reconciliation.
 *
 * Runs after every cart read and every cart mutation (see app/api/cart/route.ts),
 * so a gift is a property of the cart's contents rather than of whichever button
 * the customer happened to press. That placement is what makes the edge cases
 * fall out for free:
 *
 *   • it is the only path the storefront has to Shopify's cart, so there is no
 *     client route that can leave the cart unreconciled — including the Instagram
 *     permalink route (app/cart), which gets the gift without a line of
 *     gift-specific code;
 *   • a customer who deletes the gift while still qualifying gets it back on the
 *     next response — the gift is not theirs to remove, so the drawer offers no
 *     button to try;
 *   • it survives a stale tab, a bfcache restore and a second device on the same
 *     cart id, because it reasons about the cart it was handed, not history.
 *
 * Offers are reconciled independently, so a rotation can overlap two brands and a
 * cart qualifying for both receives both gifts. Gifts belonging to an offer that
 * has ended are removed.
 *
 * Every failure path returns the cart it was given. A broken promotion must never
 * become a broken cart.
 */
import { addToCart, removeFromCart, updateCartLineQuantity } from './shopify'
import {
  GWP_OFFERS,
  isOfferLive,
  cartQualifiesFor,
  giftLinesFor,
  allGiftLines,
  offerForGiftLine,
  type GiftOffer,
} from './gwp'
import type { Cart } from '@/types/shopify'

export async function reconcileGift(cart: Cart | null): Promise<Cart | null> {
  if (!cart?.id) return cart

  try {
    let current: Cart = cart
    const now = new Date()

    // Gifts from offers that are over (or switched off) don't belong in a cart
    // any more — a rotation must not leave last fortnight's gift behind.
    const stale = allGiftLines(current).filter(l => {
      const offer = offerForGiftLine(l)
      return !offer || !isOfferLive(offer, now)
    })
    if (stale.length) {
      current = await removeFromCart(current.id, stale.map(l => l.id))
    }

    for (const offer of GWP_OFFERS) {
      if (!isOfferLive(offer, now)) continue
      current = await reconcileOffer(current, offer)
    }

    return current
  } catch (e) {
    console.error('[gwp] reconcile failed, cart left as-is:', e instanceof Error ? e.message : e)
    return cart
  }
}

async function reconcileOffer(cart: Cart, offer: GiftOffer): Promise<Cart> {
  let current = cart
  const qualifies = cartQualifiesFor(offer, current)
  let gifts = giftLinesFor(offer, current)

  // Nothing earns the gift → make sure there isn't one. Covers "last qualifying
  // product removed" and a cart that qualified in an older session.
  if (!qualifies) {
    if (!gifts.length) return current
    return await removeFromCart(current.id, gifts.map(l => l.id))
  }

  // Qualifies but has no gift → add exactly one, labelled for checkout.
  if (!gifts.length) {
    current = await addToCart(current.id, offer.giftVariantId, 1, [...offer.lineAttributes])
    gifts = giftLinesFor(offer, current)

    // Out of stock. The gift variant is inventory-policy DENY, so Shopify accepts
    // the mutation and then clamps the line to quantity 0 rather than erroring.
    // Take the dead line back out and carry on silently: no gift, no error, no
    // blocked checkout, and the offer stops advertising itself once stock is gone.
    const added = gifts[0]
    if (!added || (added.quantity ?? 0) < 1) {
      return gifts.length ? await removeFromCart(current.id, gifts.map(l => l.id)) : current
    }
    return current
  }

  // Has a gift already — hold it at exactly one line of quantity one.
  if (gifts.length > 1) {
    current = await removeFromCart(current.id, gifts.slice(1).map(l => l.id))
    gifts = giftLinesFor(offer, current)
  }
  const gift = gifts[0]
  if (gift && (gift.quantity ?? 0) < 1) {
    // Went out of stock while sitting in the cart: drop it quietly.
    return await removeFromCart(current.id, [gift.id])
  }
  if (gift && gift.quantity !== 1) {
    current = await updateCartLineQuantity(current.id, gift.id, 1)
  }
  return current
}
