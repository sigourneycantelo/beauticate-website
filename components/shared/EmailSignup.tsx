'use client'
import { useState } from 'react'

export default function EmailSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    })
    setStatus(res.ok ? 'success' : 'error')
  }

  return (
    <section className="bg-charcoal text-cream py-16 px-4">
      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-cream mb-2">Get the edit</h2>
        <p className="text-cream/70 text-sm mb-8">
          Weekly beauty intelligence — trusted tips, expert voices, and what we're shopping now.
        </p>
        {status === 'success' ? (
          <p className="text-wine text-sm">You're in. Welcome to the Beauticate world.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-transparent border border-cream/30 text-cream placeholder-cream/40 text-sm focus:outline-none focus:border-cream"
            />
            <button type="submit" disabled={status === 'loading'} className="btn-gold whitespace-nowrap">
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-xs mt-2">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  )
}
