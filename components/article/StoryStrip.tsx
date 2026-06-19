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
      {/* gradient + text overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-serif text-cream text-lg leading-snug lowercase">
          {f.title.toLowerCase()}
        </p>
        <span className="mt-2 inline-block text-cream/70 text-lg leading-none group-hover:text-cream transition-colors">→</span>
      </div>
    </Link>
  )
}

export default function StoryStrip({ articles }: Props) {
  const cards = articles.filter(a => a?.frontmatter.featured_image).slice(0, 6)
  if (!cards.length) return null

  return (
    <div className="max-w-wide mx-auto px-4 py-10">
      {/* horizontal scroll on mobile, wraps to grid on md+ */}
      <div className="flex gap-4 overflow-x-auto md:overflow-visible md:grid md:grid-cols-3 lg:grid-cols-6 scrollbar-hide pb-2 md:pb-0">
        {cards.map((a, i) => (
          <StoryCard key={i} article={a} />
        ))}
      </div>
    </div>
  )
}
