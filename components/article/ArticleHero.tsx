import Image from 'next/image'
import Link from 'next/link'
import type { ArticleFrontmatter } from '@/types/content'
import AuthorByline from './AuthorByline'
import { resolveSchemaType } from '@/lib/seo'
import { usesSplitHero } from '@/lib/hero-layout'

interface Props {
  frontmatter: ArticleFrontmatter
}

export default function ArticleHero({ frontmatter: f }: Props) {
  const splitMode = usesSplitHero(f)
  const heroSrc = f.hero_image || f.featured_image
  const isGif = heroSrc?.toLowerCase().endsWith('.gif')

  if (!splitMode) {
    if (isGif) {
      // Animated GIF — use native <img> so the animation plays
      return (
        <div className="max-w-[1200px] mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroSrc}
            alt={f.featured_image_alt ?? f.title}
            className="w-full h-auto"
          />
        </div>
      )
    }

    // Full-bleed landscape mode — used for all articles with any image
    return (
      <>
        {/* Desktop: use hero_aspect if set, default 16:9, capped at 1200px */}
        <div className="hidden md:block max-w-[1200px] mx-auto">
          <div className="relative w-full" style={{ aspectRatio: f.hero_aspect ?? '16/9' }}>
            <Image
              src={heroSrc}
              alt={f.featured_image_alt ?? f.title}
              fill
              sizes="1200px"

              className="object-cover"
              style={{ objectPosition: f.hero_focus ?? 'center center' }}
              priority
            />
          </div>
        </div>
        {/* Mobile: portrait/square at 3:4, prefer featured_image */}
        <div className="md:hidden relative w-full aspect-[3/4]">
          <Image
            src={f.featured_image || f.hero_image!}
            alt={f.featured_image_alt ?? f.title}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
            style={{ objectPosition: f.hero_focus ?? 'center center' }}
            priority
          />
        </div>
      </>
    )
  }

  // Editorial split mode — opt in with `hero_layout: "split"`, and the default
  // when an article has no image at all.
  const splitSrc = f.featured_image || f.hero_image

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 min-h-[480px] md:min-h-[580px]">
      {/* Image */}
      {splitSrc && (
        <div className="relative aspect-[4/5] md:aspect-auto order-1">
          <Image
            src={splitSrc}
            alt={f.featured_image_alt ?? f.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
            className="object-cover"
            style={{ objectPosition: f.hero_focus ?? 'center center' }}
            priority
          />
        </div>
      )}

      {/* Greige text panel */}
      <div
        className="order-2 flex flex-col justify-center items-center text-center px-[clamp(28px,6vw,80px)] py-12 md:py-16"
        style={{ background: '#F3EFE8' }}
      >
        {/* Breadcrumb */}
        <nav className="text-[11.5px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal-light mb-6 flex gap-3 flex-wrap justify-center items-center">
          {f.venueType ? (
            <>
              <Link href="/destinations" className="hover:text-charcoal transition-colors">
                destinations
              </Link>
              <span>/</span>
              <Link href="/destinations/directory" className="hover:text-charcoal transition-colors">
                directory
              </Link>
            </>
          ) : (
            <>
              <Link href={`/${f.category}`} className="hover:text-charcoal transition-colors">
                {f.category.replace(/-/g, ' ')}
              </Link>
              {f.subcategory && (
                <>
                  <span>/</span>
                  <Link href={`/${f.category}/${f.subcategory}`} className="hover:text-charcoal transition-colors">
                    {f.subcategory.replace(/-/g, ' ')}
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Title */}
        <h1
          className="font-serif text-charcoal leading-[1.12] mb-5 text-center"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', letterSpacing: '-0.02em' }}
        >
          {f.title}
        </h1>

        {/* Standfirst / excerpt */}
        {f.excerpt && (
          <p className="font-serif text-[17px] leading-[1.65] text-charcoal-light mb-8">
            {f.excerpt}
          </p>
        )}

        {/* Byline */}
        <AuthorByline
          name={f.author ?? 'Beauticate Editorial'}
          date={f.date_published}
          readingTime={f.reading_time}
          affiliateDisclosure={f.affiliate_disclosure}
          showDate={resolveSchemaType(f) === 'NewsArticle'}
          lastUpdated={f.date_modified && f.date_modified > f.date_published ? f.date_modified : undefined}
        />
      </div>
    </div>
  )
}
