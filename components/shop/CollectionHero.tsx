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

export default function CollectionHero({ image, eyebrow, title, description, founder }: Props) {
  if (!image) {
    return (
      <header className="text-center max-w-wide mx-auto px-[clamp(20px,6vw,104px)] pt-[clamp(40px,6vw,80px)] pb-[clamp(4px,2vw,16px)]">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-charcoal-light/60">{eyebrow}</p>
        <h1 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1 }}>{title}</h1>
        {(description || founder) && (
          <div className="flex items-stretch justify-center gap-6 mt-5 mx-auto max-w-[64ch]">
            {founder && (
              <div className="shrink-0 flex flex-col items-center">
                <div className="relative overflow-hidden rounded-[2px] flex-1" style={{ width: 200, minHeight: 140 }}>
                  <Image src={founder.image} alt={founder.name} fill sizes="200px" className="object-cover object-[50%_20%]" />
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
          <div className="flex items-stretch justify-center gap-5 mt-5 max-w-[64ch]">
            {founder && (
              <div className="shrink-0 flex flex-col items-center">
                <div className="relative overflow-hidden rounded-[2px] ring-1 ring-white/20 flex-1" style={{ width: 180, minHeight: 120 }}>
                  <Image src={founder.image} alt={founder.name} fill sizes="180px" className="object-cover object-[50%_20%]" />
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
