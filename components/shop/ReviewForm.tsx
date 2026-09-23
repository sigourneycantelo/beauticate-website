'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  productId: string
  productTitle: string
  productHandle: string
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-colors"
        >
          <svg
            viewBox="0 0 20 20"
            className={`w-7 h-7 ${n <= shown ? 'text-berry' : 'text-ink/20'}`}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 1.6l2.47 5.28 5.53.72-4.06 3.9 1.04 5.68L10 14.4l-4.98 2.78 1.04-5.68L2 7.6l5.53-.72L10 1.6z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

const label = 'block font-sans text-[10.5px] tracking-[0.18em] uppercase font-semibold text-ink mb-2'
const field =
  'w-full font-serif text-[15px] bg-white border border-line rounded-none px-3 py-2.5 ' +
  'focus:outline-none focus:border-ink transition-colors'

export default function ReviewForm({ productId, productTitle, productHandle }: Props) {
  const [rating, setRating] = useState(0)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = new FormData(e.currentTarget)
    if (rating < 1) {
      setError('Please choose a rating.')
      return
    }

    setState('sending')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          name: form.get('name'),
          email: form.get('email'),
          title: form.get('title'),
          body: form.get('body'),
          // Honeypot — hidden from people, irresistible to bots.
          website: form.get('website'),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'We could not save your review. Please try again.')
        setState('idle')
        return
      }
      setState('done')
    } catch {
      setError('We could not save your review. Please try again.')
      setState('idle')
    }
  }

  if (state === 'done') {
    return (
      <div className="text-center py-10">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-eucalypt font-semibold mb-4">
          Thank you
        </p>
        <p className="font-serif text-[17px] leading-[1.6] text-charcoal-light max-w-[440px] mx-auto">
          Your review has been sent. We read every one before it goes up, so it may be a
          day or two before it appears.
        </p>
        <Link
          href={`/shop/products/${productHandle}`}
          className="inline-block mt-6 font-sans text-[10.5px] tracking-[0.18em] uppercase font-semibold text-ink border-b border-ink/40 pb-1 hover:border-ink transition-colors"
        >
          Back to {productTitle}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <span className={label}>Your rating</span>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div>
        <label className={label} htmlFor="review-title">Headline <span className="opacity-50">(optional)</span></label>
        <input id="review-title" name="title" type="text" maxLength={120} className={field} />
      </div>

      <div>
        <label className={label} htmlFor="review-body">Your review</label>
        <textarea
          id="review-body"
          name="body"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          className={`${field} resize-y`}
          placeholder="What did you think? How did you use it?"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="review-name">Your name</label>
          <input id="review-name" name="name" type="text" required maxLength={80} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="review-email">Email</label>
          <input id="review-email" name="email" type="email" required className={field} />
          <p className="font-sans text-[10px] text-charcoal-light opacity-70 mt-1.5 leading-relaxed">
            Never published. We only use it to check the review is genuine.
          </p>
        </div>
      </div>

      {/* Honeypot. Hidden from people and from screen readers; bots fill it in. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="review-website">Website</label>
        <input id="review-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="font-sans text-[12px] text-berry">{error}</p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="font-sans text-[10.5px] tracking-[0.2em] uppercase px-8 py-3.5 rounded-[1px] border border-ink text-ink transition-colors hover:bg-ink hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        {state === 'sending' ? 'Sending…' : 'Submit review'}
      </button>
    </form>
  )
}
