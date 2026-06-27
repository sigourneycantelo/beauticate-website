import { getAllArticles, getHeroArticle, getVodcastEpisodes } from '@/lib/content'
import { getProducts } from '@/lib/shopify'

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

export default async function HomePage() {
  const [shopProducts, vodcastEpisodes] = await Promise.all([
    getProducts(12),
    Promise.resolve(getVodcastEpisodes()),
  ])

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

      {/* 2 — Insiders subscribe strip */}
      <InsidersBar />

      {/* 3 — Two stories */}
      {duoLeftArticles.length > 0 && <DuoLeft articles={duoLeftArticles as any} />}

      {/* 4 — Shop strip */}
      <ShopStrip products={shopProducts} />

      {/* 5 — Staggered scrim pair */}
      {bigArticle && smallArticle && (
        <DuoStagger big={bigArticle as any} small={smallArticle as any} />
      )}

      {/* 6 — The Collective */}
      <TheCollective />

      {/* 7 — Instagram feed (Curator.io) */}
      <InstagramFeed />

      {/* 8 — Stories worth your time */}
      <SectionTitle eyebrow="Editorial" title="Stories worth your time" italic="your time" />
      {trio1Articles.length > 0 && <StoriesTrio articles={trio1Articles as any} />}

      {/* 9 — Beautiful Inside podcast (video reels, warm greige) */}
      <PodcastSection episodes={vodcastEpisodes} />

      {/* 10 — Image-left / text-right featured story */}
      {splitArticle && <HeroSplit article={splitArticle as any} />}

      {/* 11 — The edit */}
      <SectionTitle eyebrow="Shop" title="The edit" italic="edit" />
      {trio2Articles.length > 0 && <StoriesTrio articles={trio2Articles as any} />}

      {/* 12 — Shop by Moment */}
      <ShopByMoment />

      {/* 13 — More to explore */}
      <SectionTitle eyebrow="Keep reading" title="More to explore" italic="explore" />
      {trio3Articles.length > 0 && <StoriesTrio articles={trio3Articles as any} />}

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
