'use client'
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { Cart } from '@/types/shopify'
import { track } from '@/lib/meta/pixel'

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
  removeItem: (lineId: string) => Promise<void>
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

  useEffect(() => {
    const savedId = loadCartId()
    if (!savedId) return
    fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ action: 'get', cartId: savedId }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then(data => {
        if (data?.id && data.lines?.nodes?.length > 0) {
          setCart(data)
        } else {
          clearCartId()
        }
      })
      .catch(() => clearCartId())
  }, [])

  const getOrCreateCart = useCallback(async () => {
    if (cart) return cart
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
    return newCart
  }, [cart])

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    const c = await getOrCreateCart()
    if (!c?.id) return
    const updated = await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ action: 'add', cartId: c.id, variantId, quantity }),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json())
    if (updated?.id) {
      setCart(updated)
      saveCartId(updated.id)
      setIsOpen(true)

      // Meta Pixel + CAPI: AddToCart for a real on-site cart add. This covers
      // every add-to-cart entry point (AddToCartButton, ProductBuyBox, MDX
      // ProductEmbed) since they all funnel through here.
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
      } catch {
        // analytics must never break add-to-cart
      }
    }
  }, [getOrCreateCart])

  const removeItem = useCallback(async (lineId: string) => {
    if (!cart?.id) return
    const updated = await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ action: 'remove', cartId: cart.id, lineIds: [lineId] }),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json())
    if (updated?.id) {
      setCart(updated)
      if (updated.lines?.nodes?.length === 0) clearCartId()
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
