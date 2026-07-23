'use client'

import { useState, FormEvent } from 'react'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main
      style={{
        background: '#FBF9F4',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(60px,10vw,120px) clamp(20px,6vw,104px)',
        textAlign: 'center',
      }}
    >
      <span
        className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium mb-4"
        style={{ opacity: 0.55 }}
      >
        Beauticate Insiders
      </span>
      <h1
        className="font-serif font-normal"
        style={{ fontSize: 'clamp(30px,4vw,52px)', letterSpacing: '-.015em', marginBottom: '12px' }}
      >
        Join the Beauticate Insiders
      </h1>
      <p
        className="font-serif italic"
        style={{ fontSize: 'clamp(15px,1.6vw,20px)', opacity: 0.6, marginBottom: '20px' }}
      >
        fashion. beauty. wellness. living. destinations.
      </p>
      <p
        className="font-sans"
        style={{ fontSize: '14px', opacity: 0.7, maxWidth: '44ch', marginBottom: '36px', lineHeight: 1.6 }}
      >
        One beautifully edited email a week. Delivered to your inbox, every Sunday.
      </p>

      {status === 'success' ? (
        <p className="font-serif italic" style={{ fontSize: 'clamp(16px,1.8vw,20px)', opacity: 0.75 }}>
          You&rsquo;re in. The first edit lands in your inbox soon.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 w-full"
          style={{ maxWidth: '440px' }}
        >
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Your email address"
            className="flex-1 font-sans text-[13px] px-4 py-3 rounded-[1px] outline-none"
            style={{
              border: '1px solid rgba(28,26,23,.25)',
              background: '#fff',
              color: '#1C1A17',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="font-sans text-[10.5px] tracking-[0.2em] uppercase font-medium px-6 py-3 rounded-[1px] transition-opacity hover:opacity-80 whitespace-nowrap disabled:opacity-50"
            style={{ background: '#1C1A17', color: '#fff', border: '1px solid #1C1A17' }}
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="font-sans mt-4" style={{ fontSize: '12px', color: '#B5613A' }}>
          Something went wrong. Please try again.
        </p>
      )}

      <p
        className="font-sans mt-5"
        style={{ fontSize: '11px', opacity: 0.4 }}
      >
        No spam, ever. Unsubscribe at any time.
      </p>
    </main>
  )
}
