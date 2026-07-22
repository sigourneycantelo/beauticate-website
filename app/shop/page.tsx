import { getCollections, getProducts, getProductsByTag, getCollectionByHandle } from '@/lib/shopify'
import { getVodcastEpisodes } from '@/lib/content'
import HeroVideo from '@/components/shop/HeroVideo'
import TrustBand from '@/components/shop/TrustBand'
import FounderIntro from '@/components/shop/FounderIntro'
import ShopByMoment from '@/components/shop/ShopByMoment'
import Collective from '@/components/shop/Collective'
import SigourneysEdit from '@/components/shop/SigourneysEdit'
import ShopCategoryGrid from '@/components/shop/ShopCategoryGrid'
import ShopNewsletter from '@/components/shop/ShopNewsletter'
import ShopGrid from '@/components/home/ShopGrid'
import PodcastSection from '@/components/home/PodcastSection'
import type { ShopifyCollection } from '@/types/shopify'
import type { Metadata } from 'next'

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

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop | Beauticate',
  description: 'Curated beauty, wellness and lifestyle — recommended by the editors and experts of Beauticate. Fewer, better things, chosen by editors not algorithms.',
}

export default async function ShopPage() {
  const [collections, taggedProducts, allProducts, vodcastEpisodes] = await Promise.all([
    getCollections(48),
    getProductsByTag('team', 24),
    getProducts(24),
    Promise.resolve(getVodcastEpisodes()),
  ])
  const moments = pickMoments(collections)

  const seen = new Set<string>()
  const curatedProducts = [...taggedProducts].filter(p => {
    if (seen.has(p.handle)) return false
    seen.add(p.handle)
    return true
  }).slice(0, 24)
  const shopProducts = curatedProducts.length > 0 ? curatedProducts : allProducts

  return (
    <div>

      {/* Hero — full-bleed video */}
      <section
        className="relative bg-ink overflow-hidden"
        style={{
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          minHeight: 'clamp(500px, 72vh, 820px)',
        }}
      >
        <HeroVideo />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(0,0,0,.52) 0%, rgba(0,0,0,.20) 40%, transparent 72%)' }}
        />

        <div
          className="relative z-10 flex flex-col items-start justify-start text-left px-[clamp(24px,6vw,104px)] pt-[clamp(34px,6vw,76px)]"
          style={{ minHeight: 'clamp(500px, 72vh, 820px)' }}
        >
          <h1
            className="font-serif font-normal text-paper"
            style={{ fontSize: 'clamp(22px, 2.9vw, 40px)', lineHeight: 1.08 }}
          >
            essentials for a <em className="italic">beautiful</em> life.
          </h1>
          <p
            className="font-serif font-normal text-paper/90 mt-2"
            style={{ fontSize: 'clamp(22px, 2.9vw, 40px)', lineHeight: 1.082, marginLeft: 'clamp(14px, 2.5vw, 36px)' }}
          >
            curated by editors and experts.
          </p>
        </div>
      </section>

      {/* Trust band */}
      <TrustBand />

      {/* Product grid — the main shopping area */}
      <ShopGrid products={shopProducts} />

      {/* Founder introduction */}
      <FounderIntro />

      {/* Shop by Moment — full-width tiles */}
      <ShopByMoment collections={moments} />

      {/* Sigourney's Edit */}
      <SigourneysEdit />

      {/* Shop by Category */}
      <ShopCategoryGrid />

      {/* Meet the Beauticate Collective */}
      <Collective />

      {/* Podcast — founder interviews */}
      <PodcastSection episodes={vodcastEpisodes} />

      {/* Newsletter */}
      <ShopNewsletter />

    </div>
  )
}
