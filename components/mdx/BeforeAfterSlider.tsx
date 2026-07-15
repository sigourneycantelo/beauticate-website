'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'

interface Props {
  before: string
  after: string
  beforeAlt?: string
  afterAlt?: string
  beforeLabel?: string
  afterLabel?: string
  beforeFocus?: string
  afterFocus?: string
  beforeScale?: string | number
  afterScale?: string | number
}

export default function BeforeAfterSlider({
  before,
  after,
  beforeAlt = 'Before',
  afterAlt = 'After',
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforeFocus,
  afterFocus,
  beforeScale,
  afterScale,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)
  const [width, setWidth] = useState(0)
  const dragging = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(containerRef.current)
    setWidth(containerRef.current.offsetWidth)
    return () => ro.disconnect()
  }, [])

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = clientX - rect.left
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updatePosition(e.clientX)
  }, [updatePosition])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    updatePosition(e.clientX)
  }, [updatePosition])

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  const bfPos = beforeFocus ?? 'center'
  const afPos = afterFocus ?? 'center'
  const bfScale = typeof beforeScale === 'string' ? parseFloat(beforeScale) : (beforeScale ?? 1)
  const afScale = typeof afterScale === 'string' ? parseFloat(afterScale) : (afterScale ?? 1)

  return (
    <div className="not-prose my-10 w-full max-w-[680px] mx-auto">
      <div
        ref={containerRef}
        className="relative aspect-[4/5] overflow-hidden select-none touch-none cursor-col-resize"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* After image — full background */}
        <div
          className="absolute inset-0"
          style={afScale !== 1 ? { transform: `scale(${afScale})` } : undefined}
        >
          <Image
            src={after}
            alt={afterAlt}
            fill
            sizes="(max-width: 768px) 100vw, 680px"
            style={{ objectFit: 'cover', objectPosition: afPos }}
          />
        </div>

        {/* Before image — clipped by slider */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <div
            className="relative"
            style={{
              width: width || '100vw',
              height: '100%',
              transform: bfScale !== 1 ? `scale(${bfScale})` : undefined,
            }}
          >
            <Image
              src={before}
              alt={beforeAlt}
              fill
              sizes="(max-width: 768px) 100vw, 680px"
              style={{ objectFit: 'cover', objectPosition: bfPos }}
            />
          </div>
        </div>

        {/* Slider line + handle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white/90 pointer-events-none"
          style={{ left: `${position}%`, transform: 'translateX(-1px)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-ink">
              <path d="M7 4L3 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 4L17 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <span className="absolute top-4 left-4 font-sans text-[10px] tracking-[0.2em] uppercase text-white bg-black/40 px-2.5 py-1 rounded-sm pointer-events-none">
          {beforeLabel}
        </span>
        <span className="absolute top-4 right-4 font-sans text-[10px] tracking-[0.2em] uppercase text-white bg-black/40 px-2.5 py-1 rounded-sm pointer-events-none">
          {afterLabel}
        </span>
      </div>
    </div>
  )
}
