interface Props {
  /** Score out of `outOf`. Shown to the reader AND mirrored into Review schema. */
  rating: number
  /** Denominator. Defaults to 5. */
  outOf?: number
  /** What was reviewed, e.g. "Qure Micro-Infusion Device". */
  item?: string
  /** Eyebrow label. Use "Reader verdict" when the score came from readers. */
  label?: string
  /** One or two sentences of plain-language verdict. */
  children?: React.ReactNode
}

/**
 * The visible verdict block — the thing that makes `review_rating` legal.
 *
 * `lib/seo.ts` emits a `reviewRating` into the page's JSON-LD whenever
 * `review_rating` is set in frontmatter. Google requires structured data to
 * reflect content a reader can actually see, so a rating that exists only in
 * the markup is the textbook case for a spammy-structured-markup manual
 * action. This component is the visible half of that pair.
 *
 * The rule is therefore: `review_rating` in frontmatter and `<Verdict>` in the
 * body travel together, with the SAME number. Set one without the other and
 * the article is either breaking Google's policy (markup, no block) or
 * throwing away a rich result (block, no markup).
 *
 * `scripts/audit-review-ratings.mjs` checks that pairing across the whole
 * archive, so a drift is caught rather than discovered.
 */
export default function Verdict({ rating, outOf = 5, item, label = 'Our verdict', children }: Props) {
  // Clamp defensively: a rating outside the scale would render a nonsense bar
  // and put a nonsense ratingValue into the schema.
  const safe = Math.max(0, Math.min(rating, outOf))
  const pct = (safe / outOf) * 100
  // Trim a trailing ".0" so 4 renders as "4", not "4.0", while 4.5 survives.
  const shown = Number.isInteger(safe) ? String(safe) : safe.toFixed(1)

  return (
    <aside className="not-prose my-8 border border-wine/25 bg-parchment p-6 sm:p-7">
      <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-wine mb-4">
        {label}
      </p>

      <div className="flex items-baseline gap-2">
        <span className="font-serif text-4xl sm:text-5xl leading-none text-charcoal">{shown}</span>
        <span className="font-sans text-sm text-charcoal/55">/ {outOf}</span>
      </div>

      {/*
        A bar rather than star glyphs: it reads at any size, needs no icon font,
        and survives a half-point score without a half-star asset.
        aria-hidden because the score is already stated in text above.
      */}
      <div className="mt-3 h-[3px] w-full max-w-[220px] bg-charcoal/12" aria-hidden="true">
        <div className="h-full bg-wine" style={{ width: `${pct}%` }} />
      </div>

      {item ? (
        <p className="mt-4 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal/55">
          {item}
        </p>
      ) : null}

      {children ? (
        <div className="mt-3 text-[15px] sm:text-base text-charcoal leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0">
          {children}
        </div>
      ) : null}
    </aside>
  )
}
