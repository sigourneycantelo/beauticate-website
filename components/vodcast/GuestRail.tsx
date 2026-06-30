'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Styles = Record<string, string>

export interface Guest {
  name: string
  role: string
  image?: string
  href: string
}

export default function GuestRail({
  styles,
  guests,
}: {
  styles: Styles
  guests: Guest[]
}) {
  const railRef = useRef<HTMLDivElement>(null)

  const step = () => {
    const rail = railRef.current
    if (!rail) return 0
    return Math.min(rail.clientWidth * 0.8, 560)
  }
  const next = () => railRef.current?.scrollBy({ left: step(), behavior: 'smooth' })
  const prev = () => railRef.current?.scrollBy({ left: -step(), behavior: 'smooth' })

  return (
    <section className={styles.guests}>
      <div className={styles.wrap}>
        <div className={`${styles.secHead} ${styles.rev}`}>
          <div>
            <span className={styles.eyebrow}>The guests</span>
            <h2>Who we&apos;ve had in the room</h2>
          </div>
          <div className={styles.railCtrl}>
            <button onClick={prev} aria-label="Previous">
              <svg viewBox="0 0 24 24">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button onClick={next} aria-label="Next">
              <svg viewBox="0 0 24 24">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.rail} ref={railRef}>
        {guests.map(g => (
          <Link key={g.href} className={styles.guest} href={g.href}>
            <div className={styles.guestImg}>
              {g.image && (
                <Image
                  src={g.image}
                  alt={g.name}
                  fill
                  sizes="(max-width: 768px) 60vw, 260px"
                  className="object-cover"
                />
              )}
            </div>
            <div className={styles.meta}>
              <div className={styles.nm}>{g.name}</div>
              <div className={styles.rl}>{g.role}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
