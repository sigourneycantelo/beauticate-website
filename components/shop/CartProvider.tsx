'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Cart } from '@/types/shopify'

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

  const getOrCreateCart = useCallback(async () => {
    if (cart) return cart
    const newCart = await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ action: 'create' }),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json())
    setCart(newCart)
    return newCart
  }, [cart])

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    const c = await getOrCreateCart()
    const updated = await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ action: 'add', cartId: c.id, variantId, quantity }),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json())
    setCart(updated)
    setIsOpen(true)
  }, [getOrCreateCart])

  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) return
    const updated = await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ action: 'remove', cartId: cart.id, lineIds: [lineId] }),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json())
    setCart(updated)
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
