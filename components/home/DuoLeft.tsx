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

const BG = ['linear-gradient(150deg,#d7c9c0,#b9a294)', 'linear-gradient(150deg,#c2c8c1,#8a948b)']

function Card({ article, i }: { article: Article; i: number }) {
  const f = article.frontmatter
  return (
    <article className="group">
      <Link href={articleHref(f)} className="block">
        <div
          className="relative overflow-hidden rounded-[2px]"
          style={{ aspectRatio: '4/5', border: '1px solid rgba(28,26,23,.10)' }}
        >
          {f.featured_image ? (
            <Image
              src={f.featured_image}
              alt={f.featured_image_alt ?? f.title}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width:768px) 50vw, 35vw"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: BG[i % BG.length] }} />
          )}
        </div>
        <span className="block font-sans text-[10px] tracking-[.18em] uppercase font-medium mt-3.5 mb-1.5" style={{ opacity: 0.55 }}>
          {(f.subcategory ?? f.category).replace(/-/g, ' ')}
        </span>
        <h3 className="font-serif font-normal text-[20px] leading-[1.16]">{f.title}</h3>
        {f.excerpt && (
          <p className="font-sans mt-1.5 text-[13px] leading-[1.5]" style={{ opacity: 0.72, maxWidth: '44ch' }}>
            {f.excerpt}
          </p>
        )}
      </Link>
    </article>
  )
}

export default function DuoLeft({ articles }: { articles: Article[] }) {
  const [a, b] = articles
  if (!a) return null
  return (
    <section
      className="reveal grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_0.72fr]"
      style={{
        gap: 'clamp(24px,3vw,46px)',
        padding: 'clamp(28px,4vw,52px) clamp(20px,6vw,104px) clamp(14px,2vw,24px)',
      }}
    >
      <Card article={a} i={0} />
      {b && (
        <div style={{ marginTop: 'clamp(48px,8vw,120px)' }}>
          <Card article={b} i={1} />
        </div>
      )}
      <div className="hidden md:block" />
    </section>
  )
}
