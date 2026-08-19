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
        style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', lineHeight: 1.15, letterSpacing: '-0.01em' }}
      >
        {children}
      </p>
    </blockquote>
  )
}
