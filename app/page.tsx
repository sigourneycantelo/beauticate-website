import { getAllArticles, getHeroArticles, getVodcastEpisodes } from '@/lib/content'
import { getProductsByTag, getCollectionByHandle, getProducts, getCollections } from '@/lib/shopify'
import type { ShopifyCollection } from '@/types/shopify'

import HeroWide from '@/components/home/HeroWide'
import DuoLeft from '@/components/home/DuoLeft'
import ShopGrid from '@/components/home/ShopGrid'
import ShopStrip from '@/components/home/ShopStrip'
import TheCollective from '@/components/shared/TheCollective'
import InstagramFeed from '@/components/home/InstagramFeed'
import StoriesTrio from '@/components/home/StoriesTrio'
import PodcastSection from '@/components/home/PodcastSection'
import InsidersBar from '@/components/home/InsidersBar'
import HeroSplit from '@/components/home/HeroSplit'
import ShopByMoment from '@/components/home/ShopByMoment'
import ShopByCategory from '@/components/home/ShopByCategory'
import TrustPanel from '@/components/home/TrustPanel'
import AsSeenIn from '@/components/home/AsSeenIn'

const MOMENT_TITLES = ['deepest sleep', 'the winter edit', 'fit girl glow', 'selfcare sunday']

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

export default async function HomePage() {
  const [taggedProducts, winterCollection, allProducts, vodcastEpisodes, allCollections] = await Promise.all([
    getProductsByTag('team', 24),
    getCollectionByHandle('autumn-edit'),
    getProducts(24),
    Promise.resolve(getVodcastEpisodes()),
    getCollections(48),
  ])
  const moments = pickMoments(allCollections)
  const collectionProducts = winterCollection?.products?.nodes ?? []
  const seen = new Set<string>()
  const curatedProducts = [...taggedProducts, ...collectionProducts].filter(p => {
    if (seen.has(p.handle)) return false
    seen.add(p.handle)
    return true
  }).slice(0, 24)
  const shopProducts = curatedProducts.length > 0 ? curatedProducts : allProducts
  const shopProducts2 = allProducts.filter(p => !seen.has(p.handle))

  // Rolling de-dupe — no article appears twice on the home page
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

      {/* 2 — Trust panel */}
      <TrustPanel />

      {/* 3 — Shop by Category */}
      <ShopByCategory />

      {/* 3b — Product scroll (directly under categories) */}
      <ShopGrid products={shopProducts} />

      {/* 4 — Voices line */}
      <TheCollective />

      {/* 5 — As Seen In */}
      <AsSeenIn />

      {/* 7 — Duo (most recent two stories) */}
      {duo1Articles.length > 0 && <DuoLeft articles={duo1Articles as any} />}

      {/* 8 — Podcast */}
      <PodcastSection episodes={vodcastEpisodes} />

      {/* 9 — Trio */}
      {trio1Articles.length > 0 && <StoriesTrio articles={trio1Articles as any} />}

      {/* 10 — Single highlighted article */}
      {splitArticle && <HeroSplit article={splitArticle as any} />}

      {/* 11 — Duo */}
      {duo2Articles.length > 0 && <DuoLeft articles={duo2Articles as any} />}

      {/* 11b — Second product rail */}
      <ShopStrip
        products={shopProducts2}
        eyebrow="More to explore"
        heading={<>New in the <em className="italic">shop</em></>}
        subheading="Fresh finds, hand-picked by the team"
      />

      {/* 12 — Shop by Moment */}
      <ShopByMoment collections={moments} />

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
