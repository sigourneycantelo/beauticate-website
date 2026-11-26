'use client'

import { useState } from 'react'

/**
 * Click-to-play YouTube facade for the full EpisodeStrip.
 *
 * The poster is deliberately typographic, with no image. The article's hero is
 * already directly above this strip, and YouTube's auto-thumbnail clashes with
 * the house look. The real iframe only loads on click, so the page doesn't pay
 * for the YouTube player until a reader wants it. The VideoObject schema is
 * emitted separately from frontmatter and doesn't depend on this component.
 */
export default function EpisodePlayer({
  youtubeId,
  title,
  label,
}: {
  youtubeId: string
  title: string
  label: string
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div
      className="relative mt-5 w-full overflow-hidden rounded-[2px]"
      style={{ aspectRatio: '16/9', background: playing ? '#000' : '#E9E3D8' }}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${title}`}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
        >
          <span className="font-sans text-[9.5px] uppercase tracking-[0.22em] text-charcoal-light">
            {label}
          </span>
          <span className="max-w-[30ch] font-serif text-[20px] leading-[1.3] text-charcoal sm:text-[26px]">
            {title}
          </span>
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-105"
            style={{ border: '1px solid rgba(28,26,23,.14)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1C1A17" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="font-sans text-[9.5px] uppercase tracking-[0.18em] text-charcoal-light">
            Play episode
          </span>
        </button>
      )}
    </div>
  )
}
