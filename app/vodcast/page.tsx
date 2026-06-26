import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getVodcastEpisodes } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Beautiful Inside — Podcast by Beauticate',
  description: 'Sigourney Cantelo in conversation with the people shaping beauty, wellness and the way we live. Watch on YouTube or listen on Spotify and Apple Podcasts.',
}

const PLATFORMS = [
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@sigourneycantelo',
    icon: (
      <svg width="20" height="14" viewBox="0 0 24 17" fill="currentColor">
        <path d="M23.495 2.656A3.015 3.015 0 0 0 21.374.516C19.505 0 12 0 12 0S4.495 0 2.626.516A3.015 3.015 0 0 0 .505 2.656C0 4.534 0 8.45 0 8.45s0 3.916.505 5.794a3.015 3.015 0 0 0 2.121 2.14C4.495 16.9 12 16.9 12 16.9s7.505 0 9.374-.516a3.015 3.015 0 0 0 2.121-2.14C24 12.366 24 8.45 24 8.45s0-3.916-.505-5.794zM9.545 12.023V4.877l6.273 3.573-6.273 3.573z" />
      </svg>
    ),
  },
  {
    name: 'Spotify',
    href: 'https://open.spotify.com/show/5su7l0yO5Ue0706K2Lzd8q',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    name: 'Apple Podcasts',
    href: 'https://podcasts.apple.com/au/podcast/beautiful-inside-by-beauticate/id1754804721',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.34 0A5.328 5.328 0 0 0 0 5.34v13.32A5.328 5.328 0 0 0 5.34 24h13.32A5.328 5.328 0 0 0 24 18.66V5.34A5.328 5.328 0 0 0 18.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.878 2.915 2.078 4.718.064.563.077.6.077 1.02 0 .397-.013.44-.077.978-.206 1.87-.917 3.407-2.166 4.657-.746.746-1.51 1.224-2.596 1.63-.536.2-.794.25-1.247.3-.444.05-.776.025-1.096-.073-.696-.21-1.202-.87-1.202-1.59 0-.734.527-1.413 1.253-1.59.25-.057.27-.064.52-.077.37-.02.638-.089.99-.256.89-.428 1.556-1.214 1.876-2.23.128-.41.18-.795.17-1.273-.013-.756-.218-1.4-.647-1.985-.577-.79-1.468-1.28-2.464-1.344-.13-.008-.26-.013-.4-.013-1.37 0-2.52.755-3.054 2.01-.168.396-.24.78-.24 1.312 0 .565.077 1.01.255 1.464.268.69.71 1.22 1.33 1.59.307.18.77.37 1.14.46.282.07.41.172.517.39.09.193.09.39 0 .57-.09.19-.244.32-.46.397-.295.11-.616.08-.88-.05-.77-.38-1.437-.96-1.97-1.72-.77-1.09-1.16-2.41-1.1-3.76.09-2.16 1.15-4.01 2.88-5.11.97-.61 2.08-.93 3.27-.93zm.17 4.085c1.51 0 2.77 1.26 2.77 2.77s-1.26 2.77-2.77 2.77-2.77-1.26-2.77-2.77 1.24-2.77 2.77-2.77zm0 1.1c-.92 0-1.67.75-1.67 1.67s.75 1.67 1.67 1.67 1.67-.75 1.67-1.67-.75-1.67-1.67-1.67z" />
      </svg>
    ),
  },
]

const DEFAULT_COVER = 'https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/38363818/38363818-1739270093542-7154f374420cb.jpg'

function episodeImage(img: string | undefined): string {
  if (!img) return DEFAULT_COVER
  if (img.startsWith('http')) return img
  return img
}

export default function VodcastPage() {
  const episodes = getVodcastEpisodes()
  const [featured, ...rest] = episodes

  return (
    <div className="bg-white">

      {/* ── Masthead ── */}
      <section className="text-center py-14 px-6" style={{ borderBottom: '1px solid rgba(28,26,23,.08)' }}>
        <h1 className="font-serif font-normal text-[clamp(34px,6vw,64px)] leading-[1.05] tracking-[-0.01em] mb-1">
          BEAUTIFUL<br />INSIDE
        </h1>
        <p className="font-sans text-[10.5px] tracking-[.22em] uppercase mb-8" style={{ opacity: 0.45 }}>
          by Beauticate
        </p>
        <p className="font-sans text-[10.5px] tracking-[.2em] uppercase mb-5" style={{ opacity: 0.55 }}>
          Subscribe to the podcast on your favourite platform
        </p>
        <div className="flex justify-center items-center gap-6 flex-wrap">
          {PLATFORMS.map(p => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.name}
              className="flex items-center gap-2 font-sans text-[10px] tracking-[.16em] uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              {p.icon}
              <span>{p.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Intro + featured collage ── */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-0"
        style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,5vw,72px) clamp(20px,6vw,104px)' }}
      >
        {/* Left: cover art + description */}
        <div className="pr-0 md:pr-16 flex flex-col justify-center mb-10 md:mb-0">
          <div className="flex gap-5 items-start mb-7">
            <div className="relative flex-shrink-0 rounded-[2px] overflow-hidden shadow-sm" style={{ width: 100, height: 100 }}>
              <Image src="/images/podcast/cover.jpg" alt="Beautiful Inside by Beauticate podcast cover" fill className="object-cover" sizes="100px" />
            </div>
            <div>
              <p className="font-sans text-[9px] tracking-[.2em] uppercase mb-1.5" style={{ opacity: 0.45 }}>4.9 / 5 on Apple Podcasts</p>
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => <span key={i} className="text-[#1C1A17] text-sm">★</span>)}
              </div>
              <p className="font-sans text-[10px] tracking-[.04em]" style={{ opacity: 0.6 }}>Beautiful, honest conversations.</p>
            </div>
          </div>
          <p className="font-serif text-[18px] leading-[1.7] mb-6" style={{ opacity: 0.75 }}>
            Join us as we go inside the homes, routines and inner lives of fascinating people, discussing the science and psychology of beauty and self-care to give you the tools to look and feel the best you ever have — inside and out.
          </p>
          <p className="font-serif italic text-[20px] leading-[1.55]" style={{ color: '#8E9A82' }}>
            We will be talking to experts and thought leaders to improve our mindset and cultivate our own inner beauty.
          </p>
        </div>

        {/* Right: episode collage */}
        {episodes.length >= 3 && (
          <div className="grid grid-cols-2 gap-3" style={{ gridTemplateRows: 'auto auto' }}>
            <div className="col-span-2 relative rounded-[2px] overflow-hidden" style={{ aspectRatio: '16/7' }}>
              <Image
                src={episodeImage(episodes[0]?.frontmatter.featured_image)}
                alt={episodes[0]?.frontmatter.title ?? ''}
                fill
                className="object-cover object-top"
                sizes="600px"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,.65) 0%, rgba(10,10,10,.1) 50%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="font-sans text-[9px] tracking-[.18em] uppercase text-white mb-1" style={{ opacity: 0.7 }}>Latest episode</p>
                <h3 className="font-serif text-white text-[15px] leading-[1.25]">{episodes[0]?.frontmatter.title}</h3>
              </div>
            </div>
            <div className="relative rounded-[2px] overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <Image
                src={episodeImage(episodes[1]?.frontmatter.featured_image)}
                alt={episodes[1]?.frontmatter.title ?? ''}
                fill
                className="object-cover object-top"
                sizes="300px"
              />
            </div>
            <div className="relative rounded-[2px] overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <Image
                src={episodeImage(episodes[2]?.frontmatter.featured_image)}
                alt={episodes[2]?.frontmatter.title ?? ''}
                fill
                className="object-cover object-top"
                sizes="300px"
              />
            </div>
          </div>
        )}
      </section>

      {/* ── Episode listing ── */}
      <section style={{ borderTop: '1px solid rgba(28,26,23,.08)', padding: 'clamp(40px,5vw,64px) clamp(20px,6vw,104px)' }}>

        {/* Featured (latest) episode */}
        {featured && (
          <div
            className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-14"
            style={{ borderBottom: '1px solid rgba(28,26,23,.08)', paddingBottom: 'clamp(40px,4vw,56px)' }}
          >
            <Link href={`/vodcast/episodes/${featured.frontmatter.slug}`} className="block group">
              <div className="relative rounded-[2px] overflow-hidden" style={{ aspectRatio: '1/1' }}>
                <Image
                  src={episodeImage(featured.frontmatter.featured_image)}
                  alt={featured.frontmatter.featured_image_alt ?? featured.frontmatter.title}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="280px"
                  priority
                />
              </div>
            </Link>
            <div className="flex flex-col justify-center">
              <p className="font-sans text-[9.5px] tracking-[.18em] uppercase mb-3" style={{ opacity: 0.45 }}>
                Latest episode · {new Date(featured.frontmatter.date_published).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <Link href={`/vodcast/episodes/${featured.frontmatter.slug}`} className="group">
                <h2 className="font-serif font-normal text-[clamp(22px,3vw,32px)] leading-[1.18] mb-4 group-hover:opacity-70 transition-opacity">
                  {featured.frontmatter.title}
                </h2>
              </Link>
              {featured.frontmatter.excerpt && (
                <p className="font-serif text-[16px] leading-[1.65] mb-6" style={{ opacity: 0.68, maxWidth: '60ch' }}>
                  {featured.frontmatter.excerpt}
                </p>
              )}
              <Link
                href={`/vodcast/episodes/${featured.frontmatter.slug}`}
                className="font-sans text-[10px] tracking-[.18em] uppercase self-start"
                style={{ borderBottom: '1px solid currentColor', paddingBottom: '2px', opacity: 0.7 }}
              >
                Listen now
              </Link>
            </div>
          </div>
        )}

        {/* Episode grid — 3 columns */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 'clamp(32px,3.5vw,52px)' }}
        >
          {rest.map(ep => {
            const f = ep.frontmatter
            const date = new Date(f.date_published).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
            return (
              <article key={f.slug} className="group">
                <Link href={`/vodcast/episodes/${f.slug}`} className="block">
                  <div
                    className="relative rounded-[2px] overflow-hidden mb-4"
                    style={{ aspectRatio: '4/3', border: '1px solid rgba(28,26,23,.08)' }}
                  >
                    <Image
                      src={episodeImage(f.featured_image)}
                      alt={f.featured_image_alt ?? f.title}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <p className="font-sans text-[9px] tracking-[.16em] uppercase mb-2" style={{ opacity: 0.42 }}>
                    {date}
                  </p>
                  <h3 className="font-serif font-normal text-[17px] leading-[1.3] mb-2 group-hover:opacity-70 transition-opacity">
                    {f.title}
                  </h3>
                  {f.excerpt && (
                    <p className="font-sans text-[12.5px] leading-[1.6] mb-3" style={{ opacity: 0.6 }}>
                      {f.excerpt.length > 120 ? f.excerpt.slice(0, 117) + '...' : f.excerpt}
                    </p>
                  )}
                  <span className="font-sans text-[9.5px] tracking-[.16em] uppercase" style={{ borderBottom: '1px solid currentColor', paddingBottom: '1px', opacity: 0.55 }}>
                    Read more
                  </span>
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section
        className="text-center px-6 py-16"
        style={{ borderTop: '1px solid rgba(28,26,23,.08)', background: '#FBF9F4' }}
      >
        <p className="font-sans text-[9.5px] tracking-[.2em] uppercase mb-3" style={{ opacity: 0.45 }}>Stay in the loop</p>
        <h2 className="font-serif font-normal text-[clamp(22px,3vw,30px)] mb-3">Subscribe to Beautify Your Life</h2>
        <p className="font-serif text-[15px] leading-[1.65] mb-8 max-w-md mx-auto" style={{ opacity: 0.65 }}>
          Sign up to get your weekly fix of WISOs and HOW TOs, exclusive gifts, discounts and events directly to your inbox.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
          action="/api/subscribe"
          method="POST"
        >
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className="flex-1 px-4 py-3 font-sans text-[12px] tracking-[.04em] bg-white rounded-[2px] outline-none"
            style={{ border: '1px solid rgba(28,26,23,.2)' }}
          />
          <button
            type="submit"
            className="px-6 py-3 font-sans text-[10px] tracking-[.18em] uppercase text-white transition-opacity hover:opacity-80"
            style={{ background: '#1C1A17', borderRadius: '2px' }}
          >
            Subscribe
          </button>
        </form>
      </section>

    </div>
  )
}
