import type { ShopifyProduct } from '@/types/shopify'
import ProductRail from '@/components/shared/ProductRail'

// Thin wrapper over the shared ProductRail so category / archive shop strips
// share the exact tile size, scroll speed and styling as the home page hero
// rail. Single row (the established look for these secondary rails).
export default function ShopStrip({
  products,
  eyebrow = 'Beauticate Shop',
  heading,
  subheading = 'Curated by the Beauticate Collective',
  cta,
}: {
  products: ShopifyProduct[]
  eyebrow?: string
  heading?: React.ReactNode
  subheading?: string
  cta?: { label: string; href: string }
}) {
  return (
    <ProductRail
      products={products}
      rows={1}
      eyebrow={eyebrow}
      heading={heading ?? <>Essentials for living beautifully.<br /><em className="italic">Curated by editors and experts, not algorithms.</em></>}
      description={subheading}
      cta={cta}
    />
  )
}
