interface Props {
  number: string
  title: string
}

export default function NumberedSection({ number, title }: Props) {
  return (
    <div className="not-prose mt-14 mb-6 first:mt-0 text-center">
      <span
        className="font-numeral text-chocolate leading-none block"
        style={{ fontSize: 'clamp(48px, 7vw, 72px)', letterSpacing: '-0.03em' }}
      >
        {number}
      </span>
      <h2
        className="font-display font-medium leading-tight mt-3"
        style={{ fontSize: 'clamp(28px, 4vw, 34px)' }}
      >
        {title}
      </h2>
      <div
        className="mx-auto mt-3.5"
        style={{ width: '46px', height: '1px', background: '#7A7570' }}
      />
    </div>
  )
}
