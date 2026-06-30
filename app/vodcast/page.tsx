import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { VodcastFrontmatter } from '@/types/content'
import { getVodcastEpisodes } from '@/lib/content'
import styles from './podcast.module.css'
import PodcastReveal from '@/components/vodcast/PodcastReveal'
import StickyPlayer from '@/components/vodcast/StickyPlayer'
import GettingReadyReel from '@/components/vodcast/GettingReadyReel'
import GuestRail, { type Guest } from '@/components/vodcast/GuestRail'
import ThemeArchive, { type ArchiveEpisode } from '@/components/vodcast/ThemeArchive'
import CuratorFeed from '@/components/vodcast/CuratorFeed'

export const metadata: Metadata = {
  title: 'Beautiful Inside — Podcast by Beauticate',
  description:
    'Sigourney Cantelo in conversation with the experts, founders and thought leaders shaping how we live. Watch on YouTube or listen on Spotify and Apple Podcasts.',
}

const PLATFORMS = {
  spotify: 'https://open.spotify.com/show/5su7l0yO5Ue0706K2Lzd8q',
  apple: 'https://podcasts.apple.com/au/podcast/beautiful-inside-by-beauticate/id1754804721',
  youtube: 'https://www.youtube.com/@sigourneycantelo',
}

const DEFAULT_COVER =
  'https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/38363818/38363818-1739270093542-7154f374420cb.jpg'

function episodeImage(img: string | undefined): string {
  if (!img) return DEFAULT_COVER
  return img
}

// ── Canonical theme taxonomy ────────────────────────────────────────────────
const THEMES = [
  'Confidence',
  'Reinvention',
  'Health',
  'Healing',
  'Perimenopause',
  'Beauty & Skin',
  'Business',
  'Motherhood',
  'Reset',
]

// Keyword → theme map so the filter returns results before episodes are tagged.
const THEME_KEYWORDS: { theme: string; words: string[] }[] = [
  { theme: 'Perimenopause', words: ['perimenopause', 'menopause', 'hormone'] },
  { theme: 'Health', words: ['anxiety', 'gut', 'sleep', 'longevity', 'adhd', 'mental health', 'wellness', 'nervous system'] },
  { theme: 'Healing', words: ['heartbreak', 'trauma', 'grief', 'healing', 'breathwork', 'awakening'] },
  { theme: 'Business', words: ['founder', 'business', 'brand', 'entrepreneur', 'building'] },
  { theme: 'Motherhood', words: ['mother', 'parenting', 'family', 'ivf', 'children', 'kids'] },
  { theme: 'Reinvention', words: ['reinvention', 'starting over', 'start over', 'rebuilding', 'reinvent', 'pivot'] },
  { theme: 'Confidence', words: ['confidence', 'self-worth', 'self worth', 'identity', 'boundaries', 'picking yourself'] },
  { theme: 'Beauty & Skin', words: ['skin', 'beauty', 'fragrance', 'skincare', 'acne', 'glow'] },
  { theme: 'Reset', words: ['sacred six', 'reset', 'ritual', 'intention', 'escape', 'sanity'] },
]

function inferThemes(f: VodcastFrontmatter): string[] {
  const hay = `${f.title ?? ''} ${f.excerpt ?? ''} ${f.meta_description ?? ''}`.toLowerCase()
  const out = new Set<string>()
  for (const { theme, words } of THEME_KEYWORDS) {
    if (words.some(w => hay.includes(w))) out.add(theme)
  }
  return [...out]
}

function themesFor(f: VodcastFrontmatter): string[] {
  return f.themes && f.themes.length ? f.themes : inferThemes(f)
}

function kickerFor(f: VodcastFrontmatter): string {
  if (f.guest_role) return f.guest_role
  if (f.topics && f.topics.length) return f.topics[0]
  return 'Interview'
}

function trim(excerpt: string | undefined, max = 110): string | undefined {
  if (!excerpt) return undefined
  return excerpt.length > max ? excerpt.slice(0, max - 1).trimEnd() + '…' : excerpt
}

// ── Curated marquee guest order ─────────────────────────────────────────────
const CURATED_GUESTS: { name: string; role: string; slug: string }[] = [
  { name: 'Miranda Kerr', role: 'Founder · KORA Organics', slug: 'miranda-kerr-on-faith-family-and-that-first-date-where-he-fell-asleep' },
  { name: 'Trinny Woodall', role: 'Founder · Trinny London', slug: 'trinny-woodall-on-purpose-pressure-and-picking-yourself-back-up' },
  { name: 'Celeste Barber', role: 'Comedian & writer', slug: 'celeste-barber-on-adhd-bullying-boundaries-and-the-battle-with-social-media' },
  { name: 'Gabby Bernstein', role: 'Author & speaker', slug: 'gabby-bernstein-on-manifesting-with-compassion-healing-shame-living-the-dream' },
  { name: 'Guy Sebastian', role: 'Musician', slug: 'guy-sebastian-on-identity-inner-circles-and-rebuilding-self-worth' },
  { name: 'Dr Shefali Tsabary', role: 'Clinical psychologist', slug: 'dr-shefali-tsabary-the-truth-about-conscious-parenting-screens-and-shame' },
  { name: 'Pip Edwards', role: 'Founder · P.E Nation', slug: 'pip-edwards-from-perfectionism-to-self-compassion' },
  { name: 'Susan Yara', role: 'Founder · Naturium', slug: 'susan-yara-on-reinvention-resilience-and-rebuilding-trust' },
  { name: 'Tanya Ali Jalani', role: 'Breathwork facilitator', slug: 'tanya-ali-jalani-on-awakening-mental-health-and-the-human-side-of-healing' },
  { name: 'Lindsay Price', role: 'Actor', slug: 'lindsay-price-on-healing-childhood-trauma-life-with-curtis-stone-and-her-hollywo' },
]

const APPLE_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M12 2a10 10 0 00-3 19.5c-.1-.8 0-2 .2-2.8.2-.7 1.2-5 1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2.9.5 1.7 1.4 1.7 1.7 0 2.8-2.1 2.8-4.6 0-1.9-1.3-3.3-3.6-3.3-2.6 0-4.2 2-4.2 4.1 0 .8.2 1.3.6 1.8.2.2.2.3.1.5l-.2.8c0 .3-.2.3-.5.2-1.3-.5-1.9-2-1.9-3.6 0-2.7 2.3-5.9 6.8-5.9 3.6 0 6 2.6 6 5.4 0 3.7-2 6.4-5 6.4-1 0-2-.6-2.3-1.2l-.6 2.4c-.2.8-.7 1.8-1 2.4A10 10 0 1012 2z" />
  </svg>
)
const SPOTIFY_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.6.6 0 01-.86.2c-2.35-1.44-5.3-1.76-8.8-.96a.62.62 0 11-.28-1.2c3.83-.88 7.1-.5 9.74 1.1.3.18.4.57.2.86zm1.23-2.74a.78.78 0 01-1.07.26c-2.7-1.66-6.8-2.14-10-1.17a.78.78 0 11-.45-1.5c3.64-1.1 8.18-.56 11.27 1.34.36.22.48.7.25 1.07zm.1-2.85C14.8 8.96 9.4 8.78 6.3 9.72a.94.94 0 11-.54-1.8c3.56-1.08 9.5-.87 13.24 1.35a.94.94 0 01-.96 1.6z" />
  </svg>
)
const YOUTUBE_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M23 7.5s-.22-1.56-.9-2.24c-.86-.9-1.82-.9-2.26-.96C16.7 4.07 12 4.07 12 4.07s-4.7 0-7.82.23c-.44.06-1.4.06-2.26.96C1.22 5.94 1 7.5 1 7.5S.78 9.33.78 11.16v1.7C.78 14.7 1 16.5 1 16.5s.22 1.56.9 2.24c.86.9 2 .87 2.5.97 1.8.17 7.6.22 7.6.22s4.7 0 7.82-.24c.44-.05 1.4-.06 2.26-.96.68-.68.9-2.24.9-2.24s.22-1.83.22-3.66v-1.7C23.22 9.33 23 7.5 23 7.5zM9.7 14.84V8.86l6.08 3z" />
  </svg>
)

export default function VodcastPage() {
  const episodes = getVodcastEpisodes()
  const hero = episodes[0]
  const heroF = hero?.frontmatter
  const heroSlug = heroF?.slug ?? ''
  const heroHref = `/vodcast/episodes/${heroSlug}`

  // Staggered pair = episodes 2 and 3
  const pair: ArchiveEpisode[] = episodes.slice(1, 3).map(ep => ({
    slug: ep.frontmatter.slug,
    title: ep.frontmatter.title,
    kicker: kickerFor(ep.frontmatter),
    image: episodeImage(ep.frontmatter.featured_image),
    themes: themesFor(ep.frontmatter),
  }))

  // Grids = episodes 4 onward
  const rest: ArchiveEpisode[] = episodes.slice(3).map(ep => ({
    slug: ep.frontmatter.slug,
    title: ep.frontmatter.title,
    excerpt: trim(ep.frontmatter.excerpt),
    kicker: kickerFor(ep.frontmatter),
    image: episodeImage(ep.frontmatter.featured_image),
    themes: themesFor(ep.frontmatter),
  }))

  // Theme pills: union of episode themes + canonical THEMES, in canonical order.
  const present = new Set<string>()
  episodes.forEach(ep => themesFor(ep.frontmatter).forEach(t => present.add(t)))
  const pills = ['All', ...THEMES.filter(t => present.has(t))]

  // Resolve curated guest list against the episodes, skipping any not found.
  const bySlug = new Map(episodes.map(ep => [ep.frontmatter.slug, ep.frontmatter]))
  const guests: Guest[] = CURATED_GUESTS.filter(g => bySlug.has(g.slug)).map(g => ({
    name: g.name,
    role: g.role,
    href: `/vodcast/episodes/${g.slug}`,
    image: episodeImage(bySlug.get(g.slug)?.featured_image),
  }))

  // Pull-quote breather: prefer a featured ep's pull_quote, else a curated line.
  const pullEp = episodes.find(ep => ep.frontmatter.pull_quote)
  const quote = pullEp
    ? {
        quote: pullEp.frontmatter.pull_quote as string,
        author:
          (pullEp.frontmatter.pull_quote_author ??
            pullEp.frontmatter.guest_name ??
            pullEp.frontmatter.title) + ' · Beautiful Inside',
      }
    : {
        quote: 'The most beautiful thing we can do is come home to ourselves.',
        author: 'Beautiful Inside by Beauticate',
      }

  const heroStand =
    heroF?.standfirst ??
    heroF?.excerpt ??
    'Going inside the homes, routines and inner lives of fascinating people.'

  return (
    <div className={styles.podcastPage}>
      <PodcastReveal revClass={styles.rev} inClass={styles.in} />

      {/* ===== 2 · HERO (latest episode) ===== */}
      <section className={styles.hero} id="hero">
        <Link href={heroHref} aria-label={heroF?.title ?? 'Latest episode'}>
          <div className={styles.heroImg}>
            {heroF && (
              <Image
                src={episodeImage(heroF.featured_image)}
                alt={heroF.featured_image_alt ?? heroF.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>
        </Link>
        <div className={styles.heroScrim} />

        <div className={styles.heroRating}>
          <div>
            <small>Apple Podcasts</small>
            <span className={styles.stars}>★★★★★</span>
          </div>
          <b>4.9</b>
        </div>

        <div className={`${styles.heroInner} ${styles.rev}`}>
          <div className={`${styles.heroEyebrow} ${styles.eyebrow}`}>
            <span className={styles.dot} /> Latest episode · Beautiful Inside
          </div>
          <Link href={heroHref}>
            <h1>{heroF?.title}</h1>
          </Link>
          <p className={styles.heroStand}>{heroStand}</p>
          <div className={styles.heroRow}>
            <Link href={heroHref} className={styles.playCta}>
              <span className={styles.tri}>
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>{' '}
              Play episode
            </Link>
            <div className={styles.heroPlat}>
              <span>Also on</span>
              <a href={PLATFORMS.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify">
                {SPOTIFY_ICON}
              </a>
              <a href={PLATFORMS.apple} target="_blank" rel="noopener noreferrer" aria-label="Apple Podcasts">
                {APPLE_ICON}
              </a>
              <a href={PLATFORMS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                {YOUTUBE_ICON}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4 · GETTING READY reel ===== */}
      <section className={styles.gr}>
        <div className={`${styles.wrap} ${styles.grGrid}`}>
          <div className={styles.rev}>
            <GettingReadyReel styles={styles} />
          </div>
          <div className={`${styles.grCopy} ${styles.rev}`}>
            <h2>Inside the homes, routines and inner lives of fascinating people.</h2>
            <p className={styles.lede2}>
              Each week we go beyond the surface with the experts, founders and thought leaders
              shaping how we live. The science and psychology of beauty and self-care, and the tools
              to look and feel the best you ever have, inside and out.
            </p>
            <p className={styles.pull}>
              We talk to the people improving our mindset, our health and the way we cultivate our
              own inner beauty.
            </p>
          </div>
        </div>
      </section>

      {/* ===== 5 · GUESTS RAIL ===== */}
      <GuestRail styles={styles} guests={guests} />

      {/* ===== 6 + 7 · THEME FILTER + ARCHIVE ===== */}
      <ThemeArchive styles={styles} pair={pair} rest={rest} pills={pills} quote={quote} />

      {/* ===== 8 · CURATOR.IO STRIP ===== */}
      <CuratorFeed styles={styles} />

      {/* ===== 9 · SUBSCRIBE ===== */}
      <section className={styles.subscribe}>
        <span className={styles.eyebrow}>The newsletter</span>
        <h2>Subscribe to beautify your life</h2>
        <p>
          Your weekly fix of who&apos;s worth knowing and how to live well, plus exclusive gifts,
          discounts and events, straight to your inbox.
        </p>
        <form className={styles.subform} action="/api/subscribe" method="POST">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            aria-label="Email address"
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* ===== 3 · STICKY PLAYER (fixed, slides up past hero) ===== */}
      {heroF && (
        <StickyPlayer
          styles={styles}
          title={heroF.title}
          image={episodeImage(heroF.featured_image)}
          slug={heroSlug}
          spotifyEpisodeId={heroF.spotify_episode_id}
          youtubeVideoId={heroF.youtube_video_id}
        />
      )}
    </div>
  )
}
