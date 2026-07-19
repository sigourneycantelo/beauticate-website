'use client'
import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const inputClass =
  'w-full bg-transparent border-0 border-b border-camel/40 focus:border-wine px-0 py-3 font-serif text-ink placeholder:text-charcoal-light/40 outline-none transition-colors'
const labelClass = 'font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal-light/60 mb-1 block'

export default function SuggestForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    suggestion: '',
    why: '',
    anythingElse: '',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="font-serif text-ink text-center" style={{ fontSize: 'clamp(18px,2vw,22px)' }}>
          Noted, and thank you.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>Your Name *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={e => update('name', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Email *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={e => update('email', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>What Brand or Product Should We Be Stocking? *</label>
        <input
          type="text"
          required
          value={form.suggestion}
          onChange={e => update('suggestion', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Why Do You Love It?</label>
        <textarea
          rows={4}
          value={form.why}
          onChange={e => update('why', e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>Anything Else You Want to See More Of?</label>
        <textarea
          rows={4}
          value={form.anythingElse}
          onChange={e => update('anythingElse', e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p className="font-sans text-sm text-terracotta">Something went wrong. Please try again.</p>
      )}

      <p className="font-serif text-charcoal-light/60 text-sm leading-relaxed">
        By submitting, you&rsquo;ll also join our newsletter for the latest from Beauticate. You can unsubscribe anytime.
      </p>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-wine text-white font-sans text-[10.5px] tracking-[0.25em] uppercase px-8 py-3.5 hover:bg-wine/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending…' : 'Tell Us'}
      </button>
    </form>
  )
}
