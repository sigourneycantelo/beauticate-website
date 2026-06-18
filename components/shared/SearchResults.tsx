interface Props { query: string }

export default function SearchResults({ query }: Props) {
  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <h1 className="mb-8">
        {query ? `Results for "${query}"` : 'Search'}
      </h1>
      {/* Pagefind UI will be initialised here */}
      <div id="pagefind-search" />
    </div>
  )
}
