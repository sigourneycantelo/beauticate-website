import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
  { label: 'Beauty', href: '/shop/beauty', img: '/images/shop/category-beauty.jpg', soon: false },
  { label: 'Wellness', href: '/shop/wellness', img: '/images/shop/category-wellness.jpg', soon: false },
  { label: 'Living', href: '/shop/living', img: '/images/shop/category-living.jpg', soon: false },
  { label: 'Style', href: '/shop/style', img: '/images/shop/category-style.jpg', soon: true },
]

export default function ShopByCategory() {
  return (
    <section className="bg-white px-[clamp(20px,6vw,104px)] py-[clamp(38px,5vw,68px)]">
      <div className="text-center mb-10">
        <h2 className="font-serif font-normal" style={{ fontSize: 'clamp(24px, 3vw, 38px)' }}>
          Shop by <em className="italic">category</em>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => {
          const Inner = (
            <>
              <Image
                src={cat.img}
                alt={cat.label}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,24,20,.45)] to-[rgba(28,24,20,.06)]" />
              <div className="relative z-10 text-white">
                <h3 className="font-serif font-normal tracking-[0.02em]" style={{ fontSize: 'clamp(24px,2.6vw,34px)' }}>
                  {cat.label}
                </h3>
                <span className="inline-block mt-2 font-sans text-[9.5px] tracking-[0.2em] uppercase border-b border-white/80 pb-0.5">
                  {cat.soon ? 'Coming Soon' : 'Shop'}
                </span>
              </div>
            </>
          )

          const base = 'group relative overflow-hidden rounded-[2px] flex flex-col items-center justify-center text-center aspect-[4/5]'

          return cat.soon ? (
            <div key={cat.label} className={`${base} cursor-default`} aria-disabled style={{ opacity: 0.82 }}>
              {Inner}
            </div>
          ) : (
            <Link key={cat.label} href={cat.href} className={base}>
              {Inner}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
