'use client'

import { useState, FormEvent } from 'react'

export default function VodcastSubscribeForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'vodcast-page' }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="font-serif italic text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>You&rsquo;re in. Welcome to the edit.</p>
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email address"
        aria-label="Email address"
        required
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="font-sans text-xs w-full text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
