interface Props {
  children: React.ReactNode
}

export default function PullQuote({ children }: Props) {
  return (
    <blockquote
      className="not-prose"
      style={{ margin: '4.5rem 0' }}
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
