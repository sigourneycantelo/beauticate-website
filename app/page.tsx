import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedArticles, getArticlesByCategory, getAllArticles } from '@/lib/content'
import EditorialGrid from '@/components/article/EditorialGrid'
import StoryStrip from '@/components/article/StoryStrip'
import TheCollective from '@/components/shared/TheCollective'
import SocialFeed from '@/components/shared/SocialFeed'

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

  // Story strip: 4 most-recent articles with images
  const storySlugs = editorialArticles.slice(0, 4).map(a => a!.frontmatter.slug)
  const storyArticles = getAllArticles(4, [])

  // Editorial grid: all articles except the ones in the story strip, min 5 to fill the layout
  const storySlugsSet = new Set(storyArticles.map(a => a!.frontmatter.slug))
  const gridArticles = getAllArticles(10, []).filter(a => !storySlugsSet.has(a!.frontmatter.slug))

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

      {/* ── Story strip — 4 recent articles not in the editorial grid  */}
      <StoryStrip articles={storyArticles as any} />

      {/* ── Social feed — compact strip, high up ─────────────────── */}
      <SocialFeed title="Follow Along" compact />

      {/* ── Editorial grid — no overlap with story strip ─────────── */}
      <EditorialGrid articles={gridArticles as any} />

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

      {/* ── Insiders newsletter ───────────────────────────────────── */}
      <InsidersSignup />
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────

function InsidersSignup() {
  const perks = [
    { icon: '✦', label: 'Weekly edit', detail: 'Beauty, wellness & style picks curated by our editors' },
    { icon: '✦', label: 'First access', detail: 'Events, launches, and collective drops before anyone else' },
    { icon: '✦', label: 'Insider intel', detail: 'What the experts are actually buying, using, and loving' },
    { icon: '✦', label: 'No noise', detail: 'One beautifully edited email. Never spam.' },
  ]
  return (
    <section className="bg-charcoal text-cream">
      <div className="max-w-wide mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Left — text */}
        <div>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/50 mb-4">
            Beauticate Insiders
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight lowercase mb-6">
            the edit, delivered.
          </h2>
          <p className="font-serif text-lg text-cream/70 leading-relaxed mb-10">
            Join thousands of women who trust Beauticate to cut through the noise — beauty, wellness, style and living, once a week.
          </p>

          <ul className="space-y-5 mb-10">
            {perks.map(p => (
              <li key={p.label} className="flex items-start gap-3">
                <span className="text-gold mt-1 text-xs flex-none">{p.icon}</span>
                <div>
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold block mb-0.5">{p.label}</span>
                  <span className="font-serif text-sm text-cream/60">{p.detail}</span>
                </div>
              </li>
            ))}
          </ul>

          <form action="/api/subscribe" method="POST" className="flex flex-col sm:flex-row gap-0 max-w-md">
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="flex-1 px-5 py-4 bg-transparent border border-cream/20 text-cream font-serif text-sm placeholder:text-cream/30 focus:outline-none focus:border-cream/50"
            />
            <button
              type="submit"
              className="px-6 py-4 bg-gold text-cream font-sans text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-gold/80 transition-colors whitespace-nowrap"
            >
              Join Insiders
            </button>
          </form>
          <p className="font-serif text-xs text-cream/30 mt-3">
            Unsubscribe anytime. No spam, ever.
          </p>
        </div>

        {/* Right — editorial pull quotes / social proof */}
        <div className="hidden md:flex flex-col gap-5">
          <div className="border border-cream/10 p-6">
            <p className="font-serif text-xl italic leading-relaxed text-cream/80 mb-4">
              "The one newsletter I actually open every week."
            </p>
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/40">— Beauticate reader</span>
          </div>
          <div className="border border-cream/10 p-6">
            <p className="font-serif text-xl italic leading-relaxed text-cream/80 mb-4">
              "Finally a beauty edit that doesn't feel overwhelming — just the best of the best."
            </p>
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/40">— Beauticate reader</span>
          </div>
          <div className="bg-cream/5 p-6 text-center">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-cream/40 mb-2">Community</p>
            <p className="font-serif text-4xl text-gold mb-1">40k+</p>
            <p className="font-serif text-sm text-cream/50">women in our community</p>
          </div>
        </div>

      </div>
    </section>
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
