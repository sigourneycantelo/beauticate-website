import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct } from '@/types/shopify'

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
        {products.map(p => (
          <Link
            key={p.handle}
            href={`/shop/products/${p.handle}`}
            className="group relative text-left"
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* Product tile */}
            <div
              className="relative overflow-hidden rounded-[2px]"
              style={{ aspectRatio: '4/5', background: '#EEE9E1' }}
            >
              {p.featuredImage ? (
                <Image
                  src={p.featuredImage.url}
                  alt={p.featuredImage.altText ?? p.title}
                  fill
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width:768px) 50vw, 14vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif italic text-[12px]" style={{ opacity: 0.32 }}>{p.vendor}</span>
                </div>
              )}
              {/* Add to bag — appears on hover */}
              <div
                className="absolute left-2 right-2 bottom-2 z-10 text-center text-white font-sans text-[9px] tracking-[0.18em] uppercase py-2.5 rounded-[1px] opacity-0 translate-y-2 transition-all duration-[250ms] group-hover:opacity-100 group-hover:translate-y-0"
                style={{ background: '#1C1A17' }}
              >
                Add to bag
              </div>
            </div>
            <p
              className="font-sans text-[9.5px] tracking-[0.18em] uppercase mt-3"
              style={{ opacity: 0.6 }}
            >
              {p.vendor}
            </p>
            <p className="font-serif text-[16px] leading-[1.2] mt-1">{p.title}</p>
            <p className="font-serif text-[15px] mt-1.5">{formatPrice(p)}</p>
          </Link>
        ))}
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
