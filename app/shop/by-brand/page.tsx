import { permanentRedirect } from 'next/navigation'

// Superseded by /shop/brands (the A–Z brand index wired into the new nav).
export default function ShopByBrandRedirect() {
  permanentRedirect('/shop/brands')
}
