'use client'
import Script from 'next/script'

export default function InstagramFeed() {
  return (
    <section className="max-w-wide mx-auto px-4 py-12 border-t border-cream-200">
      <h2 className="text-center mb-8">On Instagram</h2>
      <div id="curator-feed-beauticate">
        <a href="https://curator.io" target="_blank" rel="noopener noreferrer"
          className="text-xs text-charcoal-light">
          Powered by Curator.io
        </a>
      </div>
      {/* Replace YOUR-FEED-ID with actual Curator.io feed ID */}
      <Script
        src="https://cdn.curator.io/published/YOUR-FEED-ID.js"
        strategy="lazyOnload"
      />
      <div className="text-center mt-6">
        <a href="https://www.instagram.com/beauticate/" target="_blank" rel="noopener noreferrer"
          className="text-sm tracking-widest uppercase hover:text-gold transition-colors">
          Follow @beauticate →
        </a>
      </div>
    </section>
  )
}
