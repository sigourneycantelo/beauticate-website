'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props { onClose?: () => void }

export default function SearchBar({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      onClose?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-2xl mx-auto">
      <input
        autoFocus type="search" value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search articles, products, brands..."
        className="flex-1 bg-transparent border-b border-charcoal py-2 text-sm focus:outline-none focus:border-wine"
      />
      <button type="submit" className="text-sm tracking-widest uppercase hover:text-wine">Search</button>
      {onClose && (
        <button type="button" onClick={onClose} className="text-charcoal-light hover:text-charcoal">×</button>
      )}
    </form>
  )
}
