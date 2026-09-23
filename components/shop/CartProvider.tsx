'use client'
import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'
import type { Cart } from '@/types/shopify'
import { track } from '@/lib/meta/pixel'
import { gaAddToCart, gidToId } from '@/lib/ga/events'
import { syncAttributionToCart } from '@/lib/attribution'

const STORAGE_KEY = 'beauticate_cart_id'
const STORAGE_TTL = 30 * 24 * 60 * 60 * 1000 // 30 days

function saveCartId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, ts: Date.now() }))
  } catch {}
}

function loadCartId(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { id, ts } = JSON.parse(raw)
    if (Date.now() - ts > STORAGE_TTL) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return id
  } catch {
    return null
  }
}

function clearCartId() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

interface CartContextType {
  cart: Cart | null
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (variantId: string, quantity?: number) => Promise<void>
  removeItem: (lineId: string | string[]) => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Concurrency guards. The cart's line items live only in in-memory React
  // state; the durable store is just the Shopify cart id in localStorage. That
  // makes ordering between the async "re-read the server cart" path and the
  // "mutate the cart" path the whole ballgame:
  //   - syncingRef      prevents overlapping refreshCart() reads.
  //   - mutatingRef     is true for the full duration of an add/remove.
  //   - mutationSeqRef  increments on every authoritative (mutation) setCart,
  //                     so an in-flight read that started before a mutation can
  //                     detect it lost the race and discard its stale result.
  // Together these stop a stale GET from clobbering a just-added item — a
  // "disappeared from my cart" symptom.
  const syncingRef = useRef(false)
  const mutatingRef = useRef(false)
  const mutationSeqRef = useRef(0)

  // Re-read the cart from Shopify (the source of truth) using the persisted id
  // and reconcile in-memory state against it. Called on mount and whenever the
  // user returns to the page (e.g. Back from Shopify's hosted checkout), since a
  // bfcache restore preserves stale React state and never re-runs mount effects.
  const refreshCart = useCallback(async () => {
    const savedId = loadCartId()
    if (!savedId || syncingRef.current || mutatingRef.current) return
    syncingRef.current = true
    const seqAtStart = mutationSeqRef.current
    try {
      const data = await fetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ action: 'get', cartId: savedId }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(r => (r.ok ? r.json() : null))
        .catch(() => null)
      // A mutation started/finished while this read was in flight — its result
      // is newer than ours, so drop what we fetched rather than overwrite it.
      if (mutatingRef.current || mutationSeqRef.current !== seqAtStart) return
      if (!data?.id) return // network/parse error — leave existing state intact
      if (data.lines?.nodes?.length > 0) {
        setCart(data)
      } else {
        // Empty cart means checkout completed (Shopify clears it) or it expired.
        setCart(null)
        clearCartId()
      }
    } finally {
      syncingRef.current = false
    }
  }, [])

  useEffect(() => {
    refreshCart()

    // Re-sync whenever the user returns to the page — covers back-forward cache
    // restores (event.persisted) after leaving for Shopify's hosted checkout,
    // and tab re-focus after completing/abandoning checkout in place.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) refreshCart()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshCart()
    }
    window.addEventListener('pageshow', onPageShow)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pageshow', onPageShow)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [refreshCart])

  // Resolve the cart to add to. Order matters:
  //   1. an already-loaded in-memory cart,
  //   2. a persisted server-side cart (localStorage id) — reused, never replaced,
  //   3. only as a last resort, a brand-new cart.
  //
  // Reusing the persisted cart (step 2) is critical: on a fresh page load the
  // in-memory `cart` is null until the async hydration finishes, so an add that
  // fires in that window must NOT create a new cart and overwrite the stored id.
  // Doing so orphans the cart holding previously-added items — a root cause of
  // "an item disappeared from my cart." A shared in-flight ref serialises
  // concurrent adds so two quick clicks can't each create a cart either.
  const resolveCartRef = useRef<Promise<Cart | null> | null>(null)
  // Attribution (GA4 client_id, Meta fbp/fbc) only needs writing once per cart
  // id per page load — guards against re-syncing on every getOrCreateCart call.
  const attributionSyncedRef = useRef<string | null>(null)
  const ensureAttributionSynced = useCallback((cartId: string) => {
    if (attributionSyncedRef.current === cartId) return
    attributionSyncedRef.current = cartId
    syncAttributionToCart(cartId)
  }, [])
  const getOrCreateCart = useCallback(async () => {
    if (cart) return cart
    if (resolveCartRef.current) return resolveCartRef.current

    const run = (async (): Promise<Cart | null> => {
      const savedId = loadCartId()
      if (savedId) {
        const existing = await fetch('/api/cart', {
          method: 'POST',
          body: JSON.stringify({ action: 'get', cartId: savedId }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then(r => (r.ok ? r.json() : null))
          .catch(() => null)
        if (existing?.id) {
          setCart(existing)
          saveCartId(existing.id)
          ensureAttributionSynced(existing.id)
          return existing
        }
        // Stale / expired id — drop it before creating a fresh cart.
        clearCartId()
      }
      const res = await fetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ action: 'create' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const newCart = await res.json()
      if (!res.ok || !newCart?.id) {
        console.error('[cart] create failed', newCart)
        return null
      }
      setCart(newCart)
      saveCartId(newCart.id)
      ensureAttributionSynced(newCart.id)
      return newCart
    })()

    resolveCartRef.current = run
    try {
      return await run
    } finally {
      resolveCartRef.current = null
    }
  }, [cart, ensureAttributionSynced])

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    mutatingRef.current = true
    try {
      const c = await getOrCreateCart()
      if (!c?.id) return
      const updated = await fetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ action: 'add', cartId: c.id, variantId, quantity }),
        headers: { 'Content-Type': 'application/json' },
      }).then(r => r.json())
      if (updated?.id) {
        mutationSeqRef.current++
        setCart(updated)
        saveCartId(updated.id)
        setIsOpen(true)

        // Meta Pixel + CAPI + GA4: AddToCart / add_to_cart for a real on-site
        // cart add. This covers every add-to-cart entry point (AddToCartButton,
        // ProductBuyBox, MDX ProductEmbed) since they all funnel through here.
        try {
          const line = updated.lines?.nodes?.find((l: any) => l.merchandise?.id === variantId)
          const m = line?.merchandise
          const price = m?.price
          const productId = m?.product?.id ?? variantId
          track('AddToCart', {
            content_type: 'product',
            content_ids: [productId],
            ...(m?.product?.title ? { content_name: m.product.title } : {}),
            contents: [{ id: productId, quantity }],
            ...(price ? { value: parseFloat(price.amount) * quantity, currency: price.currencyCode } : {}),
          })
          gaAddToCart(
            {
              item_id: gidToId(productId),
              item_name: m?.product?.title ?? productId,
              item_brand: m?.product?.vendor,
              price: price ? parseFloat(price.amount) : undefined,
              quantity,
            },
            price?.currencyCode ?? 'AUD'
          )
        } catch {
          // analytics must never break add-to-cart
        }
      }
    } finally {
      mutatingRef.current = false
    }
  }, [getOrCreateCart])

  // Accepts several line ids because one product can occupy more than one cart
  // line: Shopify splits a line when a discount applies to only some of its units
  // (the gift-with-purchase cent offset does exactly that). The drawer shows such
  // lines merged, so Remove has to take the whole group out at once.
  const removeItem = useCallback(async (lineId: string | string[]) => {
    if (!cart?.id) return
    const lineIds = Array.isArray(lineId) ? lineId : [lineId]
    if (!lineIds.length) return
    mutatingRef.current = true
    try {
      const updated = await fetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ action: 'remove', cartId: cart.id, lineIds }),
        headers: { 'Content-Type': 'application/json' },
      }).then(r => r.json())
      if (updated?.id) {
        mutationSeqRef.current++
        setCart(updated)
        if (updated.lines?.nodes?.length === 0) clearCartId()
      }
    } finally {
      mutatingRef.current = false
    }
  }, [cart])

  return (
    <CartContext.Provider value={{
      cart, isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem, removeItem,
    }}>
      {children}
    </CartContext.Provider>
  )
}
