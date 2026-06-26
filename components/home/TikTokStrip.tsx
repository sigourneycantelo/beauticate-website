import Image from 'next/image'
import Link from 'next/link'

interface EpisodeData {
  frontmatter: {
    slug: string
    title: string
    featured_image?: string
    youtube_video_id?: string
  }
}

const BG = [
  'linear-gradient(150deg,#cdc4bb,#8f857b)',
  'linear-gradient(150deg,#d7c9c0,#b9a294)',
  'linear-gradient(150deg,#c2c8c1,#8a948b)',
  'linear-gradient(150deg,#d9cfc6,#a99a8d)',
  'linear-gradient(150deg,#cfc8c8,#9a8f8f)',
  'linear-gradient(150deg,#bfc6c0,#888f88)',
]

export default function TikTokStrip({ episodes }: { episodes: EpisodeData[] }) {
  const items = episodes.slice(0, 6)

  return (
    <section
      className="reveal"
      style={{ padding: 'clamp(40px,5vw,72px) clamp(20px,6vw,104px)' }}
    >
      {/* Heading */}
      <div className="flex items-center gap-3 justify-center mb-7">
        <svg width="20" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.28 8.28 0 0 0 4.84 1.54V6.78a4.85 4.85 0 0 1-1.07-.09z" />
        </svg>
        <h2 className="font-serif font-normal" style={{ fontSize: 'clamp(22px,2.6vw,32px)' }}>
          Watch us on <em className="italic">TikTok</em>
        </h2>
      </div>

      {/* Horizontal scroll rail */}
      <div
        className="grid overflow-x-auto pb-2"
        style={{
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(150px,1fr)',
          gap: '14px',
          scrollSnapType: 'x mandatory',
        }}
      >
        {items.map((ep, i) => {
          const f = ep.frontmatter
          const href = f.youtube_video_id
            ? `https://www.youtube.com/watch?v=${f.youtube_video_id}`
            : `/vodcast/${f.slug}`
          const isExternal = f.youtube_video_id != null

          return (
            <Link
              key={f.slug}
              href={href}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="relative block"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div
                className="relative overflow-hidden rounded-[3px]"
                style={{ aspectRatio: '9/16', border: '1px solid rgba(28,26,23,.10)' }}
              >
                {f.featured_image ? (
                  <Image
                    src={f.featured_image}
                    alt={f.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 45vw, 14vw"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: BG[i % BG.length] }} />
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top,rgba(8,8,8,.5),transparent 52%)' }}
                />
                <div
                  className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-white lowercase"
                  style={{ fontSize: '10.5px', lineHeight: 1.25 }}
                >
                  {f.title}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Follow CTA */}
      <div className="text-center mt-6">
        <a
          href="https://www.tiktok.com/@sigourneycantelo"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[10.5px] tracking-[0.2em] uppercase font-medium border-b pb-0.5"
          style={{ borderColor: '#1C1A17', opacity: 0.65 }}
        >
          Follow @sigourneycantelo
        </a>
      </div>
    </section>
  )
}
