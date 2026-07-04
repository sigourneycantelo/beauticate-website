import Image from 'next/image'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  align?: 'left' | 'center'
}

export default function InlineImage(props: Props) {
  const { src, alt, caption, align = 'left' } = props
  const w = Number(props.width)
  const h = Number(props.height)
  const alignment = align === 'center' ? 'mx-auto' : ''
  return (
    <figure className={`my-6 ${alignment}`} style={{ maxWidth: w }}>
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        className="w-full h-auto rounded"
      />
      {caption && (
        <figcaption className="font-sans text-[10px] tracking-[0.2em] uppercase leading-snug mt-2" style={{ color: '#9a9190' }}>{caption}</figcaption>
      )}
    </figure>
  )
}
