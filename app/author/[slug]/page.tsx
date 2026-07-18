import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllAuthorsWithPages, getAuthorBySlug, buildPersonSchema } from '@/lib/authors'
import { getArticlesByAuthor } from '@/lib/content'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com').replace(/\/$/, '')

export function generateStaticParams() {
  return getAllAuthorsWithPages().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) return {}
  return {
    title: `${author.name} — ${author.role} | Beauticate`,
    description: author.bio ?? `Articles by ${author.name}, ${author.role} at Beauticate.`,
    alternates: { canonical: `${SITE_URL}/author/${author.slug}` },
    openGraph: {
      title: `${author.name} — ${author.role}`,
      description: author.bio ?? `Articles by ${author.name}, ${author.role} at Beauticate.`,
      url: `${SITE_URL}/author/${author.slug}`,
      type: 'profile',
      ...(author.photo ? { images: [{ url: `${SITE_URL}${author.photo}` }] } : {}),
    },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author || !author.photo) notFound()

  const articles = getArticlesByAuthor(author.name)
  const personSchema = {
    '@context': 'https://schema.org',
    ...buildPersonSchema(author, SITE_URL),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <section className="max-w-3xl mx-auto px-5 pt-16 pb-12">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-cream-200 mb-5">
            <Image
              src={author.photo}
              alt={author.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <h1 className="font-serif text-[28px] md:text-[34px] leading-[1.15] mb-1.5">
            {author.name}
          </h1>
          <p className="font-sans text-[11px] tracking-[.22em] uppercase text-charcoal-light mb-3">
            {author.role}
          </p>
          {author.bio && (
            <p className="text-[14px] leading-[1.7] text-charcoal-light max-w-[52ch] mb-4">
              {author.bio}
            </p>
          )}
          {author.sameAs && author.sameAs.length > 0 && (
            <div className="flex gap-4 text-[12px] text-charcoal-light">
              {author.instagram && (
                <a href={author.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-charcoal transition-colors">
                  Instagram
                </a>
              )}
              {author.linkedin && (
                <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-charcoal transition-colors">
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-20">
        <h2 className="font-sans text-[11px] tracking-[.22em] uppercase text-charcoal-light mb-8">
          Articles by {author.name.split(' ')[0]}
        </h2>

        {articles.length === 0 ? (
          <p className="text-[14px] text-charcoal-light">No articles yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {articles.map(a => {
              const f = a!.frontmatter
              const href = `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
              return (
                <Link key={f.slug} href={href} className="group block">
                  <div className="relative overflow-hidden rounded-[2px] border border-cream-200 aspect-[4/5]">
                    {f.featured_image ? (
                      <Image
                        src={f.featured_image}
                        alt={f.featured_image_alt ?? f.title}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#cdc4bb] to-[#8f857b]" />
                    )}
                  </div>
                  <span className="font-sans text-[10px] tracking-[.22em] uppercase font-medium text-charcoal-light block mt-3.5 mb-1.5">
                    {(f.subcategory ?? f.category).replace(/-/g, ' ')}
                  </span>
                  <h3 className="font-serif font-normal text-[20px] leading-[1.16]">{f.title}</h3>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
