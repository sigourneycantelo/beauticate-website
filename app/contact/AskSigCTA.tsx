'use client'

import Image from 'next/image'

export default function AskSigCTA() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('open-ask-sig'))}
      className="group flex flex-col items-center gap-3 cursor-pointer"
    >
      <div className="relative w-16 h-16 rounded-full ring-[3px] ring-wine overflow-hidden group-hover:ring-eucalypt transition-all">
        <Image
          src="/images/sig-chat-avatar.png"
          alt="Ask Sig"
          width={64}
          height={64}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform"
        />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-eucalypt rounded-full border-2 border-white" />
      </div>
      <div className="text-center">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase font-semibold text-wine group-hover:text-eucalypt transition-colors">
          Try Sig first
        </p>
        <p className="font-serif text-sm text-charcoal/50 mt-1">
          Beauty dilemmas, product recommendations, shopping help
        </p>
      </div>
    </button>
  )
}
