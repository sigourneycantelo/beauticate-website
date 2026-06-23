'use client'
import { useEffect, useRef, useState } from 'react'

const VIDEO_ID   = 'ec2590621cbfc04df0bb835a09c7950e'
const POSTER_URL = `https://videodelivery.net/${VIDEO_ID}/thumbnails/thumbnail.jpg?time=0s&height=1080`
const STREAM_URL = `https://iframe.videodelivery.net/${VIDEO_ID}?autoplay=true&muted=true&loop=true&controls=false&background=true&preload=auto`

export default function HeroVideo() {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // IntersectionObserver fires when the hero enters the viewport (instant on page load).
    // We wait for it rather than a bare timeout so the fade only triggers once the
    // element is actually on screen — correct behaviour if the component ever moves.
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay lets the poster render before the iframe starts painting,
          // giving a clean cross-fade rather than a flash.
          const t = setTimeout(() => setVisible(true), 600)
          observer.disconnect()
          return () => clearTimeout(t)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      {/* Poster frame — loads instantly, sits underneath the video */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={POSTER_URL}
        alt=""
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        fetchPriority="high"
      />

      {/* Cloudflare Stream iframe — fades in over the poster once ready.
          Inline styles guarantee full coverage regardless of UA stylesheet specificity. */}
      <iframe
        src={STREAM_URL}
        allow="autoplay; fullscreen; picture-in-picture"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          pointerEvents: 'none',
          opacity: visible ? 1 : 0,
          transition: 'opacity 1400ms ease-in-out',
        }}
        title=""
        aria-hidden
      />
    </div>
  )
}
