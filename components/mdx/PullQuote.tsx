interface Props {
  children: React.ReactNode
}

export default function PullQuote({ children }: Props) {
  return (
    <blockquote className="not-prose my-20 md:my-28">
      <p
        className="font-serif italic text-chocolate leading-[1.15] tracking-[-0.01em]"
        style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
      >
        {children}
      </p>
    </blockquote>
  )
}
