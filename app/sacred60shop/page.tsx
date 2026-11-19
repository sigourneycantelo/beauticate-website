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

/* ── Spread layout templates ─────────────────────────────
   Each section has two spreads of ≤5 items, matched to the
   PDF flat-lay composition. Products sit in the centre zone
   (roughly 38–62%) with text in side margins.

   imgX: % from left for image centre
   imgY: px from spread top
   imgW: product width in px
   z: stacking order (higher = in front)
   txtSide: which margin the text floats in
   txtY: optional override for text Y position
*/
type SpreadPos = {
  imgX: number
  imgY: number
  imgW: number
  z: number
  txtSide: 'left' | 'right'
  txtY?: number
}

const SECTION_SPREAD_LAYOUTS: SpreadPos[][][] = [
  /* ── 0  Mind & Mood ───────────────────────── */
  [
    // Spread 1 (items 1–5): moon lamp top-right, journal left with matcha scatter,
    // tingsha bells right, neurofit app centre-low, lion's mane right
    [
      { imgX: 55, imgY: 0,   imgW: 260, z: 3, txtSide: 'right' },
      { imgX: 42, imgY: 220, imgW: 240, z: 2, txtSide: 'left' },
      { imgX: 58, imgY: 380, imgW: 170, z: 4, txtSide: 'right' },
      { imgX: 46, imgY: 560, imgW: 200, z: 3, txtSide: 'left' },
      { imgX: 56, imgY: 760, imgW: 160, z: 2, txtSide: 'right' },
    ],
    // Spread 2 (items 6–10): pulsetto top, infraredi tall right, manifest journal centre,
    // mindvalley app lower-left, palo santo + hourglass right
    [
      { imgX: 48, imgY: 0,   imgW: 220, z: 3, txtSide: 'left' },
      { imgX: 58, imgY: 60,  imgW: 160, z: 2, txtSide: 'right', txtY: 160 },
      { imgX: 46, imgY: 280, imgW: 220, z: 4, txtSide: 'left' },
      { imgX: 44, imgY: 530, imgW: 180, z: 3, txtSide: 'left', txtY: 580 },
      { imgX: 56, imgY: 680, imgW: 280, z: 2, txtSide: 'right' },
    ],
  ],
  /* ── 1  Body & Balance ────────────────────── */
  [
    // Spread 1 (items 11–15): cork ball HERO top-centre, dance (no product) right,
    // salt flakes left with crystal scatter, grounding mat bottom-left, ashaya oil right tall
    [
      { imgX: 52, imgY: 0,   imgW: 320, z: 3, txtSide: 'left' },
      { imgX: 56, imgY: 160, imgW: 180, z: 2, txtSide: 'right' },
      { imgX: 44, imgY: 320, imgW: 200, z: 4, txtSide: 'left' },
      { imgX: 46, imgY: 540, imgW: 280, z: 2, txtSide: 'left', txtY: 640 },
      { imgX: 58, imgY: 400, imgW: 160, z: 3, txtSide: 'right', txtY: 540 },
    ],
    // Spread 2 (items 16, 18, 19 — 17 & 20 excluded): theragun HERO, dumbbells, neck massager
    [
      { imgX: 50, imgY: 0,   imgW: 340, z: 3, txtSide: 'left' },
      { imgX: 46, imgY: 350, imgW: 240, z: 2, txtSide: 'left' },
      { imgX: 58, imgY: 440, imgW: 240, z: 4, txtSide: 'right' },
      { imgX: 46, imgY: 650, imgW: 260, z: 2, txtSide: 'left' },
      { imgX: 55, imgY: 850, imgW: 220, z: 3, txtSide: 'right' },
    ],
  ],
  /* ── 2  Skin & Glow ───────────────────────── */
  [
    // Spread 1 (items 21–25): LED mask HERO top-right, dermalogica tall left,
    // muji oil centre-right, gua sha bottom-left, UV SPF bottom-right with cream blob
    [
      { imgX: 55, imgY: 0,   imgW: 280, z: 3, txtSide: 'right' },
      { imgX: 42, imgY: 100, imgW: 200, z: 2, txtSide: 'left', txtY: 180 },
      { imgX: 56, imgY: 360, imgW: 180, z: 4, txtSide: 'right' },
      { imgX: 42, imgY: 560, imgW: 220, z: 3, txtSide: 'left' },
      { imgX: 56, imgY: 760, imgW: 240, z: 2, txtSide: 'right' },
    ],
    // Spread 2 (items 26–30): micro-infusion tall centre, body brush LARGE right,
    // weleda centre-left, qure neck LED right, aesop hydrosol bottom
    [
      { imgX: 46, imgY: 0,   imgW: 180, z: 3, txtSide: 'left' },
      { imgX: 58, imgY: 0,   imgW: 300, z: 2, txtSide: 'right', txtY: 60 },
      { imgX: 44, imgY: 340, imgW: 220, z: 4, txtSide: 'left' },
      { imgX: 58, imgY: 380, imgW: 220, z: 3, txtSide: 'right', txtY: 440 },
      { imgX: 46, imgY: 620, imgW: 180, z: 2, txtSide: 'left' },
    ],
  ],
  /* ── 3  Energy & Sleep ────────────────────── */
  [
    // Spread 1 (items 31–35): weighted blanket HERO top, magnesium right,
    // mouth tape left, silk pillowcase centre, eye mask bottom
    [
      { imgX: 52, imgY: 0,   imgW: 340, z: 3, txtSide: 'left' },
      { imgX: 58, imgY: 220, imgW: 180, z: 2, txtSide: 'right' },
      { imgX: 42, imgY: 300, imgW: 160, z: 4, txtSide: 'left' },
      { imgX: 54, imgY: 480, imgW: 240, z: 3, txtSide: 'right' },
      { imgX: 44, imgY: 680, imgW: 200, z: 2, txtSide: 'left' },
    ],
    // Spread 2 (items 36–40): bedgear pillow top, baja gold salt right with scatter,
    // welleco elixir centre-left tall, sleep journal right, castor oil bottom tall
    [
      { imgX: 48, imgY: 0,   imgW: 240, z: 3, txtSide: 'left' },
      { imgX: 58, imgY: 0,   imgW: 220, z: 2, txtSide: 'right', txtY: 60 },
      { imgX: 44, imgY: 280, imgW: 200, z: 4, txtSide: 'left' },
      { imgX: 58, imgY: 350, imgW: 160, z: 3, txtSide: 'right' },
      { imgX: 48, imgY: 540, imgW: 200, z: 2, txtSide: 'left' },
    ],
  ],
  /* ── 4  Space & Soul ──────────────────────── */
  [
    // Spread 1 (items 41–45): marble hand right, greenpan left, food cycler centre-left,
    // bala bangles right, chopping board bottom-centre
    [
      { imgX: 58, imgY: 0,   imgW: 200, z: 3, txtSide: 'right' },
      { imgX: 44, imgY: 60,  imgW: 260, z: 2, txtSide: 'left', txtY: 160 },
      { imgX: 46, imgY: 360, imgW: 200, z: 4, txtSide: 'left' },
      { imgX: 58, imgY: 400, imgW: 220, z: 3, txtSide: 'right' },
      { imgX: 48, imgY: 640, imgW: 280, z: 2, txtSide: 'left' },
    ],
    // Spread 2 (items 46–50): pill organiser left, steam sauna HERO right,
    // LED mask display centre-left, hourglass timer right, candle bottom
    [
      { imgX: 44, imgY: 0,   imgW: 200, z: 3, txtSide: 'left' },
      { imgX: 58, imgY: 0,   imgW: 300, z: 2, txtSide: 'right', txtY: 100 },
      { imgX: 44, imgY: 320, imgW: 220, z: 4, txtSide: 'left' },
      { imgX: 58, imgY: 400, imgW: 160, z: 3, txtSide: 'right' },
      { imgX: 48, imgY: 580, imgW: 260, z: 2, txtSide: 'left' },
    ],
  ],
  /* ── 5  Nourish & Nurture ─────────────────── */
  [
    // Spread 1 (items 51–55): maison balzac carafe centre-left tall, kurk tall right,
    // calmerceuticals collagen centre, koala eco right, jshealth fish oil bottom
    [
      { imgX: 46, imgY: 0,   imgW: 200, z: 3, txtSide: 'left' },
      { imgX: 58, imgY: 0,   imgW: 200, z: 2, txtSide: 'right', txtY: 80 },
      { imgX: 46, imgY: 320, imgW: 240, z: 4, txtSide: 'left' },
      { imgX: 58, imgY: 440, imgW: 180, z: 3, txtSide: 'right' },
      { imgX: 46, imgY: 620, imgW: 180, z: 2, txtSide: 'left' },
    ],
    // Spread 2 (items 56–60): hydrogen water cup top, herb garden right,
    // fire diffuser centre-left, tongue scraper right, acupressure mat bottom
    [
      { imgX: 48, imgY: 0,   imgW: 220, z: 3, txtSide: 'left' },
      { imgX: 58, imgY: 100, imgW: 240, z: 2, txtSide: 'right' },
      { imgX: 44, imgY: 340, imgW: 220, z: 4, txtSide: 'left' },
      { imgX: 58, imgY: 450, imgW: 160, z: 3, txtSide: 'right' },
      { imgX: 48, imgY: 620, imgW: 280, z: 2, txtSide: 'left' },
    ],
  ],
]

const FALLBACK_LAYOUT: SpreadPos[] = [
  { imgX: 50, imgY: 0,   imgW: 260, z: 2, txtSide: 'right' },
  { imgX: 44, imgY: 220, imgW: 220, z: 3, txtSide: 'left' },
  { imgX: 56, imgY: 440, imgW: 200, z: 4, txtSide: 'right' },
  { imgX: 48, imgY: 600, imgW: 300, z: 1, txtSide: 'left', txtY: 680 },
  { imgX: 52, imgY: 920, imgW: 240, z: 2, txtSide: 'right' },
]

/* ── Text block for spread layout ── */
function SpreadTextBlock({
  item,
  side,
}: {
  item: S60Item
  side: 'left' | 'right'
}) {
  const txtAlign = side === 'left' ? 'text-center' : 'text-left'
  const numJustify = side === 'left' ? 'justify-center' : 'justify-start'
  const btnJustify = side === 'left' ? 'justify-center' : 'justify-start'

  return (
    <div className={`flex flex-col ${txtAlign}`} style={{ maxWidth: 260 }}>
      <div className={`flex items-baseline gap-2 ${numJustify} flex-wrap`}>
        <span
          className="font-numeral text-chocolate leading-[0.85] select-none flex-shrink-0"
          style={{ fontSize: 120, letterSpacing: '-0.03em' }}
          aria-hidden
        >
          {item.number}.
        </span>
        <h3
          className="font-sans text-[13px] tracking-[0.18em] uppercase font-bold leading-tight"
          style={{ color: '#5C4A3A', maxWidth: 170 }}
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

/* ── Decorative textural elements per section ── */
type TextureEl = {
  x: string; y: string; w: string; h: string; opacity: number; rotate?: number
  bg: string
}

const SECTION_TEXTURES: TextureEl[][] = [
  /* 0 Mind & Mood — matcha powder scatter, cinnamon sticks */
  [
    { x: '8%', y: '180px', w: '120px', h: '120px', opacity: 0.12, rotate: -15,
      bg: 'radial-gradient(circle, #7a9a6e 0%, #7a9a6e 30%, transparent 70%)' },
    { x: '78%', y: '640px', w: '100px', h: '80px', opacity: 0.10, rotate: 25,
      bg: 'linear-gradient(135deg, #8B6914 0%, #A67C2E 50%, transparent 100%)' },
    { x: '15%', y: '800px', w: '60px', h: '60px', opacity: 0.08,
      bg: 'radial-gradient(circle, #7a9a6e 0%, transparent 60%)' },
  ],
  /* 1 Body & Balance — salt crystals, golden oil drip */
  [
    { x: '12%', y: '300px', w: '140px', h: '100px', opacity: 0.10, rotate: 10,
      bg: 'radial-gradient(ellipse, rgba(220,215,205,0.8) 0%, rgba(200,195,180,0.4) 40%, transparent 70%)' },
    { x: '80%', y: '400px', w: '40px', h: '180px', opacity: 0.14,
      bg: 'linear-gradient(180deg, #C9A84C 0%, #E8C96A 40%, transparent 100%)' },
    { x: '25%', y: '100px', w: '80px', h: '80px', opacity: 0.07,
      bg: 'radial-gradient(circle, rgba(210,205,195,0.6) 0%, transparent 60%)' },
  ],
  /* 2 Skin & Glow — white cream swirl */
  [
    { x: '75%', y: '700px', w: '160px', h: '140px', opacity: 0.12, rotate: -20,
      bg: 'radial-gradient(ellipse at 40% 50%, rgba(255,255,255,0.9) 0%, rgba(245,240,235,0.5) 40%, transparent 70%)' },
    { x: '10%', y: '400px', w: '100px', h: '100px', opacity: 0.08,
      bg: 'radial-gradient(circle, rgba(240,235,228,0.6) 0%, transparent 60%)' },
  ],
  /* 3 Energy & Sleep — salt scatter */
  [
    { x: '78%', y: '50px', w: '110px', h: '90px', opacity: 0.10, rotate: 15,
      bg: 'radial-gradient(ellipse, rgba(220,215,205,0.7) 0%, rgba(200,195,180,0.3) 40%, transparent 70%)' },
    { x: '5%', y: '500px', w: '80px', h: '60px', opacity: 0.06,
      bg: 'radial-gradient(circle, rgba(210,205,195,0.5) 0%, transparent 60%)' },
  ],
  /* 4 Space & Soul — lava rocks, warm glow */
  [
    { x: '70%', y: '580px', w: '130px', h: '100px', opacity: 0.10, rotate: 5,
      bg: 'radial-gradient(ellipse, rgba(80,60,50,0.4) 0%, rgba(60,45,35,0.2) 40%, transparent 70%)' },
    { x: '8%', y: '200px', w: '90px', h: '90px', opacity: 0.07,
      bg: 'radial-gradient(circle, rgba(200,170,120,0.3) 0%, transparent 60%)' },
  ],
  /* 5 Nourish & Nurture — herb scatter, warm tones */
  [
    { x: '80%', y: '100px', w: '100px', h: '100px', opacity: 0.10, rotate: -10,
      bg: 'radial-gradient(circle, #7a9a6e 0%, #7a9a6e 20%, transparent 60%)' },
    { x: '10%', y: '500px', w: '80px', h: '60px', opacity: 0.08, rotate: 30,
      bg: 'radial-gradient(ellipse, rgba(140,120,80,0.4) 0%, transparent 60%)' },
  ],
]

/* ── Absolute-positioned flat-lay spread (5 items) ── */
function FlatLaySpread({
  items,
  layout,
  textures,
}: {
  items: S60Item[]
  layout: SpreadPos[]
  textures?: TextureEl[]
}) {
  const count = Math.min(items.length, layout.length)
  const lastPos = layout[count - 1]
  const containerH = (lastPos?.imgY ?? 0) + 580

  return (
    <div className="relative w-full" style={{ height: containerH }}>
      {textures?.map((t, ti) => (
        <div
          key={`tex-${ti}`}
          className="absolute pointer-events-none"
          style={{
            left: t.x, top: t.y, width: t.w, height: t.h,
            opacity: t.opacity,
            transform: t.rotate ? `rotate(${t.rotate}deg)` : undefined,
            background: t.bg,
            borderRadius: '50%',
            zIndex: 1,
          }}
          aria-hidden
        />
      ))}
      {items.slice(0, count).map((item, i) => {
        const pos = layout[i]
        const txtY = pos.txtY ?? pos.imgY

        return (
          <React.Fragment key={item.number}>
            {/* Product image — absolute, centred on imgX */}
            <div
              className="absolute"
              style={{
                left: `${pos.imgX}%`,
                top: pos.imgY,
                transform: 'translateX(-50%)',
                zIndex: pos.z + 10,
              }}
            >
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
                  className="h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{ width: pos.imgW }}
                  loading="lazy"
                />
              </Link>
            </div>

            {/* Text block — absolute, in the margin */}
            <div
              className="absolute"
              style={{
                top: txtY,
                zIndex: pos.z,
                ...(pos.txtSide === 'left'
                  ? { left: 0, width: '28%', display: 'flex', justifyContent: 'flex-end' }
                  : { right: 0, width: '28%' }),
                padding: '0 12px',
              }}
            >
              <SpreadTextBlock item={item} side={pos.txtSide} />
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

/* ── Mobile item card ── */
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

/* ── Product grid: splits items into spreads of 5 ── */
function ProductGrid({ items, sectionIndex }: { items: S60Item[]; sectionIndex: number }) {
  const chunks: S60Item[][] = []
  for (let i = 0; i < items.length; i += 5) {
    chunks.push(items.slice(i, i + 5))
  }

  const sectionLayouts = SECTION_SPREAD_LAYOUTS[sectionIndex] ?? [FALLBACK_LAYOUT, FALLBACK_LAYOUT]
  const textures = SECTION_TEXTURES[sectionIndex]

  return (
    <div className="relative">
      {/* Desktop: absolute-positioned flat-lay spreads */}
      <div className="hidden md:block" style={{ maxWidth: 1000, margin: '0 auto' }}>
        {chunks.map((chunk, ci) => (
          <FlatLaySpread
            key={ci}
            items={chunk}
            layout={sectionLayouts[ci] ?? FALLBACK_LAYOUT}
            textures={ci === 0 ? textures : undefined}
          />
        ))}
      </div>
      {/* Mobile: single column */}
      <div className="md:hidden space-y-14 px-2">
        {items.map(item => (
          <MobileItemCard key={item.number} item={item} />
        ))}
      </div>
    </div>
  )
}

/* ── Full-bleed section header ── */
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

                <div className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
                  <ProductGrid items={visibleItems} sectionIndex={si} />
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
