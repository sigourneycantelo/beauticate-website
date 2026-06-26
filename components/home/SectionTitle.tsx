interface Props {
  eyebrow?: string
  title: string
  italic?: string
}

export default function SectionTitle({ eyebrow, title, italic }: Props) {
  const parts = italic ? title.split(italic) : null
  return (
    <div
      className="reveal text-center"
      style={{ padding: 'clamp(24px,3vw,40px) clamp(20px,6vw,104px) 0' }}
    >
      {eyebrow && (
        <span className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium" style={{ opacity: 0.5 }}>
          {eyebrow}
        </span>
      )}
      <h2
        className="font-serif font-normal mt-2"
        style={{ fontSize: 'clamp(24px,3vw,36px)' }}
      >
        {parts ? (
          <>
            {parts[0]}
            <em className="italic">{italic}</em>
            {parts[1]}
          </>
        ) : title}
      </h2>
    </div>
  )
}
