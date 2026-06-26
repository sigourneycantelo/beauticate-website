import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop by Brand | Beauticate',
  description: 'Discover the carefully curated brands behind the Beauticate edit. Each chosen for quality, efficacy and editorial integrity.',
}

// Update this list as new brands are onboarded to beauticate.shop
const BRANDS = [
  { name: 'Archer Farrar Perfume Atelier', handle: 'archer-farrar-perfume-atelier', category: 'Fragrance' },
  { name: 'Basics by B',                  handle: 'basics-by-b',                  category: 'Skincare' },
  { name: 'Booie Beauty',                 handle: 'booie-beauty',                 category: 'Skincare' },
  { name: 'Christophe Robin',             handle: 'christophe-robin',             category: 'Hair' },
  { name: 'JSHealth Vitamins',            handle: 'jshealth-vitamins',            category: 'Wellness' },
  { name: 'Lumira',                       handle: 'lumira',                       category: 'Fragrance' },
  { name: 'Maison Balzac',               handle: 'maison-balzac',               category: 'Living' },
  { name: 'Mukti Organics',              handle: 'mukti-organics',              category: 'Skincare' },
  { name: 'Subtle Energies',             handle: 'subtle-energies',             category: 'Wellness' },
  { name: 'Tulita Parfum',               handle: 'tulita-parfum',               category: 'Fragrance' },
  { name: 'Sunescape',                   handle: 'sunescape',                   category: 'Skincare' },
  { name: 'Lamav',                       handle: 'lamav',                       category: 'Skincare' },
]

const categories = [...new Set(BRANDS.map(b => b.category))].sort()

export default function ShopByBrandPage() {
  return (
    <div className="max-w-wide mx-auto px-4 py-12 md:py-16">

      <header className="mb-10 md:mb-14">
        <p className="label-editorial mb-2">The edit</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-4">Shop by Brand</h1>
        <p className="font-serif text-base text-charcoal/60 max-w-xl leading-relaxed">
          Every brand in the Beauticate edit is chosen on merit alone — efficacy, values, and
          whether Sigourney would genuinely recommend it to a friend.
        </p>
      </header>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(cat => (
          <span
            key={cat}
            className="font-sans text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-camel/50 text-charcoal/60"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Brand grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-camel/20">
        {BRANDS.map(brand => (
          <Link
            key={brand.handle}
            href={`/shop/brands/${brand.handle}`}
            className="group bg-paper flex flex-col items-center justify-center text-center px-6 py-10 hover:bg-parchment transition-colors"
          >
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">
              {brand.category}
            </p>
            <p className="font-serif text-base text-ink leading-snug group-hover:text-eucalypt transition-colors">
              {brand.name}
            </p>
            <span className="mt-3 font-sans text-[9px] tracking-[0.2em] uppercase text-charcoal/30 group-hover:text-eucalypt/70 transition-colors">
              Shop now →
            </span>
          </Link>
        ))}
      </div>

      {/* About our curation */}
      <div className="mt-16 pt-14 border-t border-camel/30 max-w-2xl">
        <h2 className="font-serif text-xl text-ink mb-4">How we choose our brands</h2>
        <p className="font-serif text-base text-charcoal/70 leading-relaxed mb-4">
          The Beauticate edit is not a marketplace. It is a highly selective curation — every brand
          assessed by Sigourney Cantelo and the Beauticate team against the same standards applied
          across eleven years of editorial.
        </p>
        <p className="font-serif text-base text-charcoal/70 leading-relaxed">
          We do not stock brands because they advertise with us. We stock brands we would
          genuinely use and recommend. That is the whole brief.
        </p>
      </div>
    </div>
  )
}
