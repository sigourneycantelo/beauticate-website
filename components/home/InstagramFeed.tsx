'use client'
import { useEffect } from 'react'

const CURATOR_FEED_ID = '3e5bafe4-bd3c-4e90-a57b-706d1269db2a'

const BG = [
  'linear-gradient(150deg,#cfc6bd,#9a8f84)',
  'linear-gradient(150deg,#c3ccc4,#8c968d)',
  'linear-gradient(150deg,#d8cabf,#b39a8b)',
  'linear-gradient(150deg,#c8c2c2,#94898a)',
  'linear-gradient(150deg,#d2cabf,#a3978a)',
  'linear-gradient(150deg,#bfc6c0,#888f88)',
]

export default function InstagramFeed() {
  useEffect(() => {
    if (document.getElementById('curator-script')) return
    const script = document.createElement('script')
    script.id = 'curator-script'
    script.async = true
    script.charset = 'UTF-8'
    script.src = `https://cdn.curator.io/published/${CURATOR_FEED_ID}.js`
    document.head.appendChild(script)
  }, [])

  return (
    <section
      className="reveal text-center"
      style={{ padding: 'clamp(48px,6vw,84px) clamp(20px,6vw,104px)' }}
    >
      <span
        className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium"
        style={{ opacity: 0.55 }}
      >
        Community
      </span>
      <h2
        className="font-serif font-normal mt-3 mb-1"
        style={{ fontSize: 'clamp(24px,3vw,38px)' }}
      >
        Join us on <em className="italic">Instagram</em>
      </h2>
      <p className="font-sans mb-7" style={{ fontSize: '11.5px', letterSpacing: '.04em', opacity: 0.5 }}>
        @beauticate
      </p>

      <div id="curator-feed-default-feed-layout" className="max-w-[1180px] mx-auto">
        {/* Fallback grid shown until Curator.io loads */}
        <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(6,1fr)' }}>
          {BG.map((bg, i) => (
            <div
              key={i}
              className="rounded-[2px]"
              style={{ aspectRatio: '1', border: '1px solid rgba(28,26,23,.10)', background: bg }}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <a
          href="https://www.instagram.com/beauticate/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[10.5px] tracking-[0.2em] uppercase font-medium border-b pb-0.5"
          style={{ borderColor: '#1C1A17', opacity: 0.65 }}
        >
          Follow @beauticate
        </a>
      </div>
    </section>
  )
}
