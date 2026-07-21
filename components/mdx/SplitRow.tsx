import type { ReactNode } from 'react'

interface Props {
  /** Image path, e.g. /content/<cat>/<sub>/<slug>/foo.jpg (served from public/) */
  image: string
  /** Descriptive alt text (sentence case, under 125 chars, no "image of") */
  alt: string
  /** Which side the image sits on at desktop width. Default 'right'. */
  side?: 'left' | 'right'
  /** Max width of the image column in px. Default 320. In MDX pass a string
   *  (imageWidth="260") — MDX does not reliably forward {expression} attributes. */
  imageWidth?: number | string
  /** Optional affiliate/external link wrapping the image (gets rel="sponsored noopener"). */
  href?: string
  /** The copy (or any block, e.g. an <EditorNote>) that sits beside the image. */
  children: ReactNode
}

/**
 * Two-column "text beside a smaller image" row for article bodies. Replaces the
 * full-width image + floated-image patterns: the image is capped to `imageWidth`
 * and sits on `side`, with the copy filling the rest, so a tall portrait shot no
 * longer forces a long single-column scroll. Stacks (copy then image) on mobile.
 *
 * Examples:
 *   <SplitRow image="…/stamping.jpg" alt="…" side="right">…copy…</SplitRow>
 *   <SplitRow image="…/glow.jpg" alt="…" side="left" imageWidth={260}><EditorNote …/></SplitRow>
 */
export default function SplitRow({ image, alt, side = 'right', imageWidth = 320, href, children }: Props) {
  const maxW = typeof imageWidth === 'number' ? imageWidth : parseInt(String(imageWidth), 10) || 320
  const img = <img src={image} alt={alt} className="w-full h-auto" style={{ maxWidth: maxW }} />
  const imageBlock = href ? (
    <a href={href} target="_blank" rel="sponsored noopener" className="block">
      {img}
    </a>
  ) : img

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start my-8">
      {/* Copy column keeps prose styling (no not-prose) so links/typography render */}
      <div className={`min-w-0 flex-1 ${side === 'left' ? 'md:order-2' : 'md:order-1'}`}>
        {children}
      </div>
      {/* Image column: capped width, centred when narrower than the column on mobile */}
      <div className={`not-prose w-full md:w-auto md:shrink-0 ${side === 'left' ? 'md:order-1' : 'md:order-2'}`}>
        <div className="mx-auto" style={{ maxWidth: maxW }}>
          {imageBlock}
        </div>
      </div>
    </div>
  )
}
