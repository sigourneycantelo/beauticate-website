import SearchResults from '@/components/shared/SearchResults'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Search Beauticate' }

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  return <SearchResults query={q ?? ''} />
}
