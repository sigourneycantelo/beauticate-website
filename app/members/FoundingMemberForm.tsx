'use client'

import { useState, FormEvent } from 'react'

export default function FoundingMemberForm() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || !firstName) return
    setStatus('loading')

    try {
      const res = await fetch('/api/members/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, source: 'members-club-landing' }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="join" className="py-16 px-6 bg-parchment">
      <div className="max-w-[480px] mx-auto text-center">
        <span className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium opacity-50 mb-3">
          Early Access
        </span>
        <h2
          className="font-serif font-normal"
          style={{ fontSize: 'clamp(22px, 2.8vw, 30px)' }}
        >
          Be first to know.
        </h2>
        <p className="font-serif mt-4 opacity-70 text-[15px] leading-relaxed">
          Register your interest and we&rsquo;ll let you know the moment
          the Members&rsquo; Club opens. You&rsquo;ll start on The Edit,
          our entry tier, with everything that comes with it.
        </p>

        {status === 'success' ? (
          <p className="font-serif italic text-lg mt-8 opacity-80">
            You&rsquo;re on the list. We&rsquo;ll be in touch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-3 max-w-[380px] mx-auto">
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First name"
                className="font-sans text-[13px] px-4 py-3 bg-white border border-ink/20 outline-none"
              />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="font-sans text-[13px] px-4 py-3 bg-white border border-ink/20 outline-none"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary mt-1 disabled:opacity-50"
              >
                {status === 'loading' ? 'Joining...' : 'Join the List'}
              </button>
            </div>
            {status === 'error' && (
              <p className="font-sans text-[12px] mt-3 text-wine">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
