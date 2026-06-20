import Image from 'next/image'

interface Props {
  src: string
  alt: string
  caption?: string
  side?: 'left' | 'right'
}

export default function Portrait({ src, alt, caption, side = 'left' }: Props) {
  const float = side === 'left' ? 'float-left mr-8 mb-4' : 'float-right ml-8 mb-4'
  return (
    <span className={`${float} w-[45%] max-w-[280px] block clear-${side}`}>
      <Image
        src={src}
        alt={alt}
        width={400}
        height={600}
        className="w-full h-auto rounded"
      />
      {caption && (
        <span className="text-xs text-charcoal-light block mt-1 leading-snug">{caption}</span>
      )}
    </span>
  )
}
