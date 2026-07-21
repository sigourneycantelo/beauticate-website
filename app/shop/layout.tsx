import ShopSubNav, { type SubNavItem } from '@/components/shop/ShopSubNav'
import { getCollections } from '@/lib/shopify'
import { BROAD_CATEGORIES, SHOP_BRANDS, MOOD_MOMENTS } from '@/lib/shop-taxonomy'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const collections = await getCollections(100)
  const imgByHandle = new Map<string, string>()
  for (const c of collections) {
    const url = c.image?.url ?? c.products?.nodes?.[0]?.featuredImage?.url
    if (url) imgByHandle.set(c.handle, url)
  }

  const category: SubNavItem[] = BROAD_CATEGORIES.map(b => ({
    label: b.label,
    href: b.comingSoon ? '/shop/style' : `/shop/${b.slug}`,
    image: b.handle ? imgByHandle.get(b.handle) : undefined,
    soon: b.comingSoon,
  }))
  const brands: SubNavItem[] = SHOP_BRANDS.map(b => ({ label: b.name, href: `/shop/brands/${b.handle}`, image: imgByHandle.get(b.handle) }))
  const moments: SubNavItem[] = MOOD_MOMENTS.map(m => ({ label: m.name, href: `/shop/collections/${m.handle}`, image: imgByHandle.get(m.handle) }))

  return (
    <>
      <ShopSubNav category={category} brands={brands} moments={moments} />
      {children}
    </>
  )
}
