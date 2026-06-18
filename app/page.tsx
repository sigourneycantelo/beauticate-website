// Homepage — editorial + commerce merged
// Sections follow the Social-First Commerce SOP
import { getFeaturedArticles } from '@/lib/content'
import { getCollections } from '@/lib/shopify'
import HeroCarousel from '@/components/layout/HeroCarousel'
import ShopByMoment from '@/components/shop/ShopByMoment'
import ArticleGrid from '@/components/article/ArticleGrid'
import SigourneysEdit from '@/components/shop/SigourneysEdit'
import InstagramFeed from '@/components/shared/InstagramFeed'
import YouTubeFeed from '@/components/shared/YouTubeFeed'
import EmailSignup from '@/components/shared/EmailSignup'
import TheCollective from '@/components/shared/TheCollective'

export default async function HomePage() {
  const [featuredArticles, collections] = await Promise.all([
    getFeaturedArticles(6),
    getCollections(12),
  ])

  return (
    <>
      {/* Hero carousel — "What we're obsessed with right now" */}
      <HeroCarousel articles={featuredArticles} />

      {/* Shop by Moment — editorial-led commerce */}
      <ShopByMoment collections={collections} />

      {/* Editorial cluster — latest interviews + beauty */}
      <ArticleGrid articles={featuredArticles} />

      {/* Sigourney's Edit — curated product picks */}
      <SigourneysEdit />

      {/* The Beauticate Collective — social proof */}
      <TheCollective />

      {/* Instagram feed — social continuity */}
      <InstagramFeed />

      {/* YouTube feed */}
      <YouTubeFeed />

      {/* Email signup */}
      <EmailSignup />
    </>
  )
}
