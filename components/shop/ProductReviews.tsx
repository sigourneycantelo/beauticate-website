'use client'

import { useState } from 'react'
import Link from 'next/link'
import StarRating from './StarRating'
import type { Review, Rating } from '@/lib/judgeme'

/** Reviews shown before "Show all" appears. Enough to read the room without
 *  pushing "Complete the ritual" off the bottom of a long page. */
const INITIAL = 4

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <li className="py-6 border-t border-line first:border-t-0">
      <div className="flex items-center gap-3 flex-wrap">
        <StarRating rating={review.rating} size="sm" showCount={false} />
        {review.verified && (
          <span className="font-sans text-[9px] tracking-[0.14em] uppercase text-eucalypt font-semibold">
            Verified purchase
          </span>
        )}
      </div>

      {review.title && (
        <h3 className="font-serif text-[18px] leading-[1.3] mt-2.5">{review.title}</h3>
      )}

      {review.body && (
        <p className="font-serif text-[15px] leading-[1.65] text-charcoal-light mt-2 whitespace-pre-line">
          {review.body}
        </p>
      )}

      <p className="font-sans text-[10.5px] tracking-[0.12em] uppercase text-charcoal-light opacity-70 mt-3">
        {review.author}
        {formatDate(review.createdAt) && <span className="opacity-60"> · {formatDate(review.createdAt)}</span>}
      </p>
    </li>
  )
}

interface Props {
  reviews: Review[]
  rating: Rating | null
  /** Product handle, so "Write a review" lands on the form with this pre-selected. */
  handle: string
}

export default function ProductReviews({ reviews, rating, handle }: Props) {
  const [expanded, setExpanded] = useState(false)
  const writeHref = `/shop/reviews/write?product=${encodeURIComponent(handle)}`

  // Empty state: a quiet invitation, deliberately with no stars and no "0 reviews".
  // A row of grey stars reading zero makes a product look rejected rather than new,
  // and for a while that will be most of the shop.
  if (!rating || reviews.length === 0) {
    return (
      <section className="mt-[clamp(48px,7vw,96px)] max-w-[720px] mx-auto text-center">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-eucalypt font-semibold mb-4">
          Reviews
        </p>
        <p className="font-serif text-[16px] leading-[1.6] text-charcoal-light">
          No reviews yet. If you&rsquo;ve tried this, we&rsquo;d love to hear it.
        </p>
        <Link
          href={writeHref}
          className="inline-block mt-5 font-sans text-[10.5px] tracking-[0.18em] uppercase font-semibold text-ink border-b border-ink/40 pb-1 hover:border-ink transition-colors"
        >
          Write a review
        </Link>
      </section>
    )
  }

  const visible = expanded ? reviews : reviews.slice(0, INITIAL)

  return (
    <section className="mt-[clamp(48px,7vw,96px)] max-w-[720px] mx-auto">
      <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-eucalypt font-semibold text-center mb-8">
        Reviews
      </p>

      <div className="flex flex-col items-center text-center pb-8">
        <p className="font-serif text-[44px] leading-none tabular-nums">{rating.average.toFixed(1)}</p>
        <StarRating rating={rating.average} size="lg" showCount={false} className="mt-3" />
        <p className="font-sans text-[10.5px] tracking-[0.12em] uppercase text-charcoal-light mt-3">
          Based on {rating.count} {rating.count === 1 ? 'review' : 'reviews'}
        </p>
        <Link
          href={writeHref}
          className="inline-block mt-5 font-sans text-[10.5px] tracking-[0.18em] uppercase font-semibold text-ink border-b border-ink/40 pb-1 hover:border-ink transition-colors"
        >
          Write a review
        </Link>
      </div>

      <ul>
        {visible.map(r => <ReviewItem key={r.id} review={r} />)}
      </ul>

      {reviews.length > INITIAL && !expanded && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="font-sans text-[10.5px] tracking-[0.18em] uppercase font-semibold text-ink border-b border-ink/40 pb-1 hover:border-ink transition-colors"
          >
            Show all {reviews.length} reviews
          </button>
        </div>
      )}
    </section>
  )
}
