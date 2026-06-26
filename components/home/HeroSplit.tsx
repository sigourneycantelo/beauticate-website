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

export default function HeroSplit({ article }: { article: Article }) {
  const f = article.frontmatter
  const label = (f.subcategory ?? f.category).replace(/-/g, ' ')

  return (
    <section
      className="reveal grid grid-cols-1 md:grid-cols-[1.05fr_1fr] items-center"
      style={{
        gap: 'clamp(30px,5vw,80px)',
        padding: 'clamp(34px,5vw,70px) clamp(20px,6vw,104px)',
      }}
    >
      {/* Image */}
      <div
        className="group relative overflow-hidden rounded-[2px]"
        style={{ aspectRatio: '4/5', border: '1px solid rgba(28,26,23,.10)' }}
      >
        {f.featured_image ? (
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            className="object-cover object-top transition-transform duration-[1000ms] group-hover:scale-[1.03]"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(150deg,#cabfb4,#8c8076)' }}
          />
        )}
      </div>

      {/* Text */}
      <div>
        <span
          className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium mb-4"
          style={{ opacity: 0.55 }}
        >
          {label}
        </span>
        <h1
          className="font-serif font-normal leading-[1.04]"
          style={{ fontSize: 'clamp(34px,4.6vw,58px)', letterSpacing: '-.015em' }}
        >
          {f.title}
        </h1>
        {f.excerpt && (
          <p
            className="font-sans leading-[1.55]"
            style={{ fontSize: '14px', opacity: 0.72, margin: '18px 0 24px', maxWidth: '40ch' }}
          >
            {f.excerpt}
          </p>
        )}
        <Link
          href={articleHref(f)}
          className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase font-medium px-7 py-3 rounded-[1px] transition-colors hover:bg-white hover:text-ink"
          style={{ background: '#1C1A17', color: '#fff', border: '1px solid #1C1A17' }}
        >
          Read the story
        </Link>
      </div>
    </section>
  )
}
