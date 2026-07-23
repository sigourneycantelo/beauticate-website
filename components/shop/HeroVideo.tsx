'use client'
import { useEffect, useRef, useState } from 'react'

const DESKTOP_ID = 'ec2590621cbfc04df0bb835a09c7950e'
const MOBILE_ID  = 'a70724dd7fca31bd76ce799562307e7b'

function streamUrl(id: string) {
  return `https://iframe.videodelivery.net/${id}?autoplay=true&muted=true&loop=true&controls=false&background=true&preload=auto`
}
function posterUrl(id: string) {
  return `https://videodelivery.net/${id}/thumbnails/thumbnail.jpg?time=0s&height=1080`
}

export default function HeroVideo() {
  const [visible, setVisible] = useState(false)
  const [mobile, setMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

  const videoId = mobile ? MOBILE_ID : DESKTOP_ID

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterUrl(videoId)}
        alt=""
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        fetchPriority="high"
      />

      <iframe
        key={videoId}
        src={streamUrl(videoId)}
        allow="autoplay; fullscreen; picture-in-picture"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: mobile ? '100vw' : '100vw',
          height: mobile ? '100vh' : '56.25vw',
          minHeight: mobile ? '100vh' : '100vh',
          minWidth: mobile ? '100vw' : '177.78vh',
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
