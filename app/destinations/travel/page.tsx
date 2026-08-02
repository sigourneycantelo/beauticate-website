import Image from 'next/image'
import Link from 'next/link'
import { getArticlesBySubcategory } from '@/lib/content'
import InsidersBar from '@/components/home/InsidersBar'
import EditorialSections from '@/components/shared/EditorialSections'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Travel',
  description: 'Destination guides, hotel reviews, travel beauty and Sigourney\'s travel edits — curated for the beauty-obsessed traveller.',
}

const FEELINGS = [
  { slug: 'girls-trip', title: 'Girls trip', sub: 'Weekends away with your best', image: '/destinations/feeling-girls-trip.jpg' },
  { slug: 'reset', title: 'Reset & heal', sub: 'Wellness & longevity stays', image: '/destinations/feeling-reset.jpg' },
  { slug: 'switch-off', title: 'Switch off', sub: 'Retreats & do-nothing escapes', image: '/destinations/feeling-switch-off.jpg' },
  { slug: 'city', title: 'Explore a city', sub: 'Guides for 24 hours or a week', image: '/destinations/feeling-city.jpg' },
  { slug: 'family', title: 'Family adventure', sub: 'Trips that work for everyone', image: '/destinations/feeling-family.jpg' },
  { slug: 'romantic', title: 'Romantic escapes', sub: 'Mini-breaks made for two', image: '/destinations/feeling-weekender.jpg' },
]

function articleHref(f: { category: string; subcategory?: string; slug: string }) {
  return `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
}

export default function TravelPage() {
  const allTravel = getArticlesBySubcategory('destinations', 'travel')
    .filter(a => a != null && a.frontmatter.published !== false)

  const heroArticle = allTravel.find(a => a?.frontmatter.isTravelHero) ?? allTravel[0]
  const hf = heroArticle?.frontmatter
  const heroImage = hf?.hero_image ?? hf?.featured_image

  const editorialArticles = allTravel
    .filter(a => a?.frontmatter.slug !== heroArticle?.frontmatter.slug && a?.frontmatter.featured_image)
    .slice(0, 34)
    .map(a => ({ frontmatter: a!.frontmatter }))

  return (
    <div style={{ background: '#FFFFFF' }}>
      {/* HERO */}
      {heroArticle && (
        <Link href={articleHref(hf!)} className="block">
          <section className="relative h-[520px] md:h-[600px] flex items-end overflow-hidden">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={hf!.featured_image_alt ?? hf!.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 70% 20%,#C9A98A,#9C7E64 42%,#5E4A3B)' }} />
            )}
            <div
              className="absolute inset-0 z-[1]"
              style={{ background: 'linear-gradient(180deg,rgba(20,18,15,0) 40%,rgba(20,18,15,.72) 100%)' }}
            />
            <div className="relative z-10 max-w-[1240px] mx-auto w-full px-8 pb-[54px]" style={{ color: '#FBF6EE' }}>
              <p className="font-sans text-xs tracking-[0.22em] uppercase opacity-90 mb-[18px]">
                Destinations · Travel
              </p>
              <h1 className="font-serif font-medium text-[40px] md:text-[60px] leading-[1.02] max-w-[900px] tracking-[0.005em]">
                {hf!.title}
              </h1>
              {hf!.excerpt && (
                <p className="font-serif text-[21px] italic mt-4 max-w-[620px] opacity-[0.94]">
                  {hf!.excerpt}
                </p>
              )}
              {hf!.state && (
                <p className="font-sans text-xs tracking-[0.16em] uppercase mt-5 opacity-[0.85]">
                  {hf!.state}
                </p>
              )}
            </div>
          </section>
        </Link>
      )}

      {/* FEELING TILES */}
      <section className="py-[66px]" style={{ background: '#F3ECE1' }}>
        <div className="max-w-[1240px] mx-auto px-8">
          <p className="font-sans text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#A8735A' }}>
            Start with a feeling
          </p>
          <div className="flex items-baseline justify-between mb-[26px]">
            <h2 className="font-serif font-medium text-[34px] tracking-[0.01em]">Where do you want to go?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[22px]">
            {FEELINGS.map(f => (
              <Link
                key={f.slug}
                href={`/destinations/travel/feeling/${f.slug}`}
                className="relative h-[320px] rounded-[5px] overflow-hidden flex items-end group"
                style={{ color: '#FCF7EF' }}
              >
                <Image
                  src={f.image}
                  alt={f.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 900px) 50vw, 33vw"
                />
                <div
                  className="absolute inset-0 z-[1]"
                  style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(20,16,12,.72) 100%)' }}
                />
                <div className="relative z-10 p-[26px] w-full text-center">
                  <div className="font-sans text-[24px] tracking-[0.18em] uppercase font-medium">{f.title}</div>
                  <div className="font-sans text-[14px] tracking-[0.04em] opacity-[0.82] mt-[6px]">{f.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL LAYOUT */}
      <EditorialSections articles={editorialArticles} />

      {/* SUBSCRIBE */}
      <InsidersBar />

      {/* CROSS BAND — DIRECTORY LINK */}
      <section className="pt-5 pb-[66px]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div
            className="rounded-[6px] px-[50px] py-[46px] flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: '#5A5A46', color: '#F4EFE3' }}
          >
            <p className="font-serif text-[29px] font-medium leading-[1.12] max-w-[640px] md:text-left text-center">
              Looking for somewhere closer to home? Explore spas, salons and clinics near you.
            </p>
            <Link
              href="/destinations/directory"
              className="font-sans text-xs tracking-[0.16em] uppercase whitespace-nowrap px-[26px] py-[14px] rounded-[1px]"
              style={{ border: '1px solid rgba(244,239,227,0.6)' }}
            >
              Open the directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
