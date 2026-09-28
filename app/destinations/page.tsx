import Image from 'next/image'
import Link from 'next/link'
import { getArticlesBySubcategory, getDirectoryListings } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Where to go and who to trust when you get there — travel guides, hotel reviews and the beauty & wellness directory.',
}

const TRAVEL_FEELINGS = ['Girls trip', 'Reset & heal', 'Switch off', 'Explore a city', 'Family adventure', 'Romantic escapes']
const DIRECTORY_TYPES = ['Spas', 'Salons', 'Skin clinics', 'Bathhouses', 'Wellness']

export default function DestinationsPage() {
  const travelArticles = getArticlesBySubcategory('destinations', 'travel')
    .filter(a => a != null && a.frontmatter.published !== false)
  const travelHero = travelArticles.find(a => a?.frontmatter.isTravelHero) ?? travelArticles[0]
  const travelImage = travelHero?.frontmatter.hero_image ?? travelHero?.frontmatter.featured_image ?? '/destinations/feeling-city.jpg'

  const venues = getDirectoryListings()
  const directoryHero = venues.find(v => v?.frontmatter.is_featured && v.frontmatter.featured_image) ?? venues.find(v => v?.frontmatter.featured_image)
  const directoryImage = directoryHero?.frontmatter.featured_image ?? '/destinations/hero.jpg'

  return (
    <div style={{ background: '#FFFFFF' }}>
      <div
        className="text-center"
        style={{ padding: 'clamp(48px,6vw,82px) clamp(20px,6vw,104px) clamp(28px,4vw,44px)' }}
      >
        <h1
          className="font-sans uppercase tracking-[0.34em] text-xs font-medium"
          style={{ opacity: 0.55 }}
        >
          Destinations
        </h1>
        <p className="font-serif text-[22px] md:text-[26px] mt-4 max-w-[560px] mx-auto leading-[1.3]">
          Where to go, and who to trust when you get there.
        </p>
      </div>

      <section className="grid md:grid-cols-2" style={{ gap: '2px' }}>
        <Link
          href="/destinations/travel"
          className="relative h-[560px] md:h-[680px] flex items-end overflow-hidden group"
          style={{ color: '#FBF6EE' }}
        >
          <Image
            src={travelImage}
            alt=""
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0 z-[1]"
            style={{ background: 'linear-gradient(180deg,rgba(20,18,15,0) 30%,rgba(20,18,15,.78) 100%)' }}
          />
          <div className="relative z-10 w-full px-8 md:px-[54px] pb-[54px]">
            <p className="font-sans text-xs tracking-[0.22em] uppercase opacity-90 mb-[14px]">
              Travel
            </p>
            <h2 className="font-serif font-medium text-[34px] md:text-[44px] leading-[1.05] max-w-[420px]">
              Where to go
            </h2>
            <p className="font-serif text-[17px] italic mt-3 max-w-[380px] opacity-[0.92]">
              Hotel reviews, destination guides and Sigourney&rsquo;s travel edits.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 max-w-[440px]">
              {TRAVEL_FEELINGS.map(f => (
                <span
                  key={f}
                  className="font-sans text-[11px] tracking-[0.08em] uppercase px-[14px] py-[8px] rounded-[1px]"
                  style={{ border: '1px solid rgba(251,246,238,0.45)' }}
                >
                  {f}
                </span>
              ))}
            </div>
            <p className="font-sans text-xs tracking-[0.16em] uppercase mt-7 underline decoration-1 underline-offset-4 opacity-95">
              Explore travel
            </p>
          </div>
        </Link>

        <Link
          href="/destinations/directory"
          className="relative h-[560px] md:h-[680px] flex items-end overflow-hidden group"
          style={{ color: '#FBF6EE' }}
        >
          <Image
            src={directoryImage}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0 z-[1]"
            style={{ background: 'linear-gradient(180deg,rgba(20,18,15,0) 30%,rgba(20,18,15,.78) 100%)' }}
          />
          <div className="relative z-10 w-full px-8 md:px-[54px] pb-[54px]">
            <p className="font-sans text-xs tracking-[0.22em] uppercase opacity-90 mb-[14px]">
              The directory
            </p>
            <h2 className="font-serif font-medium text-[34px] md:text-[44px] leading-[1.05] max-w-[420px]">
              Who to trust nearby
            </h2>
            <p className="font-serif text-[17px] italic mt-3 max-w-[380px] opacity-[0.92]">
              The spas, salons and clinics we actually rate, all around Australia.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 max-w-[440px]">
              {DIRECTORY_TYPES.map(t => (
                <span
                  key={t}
                  className="font-sans text-[11px] tracking-[0.08em] uppercase px-[14px] py-[8px] rounded-[1px]"
                  style={{ border: '1px solid rgba(251,246,238,0.45)' }}
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="font-sans text-xs tracking-[0.16em] uppercase mt-7 underline decoration-1 underline-offset-4 opacity-95">
              Browse the directory
            </p>
          </div>
        </Link>
      </section>
    </div>
  )
}
