'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

interface VariantSelection {
  /** Currently selected variant id (GID). */
  variantId?: string
  /** Select a variant — updates the buy box, the gallery and the URL together. */
  select: (variantId: string) => void
}

const VariantSelectionContext = createContext<VariantSelection | null>(null)

export function useVariantSelection(): VariantSelection {
  const ctx = useContext(VariantSelectionContext)
  if (!ctx) throw new Error('useVariantSelection must be used inside <VariantSelectionProvider>')
  return ctx
}

/**
 * One source of truth for "which variant is the reader looking at", shared by the
 * buy box and the image gallery. Before this the two were siblings with no link
 * between them, so choosing a colourway moved the price and left the photo behind.
 */
export default function VariantSelectionProvider({
  initialVariantId,
  variantIds,
  children,
}: {
  initialVariantId?: string
  /** Every variant id on the product — used to validate a `?variant=` off the URL. */
  variantIds: string[]
  children: React.ReactNode
}) {
  const [variantId, setVariantId] = useState(initialVariantId)

  // A deep link should keep working when it's shared on, so the selection is
  // written back to `?variant=`. Deliberately the native history API rather than
  // router.replace: this needs no server round trip, and replaceState (not push)
  // means Back leaves the product instead of walking through every colourway the
  // reader tried.
  const select = useCallback((id: string) => {
    setVariantId(id)
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    url.searchParams.set('variant', id.split('/').pop() ?? id)
    window.history.replaceState(window.history.state, '', url)
  }, [])

  // Back/forward can still land on a different ?variant= — the entry the reader
  // arrived on, or one from another product page. Re-read it so the gallery and
  // the buy box never drift apart from the URL.
  useEffect(() => {
    const syncFromUrl = () => {
      const wanted = new URLSearchParams(window.location.search).get('variant')?.split('/').pop()
      const match = wanted ? variantIds.find(id => id.split('/').pop() === wanted) : undefined
      setVariantId(match ?? initialVariantId)
    }
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialVariantId, variantIds.join(',')])

  return (
    <VariantSelectionContext.Provider value={{ variantId, select }}>
      {children}
    </VariantSelectionContext.Provider>
  )
}
