import type { Metadata } from 'next'
import React, { Suspense } from 'react'
import Link from 'next/link'
import Sacred60Gate from './Sacred60Gate'
import { SACRED_60 } from '@/data/sacred60'
import type { Sacred60Item as S60Item } from '@/data/sacred60'
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

function CollageItem({
  item,
  imgW = 240,
  numberSize = 80,
  textW,
  className = '',
  style,
  textAlign = 'left',
}: {
  item: S60Item
  imgW?: number
  numberSize?: number
  textW?: number
  className?: string
  style?: React.CSSProperties
  textAlign?: 'left' | 'right' | 'center'
}) {
  const maxTextW = textW ?? Math.min(imgW + 60, 300)
  const alignClass =
    textAlign === 'right'
      ? 'text-right ml-auto'
      : textAlign === 'center'
        ? 'text-center mx-auto'
        : ''

  return (
    <article className={className} style={style}>
      <span
        className={`block font-serif font-light select-none leading-none ${textAlign === 'right' ? 'text-right' : ''}`}
        style={{ fontSize: numberSize, color: '#9B8B7A', opacity: 0.25 }}
        aria-hidden
      >
        {item.number}.
      </span>
      <h3
        className={`font-sans text-[9px] tracking-[0.25em] uppercase font-bold mt-0.5 ${alignClass}`}
        style={{ color: '#5C4A3A', opacity: 0.7, maxWidth: maxTextW }}
      >
        {item.title}
      </h3>

      <Link
        href={item.url}
        target={item.url.startsWith('http') ? '_blank' : undefined}
        rel={withNoskim(
          item.url.startsWith('http') && !item.isShop
            ? 'noopener noreferrer sponsored'
            : undefined,
          item.url
        )}
        className="group block mt-3 mb-3"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.product}
          className="h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ maxWidth: imgW, maxHeight: 420, width: '100%' }}
          loading="lazy"
        />
      </Link>

      <p
        className={`font-serif text-[13px] leading-[1.75] mb-3 ${alignClass}`}
        style={{ color: '#5C4A3A', opacity: 0.6, maxWidth: maxTextW }}
      >
        {item.description}
      </p>

      <div className={`flex items-center gap-2 flex-wrap ${textAlign === 'right' ? 'justify-end' : ''}`}>
        <Link
          href={item.url}
          target={item.url.startsWith('http') ? '_blank' : undefined}
          rel={withNoskim(
            item.url.startsWith('http') && !item.isShop
              ? 'noopener noreferrer sponsored'
              : undefined,
            item.url
          )}
          className="inline-block font-sans text-[9px] tracking-[0.15em] uppercase font-medium px-4 py-2 transition-opacity hover:opacity-70"
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
        <p className={`font-sans text-[10px] mt-1.5 ${alignClass}`} style={{ opacity: 0.4 }}>
          {item.discount}
        </p>
      )}
    </article>
  )
}

/* ── Collage spread patterns ──────────────────────────────
   Each takes 5 items and scatters them in a magazine-style
   layout matching the Sacred 60 website PDF:
   - 2-column organic placement
   - Huge light-brown numbers next to titles
   - Overlapping product images
   - Narrow text columns
   ──────────────────────────────────────────────────────── */

function SpreadA({ items }: { items: S60Item[] }) {
  return (
    <div className="relative">
      <div className="hidden md:grid grid-cols-12 gap-x-4" style={{ minHeight: 900 }}>
        {/* Item 0 — left column, top */}
        <div className="col-span-5 col-start-1 row-start-1" style={{ marginTop: 0 }}>
          <CollageItem item={items[0]} imgW={260} numberSize={90} textAlign="right" textW={260} />
        </div>
        {/* Item 1 — right column, offset down from top, large number */}
        <div className="col-span-5 col-start-8 row-start-1" style={{ marginTop: 20 }}>
          <CollageItem item={items[1]} imgW={220} numberSize={80} textW={240} />
        </div>
        {/* Item 2 — left, overlapping into item 0's space */}
        <div className="col-span-5 col-start-1" style={{ marginTop: -60 }}>
          <CollageItem item={items[2]} imgW={200} numberSize={75} textAlign="right" textW={240} />
        </div>
        {/* Item 3 — right, pulled up */}
        <div className="col-span-5 col-start-7" style={{ marginTop: -100 }}>
          <CollageItem item={items[3]} imgW={240} numberSize={85} textW={260} />
        </div>
        {/* Item 4 — center-left, bottom */}
        <div className="col-span-5 col-start-3" style={{ marginTop: -40 }}>
          <CollageItem item={items[4]} imgW={220} numberSize={80} textW={240} />
        </div>
      </div>
      {/* Mobile: stacked with alternating alignment */}
      <div className="md:hidden space-y-14 px-2">
        <CollageItem item={items[0]} imgW={240} numberSize={70} />
        <CollageItem item={items[1]} imgW={200} numberSize={65} className="ml-auto" style={{ maxWidth: 300 }} textAlign="right" />
        <CollageItem item={items[2]} imgW={220} numberSize={65} />
        <CollageItem item={items[3]} imgW={200} numberSize={65} className="ml-auto" style={{ maxWidth: 300 }} textAlign="right" />
        <CollageItem item={items[4]} imgW={220} numberSize={65} />
      </div>
    </div>
  )
}

function SpreadB({ items }: { items: S60Item[] }) {
  return (
    <div className="relative">
      <div className="hidden md:grid grid-cols-12 gap-x-4" style={{ minHeight: 900 }}>
        {/* Item 0 — left, starts high */}
        <div className="col-span-5 col-start-1 row-start-1" style={{ marginTop: 30 }}>
          <CollageItem item={items[0]} imgW={220} numberSize={85} textAlign="right" textW={240} />
        </div>
        {/* Item 1 — right, large, top */}
        <div className="col-span-5 col-start-7 row-start-1" style={{ marginTop: 0 }}>
          <CollageItem item={items[1]} imgW={280} numberSize={95} textW={260} />
        </div>
        {/* Item 2 — center, overlapping */}
        <div className="col-span-6 col-start-4" style={{ marginTop: -80 }}>
          <CollageItem item={items[2]} imgW={260} numberSize={85} textW={260} />
        </div>
        {/* Item 3 — left, lower */}
        <div className="col-span-5 col-start-1" style={{ marginTop: -30 }}>
          <CollageItem item={items[3]} imgW={200} numberSize={75} textAlign="right" textW={220} />
        </div>
        {/* Item 4 — right, bottom, pulled up */}
        <div className="col-span-5 col-start-7" style={{ marginTop: -120 }}>
          <CollageItem item={items[4]} imgW={240} numberSize={80} textW={240} />
        </div>
      </div>
      <div className="md:hidden space-y-14 px-2">
        <CollageItem item={items[0]} imgW={200} numberSize={65} />
        <CollageItem item={items[1]} imgW={260} numberSize={70} className="ml-auto" style={{ maxWidth: 340 }} textAlign="right" />
        <CollageItem item={items[2]} imgW={240} numberSize={65} />
        <CollageItem item={items[3]} imgW={200} numberSize={65} className="ml-auto" style={{ maxWidth: 300 }} textAlign="right" />
        <CollageItem item={items[4]} imgW={220} numberSize={65} />
      </div>
    </div>
  )
}

function SpreadC({ items }: { items: S60Item[] }) {
  return (
    <div className="relative">
      <div className="hidden md:grid grid-cols-12 gap-x-4" style={{ minHeight: 900 }}>
        {/* Item 0 — large, left */}
        <div className="col-span-5 col-start-1 row-start-1">
          <CollageItem item={items[0]} imgW={280} numberSize={95} textAlign="right" textW={260} />
        </div>
        {/* Item 1 — right, offset down */}
        <div className="col-span-5 col-start-8 row-start-1" style={{ marginTop: 160 }}>
          <CollageItem item={items[1]} imgW={220} numberSize={80} textW={240} />
        </div>
        {/* Item 2 — left, overlapping */}
        <div className="col-span-5 col-start-2" style={{ marginTop: -40 }}>
          <CollageItem item={items[2]} imgW={200} numberSize={75} textAlign="right" textW={220} />
        </div>
        {/* Item 3 — right */}
        <div className="col-span-5 col-start-7" style={{ marginTop: -80 }}>
          <CollageItem item={items[3]} imgW={250} numberSize={85} textW={260} />
        </div>
        {/* Item 4 — center-left */}
        <div className="col-span-5 col-start-2" style={{ marginTop: -20 }}>
          <CollageItem item={items[4]} imgW={220} numberSize={80} textW={240} />
        </div>
      </div>
      <div className="md:hidden space-y-14 px-2">
        <CollageItem item={items[0]} imgW={260} numberSize={70} />
        <CollageItem item={items[1]} imgW={200} numberSize={65} className="ml-auto" style={{ maxWidth: 300 }} textAlign="right" />
        <CollageItem item={items[2]} imgW={200} numberSize={60} />
        <CollageItem item={items[3]} imgW={240} numberSize={65} className="ml-auto" style={{ maxWidth: 340 }} textAlign="right" />
        <CollageItem item={items[4]} imgW={220} numberSize={65} />
      </div>
    </div>
  )
}

function SpreadD({ items }: { items: S60Item[] }) {
  return (
    <div className="relative">
      <div className="hidden md:grid grid-cols-12 gap-x-4" style={{ minHeight: 900 }}>
        {/* Item 0 — right, large */}
        <div className="col-span-5 col-start-7 row-start-1">
          <CollageItem item={items[0]} imgW={270} numberSize={90} textW={260} />
        </div>
        {/* Item 1 — left, offset down */}
        <div className="col-span-5 col-start-1 row-start-1" style={{ marginTop: 100 }}>
          <CollageItem item={items[1]} imgW={230} numberSize={80} textAlign="right" textW={240} />
        </div>
        {/* Item 2 — right, pulled up */}
        <div className="col-span-5 col-start-7" style={{ marginTop: -60 }}>
          <CollageItem item={items[2]} imgW={210} numberSize={80} textW={240} />
        </div>
        {/* Item 3 — center-left */}
        <div className="col-span-5 col-start-2" style={{ marginTop: -50 }}>
          <CollageItem item={items[3]} imgW={200} numberSize={75} textAlign="right" textW={220} />
        </div>
        {/* Item 4 — center, bottom */}
        <div className="col-span-6 col-start-4" style={{ marginTop: -10 }}>
          <CollageItem item={items[4]} imgW={250} numberSize={85} textW={260} />
        </div>
      </div>
      <div className="md:hidden space-y-14 px-2">
        <CollageItem item={items[0]} imgW={250} numberSize={70} className="ml-auto" style={{ maxWidth: 340 }} textAlign="right" />
        <CollageItem item={items[1]} imgW={220} numberSize={65} />
        <CollageItem item={items[2]} imgW={200} numberSize={65} className="ml-auto" style={{ maxWidth: 300 }} textAlign="right" />
        <CollageItem item={items[3]} imgW={200} numberSize={60} />
        <CollageItem item={items[4]} imgW={240} numberSize={65} />
      </div>
    </div>
  )
}

const SPREAD_COMPONENTS = [SpreadA, SpreadB, SpreadC, SpreadD]

function CollageSpread({ items, index }: { items: S60Item[]; index: number }) {
  const Spread = SPREAD_COMPONENTS[index % SPREAD_COMPONENTS.length]
  return <Spread items={items} />
}

/* Section header with holding-shot style layout */
function SectionHeader({
  section,
  index,
}: {
  section: (typeof SACRED_60)[number]
  index: number
}) {
  const isEven = index % 2 === 0
  return (
    <div className="py-10 md:py-0" style={{ background: '#FAF7F2' }}>
      <div className={`max-w-6xl mx-auto md:grid md:grid-cols-2 md:min-h-[400px] items-center`}>
        {/* Text side */}
        <div
          className={`px-6 md:px-14 py-10 md:py-20 ${isEven ? 'md:order-2' : 'md:order-1'}`}
        >
          <h2
            className="font-serif font-normal tracking-[0.08em] uppercase"
            style={{ fontSize: 'clamp(28px,5vw,48px)', color: '#5C4A3A' }}
          >
            {section.title}
          </h2>
          <p
            className="font-serif text-base md:text-lg mt-4 max-w-md leading-relaxed"
            style={{ color: '#5C4A3A', opacity: 0.7 }}
          >
            {section.description}
          </p>
        </div>
        {/* Image side — greige placeholder until holding shots are added */}
        <div
          className={`hidden md:block h-full min-h-[400px] ${isEven ? 'md:order-1' : 'md:order-2'}`}
          style={{ background: '#EDE8E0' }}
        />
      </div>

      {/* Pull quote below the header */}
      <div className="text-center py-8 md:py-12 px-6">
        <p
          className="font-serif italic text-base md:text-lg max-w-xl mx-auto"
          style={{ color: '#5C4A3A', opacity: 0.55 }}
        >
          &ldquo;{section.pullQuote}&rdquo;
        </p>
      </div>
    </div>
  )
}

export default function Sacred60ShopPage() {
  return (
    <Suspense>
      <Sacred60Gate>
        <main style={{ color: '#5C4A3A' }}>
          {/* ─── Header ────────────────────────────────────── */}
          <header className="relative overflow-hidden text-center" style={{ background: '#FAF7F2' }}>
            <div className="py-20 md:py-28 px-6">
              <p
                className="font-sans text-[9px] tracking-[0.4em] uppercase font-medium mb-6"
                style={{ opacity: 0.35 }}
              >
                Beauticate
              </p>
              <h1
                className="font-serif font-normal tracking-[0.15em] uppercase"
                style={{ fontSize: 'clamp(36px,6vw,64px)' }}
              >
                Sacred
              </h1>
              <span
                className="block font-serif font-light leading-none -mt-4 md:-mt-6"
                style={{ fontSize: 'clamp(100px,18vw,200px)', opacity: 0.1 }}
                aria-hidden
              >
                60
              </span>
              <p
                className="font-serif italic text-base md:text-lg -mt-2"
                style={{ opacity: 0.6 }}
              >
                Self Care &amp; Wellness Guide
              </p>
            </div>
          </header>

          {/* ─── Why I Made This ───────────────────────────── */}
          <section style={{ background: '#FAF7F2' }}>
            <div className="max-w-4xl mx-auto px-6 pb-16 md:pb-24">
              <div className="grid md:grid-cols-2 gap-8 md:gap-14">
                <div
                  className="font-serif text-[15px] leading-[1.8] space-y-5"
                  style={{ opacity: 0.75 }}
                >
                  <p>
                    What if beauty wasn't just about what you put on your face,
                    but how you lived your day?
                  </p>
                  <p>
                    For years, I believed that if I worked harder, optimised
                    better, or found the right product, everything would fall
                    into place. It didn't.
                  </p>
                  <p>
                    What changed things wasn't a breakthrough or a single
                    treatment.
                  </p>
                </div>
                <div>
                  <div
                    className="font-serif text-[15px] leading-[1.8] space-y-5"
                    style={{ opacity: 0.75 }}
                  >
                    <p>
                      It was a handful of small, repeatable rituals that helped
                      steady my nervous system, restore my energy, and bring me
                      back into my body, and my life.
                    </p>
                    <p>
                      The Sacred Sixty is a calm edit of what genuinely supports
                      me, drawn from decades of reporting and lived experience.
                      It isn't about doing more. It isn't about perfection. And
                      it certainly isn't about trends. Take what resonates. Leave
                      what doesn't.
                    </p>
                  </div>
                  <p
                    className="font-serif italic text-[15px] mt-6"
                    style={{ opacity: 0.55 }}
                  >
                    — Sigourney
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Quote Divider ─────────────────────────────── */}
          <div
            className="py-12 md:py-16 text-center border-y"
            style={{
              background: '#FAF7F2',
              borderColor: 'rgba(92,74,58,0.08)',
            }}
          >
            <p
              className="font-serif italic text-lg md:text-xl px-6 max-w-2xl mx-auto"
              style={{ opacity: 0.6 }}
            >
              It wasn't a breakthrough. It was small, repeatable rituals.
            </p>
          </div>

          {/* ─── Sections ──────────────────────────────────── */}
          {SACRED_60.map((section, si) => {
            const firstFive = section.items.slice(0, 5)
            const secondFive = section.items.slice(5, 10)
            const spreadBase = si * 2

            return (
              <section key={si}>
                {/* Section header — split layout like the PDF */}
                <SectionHeader section={section} index={si} />

                {/* Spread 1 (items 1-5) */}
                <div
                  className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20"
                  style={{ background: '#fff' }}
                >
                  <CollageSpread items={firstFive} index={spreadBase} />
                </div>

                {/* Mid-section divider */}
                <div
                  className="text-center py-6"
                  style={{ background: '#FAF7F2' }}
                >
                  <Link
                    href={`/shop/moments/sacred-60-${section.title.toLowerCase().replace(/\s*&\s*/g, '-')}`}
                    className="font-sans text-[9px] tracking-[0.2em] uppercase font-medium px-5 py-2.5 transition-opacity hover:opacity-70 inline-block"
                    style={{
                      background: '#5C4A3A',
                      color: '#fff',
                    }}
                  >
                    Shop the Edit
                  </Link>
                </div>

                {/* Spread 2 (items 6-10) */}
                {secondFive.length > 0 && (
                  <div
                    className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20"
                    style={{ background: '#fff' }}
                  >
                    <CollageSpread items={secondFive} index={spreadBase + 1} />
                  </div>
                )}
              </section>
            )
          })}

          {/* ─── Closing ──────────────────────────────────── */}
          <footer
            className="py-20 md:py-28 px-6"
            style={{ background: '#FAF7F2' }}
          >
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
              <div
                className="font-serif text-lg md:text-xl leading-[1.7] space-y-5"
                style={{ opacity: 0.75 }}
              >
                <p>
                  <strong>
                    You don't need to overhaul your life to feel better.
                  </strong>
                </p>
                <p>
                  Start with one ritual. One habit. One small shift that feels
                  doable.
                </p>
                <p>
                  Return to this guide whenever you need grounding, clarity, or
                  inspiration: it's designed to meet you where you are.
                </p>
                <p>
                  For deeper conversations, expert interviews, and ongoing edits
                  of what actually works, you'll find more on Beauticate and on
                  the Beautiful Inside podcast.
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

              <p
                className="font-sans text-[10px] mt-14 max-w-lg mx-auto"
                style={{ opacity: 0.3 }}
              >
                A note: The practices and products featured in this guide are
                shared from personal experience and general wellbeing research.
                They are not a substitute for professional medical advice.
              </p>
            </div>
          </footer>
        </main>
      </Sacred60Gate>
    </Suspense>
  )
}
