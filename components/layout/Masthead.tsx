'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import CartButton from '@/components/shop/CartButton'

export type MegaCard = { title: string; href: string; image?: string; imageAlt?: string; eyebrow: string; meta?: string }
export type MegaSub = { label: string; href: string; cards: MegaCard[] }
export type Pillar = {
  key: string; label: string; href: string; eyebrow: string
  allLabel: string; allHref: string; subs: MegaSub[]; isShop?: boolean
}

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/beauticate/', d: 'ig' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@sigourneycantelo', d: 'tt' },
  { label: 'YouTube', href: 'https://www.youtube.com/sigourneycantelo', d: 'yt' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/beauticate/', d: 'pin' },
  { label: 'Spotify', href: 'https://open.spotify.com/show/5su7l0yO5Ue0706K2Lzd8q', d: 'sp' },
]

function SocialIcon({ d }: { d: string }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 } as const
  if (d === 'ig') return <svg viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>
  if (d === 'tt') return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2 1.6 3.4 3.5 3.6v2.4c-1.3.1-2.5-.3-3.5-1v6.3c0 3.2-2.4 5.4-5.3 5.4-2.7 0-4.9-2-4.9-4.7 0-2.9 2.4-4.8 5.2-4.5v2.5c-.4-.1-.8-.2-1.2-.1-1.2.2-2 1.1-1.9 2.3.1 1.1 1 1.9 2.1 1.9 1.3 0 2.2-1 2.2-2.5V3h3.3z" /></svg>
  if (d === 'yt') return <svg viewBox="0 0 24 24" {...s}><rect x="2.5" y="6" width="19" height="12" rx="3.5" /><path d="M10.5 9.2v5.6l4.5-2.8z" fill="currentColor" stroke="none" /></svg>
  if (d === 'pin') return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9.2" /><path d="M12 7.4c-2.2 0-3.6 1.5-3.6 3.3 0 .9.4 1.9 1.2 2.2.1 0 .2 0 .2-.1l.2-.7c0-.1 0-.2-.1-.3-.3-.4-.5-.9-.5-1.4 0-1.5 1.1-2.6 2.8-2.6 1.5 0 2.4.9 2.4 2.2 0 1.6-.7 3-1.8 3-.6 0-1-.5-.9-1.1.2-.7.5-1.5.5-2 0-.5-.2-.9-.8-.9-.6 0-1.1.6-1.1 1.5 0 .5.2.9.2.9l-.8 3.2c-.2.9-.1 2 0 2.4l.1.1c.5-.7 1-1.6 1.2-2.3l.4-1.5c.3.5 1 .9 1.7.9 2.2 0 3.7-2 3.7-4.6 0-2-1.7-3.8-4.4-3.8z" fill="currentColor" stroke="none" /></svg>
  return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9.2" /><path d="M7.6 10.2c2.8-.7 5.8-.5 8.3 1M8.1 13c2.3-.5 4.6-.3 6.6.9M8.7 15.5c1.8-.4 3.4-.2 4.9.7" /></svg>
}

function Wordmark({ className = '' }: { className?: string }) {
  return <span className={className}>Beauticate<span className="mh-dot">.</span></span>
}

// Display story titles in sentence case (house style). Titles are stored Title
// Case; this lowercases all but the first word, preserving all-caps acronyms
// (DIY, SPF) and a standalone "I". Proper nouns it can't detect are lowercased.
function sentenceCase(s: string): string {
  let started = false
  return s.split(/(\s+)/).map((w) => {
    if (/^\s*$/.test(w)) return w
    const isAcronym = w.length >= 2 && w === w.toUpperCase() && /[A-Z]/.test(w)
    let out = isAcronym ? w : w.toLowerCase()
    if (out === 'i') out = 'I'
    if (!started) { out = out.charAt(0).toUpperCase() + out.slice(1); started = true }
    return out
  }).join('')
}

function Card({ c }: { c: MegaCard }) {
  return (
    <Link href={c.href} className="mh-card">
      <span className="mh-card-img">
        {c.image ? <Image src={c.image} alt={c.imageAlt || c.title} fill sizes="(max-width:1080px) 22vw, 220px" className="mh-card-obj" /> : null}
      </span>
      <span className="mh-card-eye">{c.eyebrow}</span>
      <span className="mh-card-title">{sentenceCase(c.title)}</span>
      {c.meta ? <span className="mh-card-meta">{c.meta}</span> : null}
    </Link>
  )
}

function PillarItem({ p }: { p: Pillar }) {
  const [active, setActive] = useState(p.subs[0]?.label ?? '')
  const cards = (p.subs.find(s => s.label === active) ?? p.subs[0])?.cards ?? []
  const hasMega = p.subs.length > 0
  return (
    <li className={`mh-pillar${p.isShop ? ' is-shop' : ''}`}>
      <Link href={p.href} className="mh-pillar-link">{p.label}</Link>
      {hasMega && (
        <div className="mh-mega">
          <div className="mh-mega-inner">
            <div className="mh-subs">
              <span className="mh-eyebrow">{p.eyebrow}</span>
              <ul>
                {p.subs.map(s => (
                  <li key={s.label}>
                    <Link
                      href={s.href}
                      className={active === s.label ? 'active' : ''}
                      onMouseEnter={() => setActive(s.label)}
                      onFocus={() => setActive(s.label)}
                    >{s.label}</Link>
                  </li>
                ))}
              </ul>
              <Link href={p.allHref} className="mh-all">{p.allLabel} &rarr;</Link>
            </div>
            <div className="mh-cards">
              {cards.map((c, i) => <Card key={`${active}-${i}`} c={c} />)}
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

export default function Masthead({ pillars }: { pillars: Pillar[] }) {
  const [scrolled, setScrolled] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const tick = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (tick.current) return
      tick.current = true
      requestAnimationFrame(() => { setScrolled(window.scrollY > 64); tick.current = false })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  return (
    <header className={`mh${scrolled ? ' mh-scrolled' : ''}`}>
      {/* Utility tier */}
      <div className="mh-utility">
        <div className="mh-util-left">
          <button className="mh-hamburger" aria-label="Open menu" onClick={() => setDrawer(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></svg>
          </button>
          <div className="mh-social">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"><SocialIcon d={s.d} /></a>
            ))}
          </div>
          <Link href="/subscribe" className="mh-util-link">Subscribe</Link>
          <Link href="/about" className="mh-util-link">About</Link>
        </div>

        <Link href="/" className="mh-wordmark" aria-label="Beauticate home"><Wordmark /></Link>

        <div className="mh-util-right">
          <Link href="/search" className="mh-icon-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><circle cx="11" cy="11" r="7" /><line x1="16.2" y1="16.2" x2="21" y2="21" /></svg>
          </Link>
          <Link href="/account" className="mh-util-link mh-signin">Sign In</Link>
          <CartButton />
        </div>
      </div>

      {/* Primary tier */}
      <nav className="mh-primary" aria-label="Primary">
        <Link href="/" className="mh-brand-mini" aria-hidden="true" tabIndex={-1}><Wordmark /></Link>
        <ul className="mh-pillars">
          {pillars.map(p => <PillarItem key={p.key} p={p} />)}
        </ul>
      </nav>

      {/* Mobile drawer */}
      <div className={`mh-scrim${drawer ? ' open' : ''}`} onClick={() => setDrawer(false)} aria-hidden="true" />
      <aside className={`mh-drawer${drawer ? ' open' : ''}`} aria-label="Menu">
        <div className="mh-drawer-head">
          <Wordmark className="mh-wordmark mh-drawer-word" />
          <button className="mh-drawer-close" aria-label="Close menu" onClick={() => setDrawer(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
          </button>
        </div>
        <nav className="mh-d-nav">
          {pillars.map(p => {
            const open = openKey === p.key
            return (
              <div key={p.key} className={`mh-d-item${open ? ' open' : ''}`}>
                <button className={`mh-d-pillar${p.isShop ? ' is-shop' : ''}`} onClick={() => setOpenKey(open ? null : p.key)} aria-expanded={open}>
                  <span>{p.label}</span>
                  <span className="mh-d-chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><polyline points="6 9 12 15 18 9" /></svg></span>
                </button>
                <div className="mh-d-subs">
                  {p.subs.map(s => <Link key={s.label} href={s.href} onClick={() => setDrawer(false)}>{s.label}</Link>)}
                </div>
              </div>
            )
          })}
        </nav>
        <div className="mh-d-foot">
          <Link href="/subscribe" onClick={() => setDrawer(false)}>Subscribe</Link>
          <Link href="/about" onClick={() => setDrawer(false)}>About</Link>
          <Link href="/account" onClick={() => setDrawer(false)}>Sign In</Link>
          <div className="mh-d-social">
            {SOCIALS.map(s => <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"><SocialIcon d={s.d} /></a>)}
          </div>
        </div>
      </aside>
    </header>
  )
}
