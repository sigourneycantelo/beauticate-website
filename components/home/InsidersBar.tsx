'use client'

import { useState } from 'react'

export default function InsidersBar() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = new FormData(form).get('email') as string
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'homepage-insiders-bar' }),
    })
    setSubmitted(true)
  }

  return (
    <section
      id="insiders"
      className="full-bleed text-center"
      style={{
        background: '#FFFFFF',
        padding: 'clamp(34px,4vw,52px) clamp(20px,6vw,104px)',
      }}
    >
      <h2 className="font-serif font-normal" style={{ fontSize: 'clamp(22px,2.6vw,32px)' }}>
        Become a Beauticate Insider
      </h2>
      <p className="font-sans mt-2 mb-5 mx-auto" style={{ fontSize: '13px', opacity: 0.62, maxWidth: '52ch' }}>
        Early access to every shop drop. The beauty, wellness and travel we&rsquo;re actually buying. Plus who we&rsquo;re interviewing. Every fortnight.
      </p>

      {submitted ? (
        <p className="font-serif italic" style={{ fontSize: 'clamp(16px,1.8vw,20px)', opacity: 0.75 }}>
          You&rsquo;re in. The first edit lands in your inbox soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex max-w-[420px] mx-auto">
          <input
            type="email"
            name="email"
            required
            placeholder="Your email address"
            className="flex-1 font-sans text-[13px] px-4 py-3 bg-white"
            style={{ border: '1px solid #1C1A17', borderRight: 'none' }}
          />
          <button
            type="submit"
            className="font-sans text-[10.5px] tracking-[0.2em] uppercase text-white px-5 cursor-pointer"
            style={{ background: '#1C1A17', border: '1px solid #1C1A17' }}
          >
            Join the Insiders
          </button>
        </form>
      )}
    </section>
  )
}
