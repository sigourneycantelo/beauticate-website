'use client'
import Script from 'next/script'

interface Props {
  title?: string
  compact?: boolean
}

export default function SocialFeed({ title = 'Follow Along', compact = false }: Props) {
  return (
    <section className={`border-t border-cream-200 ${compact ? 'py-6' : 'py-12'}`}>
      {title && (
        <div className={`max-w-wide mx-auto px-4 flex items-center justify-between ${compact ? 'mb-4' : 'mb-8'}`}>
          <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase">{title}</h2>
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

      {/* Curator.io widget — YouTube and other platform logos overridden to charcoal in globals.css */}
      <div className={compact ? 'max-w-wide mx-auto px-4' : ''}>
        <div id="curator-feed-default-feed-layout">
          <a href="https://curator.io" target="_blank" rel="noopener noreferrer" className="crt-logo crt-tag">
            Powered by Curator.io
          </a>
        </div>
      </div>

      <Script
        id="curator-feed"
        strategy="lazyOnload"
        src="https://cdn.curator.io/published/3e5bafe4-bd3c-4e90-a57b-706d1269db2a.js"
      />
    </section>
  )
}
