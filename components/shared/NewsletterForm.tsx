'use client'

import { useState, FormEvent } from 'react'

type Variant = 'light' | 'dark'

export default function NewsletterForm({
  variant = 'light',
  source = 'footer',
  endpoint = '/api/subscribe',
  buttonLabel = 'Subscribe',
  successMessage = 'You’re in. Welcome to the edit.',
}: {
  variant?: Variant
  source?: string
  endpoint?: string
  buttonLabel?: string
  successMessage?: string
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  const isDark = variant === 'dark'

  if (status === 'success') {
    return (
      <p className={`font-serif italic text-sm ${isDark ? 'text-cream/70' : 'opacity-70'}`}>
        {successMessage}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[420px]">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="Your email address"
        className={`flex-1 font-sans text-[13px] px-4 py-3 ${
          isDark
            ? 'bg-transparent text-cream placeholder:text-cream/40 border border-cream/30 border-r-0'
            : 'bg-white border border-charcoal border-r-0'
        }`}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`font-sans text-[10.5px] tracking-[0.2em] uppercase px-5 whitespace-nowrap cursor-pointer disabled:opacity-50 ${
          isDark
            ? 'bg-cream text-charcoal border border-cream'
            : 'bg-charcoal text-white border border-charcoal'
        }`}
      >
        {status === 'loading' ? '...' : buttonLabel}
      </button>
    </form>
  )
}
