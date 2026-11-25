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
  const isVideo = /\.(mp4|webm)$/i.test(src)
  return (
    <figure className={`my-6 ${alignment}`} style={{ maxWidth: w }}>
      {isVideo ? (
        // Looping silent clip: sharper and ~half the bytes of a GIF, and it keeps
        // playing on phones where animated GIFs were being shown as a still.
        <video
          src={src}
          aria-label={alt}
          width={w}
          height={h}
          className={`w-full h-auto rounded${caption ? ' my-0' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        // Animated GIFs must skip the optimiser, which can flatten them to a
        // still frame (phones were showing a static image).
        unoptimized={src.toLowerCase().endsWith('.gif')}
        // Inside .prose an <img> carries a 2em top/bottom margin, which would
        // open a gap between the picture and its caption.
        className={`w-full h-auto rounded${caption ? ' my-0' : ''}`}
      />
      )}
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
