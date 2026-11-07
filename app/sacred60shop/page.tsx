import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import Sacred60Gate from './Sacred60Gate'
import { SACRED_60 } from '@/data/sacred60'
import { withNoskim } from '@/lib/affiliate-links'

export const metadata: Metadata = {
  title: 'The Sacred 60 | Self-Care & Wellness Guide',
  description:
    'Sixty practical rituals, tools and everyday practices for modern self-care. By Sigourney Cantelo.',
  robots: { index: false, follow: false },
}

function ShopBadge() {
  return (
    <span
      className="inline-block font-sans text-[8px] tracking-[0.15em] uppercase font-semibold px-1.5 py-0.5 rounded-sm"
      style={{ background: '#2D5A3D', color: '#fff' }}
    >
      Shop
    </span>
  )
}

export default function Sacred60ShopPage() {
  return (
    <Suspense>
      <Sacred60Gate>
        <main className="text-[#5C4A3A]">
          {/* ─── Header ────────────────────────────────────── */}
          <header className="relative overflow-hidden text-center" style={{ background: '#FAF7F2' }}>
            <div className="py-20 md:py-28 px-6">
              <h1 className="font-serif font-normal tracking-[0.15em] uppercase" style={{ fontSize: 'clamp(36px,6vw,64px)' }}>
                Sacred
              </h1>
              <span
                className="block font-serif font-light leading-none -mt-4 md:-mt-6"
                style={{ fontSize: 'clamp(100px,18vw,200px)', opacity: 0.1 }}
                aria-hidden
              >
                60
              </span>
              <p className="font-serif italic text-base md:text-lg -mt-2" style={{ opacity: 0.6 }}>
                Self Care &amp; Wellness Guide
              </p>
            </div>
          </header>

          {/* ─── Why I Made This ───────────────────────────── */}
          <section style={{ background: '#FAF7F2' }}>
            <div className="max-w-4xl mx-auto px-6 pb-16 md:pb-24">
              <div className="grid md:grid-cols-2 gap-8 md:gap-14">
                <div className="font-serif text-[15px] leading-[1.8] space-y-5" style={{ opacity: 0.75 }}>
                  <p>
                    What if beauty wasn't just about what you put on your face, but how you lived your day?
                  </p>
                  <p>
                    For years, I believed that if I worked harder, optimised better, or found the right product, everything would fall into place. It didn't.
                  </p>
                  <p>
                    What changed things wasn't a breakthrough or a single treatment.
                  </p>
                </div>
                <div>
                  <div className="font-serif text-[15px] leading-[1.8] space-y-5" style={{ opacity: 0.75 }}>
                    <p>
                      It was a handful of small, repeatable rituals that helped steady my nervous system, restore my energy, and bring me back into my body, and my life.
                    </p>
                    <p>
                      The Sacred Sixty is a calm edit of what genuinely supports me, drawn from decades of reporting and lived experience. It isn't about doing more. It isn't about perfection. And it certainly isn't about trends. Take what resonates. Leave what doesn't.
                    </p>
                  </div>
                  <p className="font-serif italic text-[15px] mt-6" style={{ opacity: 0.55 }}>
                    — Sigourney
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Quote Divider ─────────────────────────────── */}
          <div className="py-12 md:py-16 text-center border-y" style={{ background: '#FAF7F2', borderColor: 'rgba(92,74,58,0.08)' }}>
            <p className="font-serif italic text-lg md:text-xl px-6 max-w-2xl mx-auto" style={{ opacity: 0.6 }}>
              It wasn't a breakthrough. It was small, repeatable rituals.
            </p>
          </div>

          {/* ─── Sections ──────────────────────────────────── */}
          {SACRED_60.map((section, si) => (
            <section key={si}>
              {/* Section header — editorial style */}
              <div className="py-14 md:py-20" style={{ background: '#FAF7F2' }}>
                <div className="max-w-4xl mx-auto px-6 text-center">
                  <h2
                    className="font-serif font-normal tracking-[0.08em] uppercase"
                    style={{ fontSize: 'clamp(28px,5vw,48px)' }}
                  >
                    {section.title}
                  </h2>
                  <p className="font-serif text-base md:text-lg mt-4 max-w-lg mx-auto leading-relaxed" style={{ opacity: 0.7 }}>
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Products — magazine scatter layout */}
              <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12" style={{ background: '#fff' }}>
                {(() => {
                  const pairs: (typeof section.items)[] = []
                  for (let i = 0; i < section.items.length; i += 2) {
                    pairs.push(section.items.slice(i, i + 2))
                  }
                  return pairs.map((pair, pi) => (
                    <div key={pi} className="relative md:grid md:grid-cols-12 md:items-start" style={{ marginBottom: '-2rem' }}>
                      {pair.map((item, ii) => {
                        const isRight = ii === 1
                        return (
                          <article
                            key={item.number}
                            className={`relative py-6 md:py-4 ${
                              isRight
                                ? 'md:col-start-7 md:col-span-6 md:pt-28'
                                : 'md:col-start-1 md:col-span-6'
                            }`}
                            style={{ zIndex: isRight ? 1 : 0 }}
                          >
                            <div className="flex items-start gap-2">
                              <span
                                className="font-serif font-light leading-none select-none shrink-0"
                                style={{ fontSize: 'clamp(48px,7vw,72px)', opacity: 0.12 }}
                                aria-hidden
                              >
                                {item.number}.
                              </span>
                              <h3 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold pt-3" style={{ opacity: 0.7 }}>
                                {item.title}
                              </h3>
                            </div>

                            <div
                              className="relative my-3"
                              style={{
                                marginLeft: isRight ? '-3rem' : '0',
                                marginRight: isRight ? '0' : '-3rem',
                              }}
                            >
                              <Link
                                href={item.url}
                                target={item.url.startsWith('http') ? '_blank' : undefined}
                                rel={withNoskim(item.url.startsWith('http') && !item.isShop ? 'noopener noreferrer sponsored' : undefined, item.url)}
                                className="group inline-block"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.image}
                                  alt={item.product}
                                  className="w-48 md:w-60 lg:w-72 h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </Link>
                            </div>

                            <p className="font-serif text-[13px] leading-[1.7] mb-3 max-w-[280px]" style={{ opacity: 0.7 }}>
                              {item.description}
                            </p>

                            <div className="flex items-center gap-2">
                              <Link
                                href={item.url}
                                target={item.url.startsWith('http') ? '_blank' : undefined}
                                rel={withNoskim(item.url.startsWith('http') && !item.isShop ? 'noopener noreferrer sponsored' : undefined, item.url)}
                                className="inline-block font-sans text-[10px] tracking-[0.15em] uppercase font-medium px-4 py-2 transition-opacity hover:opacity-70"
                                style={{
                                  background: item.isShop ? '#2D5A3D' : '#5C4A3A',
                                  color: '#fff',
                                }}
                              >
                                {item.isShop ? 'Shop on Beauticate' : 'Shop'}
                              </Link>
                              {item.isShop && <ShopBadge />}
                            </div>
                            {item.discount && (
                              <p className="font-sans text-[11px] mt-2" style={{ opacity: 0.4 }}>
                                {item.discount}
                              </p>
                            )}
                          </article>
                        )
                      })}
                    </div>
                  ))
                })()}
              </div>

              {/* Pull quote between sections */}
              {si < SACRED_60.length - 1 && (
                <div className="py-12 md:py-16 text-center" style={{ background: '#FAF7F2' }}>
                  <p className="font-serif italic text-base md:text-lg px-6 max-w-xl mx-auto" style={{ opacity: 0.55 }}>
                    &ldquo;{section.pullQuote}&rdquo;
                  </p>
                </div>
              )}
            </section>
          ))}

          {/* ─── Closing ──────────────────────────────────── */}
          <footer className="py-20 md:py-28 px-6" style={{ background: '#FAF7F2' }}>
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10 items-center">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/content/sacred60/hero.jpg"
                  alt="Sigourney"
                  className="w-full max-w-sm mx-auto object-cover"
                  style={{ aspectRatio: '3/4' }}
                  loading="lazy"
                />
              </div>
              <div className="font-serif text-lg md:text-xl leading-[1.7] space-y-5" style={{ opacity: 0.75 }}>
                <p>
                  <strong>You don't need to overhaul your life to feel better.</strong>
                </p>
                <p>
                  Start with one ritual. One habit. One small shift that feels doable.
                </p>
                <p>
                  Return to this guide whenever you need grounding, clarity, or inspiration: it's designed to meet you where you are.
                </p>
                <p>
                  For deeper conversations, expert interviews, and ongoing edits of what actually works, you'll find more on Beauticate and on the Beautiful Inside podcast.
                </p>
              </div>
            </div>

            <div className="text-center mt-16">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium px-6 py-3 transition-opacity hover:opacity-70"
                  style={{ background: '#5C4A3A', color: '#fff' }}
                >
                  Explore Beauticate
                </Link>
                <Link
                  href="/podcast"
                  className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium px-6 py-3 transition-opacity hover:opacity-70"
                  style={{ border: '1px solid #5C4A3A', color: '#5C4A3A' }}
                >
                  Listen to the Podcast
                </Link>
              </div>

              <p className="font-sans text-[10px] mt-14 max-w-lg mx-auto" style={{ opacity: 0.3 }}>
                A note: The practices and products featured in this guide are shared from personal experience and general
                wellbeing research. They are not a substitute for professional medical advice.
              </p>
            </div>
          </footer>
        </main>
      </Sacred60Gate>
    </Suspense>
  )
}
