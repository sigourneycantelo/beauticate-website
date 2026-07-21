'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function Sacred60Form({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/sacred60/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName: firstName || undefined }),
      })
      if (!res.ok) throw new Error()

      localStorage.setItem('sacred60_access', '1')
      setStatus('success')
      setTimeout(() => router.push('/sacred60shop'), 800)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={className}>
        <p className="font-serif text-lg text-center" style={{ opacity: 0.8 }}>
          You're in. Redirecting to the guide...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-3 w-full" style={{ maxWidth: '420px', margin: '0 auto' }}>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="First name (optional)"
          className="font-sans text-[13px] px-4 py-3 rounded-[1px] outline-none"
          style={{
            border: '1px solid rgba(28,26,23,.2)',
            background: '#fff',
            color: '#1C1A17',
          }}
        />
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          className="font-sans text-[13px] px-4 py-3 rounded-[1px] outline-none"
          style={{
            border: '1px solid rgba(28,26,23,.2)',
            background: '#fff',
            color: '#1C1A17',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="font-sans text-[10.5px] tracking-[0.2em] uppercase font-medium px-6 py-3.5 rounded-[1px] transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: '#1C1A17', color: '#fff', border: '1px solid #1C1A17' }}
        >
          {status === 'loading' ? 'Sending...' : 'Send Me the Guide'}
        </button>
      </div>
      {status === 'error' && (
        <p className="font-sans text-[12px] text-center mt-3" style={{ color: '#a33' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
