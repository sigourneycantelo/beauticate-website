interface Props {
  children: React.ReactNode
  /** Tighter vertical margin, for a piece with several quotes close together. */
  compact?: boolean
}

export default function PullQuote({ children, compact }: Props) {
  return (
    <blockquote
      className="not-prose"
      style={{ margin: compact ? '2.25rem 0' : '4.5rem 0' }}
    >
      <p
        className="font-serif italic text-chocolate"
        style={{ fontSize: 'clamp(24px, 2.9vw, 31px)', lineHeight: 1.15, letterSpacing: '-0.01em' }}
      >
        {children}
      </p>
    </blockquote>
  )
}
