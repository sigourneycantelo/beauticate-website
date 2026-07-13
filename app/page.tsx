import { getAllArticles, getHeroArticle, getVodcastEpisodes } from '@/lib/content'
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

  // Rolling de-dupe — no article appears twice on the home page
  const shownSlugs = new Set<string>()

  function take(n: number) {
    const articles = getAllArticles(n, [...shownSlugs])
    articles.forEach(a => a && shownSlugs.add(a.frontmatter.slug))
    return articles.filter(Boolean) as NonNullable<typeof articles[number]>[]
  }

  const heroArticle = getHeroArticle()
  if (heroArticle) shownSlugs.add(heroArticle.frontmatter.slug)
  const duoLeftArticles = take(2)
  const [bigArticle, smallArticle] = take(2)
  const trio1Articles = take(3)
  const [splitArticle] = take(1)
  const trio2Articles = take(3)
  const trio3Articles = take(3)

  return (
    <>
      {/* 1 — Wide landscape hero */}
      {heroArticle && <HeroWide article={heroArticle as any} />}

      {/* 2 — Press & trust band */}
      <PressTrustBand />

      {/* 3 — Shop by Category */}
      <ShopByCategory />

      {/* 4 — Voices line */}
      <TheCollective />

      {/* 5 — Product rail */}
      <ShopStrip products={shopProducts} />

      {/* 6 — Must-read stories */}
      <SectionTitle eyebrow="Editorial" title="Must-read stories" italic="stories" />
      {trio1Articles.length > 0 && <StoriesTrio articles={trio1Articles as any} />}

      {/* 7 — Subscribe */}
      <InsidersBar />

      {/* 8 — Asymmetric two-story block */}
      {bigArticle && smallArticle && (
        <DuoStagger big={bigArticle as any} small={smallArticle as any} />
      )}

      {/* 9 — Podcast */}
      <PodcastSection episodes={vodcastEpisodes} />

      {/* 10 — Single highlighted article */}
      {splitArticle && <HeroSplit article={splitArticle as any} />}

      {/* 11 — Shop by Moment */}
      <ShopByMoment />

      {/* 12 — Articles worth your time */}
      <SectionTitle eyebrow="Keep reading" title="Articles worth your time" italic="your time" />
      {trio2Articles.length > 0 && <StoriesTrio articles={trio2Articles as any} />}

      {/* 13 — Two stories */}
      {duoLeftArticles.length > 0 && <DuoLeft articles={duoLeftArticles as any} />}

      {/* 14 — More to explore */}
      <SectionTitle eyebrow="Editorial" title="More to explore" italic="explore" />
      {trio3Articles.length > 0 && <StoriesTrio articles={trio3Articles as any} />}

      {/* 15 — Instagram feed */}
      <InstagramFeed />

      {/* Explore all link */}
      <div
        className="text-center"
        style={{ padding: 'clamp(48px,6vw,82px) clamp(20px,6vw,104px)', borderTop: '1px solid rgba(28,26,23,.10)' }}
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
