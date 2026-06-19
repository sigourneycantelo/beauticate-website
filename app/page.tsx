import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedArticles, getArticlesByCategory } from '@/lib/content'
import EditorialGrid from '@/components/article/EditorialGrid'
import TheCollective from '@/components/shared/TheCollective'
import EmailSignup from '@/components/shared/EmailSignup'
import InstagramFeed from '@/components/shared/InstagramFeed'

export default async function HomePage() {
  const [featured, beautyArticles, wellnessArticles, interviewArticles] = await Promise.all([
    getFeaturedArticles(8),
    getArticlesByCategory('beauty-style'),
    getArticlesByCategory('wellness'),
    getArticlesByCategory('interviews'),
  ])

  // Hero = first featured article with an image
  const hero = featured.find(a => a?.frontmatter.featured_image)
  const editorialArticles = featured.filter(a => a?.frontmatter.featured_image)

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      {hero && (
        <section className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] bg-cream-100 overflow-hidden">
          <Image
            src={hero.frontmatter.featured_image!}
            alt={hero.frontmatter.featured_image_alt ?? hero.frontmatter.title}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-charcoal/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16 max-w-wide mx-auto">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-cream/70 mb-2 block">
              {hero.frontmatter.category?.replace(/-/g, ' ')}
            </span>
            <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl text-cream leading-tight max-w-2xl mb-4">
              {hero.frontmatter.title}
            </h1>
            <Link
              href={`/${hero.frontmatter.category}${hero.frontmatter.subcategory ? `/${hero.frontmatter.subcategory}` : ''}/${hero.frontmatter.slug}`}
              className="inline-block font-sans text-[10px] tracking-[0.22em] uppercase text-cream border-b border-cream/50 pb-0.5 hover:border-cream transition-colors"
            >
              Read More
            </Link>
          </div>
        </section>
      )}

      {/* ── Newsletter bar ────────────────────────────────────────── */}
      <NewsletterBar />

      {/* ── Editorial grid ────────────────────────────────────────── */}
      <EditorialGrid articles={editorialArticles as any} />

      {/* ── Divider label ─────────────────────────────────────────── */}
      <SectionDivider label="Beauty & Style" href="/beauty-style" />
      <EditorialGrid articles={beautyArticles.slice(0, 5) as any} />

      {/* ── Divider label ─────────────────────────────────────────── */}
      <SectionDivider label="Wellness" href="/wellness" />
      <EditorialGrid articles={wellnessArticles.slice(0, 5) as any} />

      {/* ── Interviews ────────────────────────────────────────────── */}
      {interviewArticles.length > 0 && (
        <>
          <SectionDivider label="Interviews" href="/interviews" />
          <EditorialGrid articles={interviewArticles.slice(0, 5) as any} />
        </>
      )}

      {/* ── The Beauticate Collective ──────────────────────────────── */}
      <TheCollective />

      {/* ── Instagram feed ────────────────────────────────────────── */}
      <InstagramFeed />

      {/* ── Email signup ──────────────────────────────────────────── */}
      <EmailSignup />
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────

function NewsletterBar() {
  return (
    <div className="bg-cream border-b border-cream-200 py-5 px-4">
      <div className="max-w-wide mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold mb-0.5">Join Beauticate Insiders</p>
          <p className="font-serif text-sm text-charcoal-light">
            Beauty, wellness, style, living, destinations — curated weekly.
          </p>
        </div>
        <form
          action="/api/subscribe"
          method="POST"
          className="flex gap-0 w-full sm:w-auto"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Your email"
            className="flex-1 sm:w-56 px-4 py-2.5 border border-charcoal/20 bg-transparent text-sm font-serif placeholder:text-charcoal-light/60 focus:outline-none focus:border-charcoal"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-charcoal text-cream font-sans text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-charcoal-light transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  )
}

function SectionDivider({ label, href }: { label: string; href: string }) {
  return (
    <div className="max-w-wide mx-auto px-4 mt-4 mb-0">
      <div className="flex items-center justify-between border-t border-cream-200 pt-6">
        <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase font-bold">
          {label}
        </h2>
        <Link
          href={href}
          className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light hover:text-gold transition-colors"
        >
          View All
        </Link>
      </div>
    </div>
  )
}
