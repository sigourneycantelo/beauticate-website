'use client'
import Image from 'next/image'
import Link from 'next/link'

export interface SacredSixProduct {
  number: number
  name: string
  image: string   // transparent PNG preferred, JPG works too
  url: string
  price?: string
  brand?: string
}

interface Props {
  products: SacredSixProduct[]
  headline: string
  description: string
  category?: string
}

// Fixed collage positions for 6 slots — horizontal scatter, right panel for editorial copy
const SLOTS = [
  { left: '0%',   bottom: '0',  width: '18%', numClass: 'top-0 -translate-y-8 left-0' },
  { left: '15%',  bottom: '8%', width: '11%', numClass: 'top-0 -translate-y-7 left-0' },
  { left: '21%',  top: '4%',   width: '14%', numClass: 'top-0 -translate-y-8 left-0' },
  { left: '34%',  top: '2%',   width: '17%', numClass: 'top-0 -translate-y-8 -left-2' },
  { left: '48%',  bottom: '0', width: '14%', numClass: 'top-0 -translate-y-7 left-0' },
  { left: '59%',  top: '10%',  width: '13%', numClass: 'top-0 -translate-y-8 -left-1' },
]

export default function SacredSix({ products, headline, description }: Props) {
  const items = products.slice(0, 6)

  return (
    <section className="w-full bg-cream-50 border-y border-cream-200 overflow-hidden">
      {/* Collage area + editorial panel */}
      <div className="max-w-wide mx-auto px-4">
        <div className="flex items-stretch min-h-[340px] md:min-h-[400px]">

          {/* Collage — 74% width on desktop */}
          <div className="relative flex-1 hidden md:block">
            {items.map((p, i) => {
              const slot = SLOTS[i]
              return (
                <Link
                  key={i}
                  href={p.url}
                  target={p.url.startsWith('http') ? '_blank' : undefined}
                  rel={p.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="absolute group"
                  style={{
                    left: slot.left,
                    bottom: 'bottom' in slot ? slot.bottom : undefined,
                    top: 'top' in slot ? slot.top : undefined,
                    width: slot.width,
                  }}
                >
                  {/* Number */}
                  <span
                    className={`absolute ${slot.numClass} font-serif text-4xl md:text-5xl leading-none pointer-events-none select-none z-10`}
                    aria-hidden
                  >
                    {p.number}.
                  </span>
                  {/* Product image */}
                  <div className="relative w-full aspect-square">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1200px) 20vw, 15vw"
                    />
                  </div>
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-charcoal text-cream text-[10px] tracking-widest uppercase px-3 py-1.5 whitespace-nowrap pointer-events-none z-20">
                    {p.brand ? `${p.brand} — ` : ''}{p.name}{p.price ? ` · ${p.price}` : ''}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Mobile: horizontal scroll strip */}
          <div className="flex md:hidden gap-4 overflow-x-auto py-6 pb-2 -mx-4 px-4 scrollbar-none">
            {items.map((p, i) => (
              <Link key={i} href={p.url} className="flex-none w-28 text-center group">
                <div className="relative w-28 h-28 mb-2">
                  <span className="absolute -top-4 left-0 font-serif text-3xl leading-none">{p.number}.</span>
                  <Image src={p.image} alt={p.name} fill className="object-contain" sizes="112px" />
                </div>
                {p.price && <p className="text-xs text-charcoal-light">{p.price}</p>}
              </Link>
            ))}
          </div>

          {/* Editorial panel — right ~26% */}
          <div className="hidden md:flex flex-col justify-center pl-6 pr-2 py-10 w-[26%] shrink-0 border-l border-cream-200">
            <h3 className="font-sans text-xl md:text-2xl font-bold uppercase tracking-[0.1em] leading-tight mb-4">
              {headline}
            </h3>
            <p className="font-serif text-sm md:text-base leading-relaxed text-charcoal-light">
              {description}
            </p>
          </div>
        </div>

        {/* Mobile editorial copy below the strip */}
        <div className="md:hidden py-4 pb-8 text-center">
          <h3 className="font-sans text-xl font-bold uppercase tracking-[0.1em] leading-tight mb-2">{headline}</h3>
          <p className="font-serif text-sm leading-relaxed text-charcoal-light">{description}</p>
        </div>
      </div>
    </section>
  )
}
