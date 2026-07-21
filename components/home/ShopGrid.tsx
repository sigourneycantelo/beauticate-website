import Link from 'next/link'
import type { ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'

function formatPrice(p: ShopifyProduct) {
  const num = parseFloat(p.priceRange.minVariantPrice.amount)
  return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`
}

export default function ShopGrid({
  products,
  eyebrow = 'Beauticate Shop',
  heading,
  subheading = 'Curated by the Beauticate Collective',
  maxProducts = 12,
}: {
  products: ShopifyProduct[]
  eyebrow?: string
  heading?: React.ReactNode
  subheading?: string
  maxProducts?: number
}) {
  if (!products.length) return null

  const visible = products.slice(0, maxProducts)

  return (
    <section
      className="reveal"
      style={{ padding: 'clamp(32px,4vw,52px) clamp(20px,6vw,104px)' }}
    >
      <div className="text-center mb-8">
        <p
          className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold"
          style={{ color: '#8E9A82' }}
        >
          {eyebrow}
        </p>
        <h2
          className="font-serif font-normal mt-2"
          style={{ fontSize: 'clamp(24px,3vw,34px)' }}
        >
          {heading ?? <>What the team is buying <em className="italic">this week</em></>}
        </h2>
        <p className="font-sans mt-2" style={{ fontSize: '12.5px', opacity: 0.58 }}>
          {subheading}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {visible.map(p => {
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
