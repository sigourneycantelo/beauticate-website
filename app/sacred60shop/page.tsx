import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import Sacred60Gate from './Sacred60Gate'
import { SACRED_60 } from '@/data/sacred60'

export const metadata: Metadata = {
  title: 'The Sacred 60 | Self-Care & Wellness Guide',
  description:
    'Sixty practical rituals, tools and everyday practices for modern self-care. By Sigourney Cantelo.',
  robots: { index: false, follow: false },
}

function ShopBadge() {
  return (
    <span
      className="inline-block font-sans text-[9px] tracking-[0.15em] uppercase font-semibold px-2 py-0.5 rounded-sm ml-2"
      style={{ background: '#2D5A3D', color: '#fff', verticalAlign: 'middle' }}
    >
      Shop
    </span>
  )
}

export default function Sacred60ShopPage() {
  return (
    <Suspense>
      <Sacred60Gate>
        <main className="bg-cream-50 text-charcoal">
          {/* ─── Header ────────────────────────────────────── */}
          <header
            className="relative overflow-hidden text-center py-16 md:py-24"
            style={{ background: '#F5F0E8' }}
          >
            <p
              className="font-sans text-[10px] tracking-[0.35em] uppercase font-medium mb-4"
              style={{ opacity: 0.4 }}
            >
              Self Care & Wellness Guide
            </p>
            <h1 className="font-serif font-normal leading-[0.9]" style={{ fontSize: 'clamp(48px,8vw,88px)' }}>
              Sacred
            </h1>
            <span
              className="block font-serif font-normal leading-none mt-1"
              style={{ fontSize: 'clamp(90px,16vw,180px)', opacity: 0.1 }}
              aria-hidden
            >
              60
            </span>

            <div className="max-w-2xl mx-auto px-6 mt-6">
              <p className="font-serif text-base leading-relaxed" style={{ opacity: 0.65 }}>
                After years of interviewing doctors, scientists, nutritionists and wellness experts, and doing my
                own healing work, I realised the biggest problem isn't knowing what to do. It's the overwhelm.
                The Sacred 60 is my calm edit of what actually helps. Not trends. Not "do more". Just practical
                rituals, tips and tools that support your nervous system, skin, energy, sleep and home, in real
                life.
              </p>
              <p className="font-serif italic mt-4" style={{ opacity: 0.5 }}>— Sigourney x</p>
            </div>
          </header>

          {/* ─── Sections ──────────────────────────────────── */}
          {SACRED_60.map((section, si) => (
            <section key={si}>
              {/* Section header */}
              <div
                className="text-center py-12 md:py-16"
                style={{ background: si % 2 === 0 ? '#fff' : '#F5F0E8' }}
              >
                <h2
                  className="font-sans text-[11px] tracking-[0.35em] uppercase font-semibold mb-3"
                  style={{ opacity: 0.5 }}
                >
                  {section.title}
                </h2>
                <p
                  className="font-serif italic text-base md:text-lg px-6"
                  style={{ opacity: 0.55, maxWidth: '44ch', margin: '0 auto' }}
                >
                  {section.subtitle}
                </p>
              </div>

              {/* Products */}
              <div className="max-w-4xl mx-auto px-6">
                {section.items.map((item, ii) => {
                  const isEven = ii % 2 === 0
                  return (
                    <article
                      key={item.number}
                      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12 py-12 md:py-16 ${
                        ii < section.items.length - 1 ? 'border-b border-cream-200' : ''
                      }`}
                    >
                      {/* Image */}
                      <div className="w-full md:w-2/5 shrink-0 flex justify-center">
                        <Link
                          href={item.url}
                          target={item.url.startsWith('http') ? '_blank' : undefined}
                          rel={item.url.startsWith('http') && !item.isShop ? 'noopener noreferrer sponsored' : undefined}
                          className="relative group"
                        >
                          {/* Number */}
                          <span
                            className="absolute -top-6 -left-2 font-serif text-5xl md:text-6xl leading-none select-none"
                            style={{ opacity: 0.1 }}
                            aria-hidden
                          >
                            {item.number}.
                          </span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.product}
                            className="w-48 md:w-56 h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      {/* Copy */}
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="font-sans text-xs tracking-[0.25em] uppercase font-semibold mb-3" style={{ opacity: 0.45 }}>
                          {item.number}. {item.title}
                        </h3>
                        <p className="font-serif text-base leading-relaxed mb-4" style={{ opacity: 0.7 }}>
                          {item.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center md:items-start gap-2">
                          <Link
                            href={item.url}
                            target={item.url.startsWith('http') ? '_blank' : undefined}
                            rel={item.url.startsWith('http') && !item.isShop ? 'noopener noreferrer sponsored' : undefined}
                            className="inline-block font-sans text-[10px] tracking-[0.2em] uppercase font-medium px-5 py-2.5 transition-opacity hover:opacity-70"
                            style={{
                              background: item.isShop ? '#2D5A3D' : '#1C1A17',
                              color: '#fff',
                              border: 'none',
                            }}
                          >
                            {item.isShop ? 'Shop on Beauticate' : 'Shop'}
                          </Link>
                          {item.isShop && <ShopBadge />}
                        </div>
                        {item.discount && (
                          <p className="font-sans text-[11px] mt-2" style={{ opacity: 0.45 }}>
                            {item.discount}
                          </p>
                        )}
                        {item.brand && (
                          <p className="font-sans text-[11px] mt-1" style={{ opacity: 0.35 }}>
                            {item.brand}
                          </p>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}

          {/* ─── Footer ────────────────────────────────────── */}
          <footer className="text-center py-16 md:py-24 px-6" style={{ background: '#F5F0E8' }}>
            <p className="font-serif text-base leading-relaxed max-w-xl mx-auto mb-6" style={{ opacity: 0.6 }}>
              You don't need to overhaul your life to feel better. Start with one ritual. One habit. One small
              shift that feels doable. Return to this guide whenever you need grounding, clarity, or inspiration.
            </p>
            <p className="font-serif italic mb-8" style={{ opacity: 0.5 }}>
              Self-care doesn't need to be perfect. It just needs to be considered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium px-5 py-2.5 transition-opacity hover:opacity-70"
                style={{ background: '#1C1A17', color: '#fff' }}
              >
                Explore Beauticate
              </Link>
              <Link
                href="/podcast"
                className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium px-5 py-2.5 transition-opacity hover:opacity-70"
                style={{ border: '1px solid #1C1A17', color: '#1C1A17' }}
              >
                Listen to the Podcast
              </Link>
            </div>

            <p className="font-sans text-[10px] mt-12" style={{ opacity: 0.3 }}>
              The practices and products featured in this guide are shared from personal experience and general
              wellbeing research. They are not a substitute for professional medical advice.
            </p>
          </footer>
        </main>
      </Sacred60Gate>
    </Suspense>
  )
}
