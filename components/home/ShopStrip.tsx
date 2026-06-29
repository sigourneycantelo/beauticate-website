import Link from 'next/link'
import type { ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'

function formatPrice(p: ShopifyProduct) {
  const num = parseFloat(p.priceRange.minVariantPrice.amount)
  return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`
}

export default function ShopStrip({ products }: { products: ShopifyProduct[] }) {
  if (!products.length) return null

  return (
    <section
      className="reveal"
      style={{ padding: 'clamp(46px,6vw,78px) clamp(20px,6vw,104px)' }}
    >
      <div className="text-center mb-8">
        <p
          className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold"
          style={{ color: '#8E9A82' }}
        >
          Beauticate Shop
        </p>
        <h2
          className="font-serif font-normal mt-2"
          style={{ fontSize: 'clamp(24px,3vw,34px)' }}
        >
          What the team is buying <em className="italic">this week</em>
        </h2>
        <p className="font-sans mt-2" style={{ fontSize: '12.5px', opacity: 0.58 }}>
          Curated by the Beauticate Collective
        </p>
      </div>

      {/* Product rail */}
      <div
        className="grid overflow-x-auto pb-3"
        style={{
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(168px,1fr)',
          gap: '18px',
          scrollSnapType: 'x mandatory',
        }}
      >
        {products.map(p => {
          const imgs = p.images?.nodes ?? []
          const primary = imgs[0] ?? p.featuredImage
          const secondary = imgs[1]
          return (
            <ProductTile
              key={p.handle}
              href={`/shop/products/${p.handle}`}
              useNextImage
              primarySrc={primary?.url}
              primaryAlt={primary?.altText ?? p.title}
              secondarySrc={secondary?.url}
              secondaryAlt={secondary?.altText ?? p.title}
              cornerLabel="In our shop"
              brand={p.vendor}
              name={p.title}
              price={formatPrice(p)}
              className="snap-start"
            />
          )
        })}
      </div>

      <div className="text-center mt-9">
        <Link
          href="/shop"
          className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase px-7 py-3 rounded-[1px] transition-colors hover:bg-ink hover:text-white"
          style={{ border: '1px solid #1C1A17' }}
        >
          Explore the shop
        </Link>
      </div>
    </section>
  )
}
