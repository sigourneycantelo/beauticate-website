interface Props {
  /**
   * The question a reader actually typed to get here, phrased as they would
   * phrase it. Rendered as a real heading above the answer.
   *
   * This is not decoration. Featured-snippet and AI extraction both look for a
   * heading that matches the query with a concise answer directly beneath it,
   * and it is what turns this box into a Question/Answer pair in the page's
   * JSON-LD (see `extractQuickAnswer` in lib/seo.ts). Without it the box is an
   * unlabelled paragraph as far as any machine reading the page is concerned:
   * the eyebrow below says "Quick answer", which matches no search anyone has
   * ever run.
   *
   * Optional only so the six boxes written before this prop existed keep
   * rendering. Always set it on anything new.
   */
  question?: string
  /** Eyebrow above the question. */
  label?: string
  /** The answer: 40-60 words, plain prose, facts from the article only. */
  children: React.ReactNode
}

/**
 * "Quick answer" box — a concise, scannable answer placed high on the page for
 * featured-snippet / answer-engine surfaces. Visually distinct from EditorNote:
 * a left-ruled callout with a small eyebrow label and no product card.
 */
export default function QuickAnswer({ question, label = 'Quick answer', children }: Props) {
  return (
    <aside className="not-prose my-8 border-l-2 border-wine bg-parchment p-6 sm:p-7">
      <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-wine mb-3">
        {label}
      </p>

      {/*
        A real <h2>, not a styled paragraph. The box sits above the article's
        own sections, so this is the page's first heading and the one a snippet
        matches the query against. `not-prose` on the wrapper means the
        typography plugin styles nothing in here, hence the explicit classes.
      */}
      {question ? (
        <h2 className="font-serif text-[20px] sm:text-[22px] leading-snug text-charcoal mb-3">
          {question}
        </h2>
      ) : null}

      <div className="text-[15px] sm:text-base text-charcoal leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}
