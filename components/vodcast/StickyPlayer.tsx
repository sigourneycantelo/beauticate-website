'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Styles = Record<string, string>

export default function StickyPlayer({
  styles,
  title,
  image,
  slug,
  spotifyEpisodeId,
  youtubeVideoId,
}: {
  styles: Styles
  title: string
  image?: string
  slug: string
  spotifyEpisodeId?: string
  youtubeVideoId?: string
}) {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [open, setOpen] = useState(false)

  const episodeHref = `/vodcast/episodes/${slug}`
  const hasEmbed = Boolean(spotifyEpisodeId || youtubeVideoId)

  useEffect(() => {
    if (dismissed) {
      setShow(false)
      return
    }
    const hero = document.getElementById('hero')
    const onScroll = () => {
      if (!hero) return
      const past = hero.getBoundingClientRect().bottom < 0
      setShow(past)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  const embedSrc = spotifyEpisodeId
    ? `https://open.spotify.com/embed/episode/${spotifyEpisodeId}?utm_source=generator&theme=0`
    : youtubeVideoId
      ? `https://www.youtube.com/embed/${youtubeVideoId}`
      : ''

  return (
    <div className={`${styles.player} ${show ? styles.show : ''}`} id="player" aria-hidden={!show}>
      <div className={styles.playerProg}>
        <div className={styles.bar} style={{ width: open ? '100%' : '0%' }} />
      </div>

      {hasEmbed && (
        <div className={`${styles.playerEmbed} ${open ? styles.open : ''}`}>
          {open && (
            <iframe
              title={`Now playing: ${title}`}
              src={embedSrc}
              height={spotifyEpisodeId ? 152 : 200}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          )}
        </div>
      )}

      <div className={styles.playerInner}>
        {hasEmbed ? (
          <button
            className={styles.ppbtn}
            aria-label={open ? 'Pause' : 'Play'}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            <svg viewBox="0 0 24 24">
              {open ? (
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
          </button>
        ) : (
          <Link className={styles.ppbtn} href={episodeHref} aria-label="Play episode">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </Link>
        )}

        <Link href={episodeHref} className={styles.pthumb} aria-label={title}>
          {image && (
            <Image src={image} alt="" fill sizes="42px" className="object-cover" />
          )}
        </Link>

        <Link href={episodeHref} className={styles.pmeta}>
          <div className={styles.pe}>Now playing · Latest episode</div>
          <div className={styles.pt}>{title}</div>
        </Link>

        <button
          className={styles.pclose}
          aria-label="Dismiss player"
          onClick={() => setDismissed(true)}
        >
          &times;
        </button>
      </div>
    </div>
  )
}
