'use client'

import { useEffect, useRef } from 'react'

type Styles = Record<string, string>

// Sig's "getting ready" Instagram reel. The official IG embed shows the real
// video, its caption, and links straight to the post. Lazy-loaded so it never
// blocks render. Leave '' to fall back to the styled placeholder tile.
const IG_PERMALINK = 'https://www.instagram.com/p/DBbE0wOSQHW/'
const IG_EMBED_SRC = 'https://www.instagram.com/embed.js'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}

export default function GettingReadyReel({ styles }: { styles: Styles }) {
  const ref = useRef<HTMLDivElement>(null)

  // Lazy-inject Instagram's embed.js once the section nears the viewport, then
  // ask it to process the blockquote into the live embed.
  useEffect(() => {
    if (!IG_PERMALINK) return
    const el = ref.current
    if (!el) return

    const render = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process()
        return
      }
      if (!document.querySelector(`script[src="${IG_EMBED_SRC}"]`)) {
        const s = document.createElement('script')
        s.async = true
        s.src = IG_EMBED_SRC
        s.onload = () => window.instgrm?.Embeds.process()
        document.body.appendChild(s)
      }
    }

    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          render()
          io.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (IG_PERMALINK) {
    return (
      <div className={styles.grEmbed} ref={ref}>
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={`${IG_PERMALINK}?utm_source=ig_embed&utm_campaign=loading`}
          data-instgrm-version="14"
          style={{ width: '100%', maxWidth: 360, margin: '0 auto', minWidth: 240 }}
        >
          <a href={IG_PERMALINK} target="_blank" rel="noopener noreferrer">
            Watch &ldquo;Getting ready with Sig&rdquo; on Instagram
          </a>
        </blockquote>
      </div>
    )
  }

  // Fallback styled placeholder tile (used only if no permalink is set).
  return (
    <div className={styles.grVideo}>
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
    </div>
  )
}
