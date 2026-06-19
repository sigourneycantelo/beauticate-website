'use client'
import Script from 'next/script'

interface Props {
  title?: string
}

export default function SocialFeed({ title = 'Follow Along' }: Props) {
  return (
    <section className="max-w-wide mx-auto px-4 py-12 border-t border-cream-200">
      {title && (
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase font-bold">{title}</h2>
          <a
            href="https://www.instagram.com/beauticate/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light hover:text-charcoal transition-colors"
          >
            @beauticate
          </a>
        </div>
      )}

      <div id="curator-feed-default-feed-layout">
        <a href="https://curator.io" target="_blank" rel="noopener noreferrer" className="crt-logo crt-tag">
          Powered by Curator.io
        </a>
      </div>
      <Script
        id="curator-feed"
        strategy="lazyOnload"
        src="https://cdn.curator.io/published/3e5bafe4-bd3c-4e90-a57b-706d1269db2a.js"
      />
    </section>
  )
}
