'use client'
import { useState } from 'react'

interface Props {
  url: string
  title: string
  image?: string
}

function PinterestIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="16" rx="2" />
      <path d="M2 5l10 7 10-7" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export default function ShareButtons({ url, title, image }: Props) {
  const [copied, setCopied] = useState(false)
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com'
  const fullUrl = `${base}${url}`

  const pinterestHref = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(fullUrl)}${image ? `&media=${encodeURIComponent(image)}` : ''}&description=${encodeURIComponent(title)}`
  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fullUrl)}`

  function copyLink() {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const btnClass = "flex items-center gap-2 font-sans text-[10.5px] tracking-[0.2em] uppercase text-charcoal-light hover:text-charcoal transition-colors py-2 px-3 border border-cream-200 hover:border-charcoal-light"

  return (
    <>
      {/* Desktop / inline share row */}
      <div className="flex flex-wrap items-center gap-3 py-8 border-t border-cream-200 mt-2">
        <span className="font-sans text-[9.5px] tracking-[0.28em] uppercase text-charcoal-light mr-1">Share</span>

        <a href={pinterestHref} target="_blank" rel="noopener noreferrer" className={btnClass} aria-label="Save to Pinterest">
          <PinterestIcon />
          Pinterest
        </a>

        <a href={emailHref} className={btnClass} aria-label="Share by email">
          <EmailIcon />
          Email
        </a>

        <button onClick={copyLink} className={btnClass} aria-label="Copy link">
          <LinkIcon />
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>

      {/* Mobile sticky share strip */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-cream-200" style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)' }}>
        <a href={pinterestHref} target="_blank" rel="noopener noreferrer" aria-label="Save to Pinterest" className="flex-1 flex flex-col items-center gap-1 py-3 text-charcoal-light hover:text-charcoal transition-colors">
          <PinterestIcon />
          <span className="font-sans text-[9px] tracking-[0.15em] uppercase">Save</span>
        </a>
        <a href={emailHref} aria-label="Share by email" className="flex-1 flex flex-col items-center gap-1 py-3 text-charcoal-light hover:text-charcoal transition-colors border-l border-cream-200">
          <EmailIcon />
          <span className="font-sans text-[9px] tracking-[0.15em] uppercase">Email</span>
        </a>
        <button onClick={copyLink} aria-label="Copy link" className="flex-1 flex flex-col items-center gap-1 py-3 text-charcoal-light hover:text-charcoal transition-colors border-l border-cream-200">
          <LinkIcon />
          <span className="font-sans text-[9px] tracking-[0.15em] uppercase">{copied ? 'Copied' : 'Link'}</span>
        </button>
      </div>
    </>
  )
}
