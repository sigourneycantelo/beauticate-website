'use client'

/**
 * Shopify cart permalink → our cart.
 *
 * Instagram Shopping sends customers here when they tap a tagged product on a
 * post or reel. The URL is a standard Shopify cart permalink, comma-separated
 * for multiple items, with Meta's own markers in the query string:
 *
 *   /cart/45350813564997:1,45009309302853:1
 *     ?attributes[Channel]=Instagram&attributes[cart-id]=...&cart_origin=instagram
 *
 * Confirmed against real devices on 7 Sep 2026 — see
 * docs/instagram-checkout-handoff.md. Meta still addresses these to
 * shop.beauticate.com, a Vercel alias of this app; next.config.ts forwards
 * /cart/* from there to www so this route runs on the right origin (see below).
 *
 * Why a client component, and why it must run on www:
 * the cart id lives in localStorage under 'beauticate_cart_id', not a cookie, so
 * a server component cannot hand the cart to the browser — and localStorage is
 * per-origin, so a cart built on shop.beauticate.com would be invisible the
 * moment the customer reached www.beauticate.com. They have to arrive here
 * already on www.
 *
 * Everything goes through CartProvider.addItem rather than talking to
 * /api/cart directly: it owns cart creation, the localStorage id, analytics
 * attribution and the in-memory state the drawer renders. Bypassing it is how
 * you get a cart that exists on Shopify and nowhere the customer can see.
 * reconcileGift() runs server-side on every add, so a permalink carrying a BOOIE
 * product picks up the gift with no extra work here.
 */

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/shop/CartProvider'
import { parseCartPermalink } from '@/lib/cart-permalink'

export default function CartPermalinkPage() {
  const router = useRouter()
  const { addItem, openCart } = useCart()
  const [failed, setFailed] = useState(false)
  // Effects run twice in dev StrictMode; adding the basket twice is not a
  // mistake the customer would forgive.
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const run = async () => {
      // Read the raw path rather than route params: the segment contains ':' and
      // ',', and we want it exactly as Shopify wrote it.
      const path = decodeURIComponent(window.location.pathname)
      const raw = path.replace(/^\/cart\/?/, '')
      const pairs = raw ? parseCartPermalink(raw) : []

      if (pairs.length === 0) {
        router.replace('/shop')
        return
      }

      // Sequential, not parallel: CartProvider serialises cart creation behind a
      // shared ref, and a burst of concurrent adds is exactly the pattern that
      // used to orphan carts.
      let added = 0
      for (const { variantId, quantity } of pairs) {
        try {
          await addItem(variantId, quantity)
          added++
        } catch {
          // Skip this line and keep going — see parseCartPermalink.
        }
      }

      if (added === 0) {
        setFailed(true)
        return
      }

      // The provider lives in the root layout, so the drawer's open state
      // survives this navigation and the customer lands on /shop looking at
      // what they picked — which is the whole point of the exercise.
      openCart()
      router.replace('/shop')
    }

    void run()
  }, [addItem, openCart, router])

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        {failed ? (
          <>
            <h1 className="font-serif text-2xl mb-3">We couldn&rsquo;t open that basket</h1>
            <p className="text-charcoal-light text-sm mb-6">
              Those items may no longer be available. Everything else is still here.
            </p>
            <a href="/shop" className="underline underline-offset-4 text-sm">
              Continue to the shop
            </a>
          </>
        ) : (
          <>
            <h1 className="font-serif text-2xl mb-3">Just a moment</h1>
            <p className="text-charcoal-light text-sm" role="status" aria-live="polite">
              We&rsquo;re adding your items to the cart&hellip;
            </p>
          </>
        )}
      </div>
    </main>
  )
}
