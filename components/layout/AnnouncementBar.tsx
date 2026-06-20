'use client'
import Link from 'next/link'
import { useState } from 'react'

interface Props { message: string; href: string }

export default function AnnouncementBar({ message, href }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className="bg-charcoal text-cream text-center py-2.5 px-4 relative">
      <Link href={href} className="font-sans text-xs uppercase tracking-[0.2em] text-paper hover:text-camel transition-colors">{message}</Link>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream"
        aria-label="Dismiss"
      >×</button>
    </div>
  )
}
