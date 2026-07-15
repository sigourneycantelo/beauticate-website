interface Props {
  children: React.ReactNode
}

export default function PullQuote({ children }: Props) {
  return (
    <blockquote className="not-prose px-8 md:px-0" style={{ margin: '3rem auto', maxWidth: '520px' }}>
      <p
        className="font-serif italic text-chocolate text-center"
        style={{ fontSize: 'clamp(26px, 3.2vw, 32px)', lineHeight: 1.35 }}
      >
        {children}
      </p>
    </blockquote>
  )
}
