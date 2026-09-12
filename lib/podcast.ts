/**
 * Beautiful Inside by Beauticate — the one place that knows where the podcast
 * lives.
 *
 * Every surface that offers a reader a way to watch or listen (the vodcast
 * episode page, an editorial companion article, a shop brand page for a founder
 * Sig has interviewed) reads its destinations from here. Before this existed the
 * platform links were declared inline in the vodcast episode page and nowhere
 * else, which is exactly why the companion articles shipped with no way to hear
 * the episode they were written about.
 */

export const PODCAST_NAME = 'Beautiful Inside by Beauticate'

/** Show-level destinations. Per-episode links, where we have them, win. */
export const PODCAST_SHOW = {
  youtube: 'https://www.youtube.com/@sigourneycantelo',
  spotify: 'https://open.spotify.com/show/5su7l0yO5Ue0706K2Lzd8q',
  apple: 'https://podcasts.apple.com/au/podcast/beautiful-inside-by-beauticate/id1754804721',
} as const

export type PodcastPlatform = {
  name: string
  href: string
  color: string
}

/**
 * Resolve the three destinations for one episode, falling back to the show
 * where we have no per-episode link. A show-level fallback is deliberate: it
 * lands the reader in the right app with the feed in front of them, which beats
 * offering nothing at all.
 */
export function episodePlatforms(opts: {
  youtubeId?: string
  spotifyUrl?: string
  appleUrl?: string
}): PodcastPlatform[] {
  return [
    {
      name: 'YouTube',
      href: opts.youtubeId
        ? `https://www.youtube.com/watch?v=${opts.youtubeId}`
        : PODCAST_SHOW.youtube,
      color: '#FF0000',
    },
    { name: 'Spotify', href: opts.spotifyUrl || PODCAST_SHOW.spotify, color: '#1DB954' },
    { name: 'Apple Podcasts', href: opts.appleUrl || PODCAST_SHOW.apple, color: '#9933CC' },
  ]
}
