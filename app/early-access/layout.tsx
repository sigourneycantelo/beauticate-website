import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Early Access — Beauticate',
  robots: { index: false, follow: false },
}

export default function EarlyAccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
