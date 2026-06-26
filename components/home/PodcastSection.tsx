import Image from 'next/image'
import Link from 'next/link'
import type { VodcastFrontmatter } from '@/types/content'

interface Props {
  episodes: { frontmatter: VodcastFrontmatter }[]
}

function ReelCard({ ep }: { ep: { frontmatter: VodcastFrontmatter } }) {
  const f = ep.frontmatter
  const href = f.youtube_video_id
    ? `https://www.youtube.com/watch?v=${f.youtube_video_id}`
    : `/vodcast/episodes/${f.slug}`
  const external = !!f.youtube_video_id

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group block"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div
        className="relative overflow-hidden rounded-[3px]"
        style={{ aspectRatio: '9/16', border: '1px solid rgba(28,26,23,.10)' }}
      >
        {f.featured_image ? (
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            className="object-cover"
            sizes="20vw"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(150deg,#d9cfc6,#a99a8d)' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46px] h-[46px] rounded-full border border-white/90 z-10 flex items-center justify-center">
          <span className="border-l-[12px] border-l-white border-y-[7px] border-y-transparent ml-1" />
        </div>
        {external && (
          <span className="absolute top-2.5 left-2.5 z-10 font-sans text-[8.5px] tracking-[0.18em] uppercase text-white bg-black/40 px-2 py-1 rounded-[1px]">
            YouTube
          </span>
        )}
      </div>
      <h4 className="font-serif font-normal text-[16px] leading-[1.25] mt-3 lowercase" style={{ color: '#1C1A17' }}>
        {f.title}
      </h4>
    </a>
  )
}

export default function PodcastSection({ episodes }: Props) {
  if (!episodes.length) return null

  const reelEps = episodes.slice(0, 5)

  return (
    <section
      className="reveal"
      style={{
        background: '#E8E3DB',
        borderTop: '1px solid rgba(28,26,23,.10)',
        borderBottom: '1px solid rgba(28,26,23,.10)',
        padding: 'clamp(46px,6vw,78px) clamp(20px,6vw,104px)',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-end gap-5 flex-wrap mb-7">
        <div>
          <p className="font-sans text-[11px] tracking-[0.34em] uppercase" style={{ opacity: 0.55, color: '#1C1A17' }}>
            Beautiful Inside
          </p>
          <h2 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(24px,3vw,38px)', color: '#1C1A17' }}>
            The <em className="italic">podcast</em>
          </h2>
        </div>
        <Link
          href="/vodcast"
          className="font-sans text-[10.5px] tracking-[0.2em] uppercase px-5 py-2.5 rounded-[1px] transition-colors hover:bg-ink hover:text-white"
          style={{ border: '1px solid rgba(28,26,23,.4)', color: '#1C1A17' }}
        >
          All episodes
        </Link>
      </div>

      {/* Reels */}
      <p className="font-sans text-[10px] tracking-[0.2em] uppercase mb-4" style={{ opacity: 0.5, color: '#1C1A17' }}>Watch</p>
      <div
        className="grid gap-4 overflow-x-auto pb-2"
        style={{
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(180px, 1fr)',
          scrollSnapType: 'x mandatory',
        }}
      >
        {reelEps.map((ep, i) => (
          <ReelCard key={i} ep={ep} />
        ))}
      </div>
    </section>
  )
}
