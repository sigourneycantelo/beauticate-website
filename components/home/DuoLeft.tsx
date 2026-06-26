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

function ScrimCard({
  article,
  aspectRatio,
  marginTop,
  sizes,
  titleSize = 'clamp(22px,2.2vw,32px)',
}: {
  article: Article
  aspectRatio: string
  marginTop?: string
  sizes: string
  titleSize?: string
}) {
  const f = article.frontmatter
  const label = (f.subcategory ?? f.category).replace(/-/g, ' ')
  return (
    <article style={{ marginTop }}>
      <Link href={articleHref(f)} className="block group">
        <div
          className="relative overflow-hidden rounded-[2px]"
          style={{
            aspectRatio,
            padding: 'clamp(18px,2.2vw,34px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          {f.featured_image ? (
            <Image
              src={f.featured_image}
              alt={f.featured_image_alt ?? f.title}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
              sizes={sizes}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(150deg,#d9cfc6,#a99a8d)' }} />
          )}
          {/* Scrim */}
          <div
            className="absolute inset-0 z-[1]"
            style={{ background: 'linear-gradient(to top,rgba(10,10,10,.72) 0%,rgba(10,10,10,.22) 44%,transparent 70%)' }}
          />
          {/* Text */}
          <div className="relative z-[2]">
            <span
              className="block font-sans text-[10px] tracking-[.22em] uppercase font-medium mb-2"
              style={{ color: 'rgba(255,255,255,.78)' }}
            >
              {label}
            </span>
            <h3
              className="font-serif font-normal text-white leading-[1.1]"
              style={{ fontSize: titleSize, maxWidth: '20ch', textShadow: '0 1px 18px rgba(0,0,0,.35)' }}
            >
              {f.title}
            </h3>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default function DuoLeft({ articles }: { articles: Article[] }) {
  const [a, b] = articles
  if (!a) return null
  return (
    <section
      className="reveal grid grid-cols-1 sm:grid-cols-[1.35fr_1fr] items-start"
      style={{
        gap: 'clamp(16px,2.4vw,36px)',
        padding: 'clamp(28px,4vw,52px) clamp(20px,6vw,104px) clamp(14px,2vw,24px)',
      }}
    >
      <ScrimCard
        article={a}
        aspectRatio="3/4"
        sizes="(max-width:640px) 100vw, 58vw"
        titleSize="clamp(24px,2.6vw,38px)"
      />
      {b && (
        <ScrimCard
          article={b}
          aspectRatio="4/5"
          marginTop="clamp(48px,9vw,130px)"
          sizes="(max-width:640px) 100vw, 38vw"
          titleSize="clamp(20px,2vw,30px)"
        />
      )}
    </section>
  )
}
