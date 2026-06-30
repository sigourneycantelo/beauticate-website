'use client'

import { useEffect, useRef, useState } from 'react'

type Styles = Record<string, string>

// Empty placeholder for now. Drop the Curator.io feed id here to go live.
const CURATOR_FEED_ID = ''

const PLACEHOLDER_TONES = ['t-blush', 't-taupe', 't-sage', 't-clay', 't-dusk', 't-stone']

const IG_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.36 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .36-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.36-1-.42-2.2-.06-1.3-.07-1.7-.07-4.9s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.36 2.2-.42 1.3-.06 1.7-.07 4.9-.07z" />
  </svg>
)

export default function CuratorFeed({ styles }: { styles: Styles }) {
  const ref = useRef<HTMLDivElement>(null)
  const [injected, setInjected] = useState(false)

  useEffect(() => {
    if (!CURATOR_FEED_ID || injected) return
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          // Curator.io target container
          const feed = document.createElement('div')
          feed.className = 'curator-feed'
          feed.setAttribute('data-feed-id', CURATOR_FEED_ID)
          el.innerHTML = ''
          el.appendChild(feed)

          const script = document.createElement('script')
          script.async = true
          script.charset = 'UTF-8'
          script.src = `https://cdn.curator.io/published/${CURATOR_FEED_ID}.js`
          document.body.appendChild(script)

          setInjected(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [injected])

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

      {CURATOR_FEED_ID ? (
        <div className={styles.curRail} id="curatorFeed" ref={ref} />
      ) : (
        <>
          <div className={styles.curRail} id="curatorFeed" ref={ref}>
            {PLACEHOLDER_TONES.map((tone, i) => (
              <a key={tone} className={`${styles.curTile} ${tone}`}>
                {i === 0 && <span className={styles.ig}>{IG_ICON}</span>}
              </a>
            ))}
          </div>
          <p className={styles.curNote}>Feed slot · Curator.io</p>
        </>
      )}
    </section>
  )
}
