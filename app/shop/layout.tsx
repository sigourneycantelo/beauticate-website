import Script from 'next/script'
import ShopSubNav, { type SubNavItem } from '@/components/shop/ShopSubNav'
import { getCollections, brandsFromCollections } from '@/lib/shopify'
import { BROAD_CATEGORIES, MOOD_MOMENTS } from '@/lib/shop-taxonomy'
import { getArticleMoments } from '@/lib/article-moments'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com'

const shopOrgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Beauticate',
  url: SITE,
  logo: { '@type': 'ImageObject', url: `${SITE}/logo-dark.png` },
  description: 'Australia\'s most trusted independent beauty publisher. Beauticate Shop is the curated beauty and wellness edit, chosen by editors and experts.',
  // @id ties this back to the canonical Person node declared sitewide in
  // app/layout.tsx, rather than asserting a second, separate Sigourney.
  founder: { '@type': 'Person', '@id': `${SITE}/#sigourney-cantelo`, name: 'Sigourney Cantelo', url: `${SITE}/about` },
  sameAs: [
    'https://www.instagram.com/beauticate/',
    'https://www.facebook.com/beauticate',
    'https://www.linkedin.com/company/beauticate.com',
    // @beauticate 404s — see app/layout.tsx. Canonical channel-ID form.
    'https://www.youtube.com/channel/UCfuyyVnNfbiwovULXTRQiVA',
    'https://au.pinterest.com/beauticate/',
    'https://www.wikidata.org/wiki/Q139643093',
  ],
}

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
  const moments: SubNavItem[] = [
    ...MOOD_MOMENTS.map(m => ({ label: m.name, href: `/shop/collections/${m.handle}`, image: imgByHandle.get(m.handle) })),
    ...getArticleMoments().map(m => ({ label: m.title, href: `/shop/moments/${m.slug}`, image: m.image })),
  ]

  return (
    <>
      <Script id="shop-org-schema" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(shopOrgSchema)}
      </Script>
      <ShopSubNav category={category} brands={brands} moments={moments} />
      {children}
    </>
  )
}
