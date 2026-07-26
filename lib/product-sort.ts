import type { ShopifyProduct } from '@/types/shopify'

// Sort options offered on the shop, category and collection grids. `featured` is the
// default and preserves Shopify's own order (collection/manual order). The value is
// what appears in the `?sort=` URL param so a sorted grid is shareable and survives
// back/refresh.
export type SortValue = 'featured' | 'price-asc' | 'price-desc' | 'newest'

export const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
]

export const DEFAULT_SORT: SortValue = 'featured'

export function normalizeSort(sort: string | undefined | null): SortValue {
  return SORT_OPTIONS.find(o => o.value === sort)?.value ?? DEFAULT_SORT
}

const minPrice = (p: ShopifyProduct) => parseFloat(p.priceRange.minVariantPrice.amount)

// Pure, stable-ish sort over an already-fetched product list. `featured` returns the
// input order untouched. Sorting in memory (rather than re-querying Shopify) keeps a
// single fetch per page and works for the category grid, which is a union of several
// collections and has no single Shopify sort order.
export function sortProducts<T extends ShopifyProduct>(products: T[], sort: string | undefined | null): T[] {
  const key = normalizeSort(sort)
  if (key === 'featured') return products
  const out = [...products]
  switch (key) {
    case 'price-asc':
      out.sort((a, b) => minPrice(a) - minPrice(b))
      break
    case 'price-desc':
      out.sort((a, b) => minPrice(b) - minPrice(a))
      break
    case 'newest':
      // createdAt is ISO 8601, so lexicographic compare is chronological.
      out.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
      break
  }
  return out
}
