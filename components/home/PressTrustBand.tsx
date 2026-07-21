import Link from 'next/link'

const LOGOS = [
  'VOGUE',
  'The Daily Telegraph',
  'marie claire',
  'body+soul',
  'Mamamia',
  'The Daily Mail',
]

export default function PressTrustBand() {
  return (
    <section className="full-bleed press-trust-band">
      {/* Trust panel */}
      <div className="ptb-trust">
        <Link href="/about">
          <span className="ptb-trust-line">25 Years of Trusted Journalism</span>
          <span className="ptb-trust-line">3 Million Monthly Touchpoints</span>
          <span className="ptb-trust-line">Expertly Curated Shop</span>
        </Link>
      </div>

      {/* As Seen In */}
      <p className="ptb-heading">
        <Link href="/press">As Seen In</Link>
      </p>

      {/* Press logos */}
      <div className="ptb-logos">
        {LOGOS.map(name => (
          <Link key={name} href="/press" className="ptb-logo">
            {name}
          </Link>
        ))}
      </div>
    </section>
  )
}
