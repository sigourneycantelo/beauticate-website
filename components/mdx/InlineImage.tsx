import Image from 'next/image'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  /**
   * Short caption rendered directly under THIS image: small grey capitals.
   * In a 2-up grid give each image its own caption. Use it for full-width
   * images too, so every caption in an article looks the same.
   * See docs/article-image-captions.md.
   */
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
        // Inside .prose an <img> carries a 2em top/bottom margin, which would
        // open a gap between the picture and its caption.
        className={`w-full h-auto rounded${caption ? ' my-0' : ''}`}
      />
      {caption && (
        <figcaption
          className="not-prose font-sans text-[11px] tracking-[0.18em] uppercase leading-snug mt-2 mb-0 text-left"
          style={{ color: '#9a9190' }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
