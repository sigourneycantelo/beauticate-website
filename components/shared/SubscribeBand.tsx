'use client'
import { useState } from 'react'

export default function SubscribeBand() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <aside
      className="not-prose my-14 py-12 px-8 text-center"
      style={{ background: '#F3EFE8' }}
      aria-label="Newsletter signup"
    >
      {status === 'done' ? (
        <p className="font-serif italic text-[19px] text-charcoal leading-relaxed">
          You're in. The edit lands in your inbox shortly.
        </p>
      ) : (
        <>
          <p className="font-serif text-[22px] leading-[1.35] text-charcoal mb-2">
            The beauty edit, in your inbox.
          </p>
          <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal-light mb-7">
            Expert picks, honest reviews, stories worth reading — weekly.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 min-w-0 px-4 py-3 text-sm bg-white border border-cream-200 text-charcoal placeholder:text-charcoal-light focus:outline-none focus:border-charcoal-light transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-charcoal text-white font-sans text-[10.5px] tracking-[0.22em] uppercase hover:bg-charcoal-light transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {status === 'loading' ? '…' : 'Subscribe'}
            </button>
          </form>
          {status === 'error' && (
            <p className="mt-3 font-sans text-[11px] text-terracotta tracking-wide">
              Something went wrong — please try again.
            </p>
          )}
        </>
      )}
    </aside>
  )
}
