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
    <figure className="not-prose article-wide my-16 grid items-start gap-8 md:gap-14 md:grid-cols-2">
      <div className={side === 'right' ? 'md:order-2' : ''}>
        <div className="md:sticky md:top-24">
          <div className="relative w-full overflow-hidden rounded-sm">
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={1500}
              sizes="(max-width: 768px) 100vw, 560px"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      <figcaption className={`${side === 'right' ? 'md:order-1' : ''} md:pt-4`}>
        <h3 className="font-serif text-[clamp(32px,3.6vw,52px)] leading-[1.1] text-charcoal mb-1">{name}</h3>
        {role && (
          <p className="font-serif italic text-[clamp(18px,2vw,28px)] leading-[1.3] text-charcoal opacity-50 mb-6">{role}</p>
        )}
        <hr className="border-charcoal/20 w-16 mb-6" />
        <blockquote className="font-serif italic text-[clamp(28px,3.6vw,54px)] leading-[1.32] text-charcoal [&_a]:text-wine [&_a:hover]:text-charcoal">
          {children}
        </blockquote>
      </figcaption>
    </figure>
  )
}
