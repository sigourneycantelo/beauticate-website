'use client'

import { useState, FormEvent } from 'react'

export default function AdvertiseForm() {
  const [email, setEmail] = useState('')
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/advertise-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subscribeNewsletter }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto text-center">
        <p className="font-serif text-xl text-paper mb-2">You&rsquo;re in.</p>
        <p className="font-serif text-sm text-paper/60 leading-relaxed">
          Sigourney will be in touch shortly with partnership options tailored to you.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div className="flex">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="Your email address"
          className="flex-1 font-sans text-[13px] px-4 py-3 bg-transparent text-paper placeholder:text-paper/30 border border-paper/20 border-r-0 focus:border-paper/50 outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="font-sans text-[10.5px] tracking-[0.2em] uppercase px-6 py-3 bg-paper text-ink border border-paper hover:bg-paper/90 transition-colors cursor-pointer disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Get in touch'}
        </button>
      </div>
      <label className="flex items-start gap-2.5 cursor-pointer justify-center">
        <input
          type="checkbox"
          checked={!subscribeNewsletter}
          onChange={e => setSubscribeNewsletter(!e.target.checked)}
          className="mt-0.5 accent-paper"
        />
        <span className="font-sans text-[11px] text-paper/40 leading-relaxed">
          Don&rsquo;t subscribe me to the Beauticate newsletter
        </span>
      </label>
      {status === 'error' && (
        <p className="font-sans text-[11px] text-red-300 text-center">
          Something went wrong. Please try again or email sigourney@beauticate.com directly.
        </p>
      )}
    </form>
  )
}
