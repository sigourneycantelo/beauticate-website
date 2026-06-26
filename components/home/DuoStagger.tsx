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

interface Props {
  big: Article
  small: Article
}

function ScrimCard({
  article,
  aspectRatio,
  marginTop,
  sizes,
}: {
  article: Article
  aspectRatio: string
  marginTop?: string
  sizes: string
}) {
  const f = article.frontmatter
  const label = (f.subcategory ?? f.category).replace(/-/g, ' ')

  return (
    <article style={{ marginTop }}>
      <Link href={articleHref(f)} className="block group">
        <div
          className="relative overflow-hidden rounded-[2px] flex flex-col justify-end"
          style={{ aspectRatio, padding: 'clamp(22px,2.6vw,38px)', position: 'relative' }}
        >
          {/* Image */}
          {f.featured_image ? (
            <Image
              src={f.featured_image}
              alt={f.featured_image_alt ?? f.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes={sizes}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(150deg,#d9cfc6,#a99a8d)' }}
            />
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 z-[1]"
            style={{ background: 'linear-gradient(to top,rgba(12,12,12,.64),rgba(12,12,12,.14) 46%,transparent 72%)' }}
          />
          {/* Text */}
          <div className="relative z-[2]">
            <span
              className="block font-sans text-[10px] tracking-[.18em] uppercase font-medium mb-2"
              style={{ color: 'rgba(255,255,255,.82)' }}
            >
              {label}
            </span>
            <h3
              className="font-serif font-normal text-white leading-[1.12]"
              style={{ fontSize: 'clamp(25px,2.5vw,36px)', maxWidth: '18ch', textShadow: '0 1px 16px rgba(0,0,0,.3)' }}
            >
              {f.title}
            </h3>
            {f.excerpt && (
              <p
                className="font-sans mt-2"
                style={{ color: 'rgba(255,255,255,.85)', fontSize: '13px', maxWidth: '40ch' }}
              >
                {f.excerpt}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

export default function DuoStagger({ big, small }: Props) {
  return (
    <section
      className="reveal grid grid-cols-1 md:grid-cols-[1.25fr_1fr] items-start"
      style={{
        gap: 'clamp(24px,3vw,48px)',
        padding: 'clamp(28px,4vw,52px) clamp(20px,6vw,104px)',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
    >
      <ScrimCard article={big} aspectRatio="4/5" sizes="(max-width:768px) 100vw, 55vw" />
      <ScrimCard
        article={small}
        aspectRatio="4/5"
        marginTop="clamp(34px,7vw,90px)"
        sizes="(max-width:768px) 100vw, 36vw"
      />
    </section>
  )
}
