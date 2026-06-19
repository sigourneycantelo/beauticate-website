'use client'
import Script from 'next/script'

// Replace FEED_ID with your Curatedio feed ID from the dashboard
// (Settings → Embed → copy the ID from the embed code snippet)
const FEED_ID = process.env.NEXT_PUBLIC_CURATEDIO_FEED_ID ?? ''

interface Props {
  title?: string
}

export default function SocialFeed({ title = 'Follow Along' }: Props) {
  if (!FEED_ID) return null

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

      {/* Curatedio widget */}
      <div id={`curatedio-feed-${FEED_ID}`} />
      <Script
        src={`https://app.curatedio.com/widget.js`}
        data-feed={FEED_ID}
        strategy="lazyOnload"
      />
    </section>
  )
}
