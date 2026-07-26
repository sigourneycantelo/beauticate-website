'use client'

import Image from 'next/image'
import { useCallback, useRef, useState, useEffect } from 'react'

interface ProductImage {
  url: string
  altText?: string | null
}

interface Props {
  images: ProductImage[]
  vendor: string
  title: string
}

export default function ProductImageCarousel({ images, vendor, title }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const count = images.length

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const idx = Math.round(track.scrollLeft / track.clientWidth)
      setActive(idx)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = useCallback((i: number) => {
    trackRef.current?.scrollTo({ left: i * trackRef.current.clientWidth, behavior: 'smooth' })
  }, [])

  const goPrev = useCallback(() => goTo((active - 1 + count) % count), [active, count, goTo])
  const goNext = useCallback(() => goTo((active + 1) % count), [active, count, goTo])

  if (!images.length) return null

  if (images.length === 1) {
    return (
      <div className="relative bg-white rounded-[2px] overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <Image
          src={images[0].url}
          alt={images[0].altText ?? `${vendor} ${title}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    )
  }

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, i) => (
            <div
              key={img.url + i}
              className="flex-none w-full snap-center"
            >
              <div className="relative bg-white rounded-[2px] overflow-hidden" style={{ aspectRatio: '1/1' }}>
                <Image
                  src={img.url}
                  alt={img.altText ?? `${vendor} ${title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === active ? 'bg-charcoal' : 'bg-charcoal/25'}`}
            aria-label={`View image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
