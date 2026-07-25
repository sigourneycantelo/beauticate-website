'use client'

import { useState } from 'react'

export default function InsidersBar() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    await fetch('/api/subscribe', { method: 'POST', body: data })
    setSubmitted(true)
  }

  return (
    <section
      id="insiders"
      className="text-center"
      style={{
        background: '#FFFFFF',
        padding: 'clamp(24px,3vw,40px) clamp(20px,6vw,104px)',
      }}
    >
      <h2 className="font-serif font-normal" style={{ fontSize: 'clamp(22px,2.6vw,32px)' }}>
        The art of living beautifully, edited.
      </h2>
      <p className="font-sans mt-2 mb-5 mx-auto" style={{ fontSize: '15px', opacity: 0.62, maxWidth: '52ch' }}>
        The best of beauty, wellness, style and travel. Plus what we&rsquo;re buying and who we&rsquo;re interviewing. Every fortnight.
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
            className="flex-1 font-sans text-[16px] px-4 py-3 bg-white"
            style={{ border: '1px solid #1C1A17', borderRight: 'none' }}
          />
          <button
            type="submit"
            className="font-sans text-[10.5px] tracking-[0.2em] uppercase text-white px-5 cursor-pointer"
            style={{ background: '#1C1A17', border: '1px solid #1C1A17' }}
          >
            Join the edit
          </button>
        </form>
      )}
    </section>
  )
}
