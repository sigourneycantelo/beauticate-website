'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { SORT_OPTIONS, DEFAULT_SORT, normalizeSort } from '@/lib/product-sort'

// Sort dropdown for the product grids. A plain <select> so mobile gets the native
// picker. The choice is written to the `?sort=` URL param (removed when default) so
// it's shareable and survives back/refresh. On server-rendered grids the URL change
// re-runs the page; the client CategoryBrowser reads the same param.
export default function SortSelect({ className = '' }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = normalizeSort(searchParams.get('sort'))

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(searchParams.toString())
    if (e.target.value === DEFAULT_SORT) next.delete('sort')
    else next.set('sort', e.target.value)
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <label className={`inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.14em] uppercase text-charcoal-light ${className}`}>
      <span className="whitespace-nowrap">Sort by</span>
      <select
        value={current}
        onChange={onChange}
        aria-label="Sort products"
        className="border border-ink/20 rounded-[2px] bg-white px-3 py-2 font-sans text-[11px] tracking-[0.08em] text-ink hover:border-ink focus:border-ink focus:outline-none transition-colors"
      >
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}
