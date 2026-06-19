import { getArticlesByCategory } from '@/lib/content'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interviews — Beauticate',
  description: 'In-depth conversations with the people shaping beauty, wellness and the way we live — from makeup artists and dermatologists to founders and cultural icons.',
}

const SUBCATEGORY_LABELS: Record<string, string> = {
  'actors-presenters': 'Actors & Presenters',
  'founders': 'Founders',
  'models': 'Models',
  'creatives': 'Creatives',
  'tastemakers': 'Tastemakers',
}

export default async function InterviewsPage() {
  type Article = NonNullable<ReturnType<typeof getArticlesByCategory>[number]>
  const all = (getArticlesByCategory('interviews')
    .filter(a => a != null && a.frontmatter.published !== false) as Article[])
    .sort((a, b) =>
      new Date(b.frontmatter.date_published).getTime() -
      new Date(a.frontmatter.date_published).getTime()
    )

  const hero = all[0]
  const featured = all.slice(1, 4)
  const rest = all.slice(4)

  // Group rest by subcategory
  const bySubcat: Record<string, typeof rest> = {}
  for (const a of rest) {
    const sub = a.frontmatter.subcategory ?? 'other'
    if (!bySubcat[sub]) bySubcat[sub] = []
    bySubcat[sub].push(a)
  }

  return (
    <div className="bg-white">

      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-3">Interviews</p>
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight mb-5">
          The people shaping beauty
        </h1>
        <p className="font-serif text-lg text-charcoal/60 max-w-xl mx-auto leading-relaxed">
          Makeup artists, dermatologists, founders, models, tastemakers — the experts and icons Sigourney has spent 25 years getting to know.
        </p>
      </section>

      {/* Hero interview */}
      {hero && (
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <Link href={`/interviews/${hero.frontmatter.subcategory}/${hero.frontmatter.slug}`} className="group block md:flex gap-10 items-center">
            {hero.frontmatter.featured_image && (
              <div className="md:w-1/2 relative aspect-[4/3] overflow-hidden bg-cream mb-6 md:mb-0">
                <Image
                  src={hero.frontmatter.featured_image}
                  alt={hero.frontmatter.featured_image_alt ?? hero.frontmatter.title}
                  fill
                  className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                  priority
                />
              </div>
            )}
            <div className="md:w-1/2">
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-3">
                {SUBCATEGORY_LABELS[hero.frontmatter.subcategory ?? ''] ?? hero.frontmatter.subcategory}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal leading-tight mb-4 group-hover:text-gold transition-colors">
                {hero.frontmatter.title}
              </h2>
              <p className="font-serif text-base text-charcoal/60 leading-relaxed mb-6">
                {hero.frontmatter.excerpt}
              </p>
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal border-b border-charcoal pb-0.5 group-hover:text-gold group-hover:border-gold transition-colors">
                Read more
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Featured three */}
      {featured.length > 0 && (
        <section className="border-t border-gray-100 py-12">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            {featured.map(a => (
              <Link
                key={a.frontmatter.slug}
                href={`/interviews/${a.frontmatter.subcategory}/${a.frontmatter.slug}`}
                className="group"
              >
                {a.frontmatter.featured_image && (
                  <div className="relative aspect-[3/4] overflow-hidden bg-cream mb-4">
                    <Image
                      src={a.frontmatter.featured_image}
                      alt={a.frontmatter.featured_image_alt ?? a.frontmatter.title}
                      fill
                      className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                )}
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold mb-2">
                  {SUBCATEGORY_LABELS[a.frontmatter.subcategory ?? ''] ?? a.frontmatter.subcategory}
                </p>
                <h3 className="font-serif text-lg text-charcoal leading-snug group-hover:text-gold transition-colors">
                  {a.frontmatter.title}
                </h3>
                {a.frontmatter.excerpt && (
                  <p className="font-serif text-sm text-charcoal/50 mt-2 line-clamp-2">{a.frontmatter.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* By subcategory */}
      {Object.entries(bySubcat).map(([sub, articles]) => (
        <section key={sub} className="border-t border-gray-100 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif text-2xl text-charcoal">
                {SUBCATEGORY_LABELS[sub] ?? sub.replace(/-/g, ' ')}
              </h2>
              <Link
                href={`/interviews/${sub}`}
                className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 hover:text-gold transition-colors"
              >
                See all
              </Link>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {articles.slice(0, 4).map(a => (
                <Link
                  key={a.frontmatter.slug}
                  href={`/interviews/${a.frontmatter.subcategory}/${a.frontmatter.slug}`}
                  className="group"
                >
                  {a.frontmatter.featured_image && (
                    <div className="relative aspect-[3/4] overflow-hidden bg-cream mb-3">
                      <Image
                        src={a.frontmatter.featured_image}
                        alt={a.frontmatter.featured_image_alt ?? a.frontmatter.title}
                        fill
                        className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  )}
                  <h3 className="font-serif text-sm text-charcoal leading-snug group-hover:text-gold transition-colors">
                    {a.frontmatter.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

    </div>
  )
}
