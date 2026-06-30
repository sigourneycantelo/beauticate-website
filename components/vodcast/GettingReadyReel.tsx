'use client'

import { useEffect, useState } from 'react'

type Styles = Record<string, string>

const POSTER = '/images/podcast/getting-ready-poster.jpg'
const VIDEO_SRC = '/videos/getting-ready-with-sig.mp4'
// Instagram permalink for Sig's getting-ready reel. When set, the whole reel
// clicks through to the IG post (caption + comments). Leave '' to keep it
// as a non-clickable on-page reel. e.g. 'https://www.instagram.com/reel/XXXX/'
const IG_URL = ''

export default function GettingReadyReel({ styles, igUrl = IG_URL }: { styles: Styles; igUrl?: string }) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Tinted gradient placeholder is the CSS background of .grVideo, so if the
  // video/poster files are missing the box degrades gracefully (no broken icon).
  const inner = (
    <>
      {mounted && isMobile ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={POSTER} alt="Getting ready with Sig" loading="lazy" />
      ) : (
        <video
          muted
          autoPlay
          loop
          playsInline
          preload="none"
          poster={POSTER}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}
      <div className={styles.scr} />
      <span className={styles.grPlay} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <div className={styles.cap}>
        <span className={styles.eyebrow}>Behind the scenes</span>
        <b>Getting ready with Sig</b>
      </div>
    </>
  )

  // When an Instagram permalink is provided, the whole reel links out to the
  // post so people can read the caption / watch it on IG (opens in a new tab).
  if (igUrl) {
    return (
      <a
        className={styles.grVideo}
        href={igUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Watch Getting ready with Sig on Instagram"
      >
        {inner}
      </a>
    )
  }

  return <div className={styles.grVideo}>{inner}</div>
}
