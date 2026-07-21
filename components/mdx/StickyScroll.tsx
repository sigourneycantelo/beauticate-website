import type { ReactNode } from 'react'

interface Props {
  src: string
  alt: string
  side?: 'left' | 'right'
  href?: string
  caption?: string
  children: ReactNode
}

const h2Style = '[&>h2]:font-serif [&>h2]:mb-5 [&>h2]:mt-2'

export default function StickyScroll({ src, alt, side = 'right', href, caption, children }: Props) {
  const imgEl = (
    <img
      src={src}
      alt={alt}
      className="w-full h-auto"
    />
  )

  const imageBlock = href ? (
    <a href={href} target="_blank" rel="sponsored noopener" className="block">
      {imgEl}
    </a>
  ) : imgEl

  const imageColumn = (
    <div className={`not-prose md:sticky md:top-24 self-start ${side === 'left' ? 'order-2 md:order-1' : ''}`}>
      {imageBlock}
      {caption && (
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase leading-snug block mt-3" style={{ color: '#9a9190' }}>
          {caption}
        </span>
      )}
    </div>
  )

  const textColumn = (
    <div className={`prose prose-lg max-w-none ${h2Style} py-8 md:py-16 ${side === 'left' ? 'order-1 md:order-2' : ''}`}>
      {children}
    </div>
  )

  return (
    <div className="article-wide not-prose my-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        {side === 'left' ? <>{imageColumn}{textColumn}</> : <>{textColumn}{imageColumn}</>}
      </div>
    </div>
  )
}
