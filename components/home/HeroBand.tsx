import Image from 'next/image'
import Link from 'next/link'

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

export default function HeroBand({ articles }: Props) {
  const hero = articles[0]
  const cells = articles.slice(0, 5)

  return (
    <section className="relative w-full" style={{ height: 'clamp(440px, 64vh, 660px)' }}>
      {/* 5-image grid */}
      <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5">
        {cells.map((a, i) => (
          <div key={i} className={`relative overflow-hidden ${i >= 3 ? 'hidden md:block' : ''}`}>
            {a?.frontmatter.featured_image ? (
              <Image
                src={a.frontmatter.featured_image}
                alt={a.frontmatter.featured_image_alt ?? a.frontmatter.title}
                fill
                className="object-cover object-top transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 33vw, 20vw"
                priority={i === 0}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#d8cfc6] to-[#efe9e2]" />
            )}
          </div>
        ))}
      </div>

      {/* Veil gradient — bottom fade to parchment so caption reads cleanly */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(251,249,244,.88) 0%, rgba(251,249,244,.12) 38%, rgba(251,249,244,0) 60%)' }}
      />

      {/* Caption — centred, bottom third */}
      {hero && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 text-center w-full px-6 pb-10 md:pb-16" style={{ maxWidth: 'min(720px, 88%)' }}>
          {hero.frontmatter.subcategory && (
            <span className="font-serif italic text-[15px] opacity-70 block mb-3">
              {hero.frontmatter.subcategory.replace(/-/g, ' ')}
            </span>
          )}
          <h1
            className="font-serif font-normal leading-[1.02] tracking-[-0.015em] text-ink"
            style={{ fontSize: 'clamp(32px, 5vw, 62px)' }}
          >
            {hero.frontmatter.title}
          </h1>
          {hero.frontmatter.excerpt && (
            <p className="text-[13.5px] opacity-70 mt-3 mx-auto max-w-[52ch]">
              {hero.frontmatter.excerpt}
            </p>
          )}
          <Link
            href={articleHref(hero.frontmatter)}
            className="inline-flex items-center gap-2 mt-5 font-sans text-[10px] tracking-[0.2em] uppercase border border-ink px-5 py-2.5 rounded-[1px] hover:bg-ink hover:text-white transition-colors duration-300"
          >
            <span className="w-[5px] h-[5px] rounded-full bg-current inline-block" />
            Read the story
          </Link>
        </div>
      )}
    </section>
  )
}
