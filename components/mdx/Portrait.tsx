import Image from 'next/image'

interface Props {
  src: string
  alt: string
  caption?: string
  side?: 'left' | 'right'
}

/**
 * Portrait holding shot the body prose wraps around.
 *
 * The float only works because rehype-portrait-float wraps this and the
 * paragraphs it belongs to in a `flow-root` block — `.article-body` is a grid,
 * and float does nothing to a grid item.
 *
 * Both class strings are written out in full: Tailwind scans source text, so an
 * interpolated class name like `sm:clear-${side}` is never generated.
 */
export default function Portrait({ src, alt, caption, side = 'left' }: Props) {
  const float =
    side === 'left'
      ? 'sm:float-left sm:mr-8 sm:clear-left'
      : 'sm:float-right sm:ml-8 sm:clear-right'
  return (
    <span className={`${float} mb-4 w-full sm:w-[45%] max-w-[360px] block`}>
      <Image
        src={src}
        alt={alt}
        width={400}
        height={600}
        className="w-full h-auto rounded"
      />
      {caption && (
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase leading-snug block mt-2" style={{ color: '#9a9190' }}>{caption}</span>
      )}
    </span>
  )
}
