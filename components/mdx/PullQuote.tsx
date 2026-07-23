interface Props {
  children: React.ReactNode
}

export default function PullQuote({ children }: Props) {
  return (
    <blockquote
      className="not-prose"
      style={{ margin: '3rem 0', paddingLeft: 'clamp(24px, 4vw, 48px)', borderLeft: '2px solid var(--color-charcoal, #2c2c2c)', maxWidth: '600px' }}
    >
      <p
        className="font-serif italic text-chocolate"
        style={{ fontSize: 'clamp(22px, 2.8vw, 28px)', lineHeight: 1.45 }}
      >
        {children}
      </p>
    </blockquote>
  )
}
