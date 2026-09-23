/**
 * The one star-rating mark, used on product cards, the PDP and the reviews page.
 *
 * Judge.me's own stylesheet is deliberately not imported anywhere in this repo —
 * their widgets are Shopify theme app blocks and we render their data with our
 * own components. The berry fill matches the star colour configured in the
 * Judge.me account so the stars in a review-request email and the stars on the
 * site are the same colour rather than coincidentally similar.
 */

const SIZES = {
  sm: 'w-[11px] h-[11px]',
  md: 'w-[13px] h-[13px]',
  lg: 'w-[16px] h-[16px]',
} as const

function Star({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} fill="currentColor">
      <path d="M10 1.6l2.47 5.28 5.53.72-4.06 3.9 1.04 5.68L10 14.4l-4.98 2.78 1.04-5.68L2 7.6l5.53-.72L10 1.6z" />
    </svg>
  )
}

interface Props {
  /** Mean rating, 0–5. Fractions render as a partially filled star. */
  rating: number
  /** Number of reviews behind the rating. Rendered when `showCount`. */
  count?: number
  size?: keyof typeof SIZES
  showCount?: boolean
  className?: string
}

export default function StarRating({ rating, count, size = 'md', showCount = true, className = '' }: Props) {
  const clamped = Math.max(0, Math.min(5, rating))
  // Two stacked rows clipped to a percentage, rather than rounding to the nearest
  // half star: a 4.3 average should not be drawn as 4.5, because the number next
  // to it says 4.3 and the two disagreeing is the kind of detail people notice.
  const fillPct = (clamped / 5) * 100
  const star = SIZES[size]

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        role="img"
        aria-label={`${clamped.toFixed(1)} out of 5 stars`}
        className="relative inline-block leading-none"
      >
        {/* Track — empty stars. */}
        <span className="flex gap-[2px] text-ink/20">
          {[0, 1, 2, 3, 4].map(i => <Star key={i} className={star} />)}
        </span>
        {/* Fill — same row, clipped. aria-hidden on the wrapper above covers both. */}
        <span
          className="absolute inset-0 flex gap-[2px] overflow-hidden text-berry"
          style={{ width: `${fillPct}%` }}
        >
          {[0, 1, 2, 3, 4].map(i => <Star key={i} className={`${star} shrink-0`} />)}
        </span>
      </span>

      {showCount && typeof count === 'number' && (
        <span className="font-sans text-[10.5px] tracking-[0.06em] text-charcoal-light tabular-nums">
          {clamped.toFixed(1)} ({count})
        </span>
      )}
    </span>
  )
}
