'use client'

import { useEffect, useRef } from 'react'

type Styles = Record<string, string>

// Beautiful Inside / behind-the-scenes feed, configured in the Curator.io dashboard.
const CURATOR_FEED_ID = '623c76fc-7e8c-4b42-84fc-6fcecb5ada69'
const CURATOR_CONTAINER_ID = 'curator-feed-beautiful-inside'
const CURATOR_SRC = `https://cdn.curator.io/published/${CURATOR_FEED_ID}.js`

export default function CuratorFeed({ styles }: { styles: Styles }) {
  const ref = useRef<HTMLDivElement>(null)

  // Lazy-inject the Curator.io script once the strip nears the viewport, so it
  // never blocks initial render. The published script populates the container
  // (#curator-feed-beautiful-inside) by id.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (document.querySelector(`script[src="${CURATOR_SRC}"]`)) return

    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          const script = document.createElement('script')
          script.async = true
          script.charset = 'UTF-8'
          script.src = CURATOR_SRC
          document.body.appendChild(script)
          io.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className={styles.curator}>
      <div className={`${styles.wrap} ${styles.curHead} ${styles.rev}`}>
        <span className={styles.eyebrow}>@beauticate · behind the mic</span>
        <h2>Beautiful Inside, off the record</h2>
        <a
          href="https://www.instagram.com/beauticate/"
          className={styles.follow}
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow on Instagram
        </a>
      </div>

      <div className={`${styles.wrap} ${styles.curatorEmbed}`}>
        <div id={CURATOR_CONTAINER_ID} ref={ref}>
          <a
            href="https://curator.io"
            target="_blank"
            rel="noopener noreferrer"
            className="crt-logo crt-tag"
          >
            Powered by Curator.io
          </a>
        </div>
      </div>
    </section>
  )
}
