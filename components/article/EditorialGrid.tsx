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

// Large featured card — used for the hero slot
function FeaturedCard({ article }: { article: Article }) {
  const f = article.frontmatter
  const href = articleHref(f)
  return (
    <Link href={href} className="group block h-full">
      <div className="relative overflow-hidden aspect-[4/3] w-full bg-cream-100">
        {f.featured_image && (
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        )}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/15 transition-colors duration-500" />
      </div>
      <div className="pt-4">
        <CategoryLabel category={f.category} />
        <h2 className="font-serif text-2xl md:text-3xl leading-snug mt-1.5 group-hover:text-gold transition-colors">
          {f.title}
        </h2>
        {f.excerpt && (
          <p className="font-serif text-base text-charcoal-light mt-2 line-clamp-2 leading-relaxed">
            {f.excerpt}
          </p>
        )}
        <span className="inline-block mt-4 font-sans text-[10px] tracking-[0.22em] uppercase border-b border-charcoal pb-0.5 group-hover:border-gold group-hover:text-gold transition-colors">
          Read More
        </span>
      </div>
    </Link>
  )
}

// Standard card — square image
function StandardCard({ article, showExcerpt = false }: { article: Article; showExcerpt?: boolean }) {
  const f = article.frontmatter
  const href = articleHref(f)
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden aspect-square w-full bg-cream-100">
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
        <h3 className="font-serif text-lg leading-snug mt-1 group-hover:text-gold transition-colors">
          {f.title}
        </h3>
        {showExcerpt && f.excerpt && (
          <p className="font-serif text-sm text-charcoal-light mt-1 line-clamp-2">{f.excerpt}</p>
        )}
      </div>
    </Link>
  )
}

// Small side card — landscape image, horizontal layout on mobile
function SideCard({ article }: { article: Article }) {
  const f = article.frontmatter
  const href = articleHref(f)
  return (
    <Link href={href} className="group flex gap-4 items-start">
      <div className="relative overflow-hidden aspect-square w-24 shrink-0 bg-cream-100">
        {f.featured_image && (
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="96px"
          />
        )}
      </div>
      <div className="flex-1 pt-0.5">
        <CategoryLabel category={f.category} />
        <h4 className="font-serif text-base leading-snug mt-1 group-hover:text-gold transition-colors">
          {f.title}
        </h4>
      </div>
    </Link>
  )
}

export default function EditorialGrid({ articles, title }: Props) {
  if (!articles.length) return null

  const [hero, ...rest] = articles
  const sideStack = rest.slice(0, 2)       // 2 side cards next to hero
  const bottomRow = rest.slice(2, 5)       // up to 3 equal-width cards below
  const extraRow  = rest.slice(5, 8)       // optional 4th row

  return (
    <section className="max-w-wide mx-auto px-4 py-14">
      {title && (
        <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase font-bold mb-8 border-b border-cream-200 pb-4">
          {title}
        </h2>
      )}

      {/* Row 1: hero (2/3) + side stack (1/3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
        <div className="md:col-span-2">
          <FeaturedCard article={hero} />
        </div>
        {sideStack.length > 0 && (
          <div className="flex flex-col gap-8 justify-center">
            {sideStack.map((a, i) => (
              <SideCard key={i} article={a} />
            ))}
          </div>
        )}
      </div>

      {/* Row 2: 3 equal square cards */}
      {bottomRow.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-14">
          {bottomRow.map((a, i) => (
            <StandardCard key={i} article={a} showExcerpt />
          ))}
        </div>
      )}

      {/* Row 3: optional extra row */}
      {extraRow.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {extraRow.map((a, i) => (
            <StandardCard key={i} article={a} />
          ))}
        </div>
      )}
    </section>
  )
}
