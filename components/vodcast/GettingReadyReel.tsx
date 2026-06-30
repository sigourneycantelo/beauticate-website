'use client'

import { useEffect, useState } from 'react'

type Styles = Record<string, string>

const POSTER = '/images/podcast/getting-ready-poster.jpg'
const VIDEO_SRC = '/videos/getting-ready-with-sig.mp4'

export default function GettingReadyReel({ styles }: { styles: Styles }) {
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
  return (
    <div className={styles.grVideo}>
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
      <button className={styles.grPlay} aria-label="Play video" type="button">
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      <div className={styles.cap}>
        <span className={styles.eyebrow}>Behind the scenes</span>
        <b>Getting ready with Sig</b>
      </div>
    </div>
  )
}
