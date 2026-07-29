'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const ITEMS: { text: string; href: string }[] = [
  { text: 'Listen to the podcast', href: '/vodcast' },
  { text: 'Shop the winter edit', href: '/shop' },
  { text: 'The Edit: beauty, wellness, style, living and travel, delivered fortnightly. Subscribe now.', href: '/subscribe' },
]

export default function BetaTicker() {
  const pathname = usePathname()
  const isShop = pathname?.startsWith('/shop') ?? false
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  // On the shop, a single static banner promoting free shipping brands.
  if (isShop) {
    return (
      <div className="relative bg-ink text-white text-center">
        <a href="/shop/free-shipping" className="block px-10 py-[10px] font-sans text-[10px] tracking-[0.2em] uppercase opacity-90 hover:opacity-100 transition-opacity" style={{ lineHeight: 1.7 }}>
          Free shipping on select brands &rarr;
        </a>
        <button
          onClick={(e) => { e.preventDefault(); setDismissed(true) }}
          aria-label="Dismiss"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-base leading-none"
        >
          ×
        </button>
      </div>
    )
  }

  const repeated = [...ITEMS, ...ITEMS]

  return (
    <div className="relative bg-ink text-white overflow-hidden" role="marquee" aria-label="Site announcements">
      <div className="flex whitespace-nowrap" style={{ animation: 'tick 38s linear infinite' }}>
        {repeated.map((item, i) => (
          <span key={i} className="flex-none flex items-center">
            <a
              href={item.href}
              className="px-[30px] py-[9px] font-sans text-[10px] tracking-[0.2em] uppercase opacity-90 flex-none text-white hover:opacity-100 hover:underline"
            >
              {item.text}
            </a>
            <span className="opacity-30 flex-none">·</span>
          </span>
        ))}
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-base leading-none z-10"
      >
        ×
      </button>
      <style>{`@keyframes tick { from { transform: translateX(0) } to { transform: translateX(-50%) } } @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none } }`}</style>
    </div>
  )
}
