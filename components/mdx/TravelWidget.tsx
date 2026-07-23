'use client'

import { useEffect, useRef } from 'react'

interface Props {
  /** Travelpayouts widget script URL from the dashboard embed code */
  src?: string
  /** Travelpayouts widget iframe URL (alternative to script mode) */
  iframe?: string
  /** Minimum height in px — prevents layout shift while widget loads */
  height?: number
  caption?: string
}

export default function TravelWidget({ src, iframe, height = 400, caption }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !src) return
    const container = ref.current
    const script = document.createElement('script')
    script.src = src
    script.charset = 'UTF-8'
    script.async = true
    container.appendChild(script)
    return () => { container.innerHTML = '' }
  }, [src])

  if (!src && !iframe) return null

  return (
    <figure className="not-prose my-8">
      {iframe ? (
        <iframe
          src={iframe}
          className="w-full rounded border-0"
          style={{ minHeight: height }}
          loading="lazy"
          title={caption ?? 'Travel search'}
        />
      ) : (
        <div
          ref={ref}
          className="overflow-hidden rounded"
          style={{ minHeight: height }}
        />
      )}
      {caption && (
        <figcaption className="text-xs text-charcoal-light mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
