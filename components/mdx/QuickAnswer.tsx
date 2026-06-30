interface Props {
  label?: string
  children: React.ReactNode
}

/**
 * "Quick answer" box — a concise, scannable answer placed high on the page for
 * featured-snippet / answer-engine surfaces. Visually distinct from EditorNote:
 * a left-ruled callout with a small eyebrow label and no product card.
 */
export default function QuickAnswer({ label = 'Quick answer', children }: Props) {
  return (
    <aside className="not-prose my-8 border-l-2 border-gold bg-parchment p-6 sm:p-7">
      <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-terracotta mb-3">
        {label}
      </p>
      <div className="text-[15px] sm:text-base text-charcoal leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}
