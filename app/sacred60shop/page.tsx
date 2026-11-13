import type { Metadata } from 'next'
import React, { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

const SECTION_IMAGES: Record<string, string | null> = {
  'Mind & Mood': '/content/sacred60/section_mind_mood.jpg',
  'Body & Balance': '/content/sacred60/section_body_balance.jpg',
  'Skin & Glow': '/content/sacred60/section_skin_glow.jpg',
  'Energy & Sleep': '/content/sacred60/section_energy_sleep.jpg',
  'Space & Soul': '/content/sacred60/section_space_soul.jpg',
  'Nourish & Nurture': '/content/sacred60/section_nourish_nurture.jpg',
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

function ItemCard({
  item,
  imgW = 380,
  numberSize = 140,
  textW = 280,
  textAlign = 'left',
  className = '',
  style,
}: {
  item: S60Item
  imgW?: number
  numberSize?: number
  textW?: number
  textAlign?: 'left' | 'right'
  className?: string
  style?: React.CSSProperties
}) {
  const alignClass = textAlign === 'right' ? 'text-right ml-auto' : ''
  const btnAlign = textAlign === 'right' ? 'justify-end' : ''

  return (
    <article className={`relative ${className}`} style={style}>
      <span
        className={`block font-serif select-none leading-[0.85] ${textAlign === 'right' ? 'text-right' : ''}`}
        style={{ fontSize: numberSize, color: '#8C7B6B', opacity: 0.45, fontWeight: 700 }}
        aria-hidden
      >
        {item.number}.
      </span>
      <h3
        className={`font-sans text-[10px] tracking-[0.2em] uppercase font-bold mt-1 ${alignClass}`}
        style={{ color: '#5C4A3A', maxWidth: textW }}
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
        className="group block my-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.product}
          className="h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ width: imgW, maxWidth: '100%' }}
          loading="lazy"
        />
      </Link>

      <p
        className={`font-serif text-[13px] leading-[1.7] mb-3 ${alignClass}`}
        style={{ color: '#5C4A3A', opacity: 0.65, maxWidth: textW }}
      >
        {item.description}
      </p>

      <div className={`flex items-center gap-2 flex-wrap ${btnAlign}`}>
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
        <p
          className={`font-sans text-[10px] mt-1.5 ${alignClass}`}
          style={{ opacity: 0.4 }}
        >
          {item.discount}
        </p>
      )}
    </article>
  )
}

/* ── Magazine collage spreads ─────────────────────────────
   Absolute-positioned items create genuine overlap like the
   Sacred 60 website PDF flat-lay spreads.
   ──────────────────────────────────────────────────────── */

type Placement = {
  left?: string
  right?: string
  top: number
  imgW: number
  numberSize: number
  textW: number
  textAlign: 'left' | 'right'
  z: number
  width: string
}

function AbsoluteSpread({
  items,
  placements,
  height,
}: {
  items: S60Item[]
  placements: Placement[]
  height: number
}) {
  return (
    <div className="relative overflow-visible">
      {/* Desktop: absolute positioned collage */}
      <div className="hidden md:block relative" style={{ height }}>
        {items.map((item, i) => {
          const p = placements[i]
          if (!p) return null
          const pos: React.CSSProperties = {
            position: 'absolute',
            top: p.top,
            width: p.width,
            zIndex: p.z,
          }
          if (p.left !== undefined) pos.left = p.left
          if (p.right !== undefined) pos.right = p.right
          return (
            <div key={item.number} style={pos}>
              <ItemCard
                item={item}
                imgW={p.imgW}
                numberSize={p.numberSize}
                textW={p.textW}
                textAlign={p.textAlign}
              />
            </div>
          )
        })}
      </div>
      {/* Mobile: stacked, alternating sides */}
      <div className="md:hidden space-y-16 px-4">
        {items.map((item, i) => (
          <ItemCard
            key={item.number}
            item={item}
            imgW={380}
            numberSize={120}
            textW={300}
            textAlign={i % 2 === 0 ? 'left' : 'right'}
            className={i % 2 === 1 ? 'ml-auto' : ''}
            style={i % 2 === 1 ? { maxWidth: '85%' } : undefined}
          />
        ))}
      </div>
    </div>
  )
}

const SPREAD_LAYOUTS: Placement[][] = [
  // Layout A — hero top-left, stagger right, overlap center
  [
    { left: '-2%', top: 0, imgW: 600, numberSize: 220, textW: 300, textAlign: 'right', z: 2, width: '55%' },
    { right: '-2%', top: 60, imgW: 550, numberSize: 200, textW: 280, textAlign: 'left', z: 3, width: '52%' },
    { left: '3%', top: 900, imgW: 520, numberSize: 200, textW: 280, textAlign: 'right', z: 2, width: '50%' },
    { right: '0%', top: 820, imgW: 560, numberSize: 220, textW: 300, textAlign: 'left', z: 4, width: '54%' },
    { left: '10%', top: 1700, imgW: 580, numberSize: 210, textW: 300, textAlign: 'left', z: 3, width: '56%' },
  ],
  // Layout B — right hero, left offsets
  [
    { right: '-2%', top: 0, imgW: 620, numberSize: 230, textW: 300, textAlign: 'left', z: 3, width: '56%' },
    { left: '-2%', top: 100, imgW: 520, numberSize: 200, textW: 280, textAlign: 'right', z: 2, width: '50%' },
    { left: '15%', top: 880, imgW: 580, numberSize: 210, textW: 300, textAlign: 'left', z: 4, width: '54%' },
    { left: '-2%', top: 1500, imgW: 500, numberSize: 200, textW: 260, textAlign: 'right', z: 2, width: '48%' },
    { right: '-2%', top: 1420, imgW: 560, numberSize: 210, textW: 280, textAlign: 'left', z: 3, width: '52%' },
  ],
  // Layout C — center-left hero, cascade right
  [
    { left: '0%', top: 0, imgW: 580, numberSize: 220, textW: 300, textAlign: 'right', z: 3, width: '54%' },
    { right: '-2%', top: 250, imgW: 560, numberSize: 200, textW: 280, textAlign: 'left', z: 2, width: '52%' },
    { left: '5%', top: 950, imgW: 540, numberSize: 200, textW: 280, textAlign: 'right', z: 4, width: '52%' },
    { right: '0%', top: 1000, imgW: 580, numberSize: 220, textW: 300, textAlign: 'left', z: 3, width: '54%' },
    { left: '2%', top: 1800, imgW: 560, numberSize: 210, textW: 280, textAlign: 'left', z: 2, width: '52%' },
  ],
  // Layout D — diagonal flow
  [
    { right: '0%', top: 0, imgW: 600, numberSize: 230, textW: 300, textAlign: 'left', z: 3, width: '55%' },
    { left: '-2%', top: 200, imgW: 560, numberSize: 200, textW: 280, textAlign: 'right', z: 2, width: '52%' },
    { right: '2%', top: 950, imgW: 540, numberSize: 210, textW: 280, textAlign: 'left', z: 4, width: '52%' },
    { left: '0%', top: 1050, imgW: 520, numberSize: 200, textW: 280, textAlign: 'right', z: 2, width: '50%' },
    { left: '12%', top: 1800, imgW: 600, numberSize: 220, textW: 300, textAlign: 'left', z: 3, width: '56%' },
  ],
]

const SPREAD_HEIGHTS = [2400, 2300, 2500, 2450]

function CollageSpread({ items, index }: { items: S60Item[]; index: number }) {
  const li = index % SPREAD_LAYOUTS.length
  return (
    <AbsoluteSpread
      items={items}
      placements={SPREAD_LAYOUTS[li]}
      height={SPREAD_HEIGHTS[li]}
    />
  )
}

/* ── Full-bleed section header ────────────────────────── */
function SectionHeader({
  section,
  index,
}: {
  section: (typeof SACRED_60)[number]
  index: number
}) {
  const img = SECTION_IMAGES[section.title]
  const isEven = index % 2 === 0

  return (
    <div className="relative overflow-hidden" style={{ background: '#EDE8E0' }}>
      {/* Full-bleed holding shot when available */}
      <div
        className="relative w-full"
        style={{ minHeight: img ? 600 : 420 }}
      >
        {img ? (
          <Image
            src={img}
            alt={section.title}
            fill
            className="object-cover object-[50%_30%]"
            sizes="100vw"
            priority={index === 0}
          />
        ) : null}

        {/* Lower-third gradient scrim */}
        {img && (
          <div
            className="absolute inset-x-0 bottom-0 z-[1]"
            style={{ height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)' }}
          />
        )}

        {/* Overlay text — white on dark scrim */}
        <div
          className={`relative z-10 flex items-end h-full min-h-[inherit] px-8 md:px-16 py-10 md:py-14 ${isEven ? '' : 'md:justify-end'}`}
        >
          <div className="max-w-md">
            <h2
              className="font-serif font-normal tracking-[0.1em] uppercase"
              style={{
                fontSize: 'clamp(36px, 6vw, 64px)',
                color: img ? '#FFFFFF' : '#5C4A3A',
              }}
            >
              {section.title}
            </h2>
            <p
              className="font-serif text-[15px] md:text-[17px] mt-4 leading-relaxed"
              style={{ color: img ? '#FFFFFF' : '#5C4A3A', opacity: img ? 0.85 : 0.75 }}
            >
              {section.description}
            </p>
          </div>
        </div>
      </div>

      {/* Pull quote */}
      <div
        className="text-center py-10 md:py-14 px-6"
        style={{ background: '#FAF7F2' }}
      >
        <p
          className="font-serif italic text-lg md:text-xl max-w-xl mx-auto"
          style={{ color: '#5C4A3A', opacity: 0.5 }}
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
          {/* ─── Cover Hero ──────────────────────────────────── */}
          <header className="relative overflow-hidden" style={{ minHeight: '85vh' }}>
            <Image
              src="/content/sacred60/section_cover.jpg"
              alt="Sigourney Cantelo"
              fill
              className="object-cover object-[50%_20%]"
              sizes="100vw"
              priority
            />
            {/* Lower-third gradient for title text */}
            <div
              className="absolute inset-x-0 bottom-0 z-[1]"
              style={{ height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}
            />
            <div className="relative z-10 flex items-end justify-center h-full min-h-[85vh] pb-12 md:pb-16 px-6 text-center">
              <div>
                <p
                  className="font-sans text-[9px] tracking-[0.4em] uppercase font-medium mb-4"
                  style={{ color: '#FFFFFF', opacity: 0.7 }}
                >
                  Beauticate
                </p>
                <h1
                  className="font-serif font-normal tracking-[0.15em] uppercase text-white"
                  style={{ fontSize: 'clamp(42px,7vw,72px)' }}
                >
                  Sacred
                </h1>
                <span
                  className="block font-serif font-light leading-none -mt-2 md:-mt-4 text-white"
                  style={{ fontSize: 'clamp(100px,18vw,200px)', opacity: 0.25 }}
                  aria-hidden
                >
                  60
                </span>
                <p
                  className="font-serif italic text-base md:text-lg text-white -mt-1"
                  style={{ opacity: 0.85 }}
                >
                  Self Care &amp; Wellness Guide
                </p>
              </div>
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
                {/* Full-bleed section header */}
                <SectionHeader section={section} index={si} />

                {/* Spread 1 (items 1-5) */}
                <div className="max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-16">
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
                    style={{ background: '#5C4A3A', color: '#fff' }}
                  >
                    Shop the Edit
                  </Link>
                </div>

                {/* Spread 2 (items 6-10) */}
                {secondFive.length > 0 && (
                  <div className="max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-16">
                    <CollageSpread
                      items={secondFive}
                      index={spreadBase + 1}
                    />
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
