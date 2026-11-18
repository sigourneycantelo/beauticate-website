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
  'Skin & Glow': null,
  'Energy & Sleep': '/content/sacred60/section_energy_sleep.jpg',
  'Space & Soul': '/content/sacred60/section_space_soul.jpg',
  'Nourish & Nurture': '/content/sacred60/section_nourish_nurture.jpg',
}

/* Items hidden until replacement images arrive */
const EXCLUDED_ITEMS = new Set([17, 20])

/*
 * Product sizes vary — hero items get bigger images like the PDF flat-lay.
 * Positions within each section: index 0 & 4 are "hero" (large), rest standard.
 */
const HERO_INDICES = new Set([0, 4])

function getProductSize(indexInSection: number) {
  if (HERO_INDICES.has(indexInSection)) return { w: 300, h: 380 }
  return { w: 220, h: 280 }
}

/* Alternating horizontal nudge so products cascade down the centre */
const NUDGE = [0, 30, -20, 40, -10, 15, -30, 25, -5, 20]

/* ── Text block — number beside title (PDF-style), description, button ── */
function TextBlock({
  item,
  align,
}: {
  item: S60Item
  align: 'left' | 'right'
}) {
  const side = align === 'right' ? 'text-right' : 'text-left'
  const btnJustify = align === 'right' ? 'justify-end' : 'justify-start'

  return (
    <div className={`flex flex-col ${side}`} style={{ maxWidth: 280 }}>
      {/* Number + title on same line, PDF-style */}
      <div
        className={`flex items-baseline gap-2 ${
          align === 'right' ? 'justify-end' : 'justify-start'
        }`}
      >
        <span
          className="font-numeral text-chocolate leading-[0.85] select-none flex-shrink-0"
          style={{ fontSize: 120, letterSpacing: '-0.03em' }}
          aria-hidden
        >
          {item.number}.
        </span>
        <h3
          className="font-sans text-[13px] tracking-[0.18em] uppercase font-bold leading-tight"
          style={{ color: '#5C4A3A', maxWidth: 180 }}
        >
          {item.title}
        </h3>
      </div>
      <p
        className="font-serif text-[15px] leading-[1.75] mt-3"
        style={{ color: '#5C4A3A', opacity: 0.78 }}
      >
        {item.description}
      </p>
      <div className={`flex items-center gap-2 flex-wrap mt-4 ${btnJustify}`}>
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
      </div>
      {item.discount && (
        <p className="font-sans text-[10px] mt-1.5" style={{ opacity: 0.4 }}>
          {item.discount}
        </p>
      )}
    </div>
  )
}

/* ── Single item: product in centre column, text to one side ── */
function ItemRow({
  item,
  textSide,
  indexInSection,
}: {
  item: S60Item
  textSide: 'left' | 'right'
  indexInSection: number
}) {
  const size = getProductSize(indexInSection)
  const nudge = NUDGE[indexInSection % NUDGE.length]

  const productImage = (
    <Link
      href={item.url}
      target={item.url.startsWith('http') ? '_blank' : undefined}
      rel={withNoskim(
        item.url.startsWith('http') && !item.isShop
          ? 'noopener noreferrer sponsored'
          : undefined,
        item.url
      )}
      className="group block relative z-10"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt={item.product}
        className="h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        style={{ width: size.w, maxHeight: size.h }}
        loading="lazy"
      />
    </Link>
  )

  return (
    <article
      className="hidden md:grid items-center"
      style={{
        gridTemplateColumns: '1fr auto 1fr',
        gap: '1.5rem',
      }}
    >
      {textSide === 'left' ? (
        <>
          <div className="flex justify-end">
            <TextBlock item={item} align="right" />
          </div>
          <div
            className="flex justify-center"
            style={{ transform: `translateX(${nudge}px)` }}
          >
            {productImage}
          </div>
          <div />
        </>
      ) : (
        <>
          <div />
          <div
            className="flex justify-center"
            style={{ transform: `translateX(${nudge}px)` }}
          >
            {productImage}
          </div>
          <div className="flex justify-start">
            <TextBlock item={item} align="left" />
          </div>
        </>
      )}
    </article>
  )
}

/* ── Mobile item card ──────────────────────────────────── */
function MobileItemCard({ item }: { item: S60Item }) {
  return (
    <article className="md:hidden flex flex-col items-center text-center">
      <Link
        href={item.url}
        target={item.url.startsWith('http') ? '_blank' : undefined}
        rel={withNoskim(
          item.url.startsWith('http') && !item.isShop
            ? 'noopener noreferrer sponsored'
            : undefined,
          item.url
        )}
        className="group block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.product}
          className="h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03] mx-auto"
          style={{ maxWidth: 200, maxHeight: 240 }}
          loading="lazy"
        />
      </Link>
      <div className="flex items-baseline gap-1.5 justify-center mt-4">
        <span
          className="font-numeral text-chocolate leading-[0.85] select-none"
          style={{ fontSize: 56, letterSpacing: '-0.03em' }}
          aria-hidden
        >
          {item.number}.
        </span>
        <h3
          className="font-sans text-[11px] tracking-[0.18em] uppercase font-bold leading-tight"
          style={{ color: '#5C4A3A', maxWidth: 180 }}
        >
          {item.title}
        </h3>
      </div>
      <p
        className="font-serif text-[14px] leading-[1.7] mt-2 px-4"
        style={{ color: '#5C4A3A', opacity: 0.78, maxWidth: 300 }}
      >
        {item.description}
      </p>
      <Link
        href={item.url}
        target={item.url.startsWith('http') ? '_blank' : undefined}
        rel={withNoskim(
          item.url.startsWith('http') && !item.isShop
            ? 'noopener noreferrer sponsored'
            : undefined,
          item.url
        )}
        className="inline-block font-sans text-[9px] tracking-[0.15em] uppercase font-medium px-4 py-2 mt-4 transition-opacity hover:opacity-70"
        style={{
          background: item.isShop ? '#2D5A3D' : '#5C4A3A',
          color: '#fff',
        }}
      >
        {item.isShop ? 'Shop on Beauticate' : 'Shop'}
      </Link>
      {item.discount && (
        <p className="font-sans text-[10px] mt-1.5" style={{ opacity: 0.4 }}>
          {item.discount}
        </p>
      )}
    </article>
  )
}

/* ── Flat-lay grid: products cascade down the centre, text alternates ── */
function ProductGrid({ items }: { items: S60Item[] }) {
  return (
    <div className="relative">
      {/* Desktop: products centre, overlapping, text alternates L/R */}
      <div className="hidden md:block">
        {items.map((item, i) => (
          <div
            key={item.number}
            style={{ marginTop: i === 0 ? 0 : -48 }}
            className="relative"
          >
            <ItemRow
              item={item}
              textSide={i % 2 === 0 ? 'left' : 'right'}
              indexInSection={i}
            />
          </div>
        ))}
      </div>
      {/* Mobile: single column, centred */}
      <div className="md:hidden space-y-14 px-2">
        {items.map(item => (
          <MobileItemCard key={item.number} item={item} />
        ))}
      </div>
    </div>
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
      <div
        className="relative w-full"
        style={{ minHeight: img ? 600 : 420 }}
      >
        {img ? (
          <Image
            src={img}
            alt={section.title}
            fill
            className="object-cover object-[50%_20%]"
            sizes="100vw"
            priority={index === 0}
          />
        ) : null}

        {img && (
          <div
            className="absolute inset-x-0 bottom-0 z-[1]"
            style={{
              height: '55%',
              background:
                'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)',
            }}
          />
        )}

        <div
          className={`relative z-10 flex items-end h-full min-h-[inherit] px-8 md:px-16 py-10 md:py-14 ${
            isEven ? '' : 'md:justify-end'
          }`}
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
              style={{
                color: img ? '#FFFFFF' : '#5C4A3A',
                opacity: img ? 0.85 : 0.75,
              }}
            >
              {section.description}
            </p>
          </div>
        </div>
      </div>

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
          <header
            className="relative overflow-hidden"
            style={{ minHeight: '85vh' }}
          >
            <Image
              src="/content/sacred60/section_cover.jpg"
              alt="Sigourney Cantelo"
              fill
              className="object-cover object-[50%_20%]"
              sizes="100vw"
              priority
            />
            <div
              className="absolute inset-x-0 bottom-0 z-[1]"
              style={{
                height: '50%',
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
              }}
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
                  style={{
                    fontSize: 'clamp(100px,18vw,200px)',
                    opacity: 0.25,
                  }}
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
                    What if beauty wasn&apos;t just about what you put on your
                    face, but how you lived your day?
                  </p>
                  <p>
                    For years, I believed that if I worked harder, optimised
                    better, or found the right product, everything would fall
                    into place. It didn&apos;t.
                  </p>
                  <p>
                    What changed things wasn&apos;t a breakthrough or a single
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
                      It isn&apos;t about doing more. It isn&apos;t about
                      perfection. And it certainly isn&apos;t about trends. Take
                      what resonates. Leave what doesn&apos;t.
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
              It wasn&apos;t a breakthrough. It was small, repeatable rituals.
            </p>
          </div>

          {/* ─── Sections ──────────────────────────────────── */}
          {SACRED_60.map((section, si) => {
            const visibleItems = section.items.filter(
              item => !EXCLUDED_ITEMS.has(item.number)
            )

            return (
              <section key={si}>
                <SectionHeader section={section} index={si} />

                <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
                  <ProductGrid items={visibleItems} />
                </div>

                <div
                  className="text-center py-6"
                  style={{ background: '#FAF7F2' }}
                >
                  <Link
                    href={`/shop/moments/sacred-60-${section.title
                      .toLowerCase()
                      .replace(/\s*&\s*/g, '-')}`}
                    className="font-sans text-[9px] tracking-[0.2em] uppercase font-medium px-5 py-2.5 transition-opacity hover:opacity-70 inline-block"
                    style={{ background: '#5C4A3A', color: '#fff' }}
                  >
                    Shop the Edit
                  </Link>
                </div>
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
                    You don&apos;t need to overhaul your life to feel better.
                  </strong>
                </p>
                <p>
                  Start with one ritual. One habit. One small shift that feels
                  doable.
                </p>
                <p>
                  Return to this guide whenever you need grounding, clarity, or
                  inspiration: it&apos;s designed to meet you where you are.
                </p>
                <p>
                  For deeper conversations, expert interviews, and ongoing edits
                  of what actually works, you&apos;ll find more on Beauticate
                  and on the Beautiful Inside podcast.
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
                  style={{
                    border: '1px solid #5C4A3A',
                    color: '#5C4A3A',
                  }}
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
