import Image from 'next/image'
import Link from 'next/link'

// Greyscale press logos with the "25 Years of Trusted Journalism" trust lines above
// them — one shared credibility block rendered on both the home page and /about so the
// two never drift. Logos link to /press; the trust lines link to /about.
const PRESS_LOGOS: { src?: string; alt: string; text?: string }[] = [
  { src: '/images/press/vogue.png', alt: 'Vogue' },
  { src: '/images/press/marie-claire.png', alt: 'marie claire' },
  { src: '/images/press/daily-telegraph.png', alt: 'The Daily Telegraph' },
  { src: '/images/press/daily-mail.png', alt: 'Daily Mail' },
  { alt: 'Mamamia', text: 'Mamamia' },
]

export default function PressLogoBar({ className = '' }: { className?: string }) {
  return (
    <section className={`max-w-5xl mx-auto px-6 text-center ${className}`}>
      <div className="ptb-trust mb-6">
        <Link href="/about">
          <span className="ptb-trust-line">25 Years of Trusted Journalism</span>
          <span className="ptb-trust-line">Expertly Curated Shop</span>
        </Link>
      </div>
      <Link href="/press" className="group block">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {PRESS_LOGOS.map(logo => (
            <div key={logo.alt} className="relative h-7 w-[120px] opacity-50 group-hover:opacity-70 transition-opacity flex items-center justify-center">
              {logo.src ? (
                <Image src={logo.src} alt={logo.alt} fill className="object-contain" sizes="120px" />
              ) : (
                <span className="font-serif text-[22px] text-charcoal italic whitespace-nowrap">{logo.text}</span>
              )}
            </div>
          ))}
        </div>
      </Link>
    </section>
  )
}
