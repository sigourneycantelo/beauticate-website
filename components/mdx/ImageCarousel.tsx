'use client'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState, Children, isValidElement } from 'react'

interface SlideProps {
  src: string
  alt: string
  caption?: string
}

export function CarouselSlide(_props: SlideProps) {
  return null
}

interface Props {
  children: React.ReactNode
}

export default function ImageCarousel({ children }: Props) {
  const slides: SlideProps[] = []
  if (children) {
    Children.forEach(children, child => {
      if (isValidElement(child) && child.props) {
        const p = child.props as SlideProps
        if (p.src) slides.push({ src: p.src, alt: p.alt ?? '', caption: p.caption })
      }
    })
  }

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selected, setSelected] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (!slides.length) return null

  return (
    <div className="not-prose my-8">
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, i) => (
            <div key={i} className="relative flex-none w-full">
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {slides[selected]?.caption && (
        <p className="text-sm italic text-charcoal-light mt-2 text-center">{slides[selected].caption}</p>
      )}

      <div className="flex justify-center gap-1.5 mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === selected ? 'bg-charcoal' : 'bg-charcoal/25'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
