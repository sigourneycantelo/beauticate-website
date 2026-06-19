import Link from 'next/link'
import Image from 'next/image'

interface Article {
  frontmatter: {
    title: string
    slug: string
    category: string
    subcategory?: string
    featured_image?: string
    featured_image_alt?: string
    excerpt?: string
  }
}

interface Props {
  articles: Article[]
}

function articleHref(f: Article['frontmatter']) {
  return `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
}

// Single story card — portrait ratio, image fills frame, lowercase serif title overlay
function StoryCard({ article }: { article: Article }) {
  const f = article.frontmatter
  return (
    <Link href={articleHref(f)} className="group relative block flex-none w-[220px] md:w-[260px] aspect-[3/4] overflow-hidden bg-cream-100">
      {f.featured_image && (
        <Image
          src={f.featured_image}
          alt={f.featured_image_alt ?? f.title}
          fill
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          sizes="260px"
        />
      )}
      {/* lower-third gradient box — text always readable */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        {f.category && (
          <span className="font-sans text-[10px] tracking-[0.16em] uppercase text-cream/60 block mb-1.5">
            {f.subcategory ?? f.category}
          </span>
        )}
        <p className="font-serif text-cream text-lg md:text-xl leading-snug lowercase">
          {f.title.toLowerCase()}
        </p>
        <span className="mt-2 inline-block text-cream/60 text-base leading-none group-hover:text-cream transition-colors">→</span>
      </div>
    </Link>
  )
}

export default function StoryStrip({ articles }: Props) {
  const cards = articles.filter(a => a?.frontmatter.featured_image).slice(0, 3)
  if (!cards.length) return null

  return (
    <div className="max-w-wide mx-auto px-4 py-10">
      {/* 3-col grid on all sizes — horizontal scroll only on small mobile */}
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        {cards.map((a, i) => (
          <StoryCard key={i} article={a} />
        ))}
      </div>
    </div>
  )
}
