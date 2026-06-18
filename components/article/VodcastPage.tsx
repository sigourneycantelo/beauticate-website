import Link from 'next/link'
import Image from 'next/image'
import type { VodcastFrontmatter } from '@/types/content'

interface Props {
  episodes: { frontmatter: VodcastFrontmatter; content: string }[]
}

export default function VodcastPage({ episodes }: Props) {
  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="mb-4">Beautiful Inside by Beauticate</h1>
        <p className="text-charcoal-light max-w-xl mx-auto text-sm">
          Conversations with fascinating people — discussing the science and spirit of living beautifully.
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <a href="https://open.spotify.com/show/5su7l0yO5Ue0706K2Lzd8q" target="_blank" rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase hover:text-gold transition-colors">Spotify</a>
          <a href="https://podcasts.apple.com/au/podcast/beautiful-inside-by-beauticate/id1754804721" target="_blank" rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase hover:text-gold transition-colors">Apple Podcasts</a>
          <a href="https://www.youtube.com/c/sigourneycantelo" target="_blank" rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase hover:text-gold transition-colors">YouTube</a>
        </div>
      </div>

      <div className="space-y-8">
        {episodes.map((ep, i) => {
          const f = ep.frontmatter
          return (
            <article key={i} className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 border-b border-cream-200 pb-8">
              {f.featured_image && (
                <div className="relative aspect-square md:aspect-auto md:h-40 bg-cream-100">
                  <Image src={f.featured_image} alt={f.featured_image_alt ?? f.title} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="text-xs text-charcoal-light mb-2">{f.date_published}</p>
                <h2 className="text-lg md:text-xl mb-2">
                  <Link href={`/vodcast/${f.slug}`} className="hover:text-gold transition-colors">{f.title}</Link>
                </h2>
                <p className="text-sm text-charcoal-light line-clamp-2">{f.excerpt}</p>
                <Link href={`/vodcast/${f.slug}`} className="text-xs tracking-widest uppercase mt-3 inline-block hover:text-gold transition-colors">
                  Listen →
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
