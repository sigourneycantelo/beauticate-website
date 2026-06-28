'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import CartButton from '@/components/shop/CartButton'
import SearchBar from '@/components/shared/SearchBar'

// ─── Icons ────────────────────────────────────────────────────────────────────
function IgIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  )
}
function TikTokIcon() {
  return (
    <svg width="13" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.28 8.28 0 0 0 4.84 1.54V6.78a4.85 4.85 0 0 1-1.07-.09z" />
    </svg>
  )
}
function YtIcon() {
  return (
    <svg width="18" height="13" viewBox="0 0 24 17" fill="currentColor">
      <path d="M23.495 2.656A3.015 3.015 0 0 0 21.374.516C19.505 0 12 0 12 0S4.495 0 2.626.516A3.015 3.015 0 0 0 .505 2.656C0 4.534 0 8.45 0 8.45s0 3.916.505 5.794a3.015 3.015 0 0 0 2.121 2.14C4.495 16.9 12 16.9 12 16.9s7.505 0 9.374-.516a3.015 3.015 0 0 0 2.121-2.14C24 12.366 24 8.45 24 8.45s0-3.916-.505-5.794zM9.545 12.023V4.877l6.273 3.573-6.273 3.573z" />
    </svg>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MegaArticle {
  frontmatter: {
    title: string
    slug: string
    category: string
    subcategory?: string
    featured_image?: string
    featured_image_alt?: string
  }
}

export interface MegaMenuEntry {
  label: string
  href: string
  articles: MegaArticle[]
  groupHeader?: string  // if set, renders a group label above this entry
}

export interface MegaMenuData {
  beauty: MegaMenuEntry[]
  style: MegaMenuEntry[]
  wellness: MegaMenuEntry[]
  destinations: MegaMenuEntry[]
  interviews: MegaMenuEntry[]
}

// ─── Nav config ───────────────────────────────────────────────────────────────
const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/beauticate/', icon: <IgIcon /> },
  { label: 'Pinterest', href: 'https://www.pinterest.com/beauticate/', icon: <PinIcon /> },
  { label: 'TikTok', href: 'https://www.tiktok.com/@sigourneycantelo', icon: <TikTokIcon /> },
  { label: 'YouTube', href: 'https://www.youtube.com/sigourneycantelo', icon: <YtIcon /> },
]

const NAV_ITEMS = [
  { label: 'Shop', href: '/shop', lead: true },
  { label: 'Beauty', href: '/beauty-style', megaKey: 'beauty' as const },
  { label: 'Style', href: '/beauty-style/style', megaKey: 'style' as const },
  { label: 'Wellness', href: '/wellness', megaKey: 'wellness' as const },
  { label: 'Destinations', href: '/destinations', megaKey: 'destinations' as const },
  { label: 'Living', href: '/living' },
  { label: 'Podcast', href: '/vodcast' },
  { label: 'Interviews', href: '/interviews', megaKey: 'interviews' as const },
]

function articleHref(f: MegaArticle['frontmatter']) {
  return `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
}

// ─── Full-width tabbed mega menu ──────────────────────────────────────────────
function MegaMenu({
  entries,
  open,
  onMouseEnter,
  onMouseLeave,
}: {
  entries: MegaMenuEntry[]
  open: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  const [activeHref, setActiveHref] = useState(entries[0]?.href ?? '')
  const active = entries.find(e => e.href === activeHref) ?? entries[0]

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute left-0 right-0 top-full z-50 bg-white text-left ${open ? 'grid' : 'hidden'}`}
      style={{
        gridTemplateColumns: '220px 1fr',
        gap: '48px',
        padding: '34px clamp(20px,6vw,104px) 40px',
        borderTop: '1px solid rgba(28,26,23,.10)',
        borderBottom: '1px solid rgba(28,26,23,.10)',
        boxShadow: '0 24px 40px rgba(0,0,0,.07)',
      }}
    >
      {/* Subcategory tabs */}
      <div
        className="flex flex-col gap-3 pr-6"
        style={{ borderRight: '1px solid rgba(28,26,23,.10)' }}
      >
        <p className="font-sans text-[9.5px] tracking-[0.2em] uppercase mb-1" style={{ opacity: 0.45 }}>
          Browse
        </p>
        {entries.map(e => (
          <div key={e.href}>
            {e.groupHeader && (
              <p className="font-sans text-[9.5px] tracking-[0.2em] uppercase mt-3 mb-1" style={{ opacity: 0.45 }}>
                {e.groupHeader}
              </p>
            )}
            <button
              onMouseEnter={() => setActiveHref(e.href)}
              onClick={() => setActiveHref(e.href)}
              className="font-sans text-[12px] tracking-[0.16em] uppercase text-left transition-opacity cursor-pointer w-full"
              style={{ opacity: activeHref === e.href ? 1 : 0.66 }}
            >
              {e.label}
            </button>
          </div>
        ))}
      </div>

      {/* Article cards for active subcategory */}
      <div
        className="grid grid-cols-4"
        style={{ gap: '22px', minHeight: '230px' }}
      >
        {(active?.articles ?? []).slice(0, 4).map((a, i) => (
          <Link key={i} href={articleHref(a.frontmatter)} className="group/card block">
            <div
              className="relative rounded-[2px] overflow-hidden"
              style={{ aspectRatio: '4/5', border: '1px solid rgba(28,26,23,.10)', background: '#FBF9F4' }}
            >
              {a.frontmatter.featured_image && (
                <Image
                  src={a.frontmatter.featured_image}
                  alt={a.frontmatter.featured_image_alt ?? a.frontmatter.title}
                  fill
                  loading="eager"
                  className="object-cover object-top transition-transform duration-700 group-hover/card:scale-[1.05]"
                  sizes="(max-width: 1280px) 220px, 280px"
                />
              )}
            </div>
            <span className="block font-serif italic text-[12px] mt-2 mb-0.5" style={{ opacity: 0.6 }}>
              {(a.frontmatter.subcategory ?? a.frontmatter.category).replace(/-/g, ' ')}
            </span>
            <h5 className="font-serif font-normal text-[15px] leading-[1.18]">{a.frontmatter.title}</h5>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
interface Props {
  megaMenuArticles?: MegaMenuData
}

export default function Header({ megaMenuArticles }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [openMega, setOpenMega] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpenMega(null), 400)
  }
  const openMenu = (href: string) => {
    cancelClose()
    setOpenMega(href)
  }

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(28,26,23,.10)' }}
    >
      {/* ── Top bar: social | logo | actions ── */}
      <div
        className="grid items-center gap-4"
        style={{
          gridTemplateColumns: '1fr auto 1fr',
          padding: '18px clamp(20px,6vw,104px) 0',
        }}
      >
        {/* Social — desktop only */}
        <div className="hidden md:flex gap-4 items-center">
          {SOCIAL.map(s => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="block transition-opacity"
              style={{ opacity: 0.55 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
            >
              {s.icon}
            </a>
          ))}
        </div>
        <div className="md:hidden" />

        {/* Logo */}
        <Link href="/" className="justify-self-center">
          <Image
            src="/logo-dark.png"
            alt="Beauticate"
            width={360}
            height={49}
            priority
            className="h-7 w-auto mix-blend-multiply"
          />
        </Link>

        {/* Actions */}
        <div className="justify-self-end flex items-center gap-5">
          <Link
            href="/#insiders"
            className="hidden md:inline font-sans text-[10.5px] tracking-[0.16em] uppercase transition-opacity"
            style={{ opacity: 0.7 }}
          >
            Subscribe
          </Link>
          <button
            onClick={() => setSearchOpen(v => !v)}
            aria-label="Search"
            className="transition-opacity"
            style={{ opacity: 0.7 }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <Link href="/account" aria-label="Sign in" className="hidden md:block transition-opacity" style={{ opacity: 0.7 }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
          <CartButton />
          <button
            className="lg:hidden transition-opacity"
            style={{ opacity: 0.7 }}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {menuOpen
                ? <><line x1="1" y1="1" x2="21" y2="15" /><line x1="21" y1="1" x2="1" y2="15" /></>
                : <><line x1="0" y1="2" x2="22" y2="2" /><line x1="0" y1="8" x2="22" y2="8" /><line x1="0" y1="14" x2="22" y2="14" /></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Desktop nav ── */}
      <nav
        className="hidden lg:flex items-center justify-center relative"
        style={{
          gap: '38px',
          fontSize: '11.5px',
          letterSpacing: '.18em',
          marginTop: '18px',
          paddingBottom: '15px',
          borderTop: '1px solid rgba(28,26,23,.10)',
        }}
      >
        {NAV_ITEMS.map(item => {
          const hasMega = 'megaKey' in item && item.megaKey && megaMenuArticles
          const entries = hasMega ? megaMenuArticles![item.megaKey as keyof MegaMenuData] : null

          const isOpen = openMega === item.href

          return (
            // No `relative` on this wrapper — mega positions relative to sticky <header>
            <div
              key={item.href}
              className="group"
              onMouseEnter={() => hasMega ? openMenu(item.href) : undefined}
              onMouseLeave={scheduleClose}
            >
              <Link
                href={item.href}
                className="block font-sans uppercase py-1.5 transition-colors"
                style={{
                  color: isOpen ? '#B5613A' : undefined,
                  opacity: isOpen ? 1 : (item.lead ? 1 : 0.66),
                  fontWeight: item.lead ? 600 : 500,
                }}
                onMouseEnter={e => { if (!hasMega) e.currentTarget.style.color = '#B5613A' }}
                onMouseLeave={e => { if (!hasMega) e.currentTarget.style.color = '' }}
              >
                {item.label}
              </Link>
              {entries && entries.length > 0 && (
                <MegaMenu
                  entries={entries}
                  open={isOpen}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                />
              )}
            </div>
          )
        })}
      </nav>

      {/* ── Search bar ── */}
      {searchOpen && (
        <div
          className="px-6 py-3"
          style={{ borderTop: '1px solid rgba(28,26,23,.10)' }}
        >
          <SearchBar onClose={() => setSearchOpen(false)} />
        </div>
      )}

      {/* ── Mobile nav ── */}
      {menuOpen && (
        <nav className="lg:hidden bg-white" style={{ borderTop: '1px solid rgba(28,26,23,.10)' }}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-6 py-4 font-sans text-[12px] tracking-[0.16em] uppercase"
              style={{ borderBottom: '1px solid rgba(28,26,23,.10)', opacity: 0.8 }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/account"
            className="block px-6 py-4 font-sans text-[12px] tracking-[0.16em] uppercase"
            style={{ opacity: 0.8 }}
            onClick={() => setMenuOpen(false)}
          >
            My Account
          </Link>
        </nav>
      )}
    </header>
  )
}
