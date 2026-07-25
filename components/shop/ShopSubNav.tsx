'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Fragment, useState, useRef, useEffect } from 'react'

// Secondary shop navigation — a centred, dot-separated row that opens preview
// dropdowns on hover (Category / Brand / Moment), mirroring the main shop mega.
export type SubNavItem = { label: string; href: string; image?: string; soon?: boolean }
interface Props { category: SubNavItem[]; brands: SubNavItem[]; moments: SubNavItem[] }

const TABS = [
  { key: 'category', label: 'Shop by Category', href: '/shop', match: (p: string) => p === '/shop' || /^\/shop\/(beauty|wellness|living|style)/.test(p) },
  { key: 'brand', label: 'Shop by Brand', href: '/shop/brands', match: (p: string) => p.startsWith('/shop/brands') },
  { key: 'moment', label: 'Shop by Moment', href: '/shop/by-moment', match: (p: string) => p.startsWith('/shop/by-moment') || p.startsWith('/shop/collections') },
  { key: 'freeship', label: 'Free Shipping', href: '/shop/free-shipping', match: (p: string) => p === '/shop/free-shipping' },
  { key: 'about', label: 'About', href: '/about', match: (p: string) => p === '/about' },
] as const

function Card({ label, href, image, soon }: SubNavItem) {
  return (
    <Link href={soon ? '/shop/style' : href} className="group block text-center">
      <span className="relative block aspect-square overflow-hidden bg-tile rounded-[2px] mb-2">
        {image ? <Image src={image} alt={label} fill sizes="220px" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" style={{ filter: 'sepia(.24) saturate(1.3)' }} /> : null}
        {soon && <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-[9px] tracking-[0.2em] uppercase text-ink bg-white/90 px-3 py-1.5 rounded-full whitespace-nowrap">Coming Soon</span>}
      </span>
      <span className="font-serif text-[15px] leading-tight text-ink group-hover:underline group-hover:[text-underline-offset:3px] group-hover:[text-decoration-thickness:0.5px]">{label}</span>
    </Link>
  )
}

export default function ShopSubNav({ category, brands, moments }: Props) {
  const path = usePathname()
  const [open, setOpen] = useState<string | null>(null)
  const [mastheadHidden, setMastheadHidden] = useState(false)
  const closeT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const openRef = useRef<string | null>(null)
  const openMenu = (k: string) => {
    clearTimeout(closeT.current)
    openRef.current = k
    setOpen(k)
    window.dispatchEvent(new CustomEvent('subnav-open'))
  }
  const closeSoon = () => {
    clearTimeout(closeT.current)
    const snapshot = openRef.current
    closeT.current = setTimeout(() => {
      if (openRef.current === snapshot) {
        openRef.current = null
        setOpen(null)
      }
    }, 220)
  }
  useEffect(() => { openRef.current = null; setOpen(null) }, [path])
  useEffect(() => () => clearTimeout(closeT.current), [])

  useEffect(() => {
    const mh = document.querySelector<HTMLElement>('.mh')
    if (!mh) return
    const ob = new MutationObserver(() => {
      setMastheadHidden(mh.classList.contains('mh-hidden'))
    })
    ob.observe(mh, { attributes: true, attributeFilter: ['class'] })
    const onMega = () => { clearTimeout(closeT.current); setOpen(null) }
    window.addEventListener('mega-open', onMega)
    return () => { ob.disconnect(); window.removeEventListener('mega-open', onMega) }
  }, [])

  const listFor = (k: string | null) => (k === 'brand' ? brands : k === 'moment' ? moments : [])

  return (
    <div className={`bg-white shop-subnav-sticky relative${mastheadHidden ? ' mh-away' : ''}`} style={{ borderBottom: '1px solid rgba(28,26,23,.10)' }} onMouseLeave={closeSoon}>
      <nav aria-label="Shop navigation" className="max-w-wide mx-auto flex items-center justify-center flex-nowrap" style={{ gap: '0', padding: '16px clamp(20px,6vw,104px)' }}>
        {TABS.map((tab, i) => {
          const active = tab.match(path) || open === tab.key
          const hasMenu = tab.key !== 'about' && tab.key !== 'freeship'
          return (
            <Fragment key={tab.key}>
              {i > 0 && <span aria-hidden className="select-none" style={{ opacity: 0.28, margin: '0 clamp(16px,2.4vw,32px)' }}>·</span>}
              <span
                className="inline-flex"
                onMouseEnter={() => (hasMenu ? openMenu(tab.key) : setOpen(null))}
                onMouseLeave={closeSoon}
              >
                <Link
                  href={tab.href}
                  className="font-sans whitespace-nowrap transition-colors duration-150 hover:!opacity-100"
                  style={{ fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: active ? 1 : 0.6, color: active ? '#1C1A17' : undefined }}
                >
                  {tab.label}
                </Link>
              </span>
            </Fragment>
          )
        })}
      </nav>

      {open && open !== 'about' && open !== 'freeship' && (
        <div
          className="absolute left-0 right-0 top-full bg-white border-t border-b border-[rgba(42,38,33,.10)] shadow-[0_18px_40px_-28px_rgba(42,38,33,.35)] z-[60]"
          onMouseEnter={() => clearTimeout(closeT.current)}
          onMouseLeave={closeSoon}
        >
          <div className="max-w-wide mx-auto px-[clamp(24px,5vw,64px)] py-9">
            {open === 'category' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {category.map(c => <Card key={c.href} {...c} />)}
              </div>
            )}
            {(open === 'brand' || open === 'moment') && (
              <div className="grid md:grid-cols-[1.1fr_1.4fr] gap-x-12 gap-y-6 items-start">
                <ul className="columns-2 gap-x-8" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {listFor(open).map(it => (
                    <li key={it.href} className="break-inside-avoid">
                      <Link href={it.href} className="block py-1.5 font-sans text-[12px] tracking-[0.06em] uppercase text-ink/80 hover:text-wine transition-colors">{it.label}</Link>
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-3 gap-5">
                  {listFor(open).slice(0, 3).map(c => <Card key={c.href} {...c} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
