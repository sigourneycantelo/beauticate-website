import ShopSubNav, { type SubNavItem } from '@/components/shop/ShopSubNav'
import { getCollections, brandsFromCollections } from '@/lib/shopify'
import { BROAD_CATEGORIES, MOOD_MOMENTS } from '@/lib/shop-taxonomy'
import { getArticleMoments } from '@/lib/article-moments'
import { getCuratorCollections } from '@/lib/curator-collections'

// No Organization JSON-LD here. This layout used to declare a second Organization
// (no @id, different description) through next/script, which never reached the
// served HTML. Emitting it properly would have put two competing declarations of
// Beauticate on every /shop page; the one sitewide graph in app/layout.tsx is the
// single source of truth for the entity.

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
  const brands: SubNavItem[] = brandsFromCollections(collections).map(b => ({ label: b.name, href: `/shop/brands/${b.handle}`, image: imgByHandle.get(b.handle) }))
  const curators: SubNavItem[] = getCuratorCollections().map(c => ({
    label: `${c.name}'s Favourites`, href: `/shop/curators/${c.slug}`, image: c.photo,
  }))
  const moments: SubNavItem[] = [
    ...MOOD_MOMENTS.map(m => ({ label: m.name, href: `/shop/collections/${m.handle}`, image: imgByHandle.get(m.handle) })),
    ...getArticleMoments().map(m => ({ label: m.title, href: `/shop/moments/${m.slug}`, image: m.image })),
  ]

  return (
    <>
      <ShopSubNav category={category} brands={brands} moments={moments} curators={curators} />
      {children}
    </>
  )
}
