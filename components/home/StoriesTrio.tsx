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

// Alternating aspect ratios and offsets to break the rigid grid
const CONFIGS = [
  { aspectRatio: '3/4',  marginTop: '0px',                        titleSize: 'clamp(20px,2vw,30px)' },
  { aspectRatio: '4/5',  marginTop: 'clamp(40px,7vw,100px)',      titleSize: 'clamp(18px,1.8vw,26px)' },
  { aspectRatio: '5/6',  marginTop: 'clamp(16px,3vw,44px)',       titleSize: 'clamp(18px,1.8vw,26px)' },
]

function ScrimCard({
  article,
  aspectRatio,
  marginTop,
  titleSize,
}: {
  article: Article
  aspectRatio: string
  marginTop: string
  titleSize: string
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
            padding: 'clamp(16px,1.8vw,28px)',
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
              sizes="(max-width:768px) 100vw, 30vw"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(150deg,#d9cfc6,#a99a8d)' }} />
          )}
          <div
            className="absolute inset-0 z-[1]"
            style={{ background: 'linear-gradient(to top,rgba(10,10,10,.70) 0%,rgba(10,10,10,.18) 42%,transparent 68%)' }}
          />
          <div className="relative z-[2]">
            <span
              className="block font-sans text-[10px] tracking-[.22em] uppercase font-medium mb-1.5"
              style={{ color: 'rgba(255,255,255,.78)' }}
            >
              {label}
            </span>
            <h3
              className="font-serif font-normal text-white leading-[1.1]"
              style={{ fontSize: titleSize, maxWidth: '18ch', textShadow: '0 1px 16px rgba(0,0,0,.35)' }}
            >
              {f.title}
            </h3>
          </div>
        </div>
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
      {articles.slice(0, 3).map((article, i) => (
        <ScrimCard
          key={article.frontmatter.slug}
          article={article}
          {...CONFIGS[i]}
        />
      ))}
    </section>
  )
}
