import { createCart, getCart, addToCart, removeFromCart, updateCartAttributes } from '@/lib/shopify'
import { reconcileGift } from '@/lib/gwp-cart'
import { GWP } from '@/lib/gwp'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { action, cartId, variantId, lineIds, quantity, attributes } = await req.json()
  try {
    if (action === 'create') return NextResponse.json(await createCart())

    // The gift is never added by request — only by reconcileGift, off the back of a
    // qualifying cart. This blocks the one-cent buy: a crafted add, or a stale
    // client, gets the cart back untouched rather than a $0.01 illuminator.
    if (action === 'add' && variantId === GWP.giftVariantId) {
      return NextResponse.json(await reconcileGift(await getCart(cartId)))
    }

    if (action === 'get') return NextResponse.json(await reconcileGift(await getCart(cartId)))
    if (action === 'add') return NextResponse.json(await reconcileGift(await addToCart(cartId, variantId, quantity)))
    if (action === 'remove') return NextResponse.json(await reconcileGift(await removeFromCart(cartId, lineIds)))
    if (action === 'attributes') return NextResponse.json(await updateCartAttributes(cartId, attributes))
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[cart API error]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
