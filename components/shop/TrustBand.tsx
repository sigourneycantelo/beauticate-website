import Link from 'next/link'

// Thin credibility band beneath the hero — Hanken caps, wide tracking.
export default function TrustBand() {
  return (
    <div
      className="text-center"
      style={{
        background: '#FBF9F4',
        borderBottom: '1px solid rgba(28,26,23,.10)',
        padding: 'clamp(14px,2vw,20px) clamp(20px,6vw,104px)',
      }}
    >
      <p
        className="font-sans"
        style={{ fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6 }}
      >
        Trusted by women for over a decade
        <span className="mx-2 opacity-50">·</span>
        By the editors of{' '}
        <Link href="/" className="underline decoration-[0.5px] underline-offset-2 hover:opacity-70 transition-opacity">
          Beauticate.com
        </Link>
        <span className="mx-2 opacity-50">·</span>
        As featured in{' '}
        <Link href="/press" className="underline decoration-[0.5px] underline-offset-2 hover:opacity-70 transition-opacity">
          the press
        </Link>
        <span className="mx-2 opacity-50">·</span>
        <Link href="/archive" className="underline decoration-[0.5px] underline-offset-2 hover:opacity-70 transition-opacity">
          25 years in print
        </Link>
      </p>
    </div>
  )
}
