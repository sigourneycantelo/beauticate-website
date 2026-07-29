import type { ShopifyProduct } from '@/types/shopify'
import ProductRail from '@/components/shared/ProductRail'

// The home page "team favourites" rail — the canonical slow-scroll format that
// every other product rail now mirrors. Thin wrapper over the shared
// ProductRail so this stays byte-for-byte identical to the shared component.
export default function ShopGrid({
  products,
  eyebrow = 'Beauticate Shop',
  heading,
}: {
  products: ShopifyProduct[]
  eyebrow?: string
  heading?: React.ReactNode
  subheading?: string
}) {
  return (
    <ProductRail
      products={products}
      rows={2}
      eyebrow={eyebrow}
      heading={heading ?? <>Essentials for living beautifully.<br /><em className="italic">Curated by editors and experts, not algorithms.</em></>}
      description="Every product tested, used and recommended by our team before it earns a place here."
      cta={{ label: 'Explore the shop', href: '/shop' }}
    />
  )
}
