import Link from 'next/link'
import Image from 'next/image'

interface Article {
  frontmatter: {
    title: string
    slug: string
    category: string
    subcategory?: string
    excerpt?: string
    featured_image?: string
    featured_image_alt?: string
    author?: string
    date_published?: string
  }
}

interface Props {
  articles: Article[]
  title?: string
}

function articleHref(f: Article['frontmatter']) {
  return `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
}

function CategoryLabel({ category }: { category: string }) {
  return (
    <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-charcoal-light">
      {category.replace(/-/g, ' ')}
    </span>
  )
}

// Large card — hero slot, portrait/square image with text below
function HeroCard({ article }: { article: Article }) {
  const f = article.frontmatter
  return (
    <Link href={articleHref(f)} className="group block">
      <div className="relative overflow-hidden aspect-[4/5] bg-cream-100">
        {f.featured_image && (
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 55vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/15 transition-colors duration-500" />
      </div>
      <div className="pt-4 pb-2">
        <CategoryLabel category={f.category} />
        <h2 className="font-serif text-2xl md:text-3xl leading-snug mt-1.5 group-hover:text-charcoal-light transition-colors">
          {f.title}
        </h2>
        {f.excerpt && (
          <p className="font-serif text-base text-charcoal-light mt-2 line-clamp-2 leading-relaxed">
            {f.excerpt}
          </p>
        )}
        <span className="inline-block mt-4 font-sans text-[10px] tracking-[0.22em] uppercase border-b border-charcoal pb-0.5 group-hover:border-charcoal-light group-hover:text-charcoal-light transition-colors">
          Read More
        </span>
      </div>
    </Link>
  )
}

// Standard card — square image, always consistent
function Card({ article, showExcerpt = false }: { article: Article; showExcerpt?: boolean }) {
  const f = article.frontmatter
  return (
    <Link href={articleHref(f)} className="group block">
      <div className="relative overflow-hidden aspect-square bg-cream-100">
        {f.featured_image && (
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/15 transition-colors duration-500" />
      </div>
      <div className="pt-3">
        <CategoryLabel category={f.category} />
        <h3 className="font-serif text-lg leading-snug mt-1 group-hover:text-charcoal-light transition-colors">
          {f.title}
        </h3>
        {showExcerpt && f.excerpt && (
          <p className="font-serif text-sm text-charcoal-light mt-1 line-clamp-2 leading-relaxed">{f.excerpt}</p>
        )}
      </div>
    </Link>
  )
}

export default function EditorialGrid({ articles, title }: Props) {
  if (!articles.length) return null

  const [a0, a1, a2, a3, a4, a5, a6, a7] = articles

  return (
    <section className="max-w-wide mx-auto px-4 py-12">
      {title && (
        <div className="flex items-center justify-between border-b border-cream-200 pb-4 mb-10">
          <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase font-bold">{title}</h2>
        </div>
      )}

      {/* Row 1: hero (tall, left) + 2 squares (right column, stacked) */}
      {a0 && (
        <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-8 mb-10">
          <HeroCard article={a0} />
          <div className="grid grid-rows-2 gap-8">
            {a1 && <Card article={a1} showExcerpt />}
            {a2 && <Card article={a2} showExcerpt />}
          </div>
        </div>
      )}

      {/* Thin divider between rows */}
      {a3 && <div className="border-t border-cream-200 mb-10" />}

      {/* Row 2: 3 equal square cards */}
      {a3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {[a3, a4, a5].filter(Boolean).map((a, i) => (
            <Card key={i} article={a!} showExcerpt />
          ))}
        </div>
      )}

      {/* Row 3: only render if we have a full pair or triple (no orphan singles) */}
      {a6 && a7 && (
        <>
          <div className="border-t border-cream-200 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[a6, a7].filter(Boolean).map((a, i) => (
              <Card key={i} article={a!} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
