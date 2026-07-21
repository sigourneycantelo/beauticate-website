'use client'
import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const CATEGORIES = [
  'Beauty',
  'Skincare',
  'Wellness',
  'Supplements',
  'Fitness',
  'Living and Interiors',
  'Fashion and Accessories',
  'Travel',
  'Other',
]

const inputClass =
  'w-full bg-transparent border-0 border-b border-camel/40 focus:border-wine px-0 py-3 font-serif text-ink placeholder:text-charcoal-light/40 outline-none transition-colors'
const labelClass = 'font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal-light/60 mb-1 block'

export default function BrandApplyForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    brandName: '',
    name: '',
    email: '',
    website: '',
    instagram: '',
    category: '',
    location: '',
    shopify: '',
    canShipAu: '',
    about: '',
    firstProduct: '',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/partners/apply', {
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
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="font-serif text-ink text-center" style={{ fontSize: 'clamp(18px,2vw,22px)' }}>
          Thank you. We read every one.
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
        <label className={labelClass}>Instagram</label>
        <input
          type="text"
          value={form.instagram}
          onChange={e => update('instagram', e.target.value)}
          className={inputClass}
          placeholder="@"
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
        <label className={labelClass}>Where Are You Based? *</label>
        <input
          type="text"
          required
          value={form.location}
          onChange={e => update('location', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Do You Currently Sell on Shopify?</label>
        <select
          value={form.shopify}
          onChange={e => update('shopify', e.target.value)}
          className={`${inputClass} appearance-none cursor-pointer`}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Another platform">Another platform</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Can You Ship Direct to Customers in Australia?</label>
        <select
          value={form.canShipAu}
          onChange={e => update('canShipAu', e.target.value)}
          className={`${inputClass} appearance-none cursor-pointer`}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Tell Us About Your Brand *</label>
        <textarea
          required
          rows={5}
          value={form.about}
          onChange={e => update('about', e.target.value)}
          className={`${inputClass} resize-none`}
          placeholder="Why do you think it fits Beauticate?"
        />
      </div>

      <div>
        <label className={labelClass}>The One Product You Would Want Our Readers to Discover First</label>
        <input
          type="text"
          value={form.firstProduct}
          onChange={e => update('firstProduct', e.target.value)}
          className={inputClass}
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
        {status === 'loading' ? 'Sending…' : 'Send It Through'}
      </button>
    </form>
  )
}
