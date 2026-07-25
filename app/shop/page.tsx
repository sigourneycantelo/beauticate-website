import { getCollections, getProducts, getProductsByTag, getNewArrivals, getCollectionByHandle, getCollectionFull } from '@/lib/shopify'
import { getVodcastEpisodes } from '@/lib/content'
import { SHOP_BRANDS, FREE_SHIPPING_VENDORS } from '@/lib/shop-taxonomy'
import HeroVideo from '@/components/shop/HeroVideo'
import TrustBand from '@/components/shop/TrustBand'
import FounderIntro from '@/components/shop/FounderIntro'
import ShopByMoment from '@/components/shop/ShopByMoment'
import Collective from '@/components/shop/Collective'
import SigourneysEdit from '@/components/shop/SigourneysEdit'
import ShopCategoryGrid from '@/components/shop/ShopCategoryGrid'
import ShopNewsletter from '@/components/shop/ShopNewsletter'
import ShopProductGrid from '@/components/shop/ShopProductGrid'
import CollectionFeature from '@/components/shop/CollectionFeature'
import PodcastSection from '@/components/home/PodcastSection'
import FreeShippingStrip from '@/components/shop/FreeShippingStrip'
import type { ShopifyCollection } from '@/types/shopify'
import type { Metadata } from 'next'

const MOMENT_TITLES = ['deepest sleep', 'the winter edit', 'fit girl glow', 'selfcare sunday']
const FEATURED_COLLECTIONS = ['deepest-sleep', 'fit-girl-glow']

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

const FREE_SHIP_HANDLES = SHOP_BRANDS
  .filter(b => FREE_SHIPPING_VENDORS.has(b.name))
  .map(b => b.handle)

export default async function ShopPage() {
  const [collections, taggedProducts, allProducts, newArrivals, vodcastEpisodes, ...rest] = await Promise.all([
    getCollections(48),
    getProductsByTag('team', 24),
    getProducts(24),
    getNewArrivals(8),
    Promise.resolve(getVodcastEpisodes()),
    ...FEATURED_COLLECTIONS.map(h => getCollectionByHandle(h)),
    ...FREE_SHIP_HANDLES.map(h => getCollectionFull(h, 50)),
  ])
  const moments = pickMoments(collections)
  const featured = (rest.slice(0, FEATURED_COLLECTIONS.length) as (ShopifyCollection | null)[]).filter(Boolean) as ShopifyCollection[]
  const freeShipCols = rest.slice(FEATURED_COLLECTIONS.length)

  const seen = new Set<string>()
  const curatedProducts = [...taggedProducts, ...allProducts].filter(p => {
    if (seen.has(p.handle)) return false
    seen.add(p.handle)
    return true
  })
  const shopProducts = curatedProducts.slice(0, 16)

  const seenFS = new Set<string>()
  const freeShipProducts = freeShipCols.flatMap(c => (c as any)?.products?.nodes ?? []).filter((p: any) => {
    if (seenFS.has(p.handle)) return false
    seenFS.add(p.handle)
    return true
  })

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

      {/* Product grid — 16 products immediately visible */}
      <ShopProductGrid
        products={shopProducts}
        heading={
          <>
            <p className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold" style={{ color: '#8E9A82' }}>
              The Edit
            </p>
            <h2 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(24px,3vw,34px)' }}>
              What the team is buying <em className="italic">this week</em>
            </h2>
          </>
        }
      />

      {/* New Arrivals — one product per brand, most recently onboarded */}
      {newArrivals.length > 0 && (
        <ShopProductGrid
          products={newArrivals}
          maxProducts={8}
          heading={
            <>
              <p className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold" style={{ color: '#8E9A82' }}>
                Just Landed
              </p>
              <h2 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(24px,3vw,34px)' }}>
                New brands, <em className="italic">fresh finds</em>
              </h2>
              <p className="font-sans mt-2" style={{ fontSize: '12.5px', opacity: 0.55 }}>
                One pick from each of the latest brands to join the shop
              </p>
            </>
          }
        />
      )}

      {/* Founder introduction */}
      <FounderIntro />

      {/* Collection feature cards */}
      {featured.map(c => (
        <CollectionFeature key={c.id} collection={c} />
      ))}

      {/* Shop by Moment — full-width tiles */}
      <ShopByMoment collections={moments} />

      {/* Sigourney's Edit */}
      <SigourneysEdit />

      {/* Free Shipping — shuffled product rail */}
      <FreeShippingStrip products={freeShipProducts} />

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
