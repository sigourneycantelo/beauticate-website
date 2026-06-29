import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyCollection } from '@/types/shopify'

interface Props { collections: ShopifyCollection[] }

const GRADIENTS = [
  'linear-gradient(150deg,#5a5550,#22201d)',
  'linear-gradient(150deg,#c9b9a6,#8a7868)',
  'linear-gradient(150deg,#dcc6c0,#a8857c)',
  'linear-gradient(150deg,#b6bfae,#7c8770)',
]

// Shop by Moment — four portrait tiles in the home-page treatment, fed by the
// real moment collections so each tile shows its own image.
export default function ShopByMoment({ collections }: Props) {
  const moments = collections.slice(0, 4)
  if (!moments.length) return null

  return (
    <section className="bg-white border-t border-cream-200 px-[clamp(20px,6vw,104px)] py-[clamp(46px,6vw,82px)]">
      <div className="text-center mb-10">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold text-eucalypt">
          Shop by Moment
        </p>
        <h2 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(26px, 3.2vw, 40px)' }}>
          Find what you need, <em className="italic">right now</em>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {moments.map((c, i) => (
          <Link
            key={c.id}
            href={`/shop/collections/${c.handle}`}
            className="group relative overflow-hidden rounded-[2px] flex items-end p-[22px]"
            style={{ aspectRatio: '4/5' }}
          >
            {c.image ? (
              <Image
                src={c.image.url}
                alt={c.image.altText ?? c.title}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
              />
            ) : (
              <div
                className="absolute inset-0 transition-transform duration-[900ms] group-hover:scale-[1.04]"
                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
              />
            )}
            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,16,14,.62)] to-[rgba(18,16,14,0)_62%]" />
            {/* Text */}
            <div className="relative z-10 text-white">
              <h3 className="font-serif font-normal leading-[1.1]" style={{ fontSize: 'clamp(20px, 2.2vw, 28px)' }}>
                {c.title}
              </h3>
              <span className="inline-block mt-2.5 font-sans text-[9px] tracking-[0.18em] uppercase border-b border-white/70 pb-0.5">
                Shop now
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-9">
        <Link
          href="/shop/by-moment"
          className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase border border-ink px-7 py-3 rounded-[1px] hover:bg-ink hover:text-white transition-colors duration-300"
        >
          Shop all moments
        </Link>
      </div>
    </section>
  )
}
