import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getVodcastEpisode, getVodcastEpisodes } from '@/lib/content'
import FAQPanel from '@/components/shared/FAQPanel'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com'

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
  const f = ep.frontmatter
  return {
    title: f.seo_title ?? `${f.title} | Beautiful Inside`,
    description: f.meta_description ?? f.excerpt,
    openGraph: f.featured_image
      ? { images: [{ url: f.featured_image }] }
      : undefined,
  }
}

// Episode body styling: large centred pull quotes (markdown `>`) and smaller,
// quieter section sub-heads (markdown `##`) so the quotes carry the emphasis.
const mdxComponents = {
  h2: (props: React.ComponentProps<'h2'>) => (
    <h2 className="font-serif font-normal text-[21px] md:text-[22px] leading-snug tracking-[0.01em] mt-12 mb-3" style={{ color: '#1C1A17' }}>
      {props.children}
    </h2>
  ),
  blockquote: (props: React.ComponentProps<'blockquote'>) => (
    <blockquote className="not-prose my-12 mx-auto max-w-[660px] text-center border-t border-b border-cream-300 py-9 px-4 font-serif italic text-[27px] md:text-[36px] leading-[1.28] text-charcoal tracking-[-0.01em]">
      {props.children}
    </blockquote>
  ),
}

const PLATFORMS = [
  { name: 'Spotify', href: 'https://open.spotify.com/show/5su7l0yO5Ue0706K2Lzd8q' },
  { name: 'Apple Podcasts', href: 'https://podcasts.apple.com/au/podcast/beautiful-inside-by-beauticate/id1754804721' },
  { name: 'YouTube', href: 'https://www.youtube.com/@sigourneycantelo' },
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

  // ── Structured data ────────────────────────────────────────────────────────
  const episodeUrl = `${SITE_URL}/vodcast/episodes/${f.slug}`
  const imageUrl = f.featured_image ? `${SITE_URL}${f.featured_image}` : `${SITE_URL}/og-default.jpg`
  const description = f.meta_description ?? f.excerpt

  const graph: object[] = []

  if (f.youtube_video_id) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${episodeUrl}#video`,
      name: f.seo_title ?? f.title,
      description,
      thumbnailUrl: imageUrl,
      uploadDate: f.date_published,
      contentUrl: `https://www.youtube.com/watch?v=${f.youtube_video_id}`,
      embedUrl: `https://www.youtube.com/embed/${f.youtube_video_id}`,
    })
  }

  if (f.faqs && f.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${episodeUrl}#faq`,
      mainEntity: f.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    })
  }

  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Beautiful Inside', item: `${SITE_URL}/vodcast` },
      { '@type': 'ListItem', position: 3, name: f.title, item: episodeUrl },
    ],
  })

  const episodeSchema = { '@context': 'https://schema.org', '@graph': graph }

  return (
    <>
    <Script
      id="schema-vodcast-episode"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(episodeSchema) }}
    />
    <article className="bg-white min-h-screen">

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
          <p className="font-serif text-[17px] leading-[1.6]" style={{ opacity: 0.72 }}>
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

        {/* Listen elsewhere */}
        <div className="flex gap-6 mt-5 flex-wrap">
          {PLATFORMS.map(p => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[10px] tracking-[.16em] uppercase opacity-55 hover:opacity-100 transition-opacity"
            >
              {p.name} ↗
            </a>
          ))}
        </div>
      </div>

      {/* Body content */}
      {cleanContent && (
        <div
          className="max-w-3xl mx-auto px-6 pb-12 font-serif text-[17px] leading-[1.72] prose prose-lg prose-img:w-full prose-img:rounded-[2px] prose-img:my-10"
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
