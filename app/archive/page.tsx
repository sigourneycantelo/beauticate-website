import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'From the Archive',
  description: 'Selected work from Sigourney Cantelo’s years in print — Vogue Australia, Studio, Body+Soul and New Woman.',
}

interface Feature {
  title: string
  image: string
  href: string
}

const VOGUE: Feature[] = [
  { title: 'Interviewing Lady Gaga & Cyndi Lauper for M·A·C in New York', image: '/images/archive/lady-gaga-cyndi-lauper.jpg', href: '/archive/lady-gaga-cyndi-lauper.pdf' },
  { title: 'Interviewing Rihanna in Barbados for M·A·C', image: '/images/archive/rihanna-mac.jpg', href: '/archive/rihanna-mac.pdf' },
  { title: 'The Claudia Schiffer Interview', image: '/images/archive/claudia-schiffer.jpg', href: '/archive/claudia-schiffer.pdf' },
  { title: 'Interviewing Cate Blanchett in Milan for Giorgio Armani', image: '/images/archive/cate-blanchett.jpg', href: '/archive/cate-blanchett.pdf' },
  { title: 'Interviewing Christopher Bailey for Burberry in London', image: '/images/archive/burberry.jpg', href: '/archive/burberry.pdf' },
  { title: 'Lunch at Aerin Lauder’s Hamptons House', image: '/images/archive/estee-lauder.jpg', href: '/archive/estee-lauder.pdf' },
  { title: 'A Jo Malone Launch In London', image: '/images/archive/jo-malone.jpg', href: '/archive/jo-malone.pdf' },
  { title: 'Visiting The South of France with Dior', image: '/images/archive/dior-grasse.jpg', href: '/archive/dior-grasse.pdf' },
  { title: 'A shoot with Rae Morris', image: '/images/archive/in-bloom.jpg', href: '/archive/in-bloom.pdf' },
  { title: 'A Shoot with Shu Uemura’s Uchiide San', image: '/images/archive/shu-uemura.jpg', href: '/archive/shu-uemura.pdf' },
  { title: 'Coming Clean', image: '/images/archive/coming-clean.jpg', href: '/archive/coming-clean.pdf' },
  { title: 'In the Raw', image: '/images/archive/in-the-raw.jpg', href: '/archive/in-the-raw.pdf' },
  { title: 'I learned Vedic Meditation', image: '/images/archive/zen-again.jpg', href: '/archive/zen-again.pdf' },
  { title: 'The Ultimate Guide to Fragrance', image: '/images/archive/ultimate-guide-fragrance.jpg', href: '/archive/ultimate-guide-fragrance.pdf' },
  { title: 'Perfume Passport', image: '/images/archive/perfume-passport.jpg', href: '/archive/perfume-passport.pdf' },
  { title: 'Nouveau Niche', image: '/images/archive/nouveau-niche.jpg', href: '/archive/nouveau-niche.pdf' },
  { title: 'Night Moves', image: '/images/archive/night-moves.jpg', href: '/archive/night-moves.pdf' },
  { title: 'Tricks of the Trade', image: '/images/archive/tricks-of-the-trade.jpg', href: '/archive/tricks-of-the-trade.pdf' },
  { title: 'Karma Chameleon', image: '/images/archive/karma-chameleon.jpg', href: '/archive/karma-chameleon.pdf' },
  { title: 'Indo I Did', image: '/images/archive/indo-i-did.jpg', href: '/archive/indo-i-did.pdf' },
  { title: 'Paradise Found at Song Saa', image: '/images/archive/paradise-found-song-saa.jpg', href: '/archive/paradise-found-song-saa.pdf' },
  { title: 'Sweet Retreat', image: '/images/archive/sweet-retreat.jpg', href: '/archive/sweet-retreat.pdf' },
]

const VOGUE_ONLINE: Feature[] = [
  { title: 'How Not To Get A Suntan In Paris', image: '', href: 'https://www.vogue.com.au/beauty/skin/how-not-to-get-a-suntan-in-paris/news-story/a2a52a5c4d76cc2cc0129a0194539fef' },
  { title: 'Vogue Road Tests Mineral Makeup', image: '', href: 'https://www.vogue.com.au/beauty/makeup/vogue-roadtests-mineral-makeup/news-story/cd1698343c42b5622e072203b057918b' },
]

const STUDIO: Feature[] = [
  { title: 'Behind the Scenes', image: '/images/archive/studio-behind-the-scenes.jpg', href: '/archive/studio-behind-the-scenes.pdf' },
  { title: 'Florence', image: '/images/archive/studio-florence.jpg', href: '/archive/studio-florence.pdf' },
  { title: 'Honeymoons Worth the Trip', image: '/images/archive/studio-honeymoons.jpg', href: '/archive/studio-honeymoons.pdf' },
  { title: 'Thailand', image: '/images/archive/studio-thailand.jpg', href: '/archive/studio-thailand.pdf' },
]

const BODYSOUL: Feature[] = [
  { title: '6 Beauty Tips from Mum', image: '/images/archive/bs-beauty-tips-mum.jpg', href: '/archive/bs-beauty-tips-mum.pdf' },
  { title: 'Good Hair Day', image: '/images/archive/bs-good-hair-day.jpg', href: '/archive/bs-good-hair-day.pdf' },
  { title: 'Keep Your Hands Young', image: '/images/archive/bs-hands-aging.jpg', href: '/archive/bs-hands-aging.pdf' },
  { title: 'Beauty From Within', image: '/images/archive/bs-inner-outer-beauty.jpg', href: '/archive/bs-inner-outer-beauty.pdf' },
  { title: 'Look Fresh', image: '/images/archive/bs-may-2014.jpg', href: '/archive/bs-may-2014.pdf' },
]

// New Woman features are wide double-page spreads.
const NEW_WOMAN: Feature[] = [
  { title: 'Scents of Style', image: '/images/archive/new-woman-1.jpg', href: '/archive/new-woman-1.pdf' },
  { title: 'Protect Your Assets', image: '/images/archive/new-woman-2.jpg', href: '/archive/new-woman-2.pdf' },
  { title: 'Skin Doctor', image: '/images/archive/new-woman-3.jpg', href: '/archive/new-woman-3.pdf' },
]

function FeatureCard({ f }: { f: Feature }) {
  return (
    <a href={f.href} target="_blank" rel="noopener noreferrer" className="group block">
      <div className="relative overflow-hidden rounded-[2px] bg-cream-100" style={{ aspectRatio: '3/4' }}>
        <Image
          src={f.image}
          alt={f.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-top transition-transform duration-[800ms] group-hover:scale-[1.03]"
        />
      </div>
      <h2 className="font-serif font-normal mt-4" style={{ fontSize: 'clamp(19px,2vw,24px)' }}>{f.title}</h2>
      <span className="inline-block mt-2 font-sans text-[9.5px] tracking-[0.2em] uppercase opacity-45 group-hover:opacity-80 transition-opacity">
        View the feature &rarr;
      </span>
    </a>
  )
}

function WideCard({ f }: { f: Feature }) {
  return (
    <a href={f.href} target="_blank" rel="noopener noreferrer" className="group block">
      <div className="relative overflow-hidden rounded-[2px] bg-cream-100" style={{ aspectRatio: '3/2' }}>
        <Image
          src={f.image}
          alt={f.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.03]"
        />
      </div>
      <h2 className="font-serif font-normal mt-4" style={{ fontSize: 'clamp(19px,2vw,24px)' }}>{f.title}</h2>
      <span className="inline-block mt-2 font-sans text-[9.5px] tracking-[0.2em] uppercase opacity-45 group-hover:opacity-80 transition-opacity">
        View the feature &rarr;
      </span>
    </a>
  )
}

function FeatureGrid({ items }: { items: Feature[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[clamp(24px,4vw,56px)] gap-y-[clamp(36px,4vw,56px)]">
      {items.map(f => <FeatureCard key={f.href} f={f} />)}
    </div>
  )
}

function WideGrid({ items }: { items: Feature[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[clamp(24px,4vw,56px)] gap-y-[clamp(36px,4vw,56px)]">
      {items.map(f => <WideCard key={f.href} f={f} />)}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mt-[clamp(52px,6vw,96px)] mb-[clamp(28px,4vw,48px)]">
      <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase', opacity: 0.5 }}>
        {children}
      </p>
    </div>
  )
}

export default function ArchivePage() {
  return (
    <div className="max-w-wide mx-auto px-[clamp(20px,6vw,104px)] py-[clamp(48px,7vw,96px)]">
      <header className="text-center mb-[clamp(20px,3vw,40px)]">
        <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase', opacity: 0.5 }}>
          Selected work
        </p>
        <h1 className="font-serif italic font-normal mt-1" style={{ fontSize: 'clamp(40px,6vw,72px)', lineHeight: 1 }}>
          From the Archive
        </h1>
        <p className="font-serif mx-auto mt-5 max-w-[54ch]" style={{ fontSize: 'clamp(15px,1.5vw,18px)', opacity: 0.7 }}>
          Two decades of beauty, wellness and travel writing — from Vogue Australia, where Sigourney
          was Beauty &amp; Health Director, to Studio, Body+Soul and New Woman.
        </p>
      </header>

      <SectionLabel>Vogue Australia</SectionLabel>
      <FeatureGrid items={VOGUE} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[clamp(28px,4vw,64px)] gap-y-[clamp(24px,3vw,36px)] max-w-3xl mx-auto mt-[clamp(36px,4vw,56px)]">
        {VOGUE_ONLINE.map(f => (
          <a key={f.href} href={f.href} target="_blank" rel="noopener noreferrer" className="group block border-t border-cream-200 pt-5">
            <p className="font-sans" style={{ fontSize: '10.5px', letterSpacing: '0.26em', textTransform: 'uppercase', opacity: 0.55 }}>Vogue Australia · Online</p>
            <h2 className="font-serif font-normal mt-2 group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]" style={{ fontSize: 'clamp(18px,1.8vw,22px)', lineHeight: 1.25 }}>{f.title}</h2>
            <span className="inline-block mt-3 font-sans text-[9.5px] tracking-[0.2em] uppercase opacity-45 group-hover:opacity-80 transition-opacity">Read &rarr;</span>
          </a>
        ))}
      </div>

      <SectionLabel>Studio</SectionLabel>
      <FeatureGrid items={STUDIO} />

      <SectionLabel>Body+Soul</SectionLabel>
      <FeatureGrid items={BODYSOUL} />

      <SectionLabel>New Woman</SectionLabel>
      <WideGrid items={NEW_WOMAN} />
    </div>
  )
}
