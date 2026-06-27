import Link from 'next/link'
import { getProducts } from '@/lib/shopify'
import ProductCard from '@/components/shop/ProductCard'
import HeroVideo from '@/components/shop/HeroVideo'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop | Beauticate',
  description: 'Curated beauty, wellness and lifestyle — recommended by the editors and experts of Beauticate. Fewer, better things, chosen by editors not algorithms.',
}

const SHOP_SECTIONS = [
  {
    href: '/shop/by-brand',
    label: 'Shop by Brand',
    description: 'Discover the carefully chosen brands behind the edit.',
  },
  {
    href: '/shop/by-category',
    label: 'Shop by Category',
    description: 'Skincare, fragrance, hair, wellness and more.',
  },
  {
    href: '/shop/by-moment',
    label: 'Shop by Moment',
    description: 'Curated for how you actually live — not just what you need to buy.',
  },
]

export default async function ShopPage() {
  const newArrivals = await getProducts(8)

  return (
    <div>

      {/* Hero — 100vw breakout so no parent padding/constraint clips the video */}
      <section
        className="relative bg-ink overflow-hidden"
        style={{
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          minHeight: 'clamp(480px, 65vh, 780px)',
        }}
      >
        <HeroVideo />

        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />

        {/* Hero content */}
        <div
          className="relative z-10 flex flex-col items-center justify-end text-center px-6 pb-16 pt-24"
          style={{ minHeight: 'clamp(480px, 65vh, 780px)' }}
        >
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/60 mb-4">
            The Beauticate Edit
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-paper leading-tight max-w-2xl mb-5">
            Essentials for a beautiful life.
          </h1>
          <p className="font-serif text-lg md:text-xl text-paper/70 max-w-sm leading-relaxed mb-10">
            Curated by editors and experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop/by-category" className="btn-primary">
              Explore the Edit
            </Link>
            <Link href="/shop/by-brand" className="inline-flex items-center justify-center px-6 py-3 border border-paper/40 text-paper text-xs font-sans tracking-[0.34em] uppercase transition-colors hover:bg-paper hover:text-ink">
              Shop by Brand
            </Link>
          </div>
        </div>
      </section>

      {/* Section teasers — 3 columns */}
      <section className="border-b border-camel/30 bg-parchment">
        <div className="max-w-wide mx-auto px-4 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-camel/30">
          {SHOP_SECTIONS.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col items-center text-center px-8 py-10 hover:bg-camel/10 transition-colors"
            >
              <h3 className="font-sans text-[11px] tracking-[0.25em] uppercase text-ink mb-3 group-hover:text-eucalypt transition-colors">
                {s.label}
              </h3>
              <p className="font-serif text-sm text-charcoal/60 leading-relaxed max-w-xs">
                {s.description}
              </p>
              <span className="mt-4 font-sans text-[10px] tracking-[0.2em] uppercase text-eucalypt">
                Browse →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-wide mx-auto px-4 py-14 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label-editorial mb-2">Just arrived</p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink">New to the edit</h2>
            </div>
            <Link href="/shop/by-category" className="hidden md:block font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/50 hover:text-ink transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {newArrivals.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {newArrivals.length > 4 && (
            <div className="mt-10 text-center">
              <Link href="/shop/by-category" className="btn-secondary">
                See all new arrivals
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Editorial note */}
      <section className="bg-ink py-14 md:py-20">
        <div className="max-w-content mx-auto px-6 text-center">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/40 mb-6">
            Our philosophy
          </p>
          <blockquote className="font-serif text-2xl md:text-3xl text-paper leading-relaxed mb-8">
            &ldquo;I only stock things I would recommend to my closest friends. That&rsquo;s the whole edit.&rdquo;
          </blockquote>
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-paper/50">
            Sigourney Cantelo — Founder &amp; Editor-in-Chief
          </p>
        </div>
      </section>

    </div>
  )
}
