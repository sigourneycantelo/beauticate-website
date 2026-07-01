import Image from 'next/image'

interface Props {
  /** Portrait holding shot — shown full-bleed in its column. */
  src: string
  alt: string
  /** Person's name (gold eyebrow). */
  name: string
  /** Role / title, shown small-caps under the name. */
  role?: string
  /** Which side the portrait sits on — alternate down the page for magazine rhythm. */
  side?: 'left' | 'right'
  /** The quote — rendered as a large italic pull quote. */
  children: React.ReactNode
}

/**
 * Editorial portrait + pull-quote pairing: the holding shot beside the person's
 * quote, set large and italic like a magazine pull quote, the two columns equal
 * height. Alternate `side` down the page for rhythm.
 */
export default function PortraitQuote({ src, alt, name, role, side = 'left', children }: Props) {
  return (
    <figure className="not-prose my-16 grid items-center gap-8 md:gap-14 md:grid-cols-2">
      <div className={side === 'right' ? 'md:order-2' : ''}>
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-tile">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover object-top"
          />
        </div>
      </div>

      <figcaption className={side === 'right' ? 'md:order-1' : ''}>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-1">{name}</p>
        {role && (
          <p className="font-sans text-[10px] tracking-[0.18em] uppercase opacity-50 mb-5">{role}</p>
        )}
        <blockquote className="font-serif italic text-[clamp(17px,1.6vw,23px)] leading-[1.55] text-charcoal [&_a]:text-wine [&_a:hover]:text-charcoal">
          {children}
        </blockquote>
      </figcaption>
    </figure>
  )
}
