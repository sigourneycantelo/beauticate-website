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
        className="font-sans font-semibold"
        style={{ fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.7 }}
      >
        Trusted by women for over a decade
        <span className="mx-2 font-normal opacity-40">·</span>
        <span className="font-normal opacity-70">By the editors of{' '}
        <Link href="/" className="underline decoration-[0.5px] underline-offset-2 hover:opacity-70 transition-opacity">
          Beauticate.com
        </Link></span>
      </p>
      <p
        className="font-sans mt-1.5"
        style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9a9590' }}
      >
        <Link href="/press" className="hover:opacity-70 transition-opacity">
          As featured in Vogue, Marie Claire, The Daily Telegraph, Daily Mail, Body+Soul and Mumbrella
        </Link>
      </p>
    </div>
  )
}
