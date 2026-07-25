import Link from 'next/link'
import type { ShopProduct } from '@/types/content'
import ProductTile from '@/components/shared/ProductTile'
import { retailerFromUrl } from '@/lib/retailer'

interface Props {
  products: ShopProduct[]
  collectionHandle?: string
  collectionTitle?: string
}

export default function ShopEditRail({ products, collectionHandle, collectionTitle }: Props) {
  if (!products.length) return null

  return (
    <section className="mt-14 pt-10 border-t border-cream-200">
      <div className="mb-8">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold text-eucalypt">
          Beauticate Shop
        </p>
        <h3 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(22px,2.8vw,30px)' }}>
          {collectionTitle ?? 'Shop the edit'}
        </h3>
      </div>

      <div
        className="flex overflow-x-auto pb-3 scrollbar-hide -mx-2"
        style={{ gap: '16px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: '8px', paddingRight: '8px' }}
      >
        {products.map((p, i) => {
          const retailer = retailerFromUrl(p.url)
          return (
            <div key={`${p.name}-${i}`} className="snap-start shrink-0" style={{ width: '200px' }}>
              <ProductTile
                href={p.url}
                external
                primarySrc={p.image}
                primaryAlt={p.name}
                cornerLabel="shop from brand"
                brand={p.brand}
                name={p.name}
                price={p.price ? `$${parseFloat(p.price) % 1 === 0 ? parseFloat(p.price).toFixed(0) : p.price}` : undefined}
              />
            </div>
          )
        })}
      </div>

      {collectionHandle && (
        <div className="mt-6">
          <Link
            href={`/shop/collections/${collectionHandle}`}
            className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase px-7 py-3 rounded-[1px] transition-colors hover:bg-ink hover:text-white border border-ink"
          >
            View the full edit
          </Link>
        </div>
      )}
    </section>
  )
}
