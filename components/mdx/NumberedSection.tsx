interface Props {
  number: string
  title: string
}

export default function NumberedSection({ number, title }: Props) {
  return (
    <div className="not-prose flex items-baseline gap-5 mb-6 mt-14 first:mt-0">
      <span
        className="font-display text-chocolate leading-none"
        style={{ fontSize: 'clamp(64px, 10vw, 120px)', letterSpacing: '-0.03em' }}
      >
        {number}
      </span>
      <h2
        className="font-sans uppercase tracking-[0.12em] leading-tight font-medium"
        style={{ fontSize: 'clamp(13px, 1.4vw, 16px)' }}
      >
        {title}
      </h2>
    </div>
  )
}
