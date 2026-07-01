import Link from 'next/link'

const CATEGORIES = [
  { label: 'Beauty', href: '/beauty-style', gradient: 'linear-gradient(150deg,#cdbdb2,#8a766a)' },
  { label: 'Wellness', href: '/wellness', gradient: 'linear-gradient(150deg,#bcc4ba,#7d8a7c)' },
  { label: 'Living', href: '/living', gradient: 'linear-gradient(150deg,#d3c7bb,#9c8b79)' },
  { label: 'Style', href: '/beauty-style/style', gradient: 'linear-gradient(150deg,#cbb6ac,#94756a)' },
]

export default function ShopByCategory() {
  return (
    <section className="bg-white border-t border-cream-200 px-[clamp(20px,6vw,104px)] py-[clamp(46px,6vw,82px)]">
      <div className="text-center mb-10">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase opacity-50">Explore</p>
        <h2 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(24px, 3vw, 38px)' }}>
          Shop by <em className="italic">category</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative overflow-hidden rounded-[2px] flex flex-col items-center justify-center text-center aspect-[4/5]"
          >
            <div
              className="absolute inset-0 transition-transform duration-[900ms] group-hover:scale-[1.04]"
              style={{ background: cat.gradient }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,18,16,.34)] to-[rgba(20,18,16,.12)]" />
            <div className="relative z-10 text-white">
              <h3
                className="font-serif font-normal tracking-[0.02em]"
                style={{ fontSize: 'clamp(26px, 2.6vw, 34px)' }}
              >
                {cat.label}
              </h3>
              <span className="inline-block mt-2 font-sans text-[9.5px] tracking-[0.2em] uppercase border-b border-white/80 pb-0.5">
                Explore
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
