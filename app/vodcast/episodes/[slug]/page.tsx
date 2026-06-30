import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getVodcastEpisode, getVodcastEpisodes } from '@/lib/content'
import FAQPanel from '@/components/shared/FAQPanel'
import { buildVodcastMetadata, buildVodcastSchema } from '@/lib/seo'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getVodcastEpisodes().map(e => ({ slug: e.frontmatter.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ep = getVodcastEpisode(slug)
  if (!ep) return {}
  return buildVodcastMetadata(ep.frontmatter, `/vodcast/episodes/${slug}`)
}

// Episode body styling: oversized centred pull quotes (markdown `>`), smaller
// quieter section sub-heads (markdown `##`), and visible links that open
// external destinations in a new tab.
const mdxComponents = {
  h2: (props: React.ComponentProps<'h2'>) => (
    <h2 className="font-serif font-normal text-[21px] md:text-[22px] leading-snug tracking-[0.01em] mt-12 mb-3" style={{ color: '#1C1A17' }}>
      {props.children}
    </h2>
  ),
  blockquote: (props: React.ComponentProps<'blockquote'>) => (
    <blockquote className="not-prose my-10 mx-auto max-w-[600px] text-center border-t border-b border-cream-300 py-8 px-4 font-serif text-2xl md:text-3xl italic leading-relaxed text-charcoal tracking-[-0.01em]">
      {props.children}
    </blockquote>
  ),
  a: (props: React.ComponentProps<'a'>) => {
    const href = props.href ?? ''
    const external = /^https?:\/\//.test(href)
    return (
      <a
        {...props}
        className="underline underline-offset-2 decoration-1 hover:opacity-70 transition-opacity"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      />
    )
  },
  // Body image; a markdown title (![alt](src "Caption")) renders a caption.
  img: ({ src, alt, title }: React.ComponentProps<'img'>) => (
    <figure className="my-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ''} loading="lazy" className="w-full rounded-[2px]" />
      {title && (
        <figcaption className="mt-3 text-center font-sans text-[11px] tracking-[0.14em] uppercase" style={{ opacity: 0.5 }}>
          {title}
        </figcaption>
      )}
    </figure>
  ),
}

// Subscribe destinations, rendered as clickable platform logos at the top of
// each episode so listeners can jump to their preferred app.
const PLATFORMS = [
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@sigourneycantelo',
    color: '#FF0000',
    icon: (
      <svg width="22" height="16" viewBox="0 0 24 17" fill="currentColor" aria-hidden="true">
        <path d="M23.495 2.656A3.015 3.015 0 0 0 21.374.516C19.505 0 12 0 12 0S4.495 0 2.626.516A3.015 3.015 0 0 0 .505 2.656C0 4.534 0 8.45 0 8.45s0 3.916.505 5.794a3.015 3.015 0 0 0 2.121 2.14C4.495 16.9 12 16.9 12 16.9s7.505 0 9.374-.516a3.015 3.015 0 0 0 2.121-2.14C24 12.366 24 8.45 24 8.45s0-3.916-.505-5.794zM9.545 12.023V4.877l6.273 3.573-6.273 3.573z" />
      </svg>
    ),
  },
  {
    name: 'Spotify',
    href: 'https://open.spotify.com/show/5su7l0yO5Ue0706K2Lzd8q',
    color: '#1DB954',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    name: 'Apple Podcasts',
    href: 'https://podcasts.apple.com/au/podcast/beautiful-inside-by-beauticate/id1754804721',
    color: '#9933CC',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M5.34 0A5.328 5.328 0 0 0 0 5.34v13.32A5.328 5.328 0 0 0 5.34 24h13.32A5.328 5.328 0 0 0 24 18.66V5.34A5.328 5.328 0 0 0 18.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.878 2.915 2.078 4.718.064.563.077.6.077 1.02 0 .397-.013.44-.077.978-.206 1.87-.917 3.407-2.166 4.657-.746.746-1.51 1.224-2.596 1.63-.536.2-.794.25-1.247.3-.444.05-.776.025-1.096-.073-.696-.21-1.202-.87-1.202-1.59 0-.734.527-1.413 1.253-1.59.25-.057.27-.064.52-.077.37-.02.638-.089.99-.256.89-.428 1.556-1.214 1.876-2.23.128-.41.18-.795.17-1.273-.013-.756-.218-1.4-.647-1.985-.577-.79-1.468-1.28-2.464-1.344-.13-.008-.26-.013-.4-.013-1.37 0-2.52.755-3.054 2.01-.168.396-.24.78-.24 1.312 0 .565.077 1.01.255 1.464.268.69.71 1.22 1.33 1.59.307.18.77.37 1.14.46.282.07.41.172.517.39.09.193.09.39 0 .57-.09.19-.244.32-.46.397-.295.11-.616.08-.88-.05-.77-.38-1.437-.96-1.97-1.72-.77-1.09-1.16-2.41-1.1-3.76.09-2.16 1.15-4.01 2.88-5.11.97-.61 2.08-.93 3.27-.93zm.17 4.085c1.51 0 2.77 1.26 2.77 2.77s-1.26 2.77-2.77 2.77-2.77-1.26-2.77-2.77 1.24-2.77 2.77-2.77zm0 1.1c-.92 0-1.67.75-1.67 1.67s.75 1.67 1.67 1.67 1.67-.75 1.67-1.67-.75-1.67-1.67-1.67z" />
      </svg>
    ),
  },
]

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params
  const ep = getVodcastEpisode(slug)
  if (!ep) notFound()

  const { frontmatter: f, content } = ep

  // Extract anchor.fm URL from body if present (first markdown link)
  const anchorMatch = content.match(/https:\/\/anchor\.fm\/[^\s\)]+/)
  const anchorUrl = anchorMatch ? anchorMatch[0] : null

  // Strip the raw anchor URL line from display content
  const cleanContent = content.replace(/\[https:\/\/anchor\.fm[^\]]*\]\([^\)]*\)\n?/, '').trim()

  // ── Structured data: PodcastEpisode + Article + Video + FAQ + Breadcrumb ──
  const episodeSchema = buildVodcastSchema(f, `/vodcast/episodes/${f.slug}`, anchorUrl)

  return (
    <>
    <Script
      id="schema-vodcast-episode"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(episodeSchema) }}
    />
    <article className="bg-white min-h-screen">

      {/* Podcast masthead — logo + jump-to-your-platform logos */}
      <div className="text-center pt-10 pb-8 px-6">
        <Link href="/vodcast" aria-label="Beautiful Inside by Beauticate">
          <Image
            src="/images/podcast/beautiful-inside-logo.png"
            alt="Beautiful Inside by Beauticate"
            width={360}
            height={212}
            priority
            className="mx-auto h-auto w-[150px] md:w-[180px]"
          />
        </Link>
        <div className="flex items-center justify-center gap-7 mt-6 flex-wrap">
          {PLATFORMS.map(p => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.name}
              className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity"
            >
              <span style={{ color: p.color }}>{p.icon}</span>
              <span className="font-sans text-[10px] tracking-[.14em] uppercase">{p.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <div
        className="max-w-3xl mx-auto px-6 pt-10 pb-2"
        style={{ borderBottom: '1px solid rgba(28,26,23,.08)' }}
      >
        <nav className="font-sans text-[10px] tracking-[.16em] uppercase" style={{ opacity: 0.5 }}>
          <Link href="/vodcast" className="hover:opacity-100 transition-opacity">Beautiful Inside</Link>
          <span className="mx-2">/</span>
          <span>{f.title}</span>
        </nav>
      </div>

      {/* Hero image + title */}
      <header className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        {f.featured_image && (
          <div className="relative w-full mb-8 rounded-[2px] overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image
              src={f.featured_image}
              alt={f.featured_image_alt ?? f.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 760px"
            />
          </div>
        )}
        <p className="font-sans text-[10px] tracking-[.18em] uppercase mb-3" style={{ opacity: 0.5 }}>
          Beautiful Inside · {new Date(f.date_published).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 className="font-serif font-normal text-[clamp(26px,4vw,40px)] leading-[1.14] mb-5">
          {f.title}
        </h1>
        {f.excerpt && (
          <p className="episode-excerpt font-serif text-[17px] leading-[1.6]" style={{ opacity: 0.72 }}>
            {f.excerpt}
          </p>
        )}
      </header>

      {/* YouTube embed (primary) or Anchor audio (fallback) */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        {f.youtube_video_id ? (
          <div className="relative w-full overflow-hidden rounded-[2px] bg-black" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={`https://www.youtube.com/embed/${f.youtube_video_id}?rel=0&modestbranding=1`}
              title={f.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : anchorUrl ? (
          <div className="rounded-[2px] overflow-hidden" style={{ border: '1px solid rgba(28,26,23,.10)' }}>
            <iframe
              src={anchorUrl}
              height="102"
              width="100%"
              frameBorder="0"
              scrolling="no"
              title={f.title}
            />
          </div>
        ) : null}
      </div>

      {/* Body content */}
      {cleanContent && (
        <div
          className="max-w-3xl mx-auto px-6 pb-12 font-serif text-[17px] leading-[1.72] prose prose-lg"
          style={{ color: '#1C1A17' }}
        >
          <MDXRemote source={cleanContent} components={mdxComponents} />
        </div>
      )}

      {/* FAQs — proper accordion box, shared with editorial articles */}
      {f.faqs && f.faqs.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-16">
          <FAQPanel faqs={f.faqs} title="Questions about this episode" />
        </div>
      )}

      {/* Back to podcast */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <Link
          href="/vodcast"
          className="font-sans text-[10.5px] tracking-[.18em] uppercase transition-opacity"
          style={{ opacity: 0.55 }}
        >
          ← All episodes
        </Link>
      </div>

    </article>
    </>
  )
}
