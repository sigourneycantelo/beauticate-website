import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'From the Archive',
  description: 'Selected beauty features from Sigourney Cantelo’s years as Beauty & Health Director at Vogue Australia.',
}

interface Feature {
  title: string
  meta: string
  image: string
  href: string
}

// Print features — the cover image opens the full multi-page PDF.
const FEATURES: Feature[] = [
  { title: 'In Bloom', meta: 'Vogue Beauty', image: '/images/archive/in-bloom.jpg', href: '/archive/in-bloom.pdf' },
  { title: 'In the Raw', meta: 'Vogue Australia · April 2014', image: '/images/archive/in-the-raw.jpg', href: '/archive/in-the-raw.pdf' },
  { title: 'Coming Clean', meta: 'Vogue Beauty · May 2014', image: '/images/archive/coming-clean.jpg', href: '/archive/coming-clean.pdf' },
]

// Online pieces — link out to the live articles.
const ONLINE: Feature[] = [
  { title: 'How Not To Get A Suntan In Paris', meta: 'Vogue Australia', image: '', href: 'https://www.vogue.com.au/beauty/skin/how-not-to-get-a-suntan-in-paris/news-story/a2a52a5c4d76cc2cc0129a0194539fef' },
  { title: 'Vogue Road Tests Mineral Makeup', meta: 'Vogue Australia', image: '', href: 'https://www.vogue.com.au/beauty/makeup/vogue-roadtests-mineral-makeup/news-story/cd1698343c42b5622e072203b057918b' },
]

export default function ArchivePage() {
  return (
    <div className="max-w-wide mx-auto px-[clamp(20px,6vw,104px)] py-[clamp(48px,7vw,96px)]">
      <header className="text-center mb-[clamp(40px,5vw,72px)]">
        <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase', opacity: 0.5 }}>
          Selected work
        </p>
        <h1 className="font-serif italic font-normal mt-1" style={{ fontSize: 'clamp(40px,6vw,72px)', lineHeight: 1 }}>
          From the Archive
        </h1>
        <p className="font-serif mx-auto mt-5 max-w-[54ch]" style={{ fontSize: 'clamp(15px,1.5vw,18px)', opacity: 0.7 }}>
          Beauty features from Sigourney’s years as Beauty &amp; Health Director at Vogue Australia —
          the writing and editing behind the eye that curates Beauticate today.
        </p>
      </header>

      {/* Print features — cover opens the full PDF */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[clamp(24px,4vw,56px)] gap-y-[clamp(36px,4vw,56px)]">
        {FEATURES.map(f => (
          <a key={f.href} href={f.href} target="_blank" rel="noopener noreferrer" className="group block">
            <div className="relative overflow-hidden rounded-[2px] bg-cream-100" style={{ aspectRatio: '3/4' }}>
              <Image
                src={f.image}
                alt={`${f.title} — ${f.meta}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-top transition-transform duration-[800ms] group-hover:scale-[1.03]"
              />
            </div>
            <h2 className="font-serif font-normal mt-4" style={{ fontSize: 'clamp(20px,2vw,26px)' }}>
              {f.title}
            </h2>
            <p className="font-sans mt-1" style={{ fontSize: '10.5px', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.55 }}>
              {f.meta}
            </p>
            <span className="inline-block mt-3 font-sans text-[9.5px] tracking-[0.2em] uppercase opacity-45 group-hover:opacity-80 transition-opacity">
              View the feature &rarr;
            </span>
          </a>
        ))}
      </div>

      {/* Online pieces */}
      <div className="text-center mt-[clamp(48px,6vw,88px)] mb-[clamp(28px,4vw,48px)]">
        <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase', opacity: 0.5 }}>
          Also for Vogue
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[clamp(28px,4vw,64px)] gap-y-[clamp(24px,3vw,36px)] max-w-3xl mx-auto">
        {ONLINE.map(f => (
          <a key={f.href} href={f.href} target="_blank" rel="noopener noreferrer" className="group block border-t border-cream-200 pt-5">
            <p className="font-sans" style={{ fontSize: '10.5px', letterSpacing: '0.26em', textTransform: 'uppercase', opacity: 0.55 }}>
              {f.meta}
            </p>
            <h2 className="font-serif font-normal mt-2 group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]" style={{ fontSize: 'clamp(18px,1.8vw,22px)', lineHeight: 1.25 }}>
              {f.title}
            </h2>
            <span className="inline-block mt-3 font-sans text-[9.5px] tracking-[0.2em] uppercase opacity-45 group-hover:opacity-80 transition-opacity">
              Read &rarr;
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
