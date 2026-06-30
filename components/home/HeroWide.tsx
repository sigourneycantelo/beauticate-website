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
    hero_image?: string
    hero_title?: string
    hero_eyebrow?: string
    hero_aspect?: string
  }
}

function articleHref(f: Article['frontmatter']) {
  return `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
}

export default function HeroWide({ article }: { article: Article }) {
  const f = article.frontmatter

  const heroImage = f.hero_image ?? f.featured_image ?? '/images/hero-home.png'
  const heroTitle = f.hero_title ?? f.title
  const heroEyebrow = f.hero_eyebrow ?? 'Shop · The Edit'
  const heroAspect = f.hero_aspect ?? '16/9'

  return (
    <Link href={articleHref(f)} className="block cursor-pointer">
      <section
        className="reveal relative overflow-hidden flex items-end max-w-[1200px] mx-auto min-h-[480px]"
        style={{ aspectRatio: heroAspect, paddingBottom: 'clamp(30px,5vw,64px)' }}
      >
        <Image
          src={heroImage}
          alt={f.featured_image_alt ?? f.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
          unoptimized={heroImage.endsWith('.gif')}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(to top,rgba(10,10,10,.8) 0%,rgba(10,10,10,.42) 32%,rgba(10,10,10,.14) 55%,rgba(10,10,10,0) 74%)' }}
        />
        <div
          className="relative z-10 text-white text-left"
          style={{ width: 'min(840px,92%)', margin: '0 auto', padding: 0 }}
        >
          <span
            className="block font-sans text-[11px] tracking-[0.34em] uppercase mb-3.5 font-medium"
            style={{ color: 'rgba(255,255,255,.85)' }}
          >
            {heroEyebrow}
          </span>
          <h2
            className="font-serif font-normal leading-[1.04]"
            style={{
              fontSize: 'clamp(32px,4.4vw,58px)',
              letterSpacing: '-.015em',
              textShadow: '0 2px 30px rgba(0,0,0,.4)',
            }}
          >
            {heroTitle}
          </h2>
          {f.excerpt && (
            <p className="font-sans mt-3.5" style={{ fontSize: '13.5px', opacity: 0.92, maxWidth: '46ch' }}>
              {f.excerpt}
            </p>
          )}
          <span
            className="inline-block mt-4 font-sans text-[10.5px] tracking-[0.2em] uppercase font-medium"
            style={{ color: 'rgba(255,255,255,.85)', borderBottom: '1px solid rgba(255,255,255,.5)', paddingBottom: '2px' }}
          >
            Read the story
          </span>
        </div>
      </section>
    </Link>
  )
}
