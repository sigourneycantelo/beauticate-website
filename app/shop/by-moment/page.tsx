import { permanentRedirect } from 'next/navigation'

// Superseded by /shop/gifting (the "Shop by Moment" edits index in the new nav).
export default function ShopByMomentRedirect() {
  permanentRedirect('/shop/gifting')
}
