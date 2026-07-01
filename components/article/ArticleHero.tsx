import Image from 'next/image'
import Link from 'next/link'
import type { ArticleFrontmatter } from '@/types/content'
import AuthorByline from './AuthorByline'
import { resolveSchemaType } from '@/lib/seo'

interface Props {
  frontmatter: ArticleFrontmatter
}

export default function ArticleHero({ frontmatter: f }: Props) {
  const isLandscape = !!f.hero_image

  if (isLandscape) {
    // Full-bleed landscape mode
    return (
      <>
        {/* Desktop: full-bleed 16:9 */}
        <div className="hidden md:block relative w-full aspect-[16/9]">
          <Image
            src={f.hero_image!}
            alt={f.featured_image_alt ?? f.title}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Mobile: portrait/square at 3:4, prefer featured_image if available */}
        <div className="md:hidden relative w-full aspect-[3/4]">
          <Image
            src={f.featured_image || f.hero_image!}
            alt={f.featured_image_alt ?? f.title}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>
      </>
    )
  }

  // Editorial split mode — no landscape image
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 min-h-[480px] md:min-h-[580px]">
      {/* Image */}
      {f.featured_image && (
        <div className="relative aspect-[4/5] md:aspect-auto order-1">
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            priority
          />
        </div>
      )}

      {/* Greige text panel */}
      <div
        className="order-2 flex flex-col justify-center px-[clamp(28px,6vw,80px)] py-12 md:py-16"
        style={{ background: '#F3EFE8' }}
      >
        {/* Breadcrumb */}
        <nav className="text-[11px] font-sans tracking-[0.18em] uppercase text-charcoal-light mb-6 flex gap-2 flex-wrap">
          <Link href={`/${f.category}`} className="hover:text-charcoal capitalize transition-colors">
            {f.category.replace(/-/g, ' ')}
          </Link>
          {f.subcategory && (
            <>
              <span>/</span>
              <Link href={`/${f.category}/${f.subcategory}`} className="hover:text-charcoal capitalize transition-colors">
                {f.subcategory.replace(/-/g, ' ')}
              </Link>
            </>
          )}
        </nav>

        {/* Title */}
        <h1
          className="font-serif text-charcoal leading-[1.12] mb-5"
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
