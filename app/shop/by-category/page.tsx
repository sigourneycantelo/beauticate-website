import { permanentRedirect } from 'next/navigation'

// Superseded by the broad category pages (/shop/beauty, /shop/wellness, /shop/living)
// reached from the new "Shop by Category" nav. Land on the shop home.
export default function ShopByCategoryRedirect() {
  permanentRedirect('/shop')
}
