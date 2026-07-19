import { getAllArticles, getHeroArticle, getHeroArticles, getVodcastEpisodes } from '@/lib/content'
import { getProductsByTag, getCollectionByHandle, getProducts } from '@/lib/shopify'

import HeroWide from '@/components/home/HeroWide'
import DuoLeft from '@/components/home/DuoLeft'
import ShopStrip from '@/components/home/ShopStrip'
import DuoStagger from '@/components/home/DuoStagger'
import TheCollective from '@/components/shared/TheCollective'
import InstagramFeed from '@/components/home/InstagramFeed'
import SectionTitle from '@/components/home/SectionTitle'
import StoriesTrio from '@/components/home/StoriesTrio'
import PodcastSection from '@/components/home/PodcastSection'
import InsidersBar from '@/components/home/InsidersBar'
import HeroSplit from '@/components/home/HeroSplit'
import ShopByMoment from '@/components/home/ShopByMoment'
import ShopByCategory from '@/components/home/ShopByCategory'
import PressTrustBand from '@/components/home/PressTrustBand'

export default async function HomePage() {
  const [taggedProducts, winterCollection, allProducts, vodcastEpisodes] = await Promise.all([
    getProductsByTag('team', 24),
    getCollectionByHandle('autumn-edit'),
    getProducts(12),
    Promise.resolve(getVodcastEpisodes()),
  ])
  const collectionProducts = winterCollection?.products?.nodes ?? []
  const seen = new Set<string>()
  const curatedProducts = [...taggedProducts, ...collectionProducts].filter(p => {
    if (seen.has(p.handle)) return false
    seen.add(p.handle)
    return true
  }).slice(0, 12)
  const shopProducts = curatedProducts.length > 0 ? curatedProducts : allProducts

  const shownSlugs = new Set<string>()

  function take(n: number) {
    const articles = getAllArticles(n, [...shownSlugs])
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

      {/* 2 — Shop by Category */}
      <ShopByCategory />

      {/* 3 — Voices line */}
      <TheCollective />

      {/* 4 — Product rail */}
      <ShopStrip products={shopProducts} />

      {/* 5 — Press & trust band */}
      <PressTrustBand />

      {/* 6 — Duo (most recent two stories) */}
      {duo1Articles.length > 0 && <DuoLeft articles={duo1Articles as any} />}

      {/* 7 — Podcast */}
      <PodcastSection episodes={vodcastEpisodes} />

      {/* 8 — Trio */}
      {trio1Articles.length > 0 && <StoriesTrio articles={trio1Articles as any} />}

      {/* 9 — Single highlighted article */}
      {splitArticle && <HeroSplit article={splitArticle as any} />}

      {/* 10 — Duo */}
      {duo2Articles.length > 0 && <DuoLeft articles={duo2Articles as any} />}

      {/* 11 — Shop by Moment */}
      <ShopByMoment />

      {/* 12 — Subscribe */}
      <InsidersBar />

      {/* 13 — Trio */}
      {trio2Articles.length > 0 && <StoriesTrio articles={trio2Articles as any} />}

      {/* 14 — Instagram feed */}
      <InstagramFeed />

      {/* Explore all link */}
      <div
        className="text-center"
        style={{ padding: 'clamp(32px,4vw,52px) clamp(20px,6vw,104px)' }}
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
