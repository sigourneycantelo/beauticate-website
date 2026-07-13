import Image from 'next/image'

interface Props {
  image?: { url: string; altText?: string | null } | null
  eyebrow: string
  title: string
  description?: string | null
}

// Full-bleed indulgent hero (Prestige-style): the square image fills the banner with the
// title + description in white, centred over a soft scrim for readability. Square images
// crop symmetrically (centred subject) so there's no awkward slicing. Falls back to a
// clean centred text header when no image is set. Shop collection/category/brand pages only.
export default function CollectionHero({ image, eyebrow, title, description }: Props) {
  if (!image) {
    return (
      <header className="text-center max-w-wide mx-auto px-[clamp(20px,6vw,104px)] pt-[clamp(40px,6vw,80px)] pb-[clamp(4px,2vw,16px)]">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-charcoal-light/60">{eyebrow}</p>
        <h1 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1 }}>{title}</h1>
        {description && (
          <p className="font-serif mx-auto mt-4 max-w-[54ch] text-charcoal-light" style={{ fontSize: 'clamp(15px,1.5vw,18px)' }}>{description}</p>
        )}
      </header>
    )
  }

  // Full-bleed square: the square image fills the full width, so it shows whole and large
  // (Shopify-style). A square container + object-cover means no crop and no letterbox.
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: '1 / 1', backgroundColor: '#141210' }}
    >
      <Image src={image.url} alt={image.altText ?? title} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.40) 100%)' }} />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
        <p className="font-sans text-paper/80 mb-3" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase' }}>{eyebrow}</p>
        <h1 className="font-serif font-normal text-paper" style={{ fontSize: 'clamp(38px,5.5vw,66px)', letterSpacing: '0.03em', textShadow: '0 1px 24px rgba(0,0,0,0.28)' }}>{title}</h1>
        {description && (
          <p className="font-sans text-paper/90 mt-4 max-w-[56ch]" style={{ fontSize: 'clamp(13px,1.4vw,15px)', lineHeight: 1.65 }}>{description}</p>
        )}
      </div>
    </section>
  )
}
