'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

// Secondary navigation for the Shop section — sits directly beneath the main
// Beauticate header, styled as a centred, dot-separated editorial row in the
// SheerLuxe manner. Mirrors the shop links on beauticate.shop.
const TABS = [
  { label: 'Shop by Category', href: '/shop/by-category' },
  { label: 'Shop by Brand',    href: '/shop/by-brand' },
  { label: 'Shop by Moment',   href: '/shop/by-moment' },
  { label: 'About',            href: '/about' },
]

export default function ShopSubNav() {
  const path = usePathname()

  return (
    <div
      className="bg-white"
      style={{ borderBottom: '1px solid rgba(28,26,23,.10)' }}
    >
      <nav
        aria-label="Shop navigation"
        className="max-w-wide mx-auto flex items-center justify-center flex-nowrap overflow-x-auto scrollbar-none"
        style={{ gap: '0', padding: '16px clamp(20px,6vw,104px)' }}
      >
        {TABS.map((tab, i) => {
          const active = path === tab.href || path.startsWith(tab.href + '/')
          return (
            <Fragment key={tab.href}>
              {i > 0 && (
                <span
                  aria-hidden
                  className="select-none"
                  style={{ opacity: 0.28, margin: '0 clamp(16px,2.4vw,32px)' }}
                >
                  ·
                </span>
              )}
              <Link
                href={tab.href}
                className="font-sans whitespace-nowrap transition-colors duration-150"
                style={{
                  fontSize: '13px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  opacity: active ? 1 : 0.6,
                  color: active ? '#1C1A17' : undefined,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#B5613A'; e.currentTarget.style.opacity = '1' }}
                onMouseLeave={e => { e.currentTarget.style.color = active ? '#1C1A17' : ''; e.currentTarget.style.opacity = active ? '1' : '0.6' }}
              >
                {tab.label}
              </Link>
            </Fragment>
          )
        })}
      </nav>
    </div>
  )
}
