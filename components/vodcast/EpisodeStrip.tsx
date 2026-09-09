import Link from 'next/link'
import { PODCAST_NAME, episodePlatforms } from '@/lib/podcast'

/**
 * "Watch or listen" strip for Beautiful Inside by Beauticate.
 *
 * Companion articles and shop brand pages used to talk about an episode without
 * ever offering a way to hear it — the video and the platform links lived only
 * on /vodcast/episodes/<slug>. This is the shared block that fixes that, in two
 * shapes:
 *
 *   full    — greige panel with the episode embedded, for the top of an article
 *   compact — a slim band with a thumbnail and the platform links, for a shop
 *             brand page or an article the episode is a footnote to
 */

interface Props {
  /** YouTube video id — renders the player (full) or the thumbnail (compact). */
  youtubeId?: string
  /** Per-episode links where we have them; otherwise the show is used. */
  spotifyUrl?: string
  appleUrl?: string
  /** Internal episode page, when the episode is published on site. */
  episodeHref?: string
  /** Line above the buttons, e.g. "Sigourney interviews Jess Sepel". */
  heading?: string
  variant?: 'full' | 'compact'
  className?: string
}

const ICONS: Record<string, React.ReactNode> = {
  YouTube: (
    <svg width="17" height="12" viewBox="0 0 24 17" fill="currentColor" aria-hidden="true">
      <path d="M23.495 2.656A3.015 3.015 0 0 0 21.374.516C19.505 0 12 0 12 0S4.495 0 2.626.516A3.015 3.015 0 0 0 .505 2.656C0 4.534 0 8.45 0 8.45s0 3.916.505 5.794a3.015 3.015 0 0 0 2.121 2.14C4.495 16.9 12 16.9 12 16.9s7.505 0 9.374-.516a3.015 3.015 0 0 0 2.121-2.14C24 12.366 24 8.45 24 8.45s0-3.916-.505-5.794zM9.545 12.023V4.877l6.273 3.573-6.273 3.573z" />
    </svg>
  ),
  Spotify: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  ),
  'Apple Podcasts': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.34 0A5.328 5.328 0 0 0 0 5.34v13.32A5.328 5.328 0 0 0 5.34 24h13.32A5.328 5.328 0 0 0 24 18.66V5.34A5.328 5.328 0 0 0 18.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.878 2.915 2.078 4.718.064.563.077.6.077 1.02 0 .397-.013.44-.077.978-.206 1.87-.917 3.407-2.166 4.657-.746.746-1.51 1.224-2.596 1.63-.536.2-.794.25-1.247.3-.444.05-.776.025-1.096-.073-.696-.21-1.202-.87-1.202-1.59 0-.734.527-1.413 1.253-1.59.25-.057.27-.064.52-.077.37-.02.638-.089.99-.256.89-.428 1.556-1.214 1.876-2.23.128-.41.18-.795.17-1.273-.013-.756-.218-1.4-.647-1.985-.577-.79-1.468-1.28-2.464-1.344-.13-.008-.26-.013-.4-.013-1.37 0-2.52.755-3.054 2.01-.168.396-.24.78-.24 1.312 0 .565.077 1.01.255 1.464.268.69.71 1.22 1.33 1.59.307.18.77.37 1.14.46.282.07.41.172.517.39.09.193.09.39 0 .57-.09.19-.244.32-.46.397-.295.11-.616.08-.88-.05-.77-.38-1.437-.96-1.97-1.72-.77-1.09-1.16-2.41-1.1-3.76.09-2.16 1.15-4.01 2.88-5.11.97-.61 2.08-.93 3.27-.93zm.17 4.085c1.51 0 2.77 1.26 2.77 2.77s-1.26 2.77-2.77 2.77-2.77-1.26-2.77-2.77 1.24-2.77 2.77-2.77zm0 1.1c-.92 0-1.67.75-1.67 1.67s.75 1.67 1.67 1.67 1.67-.75 1.67-1.67-.75-1.67-1.67-1.67z" />
    </svg>
  ),
}

function PlatformLinks({ platforms }: { platforms: ReturnType<typeof episodePlatforms> }) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
      {platforms.map(p => (
        <a
          key={p.name}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 font-sans text-[10px] sm:gap-2 sm:px-4 font-medium uppercase tracking-[0.14em] text-charcoal transition-opacity hover:opacity-70"
          style={{ border: '1px solid rgba(28,26,23,.14)' }}
        >
          <span style={{ color: p.color }}>{ICONS[p.name]}</span>
          {p.name === 'YouTube' ? 'Watch' : p.name === 'Spotify' ? 'Spotify' : 'Apple'}
        </a>
      ))}
    </div>
  )
}

export default function EpisodeStrip({
  youtubeId,
  spotifyUrl,
  appleUrl,
  episodeHref,
  heading,
  variant = 'full',
  className = '',
}: Props) {
  const platforms = episodePlatforms({ youtubeId, spotifyUrl, appleUrl })
  // The primary "listen" destination: the episode page when it exists on site,
  // otherwise straight out to the platform the reader is most likely to finish
  // the episode in.
  const listenHref = episodeHref ?? platforms[1].href

  if (variant === 'compact') {
    return (
      <div
        className={`not-prose flex flex-col gap-4 rounded-[2px] p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5 ${className}`}
        style={{ background: '#F3EFE8' }}
      >
        {youtubeId && (
          <a
            href={listenHref}
            target={episodeHref ? undefined : '_blank'}
            rel={episodeHref ? undefined : 'noopener noreferrer'}
            className="relative block w-full shrink-0 overflow-hidden rounded-[2px] bg-black sm:w-[172px]"
            style={{ aspectRatio: '16/9' }}
            aria-label="Play the episode"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#1C1A17" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </a>
        )}
        <div className="min-w-0 flex-1">
          <Link
            href="/podcast"
            className="font-sans text-[9.5px] uppercase tracking-[0.2em] text-charcoal-light transition-opacity hover:opacity-70"
          >
            {PODCAST_NAME}
          </Link>
          {heading && (
            <p className="mb-3 mt-1.5 font-serif text-[17px] leading-[1.35] text-charcoal">{heading}</p>
          )}
          <PlatformLinks platforms={platforms} />
        </div>
      </div>
    )
  }

  return (
    <div className={`not-prose rounded-[2px] p-5 sm:p-7 ${className}`} style={{ background: '#F3EFE8' }}>
      <Link
        href="/podcast"
        className="font-sans text-[9.5px] uppercase tracking-[0.2em] text-charcoal-light transition-opacity hover:opacity-70"
      >
        {PODCAST_NAME}
      </Link>
      <p className="mt-1.5 font-serif text-[19px] leading-[1.3] text-charcoal sm:text-[21px]">
        {heading ?? 'Watch or listen to the full episode'}
      </p>

      {youtubeId && (
        <div
          className="relative mt-5 w-full overflow-hidden rounded-[2px] bg-black"
          style={{ aspectRatio: '16/9' }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            title={heading ?? PODCAST_NAME}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <PlatformLinks platforms={platforms} />
        {episodeHref && (
          <Link
            href={episodeHref}
            className="font-sans text-[10px] uppercase tracking-[0.16em] text-charcoal-light underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Episode notes
          </Link>
        )}
      </div>
    </div>
  )
}
