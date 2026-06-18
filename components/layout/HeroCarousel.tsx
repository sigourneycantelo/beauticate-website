'use client'
import Link from 'next/link'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'

interface Props { articles: any[] }

export default function HeroCarousel({ articles }: Props) {
  const [emblaRef] = useEmblaCarousel({ loop: true })

  if (!articles.length) return null

  return (
    <section className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {articles.map((article, i) => (
          <div key={i} className="relative flex-none w-full min-h-[60vh] md:min-h-[80vh]">
            {article?.frontmatter.featured_image && (
              <Image
                src={article.frontmatter.featured_image}
                alt={article.frontmatter.featured_image_alt ?? article.frontmatter.title}
                fill className="object-cover"
                priority={i === 0}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-cream">
              <p className="text-xs tracking-widest uppercase mb-2 text-cream/70">
                {article?.frontmatter.category?.replace(/-/g, ' ')}
              </p>
              <h2 className="text-2xl md:text-4xl font-serif mb-3 max-w-2xl">
                {article?.frontmatter.title}
              </h2>
              <Link
                href={`/${article?.frontmatter.category}/${article?.frontmatter.subcategory}/${article?.frontmatter.slug}`}
                className="btn-secondary border-cream text-cream hover:bg-cream hover:text-charcoal text-xs"
              >
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
