'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Styles = Record<string, string>

export interface ArchiveEpisode {
  slug: string
  title: string
  excerpt?: string
  kicker?: string
  image?: string
  themes: string[]
}

export interface QuoteBreather {
  quote: string
  author: string
}

const PLAY_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const BATCH = 9

export default function ThemeArchive({
  styles,
  pair,
  rest,
  pills,
  quote,
}: {
  styles: Styles
  pair: ArchiveEpisode[]
  rest: ArchiveEpisode[]
  pills: string[]
  quote: QuoteBreather
}) {
  const [active, setActive] = useState('All')
  const [visible, setVisible] = useState(BATCH)

  const matches = (ep: ArchiveEpisode) =>
    active === 'All' || ep.themes.includes(active)

  const filteredRest = useMemo(
    () => rest.filter(matches),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rest, active]
  )

  const shown = filteredRest.slice(0, visible)
  // First grid = first 6 of the shown set; second grid = the remainder.
  const firstGrid = shown.slice(0, 6)
  const secondGrid = shown.slice(6)
  const allShown = visible >= filteredRest.length

  const selectPill = (pill: string) => {
    setActive(pill)
    setVisible(BATCH)
  }

  const renderCard = (ep: ArchiveEpisode) => (
    <Link key={ep.slug} className={styles.ep} href={`/vodcast/episodes/${ep.slug}`}>
      <div className={styles.epImg}>
        {ep.image && (
          <Image
            src={ep.image}
            alt={ep.title}
            fill
            sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw"
            className="object-cover"
          />
        )}
      </div>
      {ep.kicker && <span className={`${styles.cat} ${styles.eyebrow}`}>{ep.kicker}</span>}
      <h3>{ep.title}</h3>
      {ep.excerpt && <p>{ep.excerpt}</p>}
      <span className={styles.listen}>
        {PLAY_ICON}
        <span>Listen</span>
      </span>
    </Link>
  )

  return (
    <section className={styles.archive}>
      <div className={styles.wrap}>
        <div className={`${styles.secHead} ${styles.rev}`} style={{ marginBottom: 0 }}>
          <div>
            <span className={styles.eyebrow}>All episodes</span>
            <h2>Find your next listen</h2>
          </div>
        </div>

        <div className={`${styles.moodbar} ${styles.rev}`}>
          {pills.map(pill => (
            <button
              key={pill}
              className={`${styles.mood} ${active === pill ? styles.active : ''}`}
              onClick={() => selectPill(pill)}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Staggered featured pair (always visible, not filtered) */}
        {pair.length > 0 && (
          <div className={`${styles.pair} ${styles.rev}`}>
            {pair.map(ep => (
              <Link
                key={ep.slug}
                className={styles.epScrim}
                href={`/vodcast/episodes/${ep.slug}`}
              >
                <div className={styles.pairImg}>
                  {ep.image && (
                    <Image
                      src={ep.image}
                      alt={ep.title}
                      fill
                      sizes="(max-width: 620px) 100vw, 50vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className={styles.scr} />
                <div className={styles.epCopy}>
                  {ep.kicker && <span className={styles.eyebrow}>{ep.kicker}</span>}
                  <h3>{ep.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* First 3-up grid */}
        <div className={styles.grid3}>{firstGrid.map(renderCard)}</div>

        {/* Pull-quote breather */}
        <div className={`${styles.quoteband} ${styles.rev}`}>
          <span className={styles.eyebrow}>From the episodes</span>
          <blockquote>{quote.quote}</blockquote>
          <cite>{quote.author}</cite>
        </div>

        {/* Second 3-up grid */}
        {secondGrid.length > 0 && (
          <div className={styles.grid3}>{secondGrid.map(renderCard)}</div>
        )}

        {filteredRest.length === 0 && (
          <p className={styles.curNote}>No episodes in this theme yet.</p>
        )}

        {filteredRest.length > BATCH && (
          <button
            className={styles.loadmore}
            disabled={allShown}
            onClick={() => setVisible(v => v + BATCH)}
          >
            {allShown ? 'You are all caught up' : 'Load more episodes'}
          </button>
        )}
      </div>
    </section>
  )
}
