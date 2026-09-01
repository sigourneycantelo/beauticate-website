import { getAllArticles, getHeroArticles, getVodcastEpisodes } from '@/lib/content'
import { getProducts, getCollections, getCollectionFull, getTeamRailProducts } from '@/lib/shopify'
import { SHOP_BRANDS, FREE_SHIPPING_VENDORS } from '@/lib/shop-taxonomy'
import type { ShopifyCollection } from '@/types/shopify'
import type { Metadata } from 'next'

import HeroWide from '@/components/home/HeroWide'
import DuoLeft from '@/components/home/DuoLeft'
import ShopGrid from '@/components/home/ShopGrid'
import ProductRail from '@/components/shared/ProductRail'
import TheCollective from '@/components/shared/TheCollective'
import ReviewsTeaser from '@/components/home/ReviewsTeaser'
import InstagramFeed from '@/components/home/InstagramFeed'
import StoriesTrio from '@/components/home/StoriesTrio'
import PodcastSection from '@/components/home/PodcastSection'
import InsidersBar from '@/components/home/InsidersBar'
import HeroSplit from '@/components/home/HeroSplit'
import ShopByMoment from '@/components/home/ShopByMoment'
import ShopByCategory from '@/components/home/ShopByCategory'
import PressLogoBar from '@/components/shared/PressLogoBar'
import FreeShippingStrip from '@/components/shop/FreeShippingStrip'

const MOMENT_TITLES = ['deepest sleep', 'the winter edit', 'fit girl glow', 'selfcare sunday']

// The homepage "Essentials for living beautifully" carousel and the shop home
// page's "The Edit" rail share ONE curation source — getTeamRailProducts (see
// lib/shopify.ts). To change what the team is buying, edit the TEAM_RAIL_* config
// there and both rails update together.

function pickMoments(collections: ShopifyCollection[]): ShopifyCollection[] {
  const picked = MOMENT_TITLES
    .map(t => collections.find(c => c.title.toLowerCase() === t))
    .filter(Boolean) as ShopifyCollection[]
  const have = new Set(picked.map(c => c.id))
  for (const c of collections) {
    if (picked.length >= 4) break
    if (!have.has(c.id) && c.image) picked.push(c)
  }
  return picked.slice(0, 4)
}

const FREE_SHIP_HANDLES = SHOP_BRANDS
  .filter(b => FREE_SHIPPING_VENDORS.has(b.name))
  .map(b => b.handle)

// Self-referencing canonical for the home page. Other routes set their own
// canonical in generateMetadata; the root layout can't (it would point every
// page at '/'), so the home page declares it here.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const [curatedProducts, allProducts, vodcastEpisodes, allCollections, freeShipCols] = await Promise.all([
    getTeamRailProducts(),
    getProducts(24),
    Promise.resolve(getVodcastEpisodes()),
    getCollections(48),
    Promise.all(FREE_SHIP_HANDLES.map(h => getCollectionFull(h, 50))),
  ])
  const moments = pickMoments(allCollections)

  const seenFS = new Set<string>()
  const freeShipProducts = freeShipCols.flatMap(c => (c as any)?.products?.nodes ?? []).filter((p: any) => {
    if (seenFS.has(p.handle)) return false
    seenFS.add(p.handle)
    return true
  })

  const shopProducts = curatedProducts.length > 0 ? curatedProducts : allProducts
  const curatedHandles = new Set(curatedProducts.map(p => p.handle))
  const shopProducts2 = allProducts.filter(p => !curatedHandles.has(p.handle))

  const shownSlugs = new Set<string>()
  const DIRECTORY_SUBS = ['bathhouses', 'clinics', 'salons', 'spas-retreats', 'wellness']

  function take(n: number) {
    const articles = getAllArticles(n, [...shownSlugs], DIRECTORY_SUBS)
    articles.forEach(a => a && shownSlugs.add(a.frontmatter.slug))
    return articles.filter(Boolean) as NonNullable<typeof articles[number]>[]
  }

  const heroArticles = getHeroArticles()
  heroArticles.forEach(a => a && shownSlugs.add(a.frontmatter.slug))
  const duo1Articles = take(2)
  const trio1Articles = take(3)
  const [splitArticle] = take(1)
  const duo2Articles = take(2)
  const trio2Articles = take(3)

  return (
    <>
      {/* 1 — Cycling hero */}
      {heroArticles.length > 0 && <HeroWide articles={heroArticles as any} />}

      {/* 2 — Trust + press logos (one credibility moment under the hero) */}
      <PressLogoBar className="py-12" />

      {/* 3 — Shop by Category */}
      <ShopByCategory />

      {/* 3b — Product scroll (directly under categories) */}
      <ShopGrid products={shopProducts} />

      {/* 4 — Voices line */}
      <TheCollective />

      {/* 4b — Reviews / submissions teaser */}
      <ReviewsTeaser />

      {/* 7 — Duo (most recent two stories) */}
      {duo1Articles.length > 0 && <DuoLeft articles={duo1Articles as any} eager />}

      {/* 8 — Podcast */}
      <PodcastSection episodes={vodcastEpisodes} />

      {/* 9 — Trio */}
      {trio1Articles.length > 0 && <StoriesTrio articles={trio1Articles as any} />}

      {/* 10 — Single highlighted article */}
      {splitArticle && <HeroSplit article={splitArticle as any} />}

      {/* 11 — Duo */}
      {duo2Articles.length > 0 && <DuoLeft articles={duo2Articles as any} />}

      {/* 11b — Second product rail */}
      <ProductRail
        products={shopProducts2}
        rows={1}
        eyebrow="More to explore"
        heading={<>New in the <em className="italic">shop</em></>}
        description="Fresh finds, hand-picked by the team"
        cta={{ label: 'Explore the shop', href: '/shop' }}
      />

      {/* 12 — Shop by Moment */}
      <ShopByMoment collections={moments} />

      {/* 12b — Free Shipping rail */}
      <FreeShippingStrip products={freeShipProducts} />

      {/* 13 — Subscribe */}
      <InsidersBar />

      {/* 14 — Trio */}
      {trio2Articles.length > 0 && <StoriesTrio articles={trio2Articles as any} />}

      {/* 15 — Instagram feed */}
      <InstagramFeed />

      {/* Explore all link */}
      <div
        className="text-center"
        style={{ padding: 'clamp(48px,6vw,82px) clamp(20px,6vw,104px)' }}
      >
        <a
          href="/beauty-style"
          className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase px-8 py-3 rounded-[1px] transition-colors hover:bg-ink hover:text-white"
          style={{ border: '1px solid #1C1A17' }}
        >
          Explore all stories
        </a>
      </div>
    </>
  )
}
