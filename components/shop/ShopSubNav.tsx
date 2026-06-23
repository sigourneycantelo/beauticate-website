'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { label: 'Shop by Brand',    href: '/shop/by-brand' },
  { label: 'Shop by Category', href: '/shop/by-category' },
  { label: 'Shop by Moment',   href: '/shop/by-moment' },
  { label: 'Shop by Curator',  href: '/shop/by-curator', soon: true },
]

export default function ShopSubNav() {
  const path = usePathname()

  return (
    <div className="bg-parchment border-b border-camel/40">
      <div className="max-w-wide mx-auto px-4">
        <nav className="flex items-stretch overflow-x-auto scrollbar-none" aria-label="Shop navigation">
          {TABS.map(tab => {
            const active = !tab.soon && path.startsWith(tab.href)
            if (tab.soon) {
              return (
                <span
                  key={tab.href}
                  className="flex items-center gap-2 px-5 py-4 font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/30 whitespace-nowrap cursor-default select-none"
                >
                  {tab.label}
                  <span className="text-[9px] tracking-[0.15em] bg-camel/40 text-charcoal/40 px-1.5 py-0.5 rounded-sm">
                    Soon
                  </span>
                </span>
              )
            }
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center px-5 py-4 font-sans text-[11px] tracking-[0.2em] uppercase whitespace-nowrap border-b-2 transition-colors duration-150 ${
                  active
                    ? 'border-ink text-ink'
                    : 'border-transparent text-charcoal/50 hover:text-ink hover:border-camel'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
