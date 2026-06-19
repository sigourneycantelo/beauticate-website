'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import CartButton from '@/components/shop/CartButton'
import SearchBar from '@/components/shared/SearchBar'

const NAV_ITEMS = [
  {
    label: 'Interviews',
    href: '/interviews',
    children: [
      { label: 'Creatives', href: '/interviews/creatives' },
      { label: 'Founders', href: '/interviews/founders' },
      { label: 'Tastemakers', href: '/interviews/tastemakers' },
    ],
  },
  {
    label: 'Beauty & Style',
    href: '/beauty-style',
    children: [
      { label: 'Skin Care', href: '/beauty-style/skin-care' },
      { label: 'Makeup', href: '/beauty-style/makeup' },
      { label: 'Hair', href: '/beauty-style/hair' },
      { label: 'Fragrance', href: '/beauty-style/fragrance' },
    ],
  },
  {
    label: 'Wellness',
    href: '/wellness',
    children: [
      { label: 'Health', href: '/wellness/health' },
      { label: 'Fitness', href: '/wellness/fitness' },
      { label: 'Mindset', href: '/wellness/mindset' },
    ],
  },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Living', href: '/living' },
  { label: 'Vodcast', href: '/vodcast' },
  { label: "Sigourney's Edit", href: '/sigourneys-edit' },
  { label: 'Shop', href: '/shop' },
]

const NAV_LINK = 'font-sans text-[11px] tracking-[0.18em] uppercase font-bold hover:text-gold transition-colors'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-cream-200">

      {/* Logo row — logo centred, icons right */}
      <div className="max-w-wide mx-auto px-4 relative flex items-center h-16 md:h-20">
        {/* Logo centred */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image
            src="/logo-dark.png"
            alt="Beauticate"
            width={180}
            height={26}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {/* Icons — right */}
        <div className="flex items-center gap-3 ml-auto">
          <button onClick={() => setSearchOpen(v => !v)} className="p-2 hover:text-gold transition-colors" aria-label="Search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <Link href="/account" className="p-2 hover:text-gold transition-colors hidden md:block" aria-label="Account">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
          <CartButton />
          <button className="lg:hidden p-2" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop nav — centred below logo */}
      <nav className="hidden lg:flex items-center justify-center gap-7 border-t border-cream-200 py-3">
        {NAV_ITEMS.map(item => (
          <div key={item.href} className="relative group">
            <Link href={item.href} className={NAV_LINK}>{item.label}</Link>
            {item.children && (
              <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-cream border border-cream-200 shadow-sm min-w-44 py-3">
                  {item.children.map(child => (
                    <Link key={child.href} href={child.href}
                      className={`block px-5 py-2 ${NAV_LINK}`}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-cream-200 px-4 py-3">
          <SearchBar onClose={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-cream-200 bg-cream">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              className={`block px-6 py-4 border-b border-cream-200 ${NAV_LINK}`}
              onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/account"
            className={`block px-6 py-4 ${NAV_LINK}`}
            onClick={() => setMenuOpen(false)}>
            My Account
          </Link>
        </nav>
      )}
    </header>
  )
}
