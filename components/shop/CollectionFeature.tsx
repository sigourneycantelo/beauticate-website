import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyCollection, ShopifyProduct } from '@/types/shopify'
import ProductTile from '@/components/shared/ProductTile'

function formatPrice(p: ShopifyProduct) {
  const num = parseFloat(p.priceRange.minVariantPrice.amount)
  return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`
}

export default function CollectionFeature({ collection }: { collection: ShopifyCollection }) {
  const products = (collection.products?.nodes ?? []).slice(0, 4)
  if (!products.length) return null

  return (
    <section style={{ padding: 'clamp(32px,4vw,52px) clamp(20px,6vw,104px)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Collection image */}
        <Link
          href={`/shop/collections/${collection.handle}`}
          className="group relative overflow-hidden rounded-[2px] aspect-[4/5]"
        >
          {collection.image ? (
            <Image
              src={collection.image.url}
              alt={collection.image.altText ?? collection.title}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(150deg,#c9b9a6,#8a7868)' }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,16,14,.5)] to-[rgba(18,16,14,0)_50%]" />
          <div className="absolute bottom-0 left-0 right-0 p-[clamp(18px,3vw,32px)] z-10 text-white">
            <h3 className="font-serif font-normal" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>
              {collection.title}
            </h3>
            {collection.description && (
              <p className="font-serif mt-2 opacity-85" style={{ fontSize: 'clamp(14px,1.4vw,17px)', maxWidth: '38ch' }}>
                {collection.description}
              </p>
            )}
            <span className="inline-block mt-3 font-sans text-[9.5px] tracking-[0.2em] uppercase border-b border-white/70 pb-0.5">
              Shop the edit
            </span>
          </div>
        </Link>

        {/* 4 featured products from the collection */}
        <div className="grid grid-cols-2 gap-4">
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
                brand={p.vendor}
                name={p.title}
                price={formatPrice(p)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
