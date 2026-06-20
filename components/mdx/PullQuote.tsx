interface Props {
  children: React.ReactNode
}

export default function PullQuote({ children }: Props) {
  return (
    <blockquote className="not-prose my-10 mx-auto max-w-[600px] text-center border-t border-b border-cream-300 py-8 px-4">
      <p className="font-serif text-2xl md:text-3xl italic leading-relaxed text-charcoal tracking-[-0.01em]">
        {children}
      </p>
    </blockquote>
  )
}
