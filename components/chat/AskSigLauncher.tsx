'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const AskSigPanel = dynamic(() => import('./AskSigPanel'), { ssr: false })

export default function AskSigLauncher() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && <AskSigPanel onClose={() => setOpen(false)} />}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow group ring-[3px] ring-wine overflow-hidden"
          aria-label="Ask Sig"
        >
          <Image
            src="/images/sig-chat-avatar.jpg"
            alt="Ask Sig"
            width={56}
            height={56}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform"
          />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-eucalypt rounded-full border-2 border-white" />
        </button>
      )}
    </>
  )
}
