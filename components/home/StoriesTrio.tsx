import Image from 'next/image'
import Link from 'next/link'

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

function articleHref(f: Article['frontmatter']) {
  return `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
}

function Card({ article }: { article: Article }) {
  const f = article.frontmatter
  const label = (f.subcategory ?? f.category).replace(/-/g, ' ')
  return (
    <article>
      <Link href={articleHref(f)} className="block group">
        <div className="relative overflow-hidden rounded-[2px] aspect-[4/5] mb-3">
          {f.featured_image ? (
            <Image
              src={f.featured_image}
              alt={f.featured_image_alt ?? f.title}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width:768px) 100vw, 30vw"
            />
          ) : (
            <div className="absolute inset-0 bg-cream-100" />
          )}
        </div>
        <span className="block font-sans text-[10px] tracking-[.22em] uppercase font-medium text-charcoal-light mb-1.5">
          {label}
        </span>
        <h3
          className="font-serif font-normal text-ink leading-[1.2]"
          style={{ fontSize: 'clamp(16px,1.6vw,22px)', maxWidth: '22ch' }}
        >
          {f.title}
        </h3>
      </Link>
    </article>
  )
}

export default function StoriesTrio({ articles }: { articles: Article[] }) {
  return (
    <section
      className="reveal grid grid-cols-1 md:grid-cols-3 items-start"
      style={{
        gap: 'clamp(16px,2.4vw,36px)',
        padding: 'clamp(28px,4vw,52px) clamp(20px,6vw,104px)',
      }}
    >
      {articles.slice(0, 3).map((article) => (
        <Card key={article.frontmatter.slug} article={article} />
      ))}
    </section>
  )
}
