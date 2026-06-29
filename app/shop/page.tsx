import { getCollections } from '@/lib/shopify'
import HeroVideo from '@/components/shop/HeroVideo'
import TrustBand from '@/components/shop/TrustBand'
import FounderIntro from '@/components/shop/FounderIntro'
import ShopByMoment from '@/components/shop/ShopByMoment'
import Collective from '@/components/shop/Collective'
import type { ShopifyCollection } from '@/types/shopify'
import type { Metadata } from 'next'

// The four "moment" collections, in display order. Matched by title with a
// fallback to any image-bearing collections so the grid always fills.
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
  const collections = await getCollections(48)
  const moments = pickMoments(collections)

  return (
    <div>

      {/* Hero — full-bleed video, headline top-left (mirrors beauticate.shop).
          100vw breakout so no parent padding/constraint clips the video. */}
      <section
        className="relative bg-ink overflow-hidden"
        style={{
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          minHeight: 'clamp(500px, 72vh, 820px)',
        }}
      >
        <HeroVideo />

        {/* Scrim — darkens the top-left corner so the headline stays legible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(0,0,0,.52) 0%, rgba(0,0,0,.20) 40%, transparent 72%)' }}
        />

        {/* Hero content — top-left */}
        <div
          className="relative z-10 flex flex-col items-start justify-start text-left px-[clamp(24px,6vw,104px)] pt-[clamp(34px,6vw,76px)]"
          style={{ minHeight: 'clamp(500px, 72vh, 820px)' }}
        >
          <h1
            className="font-serif font-normal text-paper"
            style={{ fontSize: 'clamp(20px, 2.9vw, 39px)', lineHeight: 1.1 }}
          >
            essentials for a <em className="italic">beautiful</em> life.
          </h1>
          <p
            className="font-serif font-normal text-paper/90 mt-3"
            style={{ fontSize: 'clamp(20px, 2.9vw, 39px)', lineHeight: 1.12, marginLeft: 'clamp(28px, 5vw, 72px)' }}
          >
            curated by editors and experts.
          </p>
        </div>
      </section>

      {/* Trust band */}
      <TrustBand />

      {/* Founder introduction — portrait left, letter right */}
      <FounderIntro />

      {/* Shop by Moment — four portrait tiles */}
      <ShopByMoment collections={moments} />

      {/* Meet the Beauticate Collective */}
      <Collective />

      {/* Editorial note */}
      <section className="bg-ink py-14 md:py-20">
        <div className="max-w-content mx-auto px-6 text-center">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/40 mb-6">
            Our philosophy
          </p>
          <blockquote className="font-serif text-2xl md:text-3xl text-paper leading-relaxed mb-8">
            &ldquo;I only stock things I would recommend to my closest friends. That&rsquo;s the whole edit.&rdquo;
          </blockquote>
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-paper/50">
            Sigourney Cantelo — Founder &amp; Editor-in-Chief
          </p>
        </div>
      </section>

    </div>
  )
}
