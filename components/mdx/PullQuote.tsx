interface Props {
  children: React.ReactNode
}

export default function PullQuote({ children }: Props) {
  return (
    <blockquote className="not-prose my-16 mx-auto max-w-[660px] text-center border-t border-b border-cream-300 py-11 px-4">
      <p className="font-serif font-medium italic text-[28px] md:text-[38px] leading-[1.38] text-charcoal">
        {children}
      </p>
    </blockquote>
  )
}
