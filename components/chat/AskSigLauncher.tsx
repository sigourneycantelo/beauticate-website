'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const AskSigPanel = dynamic(() => import('./AskSigPanel'), { ssr: false })

const SECTION_PROMPTS: Record<string, string> = {
  '/shop': 'Looking for something specific?',
  '/beauty-style': 'Need a product recommendation?',
  '/wellness': "What's your wellness goal?",
  '/destinations': 'Where do you want to go?',
  '/interviews': 'Ask me about anyone I’ve interviewed',
  '/vodcast': 'Ask me about any episode',
  '/living': 'Need a home or lifestyle tip?',
}
const DEFAULT_PROMPT = 'Ask me anything'

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
  const pathname = usePathname()

  useEffect(() => {
    if (dismissed || open) return
    setShowBubble(false)
    const timer = setTimeout(() => setShowBubble(true), 3000)
    return () => clearTimeout(timer)
  }, [pathname, dismissed, open])

  function handleOpen() {
    setOpen(true)
    setShowBubble(false)
  }

  function handleDismiss(e: React.MouseEvent) {
    e.stopPropagation()
    setShowBubble(false)
    setDismissed(true)
  }

  const prompt = getPromptForPath(pathname)

  return (
    <>
      {open && <AskSigPanel onClose={() => setOpen(false)} />}

      {!open && (
        <div className="fixed bottom-6 right-6 z-[9998] flex items-end gap-3">
          {showBubble && (
            <div
              onClick={handleOpen}
              className="relative cursor-pointer animate-fade-in mb-1 max-w-[200px]"
            >
              <div className="bg-white rounded-2xl rounded-br-sm shadow-lg px-4 py-3 border border-line">
                <p className="text-[9px] font-sans font-medium tracking-[0.2em] uppercase text-muted mb-1">Ask Sig</p>
                <p className="text-sm font-sans text-ink leading-snug">{prompt}</p>
              </div>
              <button
                onClick={handleDismiss}
                className="absolute -top-2 -left-2 w-5 h-5 bg-white rounded-full shadow border border-line flex items-center justify-center text-muted hover:text-ink transition-colors"
                aria-label="Dismiss"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1l6 6M7 1L1 7" />
                </svg>
              </button>
            </div>
          )}

          <button
            onClick={handleOpen}
            className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow group ring-[3px] ring-wine overflow-hidden shrink-0"
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
        </div>
      )}
    </>
  )
}
