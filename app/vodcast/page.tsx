import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beautiful Inside — Vodcast by Beauticate',
  description: 'Sigourney Cantelo in conversation with the people shaping beauty, wellness and the way we live. Watch on YouTube or listen on Spotify and Apple Podcasts.',
}

const PLATFORMS = [
  { name: 'YouTube', href: 'https://www.youtube.com/@beauticate' },
  { name: 'Spotify', href: 'https://open.spotify.com/show/5su7l0yO5Ue0706K2Lzd8q' },
  { name: 'Apple Podcasts', href: 'https://podcasts.apple.com/au/podcast/beautiful-inside-by-beauticate/id1754804721' },
]

// YouTube playlist ID for Beautiful Inside — update as needed
const PLAYLIST_ID = 'PLsXQqYVAGxCr1YwEBqSq0H6MCPEApb8pF'

export default function VodcastPage() {
  return (
    <div className="bg-white">

      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-3">Vodcast</p>
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight mb-5">
          Beautiful Inside
        </h1>
        <p className="font-serif text-lg text-charcoal/60 max-w-xl mx-auto leading-relaxed mb-8">
          Sigourney Cantelo in conversation with the experts, founders and icons shaping beauty, wellness and the way we live.
        </p>
        <div className="flex justify-center gap-8 flex-wrap">
          {PLATFORMS.map(p => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal hover:text-gold transition-colors border-b border-charcoal/20 hover:border-gold pb-0.5"
            >
              {p.name}
            </a>
          ))}
        </div>
      </section>

      {/* YouTube playlist embed */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="relative w-full aspect-video bg-charcoal overflow-hidden shadow-lg">
          <iframe
            src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&rel=0&modestbranding=1`}
            title="Beautiful Inside by Beauticate — All Episodes"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 text-center mt-4">
          All episodes · Updated regularly
        </p>
      </section>

      {/* About the show */}
      <section className="bg-[#f7f5f2] py-16">
        <div className="max-w-4xl mx-auto px-6 md:flex gap-14 items-center">
          <div className="md:w-56 flex-shrink-0 mb-8 md:mb-0">
            <div className="relative aspect-square bg-cream overflow-hidden">
              <Image
                src="/images/sigourney-cantelo.jpg"
                alt="Sigourney Cantelo, host of Beautiful Inside by Beauticate"
                fill
                className="object-cover object-top"
                sizes="224px"
              />
            </div>
          </div>
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-3">Your host</p>
            <h2 className="font-serif text-2xl text-charcoal mb-4">Sigourney Cantelo</h2>
            <p className="font-serif text-base text-charcoal/70 leading-relaxed mb-4">
              A 25-year beauty journalist and former Beauty &amp; Health Director at Vogue Australia, Sigourney has spent her career getting to know the people who shape the way we think about beauty, wellness and the way we live.
            </p>
            <p className="font-serif text-base text-charcoal/70 leading-relaxed">
              Beautiful Inside brings those conversations to life — honest, in-depth and genuinely useful.
            </p>
            <Link
              href="/about"
              className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal border-b border-charcoal/30 pb-0.5 hover:text-gold hover:border-gold transition-colors mt-6 inline-block"
            >
              About Sigourney
            </Link>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-14 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-serif text-2xl text-charcoal mb-3">Never miss an episode</h2>
          <p className="font-serif text-sm text-charcoal/60 mb-8 leading-relaxed">
            Subscribe on your favourite platform and get new conversations the moment they drop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {PLATFORMS.map(p => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[11px] tracking-[0.2em] uppercase border border-charcoal/20 text-charcoal px-6 py-3 hover:bg-charcoal hover:text-cream transition-colors"
              >
                {p.name}
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
