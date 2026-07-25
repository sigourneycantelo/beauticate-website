'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useCart } from '@/components/shop/CartProvider'

const AskSigPanel = dynamic(() => import('./AskSigPanel'), { ssr: false })

const SECTION_PROMPTS: Record<string, string> = {
  '/shop': 'Looking for something specific?',
  '/beauty-style': 'Need a product recommendation?',
  '/wellness': "What's your wellness goal?",
  '/destinations': 'Where do you want to go?',
  '/interviews': "Ask me about anyone I've interviewed",
  '/vodcast': 'Ask me about any episode',
  '/living': 'Need a home or lifestyle tip?',
}
const DEFAULT_PROMPT = 'Go on, ask me anything'

function getPromptForPath(pathname: string): string {
  for (const [prefix, prompt] of Object.entries(SECTION_PROMPTS)) {
    if (pathname.startsWith(prefix)) return prompt
  }
  return DEFAULT_PROMPT
}

export default function AskSigLauncher() {
  const [open, setOpen] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const { isOpen: cartOpen } = useCart()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (dismissed || open || isMobile) return
    setShowBubble(false)
    const timer = setTimeout(() => setShowBubble(true), 3000)
    return () => clearTimeout(timer)
  }, [pathname, dismissed, open, isMobile])

  function handleOpen() {
    setOpen(true)
    setShowBubble(false)
  }

  useEffect(() => {
    const handler = () => handleOpen()
    window.addEventListener('open-ask-sig', handler)
    return () => window.removeEventListener('open-ask-sig', handler)
  })

  function handleDismiss(e: React.MouseEvent) {
    e.stopPropagation()
    setShowBubble(false)
    setDismissed(true)
  }

  const prompt = getPromptForPath(pathname)

  if (cartOpen) return null

  return (
    <>
      {open && <AskSigPanel onClose={() => setOpen(false)} />}

      {!open && (
        <div className="fixed bottom-6 right-6 z-[9998]">
          {showBubble && !isMobile ? (
            <div
              onClick={handleOpen}
              className="relative cursor-pointer animate-fade-in max-w-[240px]"
            >
              <div className="bg-white rounded-2xl shadow-lg px-4 py-3 border border-line flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-full ring-2 ring-wine overflow-hidden shrink-0 mt-0.5">
                  <Image
                    src="/images/sig-chat-avatar.png"
                    alt="Ask Sig"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover object-center"
                  />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-eucalypt rounded-full border-[1.5px] border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-wine mb-0.5">Ask Sig</p>
                  <p className="text-sm font-sans text-ink leading-snug">{prompt}</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full shadow border border-line flex items-center justify-center text-muted hover:text-ink transition-colors"
                aria-label="Dismiss"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1l6 6M7 1L1 7" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleOpen}
              className="relative w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow group ring-[3px] ring-wine overflow-hidden shrink-0"
              aria-label="Ask Sig"
            >
              <Image
                src="/images/sig-chat-avatar.png"
                alt="Ask Sig"
                width={56}
                height={56}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform"
              />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-eucalypt rounded-full border-2 border-white" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
