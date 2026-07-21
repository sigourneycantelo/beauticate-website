interface Props {
  children: React.ReactNode
}

export default function Caption({ children }: Props) {
  return (
    <p
      className="not-prose font-sans text-[10px] tracking-[0.2em] uppercase leading-snug mt-[-0.25rem] mb-5 [&_a]:no-underline [&_a]:transition-colors"
      style={{ color: '#9a9190' }}
    >
      {children}
    </p>
  )
}
