import { createCart, addToCart, removeFromCart } from '@/lib/shopify'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { action, cartId, variantId, lineIds, quantity } = await req.json()
  try {
    if (action === 'create') return NextResponse.json(await createCart())
    if (action === 'add') return NextResponse.json(await addToCart(cartId, variantId, quantity))
    if (action === 'remove') return NextResponse.json(await removeFromCart(cartId, lineIds))
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[cart API error]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
