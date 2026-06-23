import Image from 'next/image'
import Link from 'next/link'
import type { VodcastFrontmatter } from '@/types/content'

interface Article {
  frontmatter: {
    title: string
    slug: string
    category: string
    subcategory?: string
    excerpt?: string
    featured_image?: string
    featured_image_alt?: string
  }
}

interface Props {
  stories: Article[]
  vodcastEpisodes: { frontmatter: VodcastFrontmatter }[]
}

function articleHref(f: Article['frontmatter']) {
  return `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
}

function StoryCard({ article, aspectClass = 'aspect-[4/5]' }: { article: Article; aspectClass?: string }) {
  const f = article.frontmatter
  return (
    <Link href={articleHref(f)} className="group block">
      <div className={`relative overflow-hidden rounded-[2px] border border-cream-200 ${aspectClass}`}>
        {f.featured_image ? (
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#cdc4bb] to-[#8f857b]" />
        )}
      </div>
      <span className="font-serif italic text-[15px] opacity-70 block mt-3.5 mb-1.5">
        {(f.subcategory ?? f.category).replace(/-/g, ' ')}
      </span>
      <h3 className="font-serif font-normal text-[20px] leading-[1.16]">{f.title}</h3>
      {f.excerpt && (
        <p className="text-[13px] opacity-70 leading-[1.5] mt-1.5 max-w-[44ch]">{f.excerpt}</p>
      )}
    </Link>
  )
}

function VideoCard({ ep }: { ep: { frontmatter: VodcastFrontmatter } }) {
  const f = ep.frontmatter
  const href = `/vodcast/episodes/${f.slug}`
  return (
    <Link href={href} className="group block" style={{ scrollSnapAlign: 'start' }}>
      <div className="relative overflow-hidden rounded-[3px] border border-cream-200" style={{ aspectRatio: '9/16' }}>
        {f.featured_image ? (
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            className="object-cover"
            sizes="20vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#cdc6c0] to-[#9b9087]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Play button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/90 z-10 flex items-center justify-center">
          <span className="border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1" />
        </div>
      </div>
      <h4 className="font-serif text-[14px] leading-[1.2] mt-2.5 lowercase">{f.title}</h4>
    </Link>
  )
}

export default function LatestStories({ stories, vodcastEpisodes }: Props) {
  if (!stories.length) return null

  const [s0, s1, s2, s3] = stories

  return (
    <section
      className="px-[clamp(20px,6vw,104px)] border-t border-cream-200"
      style={{ padding: 'clamp(46px,6vw,72px) clamp(20px,6vw,104px) clamp(30px,4vw,50px)' }}
    >
      {/* Section heading */}
      <div className="mb-12">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase opacity-50">The latest</p>
        <h2 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(26px, 3.2vw, 40px)' }}>
          Stories worth <em className="italic">your time</em>
        </h2>
      </div>

      {/* Row 1 — asymmetric 2-up */}
      {s0 && s1 && (
        <div className="grid grid-cols-1 md:grid-cols-[1.55fr_1fr] gap-[clamp(20px,2.6vw,38px)] items-start">
          <StoryCard article={s0} aspectClass="aspect-[3/4]" />
          <div className="md:mt-10">
            <StoryCard article={s1} aspectClass="aspect-[4/5]" />
          </div>
        </div>
      )}

      {/* Video strip */}
      {vodcastEpisodes.length > 0 && (
        <div className="my-[clamp(34px,4vw,54px)]">
          <div className="flex justify-between items-baseline mb-4">
            <p className="font-sans text-[11px] tracking-[0.34em] uppercase opacity-50">Watch</p>
            <Link
              href="/vodcast"
              className="font-sans text-[10px] tracking-[0.18em] uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              All episodes →
            </Link>
          </div>
          <div
            className="grid gap-3.5 overflow-x-auto pb-2"
            style={{
              gridAutoFlow: 'column',
              gridAutoColumns: 'minmax(150px, 1fr)',
              scrollSnapType: 'x mandatory',
            }}
          >
            {vodcastEpisodes.slice(0, 5).map((ep, i) => (
              <VideoCard key={i} ep={ep} />
            ))}
          </div>
        </div>
      )}

      {/* Row 2 — symmetric 2-up */}
      {s2 && s3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(20px,2.6vw,38px)] mt-[clamp(30px,4vw,52px)]">
          <StoryCard article={s2} aspectClass="aspect-[4/5]" />
          <div className="md:mt-8">
            <StoryCard article={s3} aspectClass="aspect-[4/5]" />
          </div>
        </div>
      )}
    </section>
  )
}
