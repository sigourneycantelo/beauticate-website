'use client'
import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const CATEGORIES = [
  'Skincare',
  'Makeup',
  'Hair',
  'Fragrance',
  'Body',
  'Wellness & Supplements',
  'Devices & Tools',
  'Other',
]

const inputClass =
  'w-full bg-transparent border-0 border-b border-camel/40 focus:border-wine px-0 py-3 font-serif text-ink placeholder:text-charcoal-light/40 outline-none transition-colors'
const labelClass = 'font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal-light/60 mb-1 block'

export default function ReviewSubmissionForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    brandName: '',
    name: '',
    email: '',
    website: '',
    category: '',
    productName: '',
    about: '',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/reviews-submissions', {
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
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="font-serif text-ink text-center" style={{ fontSize: 'clamp(18px,2vw,22px)' }}>
          Thank you. We read every submission.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>Brand Name *</label>
        <input
          type="text"
          required
          value={form.brandName}
          onChange={e => update('brandName', e.target.value)}
          className={inputClass}
        />
      </div>

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
        <label className={labelClass}>Website *</label>
        <input
          type="url"
          required
          value={form.website}
          onChange={e => update('website', e.target.value)}
          className={inputClass}
          placeholder="https://"
        />
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <select
          value={form.category}
          onChange={e => update('category', e.target.value)}
          className={`${inputClass} appearance-none cursor-pointer`}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>What Product Are You Submitting? *</label>
        <input
          type="text"
          required
          value={form.productName}
          onChange={e => update('productName', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Tell Us About It *</label>
        <textarea
          required
          rows={5}
          value={form.about}
          onChange={e => update('about', e.target.value)}
          className={`${inputClass} resize-none`}
          placeholder="What's new about it, and why should we test it?"
        />
      </div>

      {status === 'error' && (
        <p className="font-sans text-sm text-terracotta">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-wine text-white font-sans text-[10.5px] tracking-[0.25em] uppercase px-8 py-3.5 hover:bg-wine/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending…' : 'Submit for Review'}
      </button>
    </form>
  )
}
