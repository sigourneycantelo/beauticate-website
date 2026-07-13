'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import CartButton from '@/components/shop/CartButton'

export type MegaCard = { title: string; href: string; image?: string; imageAlt?: string; eyebrow: string; meta?: string; soon?: boolean }
export type MegaLink = { label: string; href: string }
export type MegaChild = { label: string; href: string }
// A sub renders either as image cards (default) or, when `list` is set, as a full text
// list of every item with `cards` shown as a few featured highlights on top.
// When `children` is set, the sub shows a nested flyout instead of cards.
export type MegaSub = { label: string; href: string; cards: MegaCard[]; list?: MegaLink[]; disabled?: boolean; children?: MegaChild[] }
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

function Wordmark({ className = '', priority = false, shop = false }: { className?: string; priority?: boolean; shop?: boolean }) {
  if (shop) return <Image src="/beauticate-shop-logo.png" alt="Beauticate Shop" width={516} height={120} priority={priority} className={`${className} mh-logo-shop`} style={{ mixBlendMode: 'multiply' }} />
  return <Image src="/logo-dark.png" alt="Beauticate" width={997} height={135} priority={priority} className={className} />
}


function Card({ c }: { c: MegaCard }) {
  return (
    <Link href={c.href} className={`mh-card${c.soon ? ' mh-card-soon' : ''}`}>
      <span className="mh-card-img">
        {c.image ? <Image src={c.image} alt={c.imageAlt || c.title} fill sizes="(max-width:1080px) 22vw, 220px" className="mh-card-obj" /> : null}
        {c.soon && <span className="mh-card-badge">Coming Soon</span>}
      </span>
      <span className="mh-card-title">{c.title}</span>
    </Link>
  )
}

function PillarItem({ p }: { p: Pillar }) {
  const [active, setActive] = useState(p.subs[0]?.label ?? '')
  const activeSub = p.subs.find(s => s.label === active) ?? p.subs[0]
  const cards = activeSub?.cards ?? []
  const hasMega = p.subs.length > 0

  // Hover-intent: a short open delay stops menus flashing as the cursor sweeps across
  // pillars, and a close grace period lets the cursor travel diagonally from the pillar
  // to a card without the menu snapping shut.
  const [open, setOpen] = useState(false)
  const openT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const closeT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const onEnter = () => { clearTimeout(closeT.current); openT.current = setTimeout(() => setOpen(true), 90) }
  const onLeave = () => { clearTimeout(openT.current); closeT.current = setTimeout(() => setOpen(false), 260) }
  useEffect(() => () => { clearTimeout(openT.current); clearTimeout(closeT.current) }, [])

  return (
    <li className={`mh-pillar${p.isShop ? ' is-shop' : ''}${open ? ' open' : ''}`} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <Link href={p.href} className="mh-pillar-link">{p.label}</Link>
      {hasMega && (
        <div className="mh-mega">
          <div className="mh-mega-inner">
            <div className="mh-subs">
              <span className="mh-eyebrow">{p.eyebrow}</span>
              <ul>
                {p.subs.map(s => (
                  <li key={s.label} className={s.children ? 'mh-has-flyout' : ''}>
                    {s.disabled ? (
                      <span
                        className={`mh-sub-soon${active === s.label ? ' active' : ''}`}
                        onMouseEnter={() => setActive(s.label)}
                      >
                        {s.label}<em>Soon</em>
                      </span>
                    ) : s.children ? (
                      <>
                        <Link
                          href={s.href}
                          className={`mh-sub-parent${active === s.label ? ' active' : ''}`}
                          onMouseEnter={() => setActive(s.label)}
                          onFocus={() => setActive(s.label)}
                        >
                          {s.label}
                          <svg className="mh-fly-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><polyline points="9 6 15 12 9 18" /></svg>
                        </Link>
                        <ul className="mh-flyout">
                          {s.children.map(c => (
                            <li key={c.href}><Link href={c.href}>{c.label}</Link></li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link
                        href={s.href}
                        className={active === s.label ? 'active' : ''}
                        onMouseEnter={() => setActive(s.label)}
                        onFocus={() => setActive(s.label)}
                      >{s.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
              <Link href={p.allHref} className="mh-all">{p.allLabel} &rarr;</Link>
            </div>
            {activeSub?.disabled ? (
              <div className="mh-cards"><p className="mh-soon-note">Our {activeSub.label} edit is coming soon.</p></div>
            ) : activeSub?.children ? (
              <div className="mh-cards"><p className="mh-soon-note">Browse our curated directory of salons, spas, clinics &amp; wellness destinations.</p></div>
            ) : activeSub?.list ? (
              <div className="mh-mega-list">
                {cards.length > 0 && (
                  <div className="mh-featured">
                    {cards.map((c, i) => <Card key={`${active}-f-${i}`} c={c} />)}
                  </div>
                )}
                <ul className="mh-list">
                  {activeSub.list.map((l) => (
                    <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mh-cards">
                {cards.map((c, i) => <Card key={`${active}-${i}`} c={c} />)}
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

export default function Masthead({ pillars }: { pillars: Pillar[] }) {
  const pathname = usePathname()
  const isShop = pathname?.startsWith('/shop') ?? false
  const [scrolled, setScrolled] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [megaHidden, setMegaHidden] = useState(false)
  const tick = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (tick.current) return
      tick.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(prev => (prev ? y > 10 : y > 64))
        tick.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  useEffect(() => {
    if (megaHidden) {
      const t = setTimeout(() => setMegaHidden(false), 400)
      return () => clearTimeout(t)
    }
  }, [pathname, megaHidden])

  const handleNavClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.mh-mega a, .mh-pillar-link')) setMegaHidden(true)
  }

  return (
    <header className={`mh${scrolled ? ' mh-scrolled' : ''}${megaHidden ? ' mh-closing' : ''}`}>
      {/* Utility tier */}
      <div className="mh-utility">
        <div className="mh-util-left">
          <button className="mh-hamburger" aria-label="Open menu" onClick={() => setDrawer(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></svg>
          </button>
          {isShop && (
            <Link href="/" className="mh-back-site" aria-label="Back to Beauticate">
              <span aria-hidden>&larr;</span> Beauticate
            </Link>
          )}
          <div className="mh-social">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"><SocialIcon d={s.d} /></a>
            ))}
          </div>
          <Link href="/subscribe" className="mh-util-link">Subscribe</Link>
        </div>

        <div className="mh-wordmark-group">
          <Link href={isShop ? '/shop' : '/'} className="mh-wordmark" aria-label={isShop ? 'Beauticate Shop' : 'Beauticate home'}><Wordmark className="mh-logo mh-logo-lg" priority shop={isShop} /></Link>
          {!isShop && <p className="mh-strapline">Beauty, wellness and lifestyle. Stories and shopping.</p>}
        </div>

        <div className="mh-util-right">
          <Link href="/about" className="mh-util-link">About</Link>
          <Link href="/search" className="mh-icon-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><circle cx="11" cy="11" r="7" /><line x1="16.2" y1="16.2" x2="21" y2="21" /></svg>
          </Link>
          <Link href="/account" className="mh-util-link mh-signin">Sign In</Link>
          <CartButton />
        </div>
      </div>

      {/* Primary tier */}
      <nav className="mh-primary" aria-label="Primary" onClick={handleNavClick}>
        <Link href={isShop ? '/shop' : '/'} className="mh-brand-mini" aria-hidden="true" tabIndex={-1}><Wordmark className="mh-logo mh-logo-mini" shop={isShop} /></Link>
        <ul className="mh-pillars">
          {pillars.map(p => <PillarItem key={p.key} p={p} />)}
        </ul>
      </nav>

      {/* Mobile drawer */}
      <div className={`mh-scrim${drawer ? ' open' : ''}`} onClick={() => setDrawer(false)} aria-hidden="true" />
      <aside className={`mh-drawer${drawer ? ' open' : ''}`} aria-label="Menu">
        <div className="mh-drawer-head">
          <Wordmark className="mh-logo mh-logo-drawer" shop={isShop} />
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
                  {p.subs.map(s => s.disabled
                    ? <span key={s.label} className="mh-d-soon">{s.label} <em>Soon</em></span>
                    : s.children ? (
                      <div key={s.label} className="mh-d-group">
                        <Link href={s.href} className="mh-d-group-label" onClick={() => setDrawer(false)}>{s.label}</Link>
                        <div className="mh-d-group-children">
                          {s.children.map(c => (
                            <Link key={c.href} href={c.href} onClick={() => setDrawer(false)}>{c.label}</Link>
                          ))}
                        </div>
                      </div>
                    )
                    : <Link key={s.label} href={s.href} onClick={() => setDrawer(false)}>{s.label}</Link>)}
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
