import SearchResults from '@/components/shared/SearchResults'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Search Beauticate' }

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  return <SearchResults query={searchParams.q ?? ''} />
}
