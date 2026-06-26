import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getVodcastEpisodes } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Beautiful Inside — Podcast by Beauticate',
  description: 'Sigourney Cantelo in conversation with the people shaping beauty, wellness and the way we live. Watch on YouTube or listen on Spotify and Apple Podcasts.',
}

const PLATFORMS = [
  { name: 'YouTube', href: 'https://www.youtube.com/@sigourneycantelo' },
  { name: 'Spotify', href: 'https://open.spotify.com/show/5su7l0yO5Ue0706K2Lzd8q' },
  { name: 'Apple Podcasts', href: 'https://podcasts.apple.com/au/podcast/beautiful-inside-by-beauticate/id1754804721' },
]

const DEFAULT_COVER = 'https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/38363818/38363818-1739270093542-7154f374420cb.jpg'

export default function VodcastPage() {
  const episodes = getVodcastEpisodes()

  return (
    <div className="bg-white">

      {/* Header */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase mb-3" style={{ opacity: 0.45 }}>Podcast</p>
        <h1 className="font-serif font-normal text-[clamp(32px,5vw,52px)] leading-[1.1] mb-5">
          Beautiful Inside
        </h1>
        <p className="font-serif text-[17px] leading-[1.65] max-w-xl mx-auto mb-8" style={{ opacity: 0.68 }}>
          Sigourney Cantelo in conversation with the experts, founders and icons shaping beauty, wellness and the way we live.
        </p>
        <div className="flex justify-center gap-8 flex-wrap">
          {PLATFORMS.map(p => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[10.5px] tracking-[0.18em] uppercase opacity-60 hover:opacity-100 transition-opacity"
              style={{ borderBottom: '1px solid currentColor', paddingBottom: '2px' }}
            >
              {p.name}
            </a>
          ))}
        </div>
      </section>

      {/* Episode grid */}
      <section
        className="max-w-[1200px] mx-auto px-6 pb-20"
        style={{ borderTop: '1px solid rgba(28,26,23,.08)', paddingTop: 'clamp(32px,4vw,56px)' }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          style={{ gap: 'clamp(20px,2.5vw,36px)' }}
        >
          {episodes.map(ep => {
            const f = ep.frontmatter
            const href = `/vodcast/episodes/${f.slug}`
            const image = f.featured_image?.startsWith('/content') ? DEFAULT_COVER : (f.featured_image ?? DEFAULT_COVER)
            const date = new Date(f.date_published).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
            return (
              <article key={f.slug} className="group">
                <Link href={href} className="block">
                  <div
                    className="relative overflow-hidden rounded-[2px] mb-3"
                    style={{ aspectRatio: '1/1', border: '1px solid rgba(28,26,23,.09)' }}
                  >
                    <Image
                      src={image}
                      alt={f.featured_image_alt ?? f.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {f.youtube_video_id && (
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'rgba(0,0,0,.35)' }}
                      >
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                          <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,.9)" />
                          <polygon points="16,13 30,20 16,27" fill="#1C1A17" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="font-sans text-[9px] tracking-[.16em] uppercase mb-1.5" style={{ opacity: 0.45 }}>
                    {date}
                  </p>
                  <h2 className="font-serif font-normal text-[14px] leading-[1.3]">
                    {f.title}
                  </h2>
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      {/* About the show */}
      <section style={{ background: '#FBF9F4', padding: 'clamp(48px,6vw,80px) 0' }}>
        <div className="max-w-4xl mx-auto px-6 md:flex gap-14 items-center">
          <div className="md:w-52 flex-shrink-0 mb-8 md:mb-0">
            <div className="relative overflow-hidden rounded-[2px]" style={{ aspectRatio: '1/1' }}>
              <Image
                src="/images/sigourney-cantelo.jpg"
                alt="Sigourney Cantelo, host of Beautiful Inside by Beauticate"
                fill
                className="object-cover object-top"
                sizes="208px"
              />
            </div>
          </div>
          <div>
            <p className="font-sans text-[9.5px] tracking-[.18em] uppercase mb-3" style={{ opacity: 0.45 }}>Your host</p>
            <h2 className="font-serif font-normal text-[26px] mb-4">Sigourney Cantelo</h2>
            <p className="font-serif text-[16px] leading-[1.7] mb-4" style={{ opacity: 0.7 }}>
              A 25-year beauty journalist and former Beauty &amp; Health Director at Vogue Australia, Sigourney has spent her career getting to know the people who shape the way we think about beauty, wellness and the way we live.
            </p>
            <p className="font-serif text-[16px] leading-[1.7]" style={{ opacity: 0.7 }}>
              Beautiful Inside brings those conversations to life. Honest, in-depth and genuinely useful.
            </p>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-serif font-normal text-[26px] mb-3">Never miss an episode</h2>
          <p className="font-serif text-[15px] leading-[1.65] mb-8" style={{ opacity: 0.6 }}>
            Subscribe on your favourite platform and get new conversations the moment they drop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {PLATFORMS.map(p => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[10px] tracking-[.18em] uppercase px-6 py-3 transition-colors hover:bg-[#1C1A17] hover:text-white"
                style={{ border: '1px solid rgba(28,26,23,.25)' }}
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
