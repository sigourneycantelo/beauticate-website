import Image from 'next/image'

export interface FounderInset {
  name: string
  image: string
  brand: string
}

interface Props {
  image?: { url: string; altText?: string | null } | null
  eyebrow: string
  title: string
  description?: string | null
  founder?: FounderInset
}

// Full-bleed indulgent hero (Prestige-style): the square image fills the banner with the
// title + description in white, centred over a soft scrim for readability. Square images
// crop symmetrically (centred subject) so there's no awkward slicing. Falls back to a
// clean centred text header when no image is set. Shop collection/category/brand pages only.
function truncate(text: string, max = 250) {
  if (text.length <= max) return text
  const cut = text.lastIndexOf(' ', max)
  return text.slice(0, cut > 0 ? cut : max) + '…'
}

export default function CollectionHero({ image, eyebrow, title, description: rawDesc, founder }: Props) {
  const description = rawDesc ? truncate(rawDesc) : rawDesc
  if (!image) {
    return (
      <header className="text-center max-w-wide mx-auto px-[clamp(20px,6vw,104px)] pt-[clamp(40px,6vw,80px)] pb-[clamp(4px,2vw,16px)]">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-charcoal-light/60">{eyebrow}</p>
        <h1 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1 }}>{title}</h1>
        {(description || founder) && (
          <div className="flex items-stretch justify-center gap-5 mt-5 mx-auto max-w-[54ch]">
            {founder && (
              <div className="shrink-0 flex flex-col items-center">
                <div className="relative overflow-hidden rounded-[2px] flex-1" style={{ width: 120, minHeight: 100 }}>
                  <Image src={founder.image} alt={founder.name} fill sizes="120px" className="object-cover object-[50%_20%]" />
                </div>
                <p className="font-sans mt-1.5 text-center" style={{ fontSize: '10px', letterSpacing: '0.04em', opacity: 0.5 }}>{founder.name}</p>
              </div>
            )}
            {description && (
              <p className={`font-serif text-charcoal-light ${founder ? 'text-left' : ''}`} style={{ fontSize: 'clamp(15px,1.5vw,18px)' }}>{description}</p>
            )}
          </div>
        )}
      </header>
    )
  }

  // Full-bleed square: the square image fills the full width, so it shows whole and large
  // (Shopify-style). A square container + object-cover means no crop and no letterbox.
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: '3 / 2', backgroundColor: '#141210' }}
    >
      <Image src={image.url} alt={image.altText ?? title} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.40) 100%)' }} />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
        <p className="font-sans text-paper/80 mb-3" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase' }}>{eyebrow}</p>
        <h1 className="font-serif font-normal text-paper" style={{ fontSize: 'clamp(38px,5.5vw,66px)', letterSpacing: '0.03em', textShadow: '0 1px 24px rgba(0,0,0,0.28)' }}>{title}</h1>
        {(description || founder) && (
          <div className="flex items-stretch justify-center gap-4 mt-5 max-w-[56ch]">
            {founder && (
              <div className="shrink-0 flex flex-col items-center">
                <div className="relative overflow-hidden rounded-[2px] ring-1 ring-white/20 flex-1" style={{ width: 110, minHeight: 90 }}>
                  <Image src={founder.image} alt={founder.name} fill sizes="110px" className="object-cover object-[50%_20%]" />
                </div>
                <p className="font-sans mt-1 text-center text-paper/70" style={{ fontSize: '10px', letterSpacing: '0.04em' }}>{founder.name}</p>
              </div>
            )}
            {description && (
              <p className={`font-sans text-paper/90 ${founder ? 'text-left' : ''}`} style={{ fontSize: 'clamp(13px,1.4vw,15px)', lineHeight: 1.65 }}>{description}</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
