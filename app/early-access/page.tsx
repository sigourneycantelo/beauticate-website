'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function EarlyAccessPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(false)
    setLoading(true)

    const res = await fetch('/api/early-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-stone-900 mb-3">
          Beauticate
        </h1>
        <p className="text-sm uppercase tracking-[0.25em] text-stone-400 mb-10">
          Early Access Preview
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full border border-stone-300 rounded-none px-4 py-3 text-sm
                       text-stone-900 placeholder:text-stone-400
                       focus:outline-none focus:border-stone-900 transition-colors"
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-600">
              That password isn&apos;t right. Try again.
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-stone-900 text-white text-sm uppercase tracking-[0.2em]
                       py-3 hover:bg-stone-800 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
        <p className="mt-8 text-xs text-stone-400 leading-relaxed">
          You&apos;re one of a small group invited to preview the new
          Beauticate before we launch. Have a look around, shop, and
          let us know if anything feels off.
        </p>
      </div>
    </main>
  )
}
