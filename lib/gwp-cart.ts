/**
 * Server-side gift-with-purchase reconciliation.
 *
 * Runs after every cart read and every cart mutation (see app/api/cart/route.ts),
 * so the gift is a property of the cart's contents rather than of whichever button
 * the customer happened to press. That placement is deliberate:
 *
 *   • it is the only path the storefront has to Shopify's cart, so there is no
 *     client-side route that can leave the cart in a state we didn't reconcile;
 *   • a customer who deletes the gift line while a BOOIE product is still in the
 *     cart simply gets it back on the next response — the gift is not theirs to
 *     remove, and the drawer therefore offers no button to try;
 *   • it survives a stale tab, a bfcache restore and a second device on the same
 *     cart id, because it reasons about the cart it was just handed, not history.
 *
 * Every failure path returns the cart it was given. A broken promotion must never
 * become a broken cart.
 */
import { addToCart, removeFromCart, updateCartLineQuantity } from './shopify'
import { GWP, cartQualifies, giftLines } from './gwp'
import type { Cart } from '@/types/shopify'

export async function reconcileGift(cart: Cart | null): Promise<Cart | null> {
  if (!GWP.enabled || !cart?.id) return cart

  try {
    let current = cart
    const qualifies = cartQualifies(current)
    let gifts = giftLines(current)

    // Nothing earns the gift → make sure there isn't one (covers "last BOOIE
    // product removed" and a cart that qualified in an older session).
    if (!qualifies) {
      if (!gifts.length) return current
      return await removeFromCart(current.id, gifts.map(l => l.id))
    }

    // Qualifies but has no gift → add exactly one, labelled for checkout.
    if (!gifts.length) {
      current = await addToCart(current.id, GWP.giftVariantId, 1, [...GWP.lineAttributes])
      gifts = giftLines(current)

      // Out of stock. The variant is inventory-policy DENY, so Shopify accepts the
      // mutation and then clamps the line to quantity 0 rather than erroring — the
      // same behaviour getVariantAvailability probes for. Take the dead line back
      // out and carry on silently: no gift, no error, no blocked checkout.
      const added = gifts[0]
      if (!added || (added.quantity ?? 0) < 1) {
        return gifts.length ? await removeFromCart(current.id, gifts.map(l => l.id)) : current
      }
      return current
    }

    // Has a gift already — hold it at exactly one line of quantity one.
    if (gifts.length > 1) {
      current = await removeFromCart(current.id, gifts.slice(1).map(l => l.id))
      gifts = giftLines(current)
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
  } catch (e) {
    console.error('[gwp] reconcile failed, cart left as-is:', e instanceof Error ? e.message : e)
    return cart
  }
}
