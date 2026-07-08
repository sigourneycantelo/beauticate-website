interface Props {
  children: React.ReactNode
}

export default function PullQuote({ children }: Props) {
  return (
    <blockquote className="not-prose my-10 md:my-14">
      <p
        className="font-serif italic text-chocolate leading-[1.15] tracking-[-0.01em]"
        style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
      >
        {children}
      </p>
    </blockquote>
  )
}
